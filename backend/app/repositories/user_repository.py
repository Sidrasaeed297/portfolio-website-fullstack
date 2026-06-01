from typing import Optional

from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database.session import get_session
from app.models.user import User
from app.schemas.auth import RegisterIn


class UserRepository:
    def __init__(self, db: Session = Depends(get_session)):
        self.db = db
        # expose the session for services that need direct commit/refresh
        self.session = db

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def create_user(self, payload: RegisterIn) -> User:
        # Password hashing is performed in the service layer; we just instantiate the model.
        user = User(
            username=payload.username,
            email=payload.email,
            password_hash=payload.password,  # placeholder; will be replaced with hashed pw
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
