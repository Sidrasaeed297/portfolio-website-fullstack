"""
app/models/user.py
─────────────────
Defines the authentication‑related domain entities with proper OOP features.

* **User** – concrete subclass of ``BaseEntity`` that stores username, email, a
  hashed password, an ``is_active`` flag, and a ``role`` column ("user" or
  "admin").  Password handling is encapsulated via ``set_password`` and
  ``check_password`` helpers.
* **Admin** – specialized ``User`` demonstrating Single‑Table Inheritance (STI).

Both classes implement ``display_label`` required by ``BaseEntity``.
"""

from __future__ import annotations

from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from app.core.security import get_password_hash, verify_password
from .base import BaseEntity


class User(BaseEntity):
    """Domain representation of an application user.

    *Encapsulation*: The raw password is never stored – it is hashed via the
    ``set_password`` helper. ``check_password`` validates a candidate password.
    *Polymorphism*: ``User`` implements ``display_label`` enabling callers to
    treat any ``BaseEntity`` uniformly.
    """

    __tablename__ = "users"

    username: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    _password_hash: Mapped[str] = mapped_column("password_hash", String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    role: Mapped[str] = mapped_column(String(20), default="user", nullable=False)

    # ---------------------------------------------------------------------
    # Encapsulation – password handling
    # ---------------------------------------------------------------------
    def set_password(self, raw_password: str) -> None:
        """Hash *raw_password* and store the resulting digest.
        This is the only public way to change a user's password.
        """
        self._password_hash = get_password_hash(raw_password)

    def check_password(self, raw_password: str) -> bool:
        """Validate *raw_password* against the stored hash."""
        return verify_password(raw_password, self._password_hash)

    @property
    def hashed_password(self) -> str:
        return self._password_hash

    def display_label(self) -> str:
        return f"User: {self.username}"
