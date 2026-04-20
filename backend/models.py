from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Enum
from sqlalchemy.sql import func
from database import Base
import enum


class ConsultationStatus(str, enum.Enum):
    pending = "pending"       # 대기중
    contacted = "contacted"   # 연락완료
    enrolled = "enrolled"     # 등록완료
    cancelled = "cancelled"   # 취소


class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(Integer, primary_key=True, index=True)
    parent_name = Column(String(50), nullable=False, comment="학부모 이름")
    child_name = Column(String(50), nullable=False, comment="자녀 이름")
    child_grade = Column(String(20), nullable=False, comment="자녀 학년")
    phone = Column(String(20), nullable=False, comment="연락처")
    email = Column(String(100), nullable=True, comment="이메일")
    program_interest = Column(String(200), nullable=True, comment="관심 프로그램")
    message = Column(Text, nullable=True, comment="문의 내용")
    status = Column(
        Enum(ConsultationStatus),
        default=ConsultationStatus.pending,
        nullable=False,
        comment="처리 상태"
    )
    admin_memo = Column(Text, nullable=True, comment="관리자 메모")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Program(Base):
    __tablename__ = "programs"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(Integer, nullable=False, comment="프로그램 번호 (1-10)")
    name = Column(String(100), nullable=False, comment="프로그램명")
    subtitle = Column(String(200), nullable=True, comment="부제")
    description = Column(Text, nullable=True, comment="설명")
    start_date = Column(String(20), nullable=True, comment="개강일")
    end_date = Column(String(20), nullable=True, comment="종강일")
    day_of_week = Column(String(20), nullable=True, comment="요일")
    time_slot = Column(String(50), nullable=True, comment="시간대")
    capacity = Column(Integer, default=8, comment="정원")
    enrolled = Column(Integer, default=0, comment="현재 등록 인원")
    is_active = Column(Boolean, default=True, comment="모집 여부")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
