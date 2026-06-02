from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.security import decode_jwt
from app.models.user import User
from app.database.session import get_db
from app.repositories.user_repository import UserRepository

# OAuth2 scheme for obtaining JWT access tokens
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def _get_user_from_token(token: str, db: Session) -> User:
    """Decode *token*, verify it is an access token, and return the associated active ``User``.
    Raises appropriate ``HTTPException`` for any failure case.
    """
    try:
        payload = decode_jwt(token)
        if payload is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        # Reject refresh tokens used where an access token is required
        if payload.get("typ") != "access":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token cannot be used as access token")
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token missing subject")
        # Retrieve user via repository (UserRepository expects a session)
        user = UserRepository(db).get_by_id(int(user_id))
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        # Inactive accounts are not allowed to authenticate
        if getattr(user, "is_active", True) is False:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User account is disabled")
        return user
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token decode error")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """FastAPI dependency returning the authenticated ``User`` instance.
    Delegates to ``_get_user_from_token`` for the heavy lifting.
    """
    return _get_user_from_token(token, db)


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Dependency that ensures the caller possesses the ``admin`` role.
    Returns the ``User`` object if the check passes; otherwise raises ``403``.
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    return current_user
