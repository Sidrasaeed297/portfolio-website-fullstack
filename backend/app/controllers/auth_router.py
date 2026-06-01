from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas.auth import RegisterIn, LoginIn, TokenOut, UserOut
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterIn, service: AuthService = Depends(AuthService)):
    return service.register(payload)

@router.post("/login", response_model=TokenOut)
def login(form_data: OAuth2PasswordRequestForm = Depends(), service: AuthService = Depends(AuthService)):
    payload = LoginIn(email=form_data.username, password=form_data.password)
    return service.login(payload)

@router.post("/refresh", response_model=TokenOut)
def refresh(refresh_token: str = Depends(), service: AuthService = Depends(AuthService)):
    return service.refresh(refresh_token)

@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(AuthService().get_current_user)):
    return UserOut.from_orm(current_user)

@router.get("/admin-only")
def admin_only(admin_user = Depends(AuthService().require_admin)):
    return {"msg": "admin access granted"}
