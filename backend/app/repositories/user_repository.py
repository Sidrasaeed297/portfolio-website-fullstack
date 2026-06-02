from typing import Optional

from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import RegisterIn


class UserRepository:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def create_user(self, payload: RegisterIn, hashed_password: str) -> User:
        user = User(
            username=payload.username,
            email=payload.email,
            _password_hash=hashed_password,
            role="user",
            is_active=True,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
