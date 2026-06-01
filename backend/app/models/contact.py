"""
app/models/contact.py
──────────────────────
Defines a simple ``ContactMessage`` model for inbound messages from the public
site.  It inherits from ``BaseEntity`` and therefore already includes primary
key, timestamps and the abstract ``display_label`` contract.
"""

from __future__ import annotations

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .base import BaseEntity


class ContactMessage(BaseEntity):
    """Message submitted via the portfolio contact form.

    * ``sender_name`` and ``sender_email`` are required.
    * ``subject`` is optional – if omitted a generic subject is used.
    * ``message_body`` stores the full free‑form message text.
    * ``is_read`` is a boolean flag toggled by the admin UI.
    """

    __tablename__ = "contact_messages"
    sender_name: Mapped[str] = mapped_column(String(120), nullable=False)
    sender_email: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    subject: Mapped[str] = mapped_column(String(200), default="Contact Form Message")
    message_body: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(default=False)

    def display_label(self) -> str:
        return f"Message from {self.sender_name} <{self.sender_email}>"
