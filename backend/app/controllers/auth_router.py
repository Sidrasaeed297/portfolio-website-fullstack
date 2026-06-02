from fastapi import APIRouter, Body, Depends, status
from fastapi.security import OAuth2PasswordRequestForm

from app.models.user import User
from app.schemas.auth import LoginIn, RegisterIn, TokenOut, UserOut
from app.services.auth_service import AuthService
from app.auth_deps import get_current_user, require_admin
from app.repositories.user_repository import UserRepository

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_auth_service(user_repo: UserRepository = Depends(UserRepository)) -> AuthService:
    return AuthService(user_repo)


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterIn, service: AuthService = Depends(get_auth_service)):
    return service.register(payload)

@router.post("/login", response_model=TokenOut)
def login(form_data: OAuth2PasswordRequestForm = Depends(), service: AuthService = Depends(get_auth_service)):
    payload = LoginIn(email=form_data.username, password=form_data.password)
    return service.login(payload)

from app.schemas.auth import LoginIn, RegisterIn, RefreshTokenIn, TokenOut, UserOut


@router.post("/refresh", response_model=TokenOut)
def refresh(payload: RefreshTokenIn, service: AuthService = Depends(get_auth_service)):
    return service.refresh(payload.refresh_token)

@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return UserOut.from_orm(current_user)

@router.get("/admin-only")
def admin_only(admin_user: User = Depends(require_admin)):
    return {"msg": "admin access granted"}
