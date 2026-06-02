from datetime import timedelta
from typing import Optional

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import RegisterIn, LoginIn, TokenOut, UserOut
from app.core.exceptions import AuthenticationError, AuthorizationError

# OAuth2 scheme for extracting bearer token from Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class AuthService:
    def __init__(self, user_repo: UserRepository = Depends(UserRepository)):
        self.user_repo = user_repo

    # ---------------------------------------------------------------------
    # Registration (public – creates regular user only)
    # ---------------------------------------------------------------------
    def register(self, payload: RegisterIn) -> UserOut:
        existing = self.user_repo.get_by_email(payload.email)
        if existing:
            raise AuthenticationError("Email already registered")
        hashed_pw = get_password_hash(payload.password)
        user = self.user_repo.create_user(payload, hashed_pw)
        return UserOut.from_orm(user)

    # ---------------------------------------------------------------------
    # Login – returns access and refresh JWTs
    # ---------------------------------------------------------------------
    def login(self, payload: LoginIn) -> TokenOut:
        user = self.user_repo.get_by_email(payload.email)
        if not user or not verify_password(payload.password, user.hashed_password):
            raise AuthenticationError("Invalid credentials")
        if not user.is_active:
            raise AuthenticationError("User account is disabled")
        access = create_access_token(
            subject=str(user.id), role=user.role
        )
        refresh = create_refresh_token(subject=str(user.id))
        return TokenOut(access_token=access, refresh_token=refresh)

    # ---------------------------------------------------------------------
    # Refresh token – issue new access token
    # ---------------------------------------------------------------------
    def refresh(self, refresh_token: str) -> TokenOut:
        payload = decode_token(refresh_token)
        if not payload or payload.get("typ") != "refresh":
            raise AuthenticationError("Invalid refresh token")
        user_id = int(payload.get("sub"))
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise AuthenticationError("User not found for token")
        access = create_access_token(subject=str(user.id), role=user.role)
        new_refresh = create_refresh_token(subject=str(user.id))
        return TokenOut(access_token=access, refresh_token=new_refresh)

    # ---------------------------------------------------------------------
    # Resolve current user from access token
    # ---------------------------------------------------------------------
    def get_current_user(self, token: str = Depends(oauth2_scheme)) -> User:
        payload = decode_token(token)
        if not payload or payload.get("typ") != "access":
            raise AuthenticationError("Could not validate credentials")
        user = self.user_repo.get_by_id(int(payload.get("sub")))
        if not user:
            raise AuthenticationError("User not found")
        return user

    # ---------------------------------------------------------------------
    # Admin‑only guard
    # ---------------------------------------------------------------------
    def require_admin(self, user: User = Depends(get_current_user)) -> User:
        if user.role != "admin":
            raise AuthorizationError("Admin privileges required")
        return user
