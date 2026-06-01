from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated

from app.core.security import decode_token
from app.models.user import User
from app.repositories.user_repository import UserRepository

# OAuth2 scheme expecting a Bearer token in the Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_user_repository() -> UserRepository:
    """Factory for dependency injection – returns a fresh repository instance."""
    return UserRepository()

async def get_current_user(token: str = Depends(oauth2_scheme), repo: UserRepository = Depends(get_user_repository)) -> User:
    """Decode JWT, retrieve the user, and raise AuthenticationError on failure."""
    payload = decode_token(token)
    if not payload or payload.get("typ") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    user = repo.get_by_id(int(user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

def require_admin(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    """Ensure the current user is an Admin; raise AuthorizationError otherwise."""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    return current_user
