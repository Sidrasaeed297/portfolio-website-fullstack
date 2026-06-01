from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_access_token
from app.core.exceptions import AuthenticationError

# OAuth2 bearer scheme for JWT retrieval from Authorization headers
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    """
    Dependency to authenticate access requests.
    Validates JWT claims signature and retrieves the username.
    """
    if not token:
        raise AuthenticationError("Authentication token is missing")
    
    username = decode_access_token(token)
    if not username:
        raise AuthenticationError("Invalid or expired authentication credentials")
    
    return username
