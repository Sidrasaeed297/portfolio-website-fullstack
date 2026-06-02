"""
app/schemas/auth.py
-------------------
Pydantic models used by the authentication endpoints.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterIn(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenPayload(BaseModel):
    sub: int  # user id
    exp: int
    typ: Literal["access", "refresh"]
    role: Literal["user", "admin"] = "user"


class RefreshTokenIn(BaseModel):
    refresh_token: str


class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: Literal["bearer"] = "bearer"


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_active: bool
    role: Literal["user", "admin"]

    model_config = ConfigDict(from_attributes=True)
