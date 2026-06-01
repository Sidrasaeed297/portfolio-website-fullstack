from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

# ---------------------------------------------------------------------------
# Password hashing utilities (bcrypt)
# ---------------------------------------------------------------------------
_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Return ``True`` if *plain_password* matches *hashed_password*.
    ``passlib`` handles the constant‑time comparison.
    """
    return _pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash *password* with bcrypt and return the digest."""
    return _pwd_context.hash(password)

# ---------------------------------------------------------------------------
# JWT helpers – access & refresh tokens share the same secret/algorithm.
# ---------------------------------------------------------------------------

def _encode_token(subject: Any, token_type: str, expires: timedelta) -> str:
    """Core encoder used by both access and refresh helpers.
    The payload includes ``sub`` (subject identifier), ``exp`` (expiry) and ``typ``
    (token type) to aid in validation.
    """
    expire = datetime.now(timezone.utc) + expires
    payload: Dict[str, Any] = {
        "sub": str(subject),
        "exp": expire,
        "typ": token_type,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_access_token(subject: Any, expires_delta: Optional[timedelta] = None) -> str:
    """Generate a short‑lived access token (default 15 minutes)."""
    delta = expires_delta or timedelta(minutes=15)
    return _encode_token(subject, "access", delta)


def create_refresh_token(subject: Any, expires_delta: Optional[timedelta] = None) -> str:
    """Generate a long‑lived refresh token (default 7 days)."""
    delta = expires_delta or timedelta(days=7)
    return _encode_token(subject, "refresh", delta)


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode *token* and return its payload as a ``dict``.
    Returns ``None`` if verification fails or token is expired.
    """
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None
