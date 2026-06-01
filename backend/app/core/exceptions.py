from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

class AppException(Exception):
    """Base application exception for portfolio domain errors."""
    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code

class EntityNotFoundError(AppException):
    """Raised when a database entity could not be retrieved."""
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, status_code=404)

class AuthenticationError(AppException):
    """Raised when authentication credentials fail."""
    def __init__(self, message: str = "Could not validate credentials"):
        super().__init__(message, status_code=401)

class AuthorizationError(AppException):
    """Raised when user permissions are insufficient."""
    def __init__(self, message: str = "Permission denied"):
        super().__init__(message, status_code=403)

def register_exception_handlers(app: FastAPI) -> None:
    """Wire custom Exception instances directly to FastAPI HTTP responses."""
    
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.message, "status_code": exc.status_code}
        )
        
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        # In production, log detailed traceback but return generic message
        return JSONResponse(
            status_code=500,
            content={"detail": "An unexpected internal server error occurred.", "status_code": 500}
        )
