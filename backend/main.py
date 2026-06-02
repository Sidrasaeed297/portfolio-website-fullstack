from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.middleware.logging import LoggingMiddleware
from app.database.session import engine, get_db
from app.models.base import Base
from app.controllers.auth_router import router as auth_router
from app.controllers.portfolio_router import router as portfolio_router
from app.data.seed import seed_database

# Auto-initialize SQLite database tables on application start for development
# (For complex setups, migrations via Alembic are recommended)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Register custom exception handler mapping
register_exception_handlers(app)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach logging & profiling middleware
app.add_middleware(LoggingMiddleware)

app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(portfolio_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def on_startup() -> None:
    """Seed the database when the API starts, using safe idempotent checks."""
    with Session(bind=engine) as db:
        seed_database(db)

@app.get("/health", tags=["Infrastructure"])
def health_check():
    """Infrastructure layer sanity check endpoint."""
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION
    }
