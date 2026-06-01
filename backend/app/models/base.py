"""
app/models/base.py
──────────────────
Defines two foundational classes:

  1. Base  — the raw SQLAlchemy DeclarativeBase required by the ORM engine.
  2. BaseEntity — an *abstract* domain ancestor that all concrete models inherit
     from.  It provides:
       • auto-incrementing primary key
       • created_at / updated_at timestamps
       • __tablename__ auto-derivation
       • abstract `display_label()` method (Abstraction + Polymorphism)

OOP Principles demonstrated here
─────────────────────────────────
  Abstraction   → BaseEntity cannot be instantiated; it exposes abstract
                  contracts for subclasses.
  Inheritance   → Every domain model inherits shared columns & behaviour.
"""

from __future__ import annotations

import abc
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import DateTime, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, declared_attr


# ──────────────────────────────────────────────────────────────────────────────
# Raw ORM engine base (must remain a plain DeclarativeBase with no columns)
# ──────────────────────────────────────────────────────────────────────────────
class Base(DeclarativeBase):
    """SQLAlchemy declarative root — do NOT add columns here."""
    pass


# ──────────────────────────────────────────────────────────────────────────────
# Abstract domain ancestor
# ──────────────────────────────────────────────────────────────────────────────
class BaseEntity(Base):
    """
    Abstract base for all Portfolio domain entities.

    Provides:
      • Shared surrogate primary key
      • Automatic created_at / updated_at timestamps
      • Auto-generated __tablename__ (pluralised snake_case)
      • Abstract display_label() enforced on every concrete subclass
        → demonstrates *Abstraction* and *Polymorphism*
    """

    __abstract__ = True  # SQLAlchemy will not create a table for this class

    # ── Primary Key ───────────────────────────────────────────────────────────
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)

    # ── Audit timestamps ──────────────────────────────────────────────────────
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # ── Auto tablename ────────────────────────────────────────────────────────
    @declared_attr.directive
    def __tablename__(cls) -> str:  # noqa: N805
        """
        Auto-derive a snake_case plural table name from the class name.
        Examples:  User → users | ContactMessage → contactmessages
        """
        name = "".join(
            f"_{c.lower()}" if c.isupper() and i else c.lower()
            for i, c in enumerate(cls.__name__)
        )
        if name.endswith("y"):
            return f"{name[:-1]}ies"
        elif name.endswith("s"):
            return f"{name}es"
        return f"{name}s"

    # ── Abstract contract ─────────────────────────────────────────────────────
    @abc.abstractmethod
    def display_label(self) -> str:
        """
        Return a human-readable label for the entity.

        *Abstraction*  — Every subclass MUST implement this.
        *Polymorphism* — Callers invoke display_label() on any BaseEntity
                         reference and get subclass-specific behaviour.
        """
