from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timedelta
import os
import asyncio
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv

from database import engine, get_db, Base
import models
import schemas

load_dotenv()

# DB 테이블 생성
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="퍼플에그 API",
    description="퍼플에그 교육 프로그램 홈페이지 백엔드 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 보안 설정
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret-key-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 8  # 8시간

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "purpleegg2024!")


# ─── JWT 유틸리티 ─────────────────────────────────────────────────────────────

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username != ADMIN_USERNAME:
            raise HTTPException(status_code=401, detail="인증이 필요합니다.")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="유효하지 않은 토큰입니다.")


# ─── 이메일 유틸리티 ──────────────────────────────────────────────────────────

async def send_notification_email(consultation: models.Consultation):
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    notify_email = os.getenv("NOTIFICATION_EMAIL", smtp_user)

    if not smtp_user or not smtp_password:
        print("이메일 설정이 없어 알림을 건너뜁니다.")
        return

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"[퍼플에그] 새 상담 신청 - {consultation.parent_name} 학부모님"
        msg["From"] = smtp_user
        msg["To"] = notify_email

        html_body = f"""
        <html><body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #7C3AED, #A78BFA); padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
                <h1 style="color: white; margin: 0;">🥚 퍼플에그</h1>
                <p style="color: #EDE9FE; margin: 5px 0 0;">새로운 상담 신청이 접수되었습니다</p>
            </div>
            <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
                <h2 style="color: #7C3AED; margin-top: 0;">신청 정보</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px 0; color: #6B7280; width: 120px;">학부모 이름</td><td style="padding: 8px 0; font-weight: bold;">{consultation.parent_name}</td></tr>
                    <tr><td style="padding: 8px 0; color: #6B7280;">자녀 이름</td><td style="padding: 8px 0; font-weight: bold;">{consultation.child_name}</td></tr>
                    <tr><td style="padding: 8px 0; color: #6B7280;">자녀 학년</td><td style="padding: 8px 0;">{consultation.child_grade}</td></tr>
                    <tr><td style="padding: 8px 0; color: #6B7280;">연락처</td><td style="padding: 8px 0;">{consultation.phone}</td></tr>
                    <tr><td style="padding: 8px 0; color: #6B7280;">이메일</td><td style="padding: 8px 0;">{consultation.email or "-"}</td></tr>
                    <tr><td style="padding: 8px 0; color: #6B7280;">관심 프로그램</td><td style="padding: 8px 0;">{consultation.program_interest or "-"}</td></tr>
                </table>
            </div>
            {"<div style='background: #F9FAFB; padding: 20px; border-radius: 8px;'><h3 style='color: #7C3AED; margin-top: 0;'>문의 내용</h3><p>" + consultation.message + "</p></div>" if consultation.message else ""}
            <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin-top: 20px;">접수 시각: {consultation.created_at.strftime('%Y년 %m월 %d일 %H:%M')}</p>
        </div>
        </body></html>
        """

        msg.attach(MIMEText(html_body, "html"))

        await aiosmtplib.send(
            msg,
            hostname=smtp_host,
            port=smtp_port,
            username=smtp_user,
            password=smtp_password,
            start_tls=True,
        )
        print(f"알림 이메일 전송 완료: {notify_email}")
    except Exception as e:
        print(f"이메일 전송 실패: {e}")


# ─── 공개 API ─────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "퍼플에그 API 서버입니다 🥚", "version": "1.0.0"}


@app.get("/api/programs", response_model=List[schemas.ProgramResponse])
def get_programs(
    active_only: bool = False,
    db: Session = Depends(get_db)
):
    """프로그램 목록 조회 (공개)"""
    query = db.query(models.Program)
    if active_only:
        query = query.filter(models.Program.is_active == True)
    return query.order_by(models.Program.number).all()


@app.post("/api/consultations", response_model=schemas.ConsultationResponse, status_code=201)
async def create_consultation(
    data: schemas.ConsultationCreate,
    db: Session = Depends(get_db)
):
    """상담 신청 접수 (공개)"""
    consultation = models.Consultation(**data.model_dump())
    db.add(consultation)
    db.commit()
    db.refresh(consultation)

    # 비동기 이메일 알림 (실패해도 응답은 정상 반환)
    asyncio.create_task(send_notification_email(consultation))

    return consultation


# ─── 관리자 인증 ─────────────────────────────────────────────────────────────

