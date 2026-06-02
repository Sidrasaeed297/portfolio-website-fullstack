from typing import Optional

from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.auth import RegisterIn


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def create_user(self, payload: RegisterIn) -> User:
        user = User(
            username=payload.username,
            email=payload.email,
            password_hash=payload.password,  # hashing will be done in service before calling
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
