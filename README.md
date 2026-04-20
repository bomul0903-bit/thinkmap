# 🥚 퍼플에그 홈페이지

초등 3·4학년 미래 역량 강화 프로그램 **퍼플에그**의 공식 홈페이지입니다.

## 🗂 프로젝트 구조

```
purple-egg/
├── frontend/         ← Next.js 14 + Tailwind CSS
│   ├── app/
│   │   ├── page.js              ← 홈 페이지
│   │   ├── programs/page.js     ← 10대 프로그램 소개
│   │   ├── philosophy/page.js   ← 교육 철학 + 강사 소개
│   │   ├── consultation/page.js ← 상담 신청 폼
│   │   └── admin/page.js        ← 관리자 대시보드
│   └── components/
│       ├── Header.js
│       └── Footer.js
└── backend/          ← FastAPI + SQLite
    ├── main.py        ← API 엔드포인트 (상담, 프로그램, 관리자)
    ├── models.py      ← 데이터베이스 모델
    ├── schemas.py     ← Pydantic 스키마
    ├── database.py    ← SQLite 연결
    └── requirements.txt
```

## 🚀 실행 방법

### 1. 백엔드 실행

```bash
cd backend

# 가상환경 생성 (선택)
python -m venv venv
source venv/bin/activate      # Mac/Linux
venv\Scripts\activate         # Windows

# 패키지 설치
pip install -r requirements.txt

# 환경변수 설정
cp .env.example .env
# .env 파일을 열어 이메일 설정 등을 수정하세요

# 서버 시작 (http://localhost:8000)
python main.py
```

> API 문서: http://localhost:8000/docs

### 2. 프론트엔드 실행

```bash
cd frontend

# 패키지 설치
npm install

# 개발 서버 시작 (http://localhost:3000)
npm run dev
```

### 3. 프론트엔드 빌드 (배포용)

```bash
cd frontend
npm run build
npm start
```

## 🔑 관리자 접속

- URL: http://localhost:3000/admin
- 기본 아이디: `admin`
- 기본 비밀번호: `purpleegg2024!`

> ⚠️ 배포 전 반드시 `.env` 파일에서 비밀번호를 변경하세요!

## 📧 이메일 알림 설정

Gmail 앱 비밀번호를 사용하세요:
1. Google 계정 → 보안 → 2단계 인증 활성화
2. 앱 비밀번호 생성 (앱: 메일, 기기: 기타)
3. `.env`에 SMTP_USER, SMTP_PASSWORD 입력

## 🌐 주요 페이지

| 페이지 | URL | 설명 |
|-------|-----|------|
| 홈 | `/` | 히어로, 프로그램 미리보기, FAQ |
| 프로그램 | `/programs` | 10대 프로그램 상세 소개 |
| 교육 철학 | `/philosophy` | 브랜드 철학, 역량, 강사 소개 |
| 상담 신청 | `/consultation` | 무료 상담 신청 폼 |
| 관리자 | `/admin` | 신청 관리, 일정 관리 |

## 🔌 API 엔드포인트

| 메서드 | URL | 설명 |
|--------|-----|------|
| GET | `/api/programs` | 프로그램 목록 조회 |
| POST | `/api/consultations` | 상담 신청 접수 |
| POST | `/api/admin/login` | 관리자 로그인 |
| GET | `/api/admin/dashboard` | 대시보드 통계 |
| GET | `/api/admin/consultations` | 상담 목록 조회 |
| PUT | `/api/admin/consultations/{id}` | 상담 상태 변경 |
| DELETE | `/api/admin/consultations/{id}` | 상담 삭제 |
| POST | `/api/admin/programs` | 프로그램 일정 추가 |
| PUT | `/api/admin/programs/{id}` | 프로그램 수정 |
| DELETE | `/api/admin/programs/{id}` | 프로그램 삭제 |

## 🛠 기술 스택

- **프론트엔드**: Next.js 14, Tailwind CSS, React Hook Form, Lucide Icons
- **백엔드**: FastAPI, SQLAlchemy, SQLite, JWT 인증, aiosmtplib
