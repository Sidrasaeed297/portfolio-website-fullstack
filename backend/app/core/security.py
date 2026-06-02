from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

# ---------------------------------------------------------------------------
# Password hashing utilities.
# ---------------------------------------------------------------------------
_pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Return ``True`` if *plain_password* matches *hashed_password``.
    ``passlib`` handles the constant‑time comparison.
    """
    return _pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash *password* with bcrypt and return the digest."""
    return _pwd_context.hash(password)

# ---------------------------------------------------------------------------
# JWT helpers – access & refresh tokens share the same secret/algorithm.
# ---------------------------------------------------------------------------

def _encode_token(
    subject: Any,
    token_type: str,
    expires: timedelta,
    extra_claims: Optional[Dict[str, Any]] = None,
) -> str:
    """Core encoder used by both access and refresh helpers.
    The payload includes ``sub`` (subject identifier), ``exp`` (expiry), ``typ``
    (token type) and any additional claims such as ``role``.
    """
    expire = datetime.now(timezone.utc) + expires
    payload: Dict[str, Any] = {
        "sub": str(subject),
        "exp": expire,
        "typ": token_type,
    }
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_access_token(
    subject: Any,
    expires_delta: Optional[timedelta] = None,
    role: Optional[str] = None,
) -> str:
    """Generate a short‑lived access token (default from settings).
    Include optional ``role`` claim for authorization checks.
    """
    delta = expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    extra = {"role": role} if role else None
    return _encode_token(subject, "access", delta, extra_claims=extra)


def create_refresh_token(
    subject: Any,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Generate a long‑lived refresh token (default from settings)."""
    # Use configured days if available, otherwise fallback to 7 days
    default_days = getattr(settings, "REFRESH_TOKEN_EXPIRE_DAYS", 7)
    delta = expires_delta or timedelta(days=default_days)
    return _encode_token(subject, "refresh", delta)


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode *token* and return its payload as a ``dict``.
    Returns ``None`` if verification fails or token is expired.
    """
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None
