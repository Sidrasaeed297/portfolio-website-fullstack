"""
app/models/portfolio.py
──────────────────────
Defines the remaining *portfolio* domain entities – ``Skill``, ``Experience`` and
``Education``.  All inherit from ``BaseEntity`` and therefore share the common
primary key, timestamp columns and the abstract ``display_label`` contract.

Each model demonstrates:
* **Indexes** – appropriate columns are indexed for fast look‑ups.
* **Constraints** – ``nullable`` flags and optional ``unique`` constraints.
* **Polymorphism** – they each implement ``display_label`` which provides a
  human‑readable label used by UI code without exposing internal column names.
"""

from __future__ import annotations

from datetime import date, datetime, timezone
from typing import Optional

from sqlalchemy import String, Text, Date, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from .base import BaseEntity


class Skill(BaseEntity):
    """A single skill with a proficiency rating.

    * ``name`` – the skill name (unique for easy de‑duplication).
    * ``category`` – optional grouping (e.g. "Programming Language").
    * ``proficiency`` – integer percentage (0‑100).
    """

    __tablename__ = "skills"
    name: Mapped[str] = mapped_column(String(80), unique=True, nullable=False, index=True)
    category: Mapped[Optional[str]] = mapped_column(String(80), index=True)
    proficiency: Mapped[int] = mapped_column(nullable=False, default=0)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    def display_label(self) -> str:
        return f"Skill: {self.name} ({self.proficiency}%)"


class Experience(BaseEntity):
    """Professional experience record.

    Includes start / optional end dates, a company name and a descriptive
    overview of responsibilities.
    """

    __tablename__ = "experiences"
    company: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    role: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[Optional[date]] = mapped_column(Date)
    is_current: Mapped[bool] = mapped_column(Boolean, default=False)

    def display_label(self) -> str:
        end = "Present" if self.is_current else self.end_date.isoformat()
        return f"{self.role} @ {self.company} ({self.start_date.isoformat()} – {end})"


class Education(BaseEntity):
    """Academic credential.

    Fields are typical for a university degree entry.
    """

    __tablename__ = "educations"
    institution: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    degree: Mapped[str] = mapped_column(String(120), nullable=False)
    field_of_study: Mapped[Optional[str]] = mapped_column(String(120))
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[Optional[date]] = mapped_column(Date)
    is_current: Mapped[bool] = mapped_column(Boolean, default=False)

    def display_label(self) -> str:
        end = "Present" if self.is_current else self.end_date.isoformat()
        return f"{self.degree} in {self.field_of_study or ''} – {self.institution} ({self.start_date.isoformat()} – {end})"
