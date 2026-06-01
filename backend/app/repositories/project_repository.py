from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select, or_, func

from app.models.content import Project
from app.repositories.base import GenericRepository

class ProjectRepository(GenericRepository[Project]):
    def __init__(self):
        super().__init__(Project)

    def search(self, db: Session, query: str, skip: int = 0, limit: int = 100) -> List[Project]:
        """Search projects by title, description, or technologies (tech_stack)."""
        stmt = (
            select(self.model)
            .where(
                or_(
                    func.lower(self.model.title).ilike(f"%{query.lower()}%"),
                    func.lower(self.model.description).ilike(f"%{query.lower()}%"),
                    func.lower(self.model.tech_stack).ilike(f"%{query.lower()}%"),
                )
            )
            .offset(skip)
            .limit(limit)
        )
        return db.scalars(stmt).all()
