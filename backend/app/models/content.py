"""
app/models/content.py
──────────────────────
Defines a content hierarchy used for public‑facing items.

* ``Content`` – abstract base class that inherits from ``BaseEntity`` and
  declares an abstract ``render_summary`` method.  This demonstrates *abstraction*
  and *polymorphism* – concrete subclasses must implement their own rendering.
* ``Project`` – concrete subclass representing a portfolio project.  It adds
  fields describing the work and a many‑to‑one relationship to ``User`` (the
  author/owner).
* ``Blog`` – concrete subclass for a blog post.  It stores a body of text
  and a publication timestamp, also linked to a ``User``.

Both concrete classes implement ``display_label`` (required by ``BaseEntity``)
and ``render_summary`` (required by ``Content``).
"""

from __future__ import annotations

import abc
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from .base import BaseEntity


class Content(BaseEntity):
    """Abstract base for all content types.

    Declares ``render_summary`` as an abstract method – subclasses must
    provide a concise string representation.  The class also adds a
    ``author_id`` foreign‑key relationship to the ``User`` table to illustrate
    ORM relationships.
    """

    __abstract__ = True

    @abc.abstractmethod
    def render_summary(self) -> str:
        """Return a short summary appropriate for list views.
        Must be implemented by each concrete content subclass.
        """
        raise NotImplementedError

    # ``display_label`` is still abstract from ``BaseEntity``; concrete
    # subclasses will provide the implementation.


class Project(Content):
    """Concrete portfolio project representation.

    * Inherits ``author`` relationship from ``Content``.
    * Stores typical project metadata – title, description, and URLs.
    * Implements ``render_summary`` and ``display_label``.
    """

    __tablename__ = "projects"
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    tech_stack: Mapped[Optional[str]] = mapped_column(String(250))
    demo_url: Mapped[Optional[str]] = mapped_column(String(250))
    repo_url: Mapped[Optional[str]] = mapped_column(String(250))

    def render_summary(self) -> str:
        return f"{self.title} – {self.tech_stack or 'Various'}"

    def display_label(self) -> str:
        return f"Project: {self.title}"


class Blog(Content):
    """Concrete blog post representation.

    * Stores the full body text and a publication timestamp.
    * Implements ``render_summary`` via a truncated preview of the body.
    """

    __tablename__ = "blogs"
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    published_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def render_summary(self) -> str:
        preview = self.body[:75]
        return f"{self.title}: {preview}{'...' if len(self.body) > 75 else ''}"

    def display_label(self) -> str:
        return f"Blog: {self.title}"
