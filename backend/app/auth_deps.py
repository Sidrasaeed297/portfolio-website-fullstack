from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated

from app.core.security import decode_access_token
from app.core.exceptions import AuthenticationError, AuthorizationError
from app.models.user import User, Admin
from app.repositories.user_repository import UserRepository

# OAuth2 scheme expecting a Bearer token in the Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_user_repository() -> UserRepository:
    """Factory for dependency injection – returns a fresh repository instance."""
    return UserRepository()

async def get_current_user(token: str = Depends(oauth2_scheme),
                     repo: UserRepository = Depends(get_user_repository)) -> User:
    """Decode JWT, retrieve the user, and raise AuthenticationError on failure."""
    user_id_str = decode_access_token(token)
    if not user_id_str:
        raise AuthenticationError("Invalid authentication token")
    try:
        user_id = int(user_id_str)
    except ValueError:
        raise AuthenticationError("Token payload malformed")
    user = await repo.get_by_id(user_id)  # repository method must be async or sync; adjust accordingly
    if not user:
        raise AuthenticationError("User not found")
    return user

def require_admin(current_user: Annotated[User, Depends(get_current_user)]) -> Admin:
    """Ensure the current user is an Admin; raise AuthorizationError otherwise."""
    if not isinstance(current_user, Admin):
        raise AuthorizationError("Admin privileges required")
    return current_user
