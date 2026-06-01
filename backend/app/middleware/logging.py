import time
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

# Configure logger context
logger = logging.getLogger("app.middleware")
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)

class LoggingMiddleware(BaseHTTPMiddleware):
    """
    HTTP Middleware profile interceptor.
    Logs method path, HTTP status, and transaction duration.
    """
    async def dispatch(self, request: Request, call_next):
        start_time = time.perf_counter()
        
        response = await call_next(request)
        
        process_time = time.perf_counter() - start_time
        logger.info(
            f"{request.method} {request.url.path} -> "
            f"Status: {response.status_code} | "
            f"Completed in {process_time:.4f}s"
        )
        
        return response
