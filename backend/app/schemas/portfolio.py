from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ProjectOut(BaseModel):
    id: int
    title: str
    description: str
    tech_stack: Optional[str]
    demo_url: Optional[str]
    repo_url: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BlogOut(BaseModel):
    id: int
    title: str
    body: str
    published_at: datetime
    category: Optional[str]

    model_config = ConfigDict(from_attributes=True)


class SkillOut(BaseModel):
    id: int
    name: str
    category: Optional[str]
    proficiency: int
    is_verified: bool

    model_config = ConfigDict(from_attributes=True)


class ExperienceOut(BaseModel):
    id: int
    company: str
    role: str
    description: Optional[str]
    start_date: date
    end_date: Optional[date]
    is_current: bool

    model_config = ConfigDict(from_attributes=True)


class EducationOut(BaseModel):
    id: int
    institution: str
    degree: str
    field_of_study: Optional[str]
    start_date: date
    end_date: Optional[date]
    is_current: bool

    model_config = ConfigDict(from_attributes=True)


class ContactIn(BaseModel):
    name: str = Field(..., alias="sender_name")
    email: EmailStr = Field(..., alias="sender_email")
    subject: Optional[str] = Field("Contact Form Message")
    message: str = Field(..., alias="message_body")

    model_config = ConfigDict(populate_by_name=True)


class ContactOut(BaseModel):
    id: int
    sender_name: str
    sender_email: EmailStr
    subject: str
    message_body: str
    created_at: datetime
    is_read: bool

    model_config = ConfigDict(from_attributes=True)
