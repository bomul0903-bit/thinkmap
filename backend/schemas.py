from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
from models import ConsultationStatus


# ─── 상담 신청 ───────────────────────────────────────────
class ConsultationCreate(BaseModel):
    parent_name: str
    child_name: str
    child_grade: str
    phone: str
    email: Optional[str] = None
    program_interest: Optional[str] = None
    message: Optional[str] = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        digits = v.replace("-", "").replace(" ", "")
        if not digits.isdigit() or len(digits) < 10:
            raise ValueError("올바른 전화번호를 입력해주세요.")
        return v


class ConsultationUpdate(BaseModel):
    status: Optional[ConsultationStatus] = None
    admin_memo: Optional[str] = None


class ConsultationResponse(BaseModel):
    id: int
    parent_name: str
    child_name: str
    child_grade: str
    phone: str
    email: Optional[str]
    program_interest: Optional[str]
    message: Optional[str]
    status: ConsultationStatus
    admin_memo: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}


# ─── 프로그램 일정 ────────────────────────────────────────
class ProgramCreate(BaseModel):
    number: int
    name: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    day_of_week: Optional[str] = None
    time_slot: Optional[str] = None
    capacity: int = 8
    is_active: bool = True


class ProgramUpdate(BaseModel):
    name: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    day_of_week: Optional[str] = None
    time_slot: Optional[str] = None
    capacity: Optional[int] = None
    enrolled: Optional[int] = None
    is_active: Optional[bool] = None


class ProgramResponse(BaseModel):
    id: int
    number: int
    name: str
    subtitle: Optional[str]
    description: Optional[str]
    start_date: Optional[str]
    end_date: Optional[str]
    day_of_week: Optional[str]
    time_slot: Optional[str]
    capacity: int
    enrolled: int
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── 관리자 인증 ──────────────────────────────────────────
class AdminLogin(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ─── 통계 ─────────────────────────────────────────────────
class DashboardStats(BaseModel):
    total_consultations: int
    pending_consultations: int
    contacted_consultations: int
    enrolled_consultations: int
    total_programs: int
    active_programs: int
