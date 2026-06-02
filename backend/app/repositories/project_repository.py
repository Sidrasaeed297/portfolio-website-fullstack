from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.content import Project
from app.repositories.base import GenericRepository


class ProjectRepository(GenericRepository[Project]):
    def __init__(self, db: Session):
        super().__init__(Project)
        self.db = db

    def create(self, obj_in: dict) -> Project:
        return super().create(self.db, obj_in)

    def get_by_id(self, id: int) -> Optional[Project]:
        return super().get_by_id(self.db, id)

    def get_all(self, skip: int = 0, limit: int = 20) -> List[Project]:
        return super().list(self.db, skip, limit)

    def update(self, db_obj: Project, obj_in: dict) -> Project:
        return super().update(self.db, db_obj, obj_in)

    def delete(self, id: int) -> Optional[Project]:
        return super().delete(self.db, id)

    def search(self, query: str, skip: int = 0, limit: int = 20) -> List[Project]:
        ilike_query = f"%{query}%"
        return (
            self.db.query(Project)
            .filter(
                (Project.title.ilike(ilike_query)) |
                (Project.description.ilike(ilike_query)) |
                (Project.tech_stack.ilike(ilike_query))
            )
            .offset(skip)
            .limit(limit)
            .all()
        )
