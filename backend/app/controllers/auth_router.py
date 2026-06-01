"""
app/controllers/auth_router.py
----------------------------
FastAPI router that wires the AuthService into HTTP endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas.auth import RegisterIn, LoginIn, TokenOut, UserOut
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Dependency injection – a fresh AuthService per request
def get_auth_service() -> AuthService:
    return AuthService()

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterIn, service: AuthService = Depends(get_auth_service)):
    return service.register(payload)

@router.post("/login", response_model=TokenOut)
def login(form: OAuth2PasswordRequestForm = Depends(), service: AuthService = Depends(get_auth_service)):
    # OAuth2PasswordRequestForm provides username (email) and password fields
    payload = LoginIn(email=form.username, password=form.password)
    return service.login(payload)

@router.post("/refresh", response_model=TokenOut)
def refresh(refresh_token: str, service: AuthService = Depends(get_auth_service)):
    return service.refresh(refresh_token)

@router.get("/me", response_model=UserOut)
def get_current_user(user: UserOut = Depends(AuthService().get_current_user)):
    return user

@router.get("/admin-only")
def admin_only(user = Depends(AuthService().require_admin)):
    return {"msg": "admin access granted"}
