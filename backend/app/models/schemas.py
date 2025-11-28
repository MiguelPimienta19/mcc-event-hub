from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from uuid import UUID

# ============================================
# Event Schemas
# ============================================

class EventBase(BaseModel):
    """Base schema for Event - shared fields"""
    title: str
    description: Optional[str] = None
    organization: str
    start_time: datetime
    end_time: datetime


class EventCreate(EventBase):
    """Schema for creating a new event"""
    pass


class EventUpdate(BaseModel):
    """Schema for updating an event - all fields optional"""
    title: Optional[str] = None
    description: Optional[str] = None
    organization: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None


class EventResponse(EventBase):
    """Schema for event response"""
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Allows SQLAlchemy models to be converted


# ============================================
# Profile Schemas
# ============================================

class ProfileBase(BaseModel):
    """Base schema for Profile"""
    email: EmailStr
    role: str = "admin"


class ProfileCreate(ProfileBase):
    """Schema for creating a profile"""
    pass


class ProfileResponse(ProfileBase):
    """Schema for profile response"""
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============================================
# AI/Agenda Optimizer Schemas
# ============================================

class AgendaRequest(BaseModel):
    """Schema for agenda optimizer request from frontend"""
    message: str
    history: List[dict] = []


class AgendaAIResponse(BaseModel):
    """Schema for agenda optimizer response"""
    response: str


# ============================================
# Auth Schemas
# ============================================

class AdminLoginRequest(BaseModel):
    """Schema for admin login request"""
    email: EmailStr


class AdminLoginResponse(BaseModel):
    """Schema for admin login response"""
    token: str
    email: EmailStr
    message: str


class AdminVerifyRequest(BaseModel):
    """Schema for admin verification request"""
    email: EmailStr


class AdminVerifyResponse(BaseModel):
    """Schema for admin verification response"""
    success: bool
    message: str
    is_admin: bool = False


class AddAdminRequest(BaseModel):
    """Schema for adding a new admin"""
    email: EmailStr


class AdminProfileResponse(BaseModel):
    """Schema for admin profile list response"""
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True
