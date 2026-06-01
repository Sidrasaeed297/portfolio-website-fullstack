from datetime import datetime, timezone
from sqlalchemy import DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, declared_attr

class Base(DeclarativeBase):
    """
    SQLAlchemy 2.0 Base Class.
    All data models inherit from this to gain standardized tracking columns.
    """
    
    # Auto-increment primary key
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    
    # Tracking timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    @declared_attr.directive
    def __tablename__(cls) -> str:
        """Generate pluralized table name from class name (e.g., User -> users)."""
        name = cls.__name__.lower()
        if name.endswith("y"):
            return f"{name[:-1]}ies"
        elif name.endswith("s"):
            return f"{name}es"
        return f"{name}s"