@app.post("/api/admin/login", response_model=schemas.TokenResponse)
def admin_login(data: schemas.AdminLogin):
    """관리자 로그인"""
    if data.username != ADMIN_USERNAME or data.password != ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="아이디 또는 비밀번호가 올바르지 않습니다."
        )
    token = create_access_token({"sub": data.username})
    return {"access_token": token}


# ─── 관리자 전용 API ─────────────────────────────────────────────────────────

@app.get("/api/admin/dashboard", response_model=schemas.DashboardStats)
def get_dashboard(
    db: Session = Depends(get_db),
    admin: str = Depends(verify_token)
):
    """관리자 대시보드 통계"""
    total = db.query(func.count(models.Consultation.id)).scalar()
    pending = db.query(func.count(models.Consultation.id)).filter(
        models.Consultation.status == models.ConsultationStatus.pending
    ).scalar()
    contacted = db.query(func.count(models.Consultation.id)).filter(
        models.Consultation.status == models.ConsultationStatus.contacted
    ).scalar()
    enrolled = db.query(func.count(models.Consultation.id)).filter(
        models.Consultation.status == models.ConsultationStatus.enrolled
    ).scalar()
    total_programs = db.query(func.count(models.Program.id)).scalar()
    active_programs = db.query(func.count(models.Program.id)).filter(
        models.Program.is_active == True
    ).scalar()

    return {
        "total_consultations": total,
        "pending_consultations": pending,
        "contacted_consultations": contacted,
        "enrolled_consultations": enrolled,
        "total_programs": total_programs,
        "active_programs": active_programs,
    }


@app.get("/api/admin/consultations", response_model=List[schemas.ConsultationResponse])
def get_consultations(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    admin: str = Depends(verify_token)
):
    """상담 신청 목록 조회 (관리자)"""
    query = db.query(models.Consultation)
    if status:
        query = query.filter(models.Consultation.status == status)
    return query.order_by(models.Consultation.created_at.desc()).offset(skip).limit(limit).all()


@app.put("/api/admin/consultations/{consultation_id}", response_model=schemas.ConsultationResponse)
def update_consultation(
    consultation_id: int,
    data: schemas.ConsultationUpdate,
    db: Session = Depends(get_db),
    admin: str = Depends(verify_token)
):
    """상담 신청 상태/메모 업데이트 (관리자)"""
    consultation = db.query(models.Consultation).filter(
        models.Consultation.id == consultation_id
    ).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="해당 상담 신청을 찾을 수 없습니다.")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(consultation, key, value)

    consultation.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(consultation)
    return consultation


@app.delete("/api/admin/consultations/{consultation_id}")
def delete_consultation(
    consultation_id: int,
    db: Session = Depends(get_db),
    admin: str = Depends(verify_token)
):
    """상담 신청 삭제 (관리자)"""
    consultation = db.query(models.Consultation).filter(
        models.Consultation.id == consultation_id
    ).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="해당 상담 신청을 찾을 수 없습니다.")
    db.delete(consultation)
    db.commit()
    return {"message": "삭제되었습니다."}


@app.post("/api/admin/programs", response_model=schemas.ProgramResponse, status_code=201)
def create_program(
    data: schemas.ProgramCreate,
    db: Session = Depends(get_db),
    admin: str = Depends(verify_token)
):
    """프로그램 일정 추가 (관리자)"""
    program = models.Program(**data.model_dump())
    db.add(program)
    db.commit()
    db.refresh(program)
    return program


@app.put("/api/admin/programs/{program_id}", response_model=schemas.ProgramResponse)
def update_program(
    program_id: int,
    data: schemas.ProgramUpdate,
    db: Session = Depends(get_db),
    admin: str = Depends(verify_token)
):
    """프로그램 일정 수정 (관리자)"""
    program = db.query(models.Program).filter(models.Program.id == program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="프로그램을 찾을 수 없습니다.")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(program, key, value)

    program.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(program)
    return program


@app.delete("/api/admin/programs/{program_id}")
def delete_program(
    program_id: int,
    db: Session = Depends(get_db),
    admin: str = Depends(verify_token)
):
    """프로그램 삭제 (관리자)"""
    program = db.query(models.Program).filter(models.Program.id == program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="프로그램을 찾을 수 없습니다.")
    db.delete(program)
    db.commit()
    return {"message": "삭제되었습니다."}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
