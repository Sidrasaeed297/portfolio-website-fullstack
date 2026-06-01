from typing import Generic, TypeVar, Type, Any, Sequence
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.base import Base

ModelType = TypeVar("ModelType", bound=Base)

class GenericRepository(Generic[ModelType]):
    """
    Abstract Generic Repository implementing standard SQL database queries.
    Inherited by specific repositories to encapsulate data-mapping operations.
    """
    
    def __init__(self, model: Type[ModelType]):
        self.model = model

    def get_by_id(self, db: Session, id: Any) -> ModelType | None:
        """Fetch a single entity matching the specified ID."""
        return db.get(self.model, id)

    def list(self, db: Session, skip: int = 0, limit: int = 100) -> Sequence[ModelType]:
        """Fetch a paginated collection of database records."""
        stmt = select(self.model).offset(skip).limit(limit)
        return db.scalars(stmt).all()

    def create(self, db: Session, data: dict[str, Any]) -> ModelType:
        """Persist a new model record instance into the database session."""
        db_obj = self.model(**data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, db_obj: ModelType, data: dict[str, Any]) -> ModelType:
        """Apply updates to an existing model entity and save changes."""
        for field, value in data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, id: Any) -> ModelType | None:
        """Remove a record matching the unique primary key ID from database."""
        db_obj = db.get(self.model, id)
        if db_obj:
            db.delete(db_obj)
            db.commit()
        return db_obj
