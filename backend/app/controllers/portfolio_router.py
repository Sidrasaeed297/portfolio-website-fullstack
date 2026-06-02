from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.content import Blog, Project
from app.models.contact import ContactMessage
from app.models.portfolio import Education, Experience, Skill
from app.schemas.portfolio import (
    BlogOut,
    ContactIn,
    ContactOut,
    EducationOut,
    ExperienceOut,
    ProjectOut,
    SkillOut,
)

router = APIRouter(tags=["Portfolio"])


def _paginate_query(query, skip: int, limit: int) -> dict:
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return {"items": items, "total": total}


@router.get("/projects")
def list_projects(
    q: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    query = db.query(Project).order_by(Project.created_at.desc())
    if q:
        q_pattern = f"%{q}%"
        query = query.filter(
            (Project.title.ilike(q_pattern))
            | (Project.description.ilike(q_pattern))
            | (Project.tech_stack.ilike(q_pattern))
        )
    page = _paginate_query(query, skip, limit)
    return {
        "items": [ProjectOut.from_orm(item).dict() for item in page["items"]],
        "total": page["total"],
    }


@router.get("/blogs")
def list_blogs(
    q: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    query = db.query(Blog).order_by(Blog.published_at.desc())
    if q:
        q_pattern = f"%{q}%"
        query = query.filter(
            (Blog.title.ilike(q_pattern))
            | (Blog.body.ilike(q_pattern))
        )
    page = _paginate_query(query, skip, limit)
    items = []
    for blog in page["items"]:
        category = blog.title.split()[0] if blog.title else "General"
        items.append(
            BlogOut(
                id=blog.id,
                title=blog.title,
                body=blog.body,
                published_at=blog.published_at,
                category=category,
            ).dict()
        )
    return {"items": items, "total": page["total"]}


@router.get("/skills")
def list_skills(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    query = db.query(Skill).order_by(Skill.proficiency.desc())
    page = _paginate_query(query, skip, limit)
    return {"items": [SkillOut.from_orm(item).dict() for item in page["items"]], "total": page["total"]}


@router.get("/experiences")
def list_experiences(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    query = db.query(Experience).order_by(Experience.start_date.desc())
    page = _paginate_query(query, skip, limit)
    return {"items": [ExperienceOut.from_orm(item).dict() for item in page["items"]], "total": page["total"]}


@router.get("/educations")
def list_educations(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    query = db.query(Education).order_by(Education.start_date.desc())
    page = _paginate_query(query, skip, limit)
    return {"items": [EducationOut.from_orm(item).dict() for item in page["items"]], "total": page["total"]}


@router.post("/contact", status_code=status.HTTP_201_CREATED)
def create_contact_message(
    payload: ContactIn,
    db: Session = Depends(get_db),
):
    message = ContactMessage(
        sender_name=payload.name,
        sender_email=payload.email,
        subject=payload.subject or "Contact Form Message",
        message_body=payload.message,
        is_read=False,
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return ContactOut.from_orm(message)


@router.get("/contact")
def list_contact_messages(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    query = db.query(ContactMessage).order_by(ContactMessage.created_at.desc())
    page = _paginate_query(query, skip, limit)
    return {"items": [ContactOut.from_orm(item).dict() for item in page["items"]], "total": page["total"]}


@router.delete("/contact/{message_id}")
def delete_contact_message(
    message_id: int,
    db: Session = Depends(get_db),
):
    message = db.get(ContactMessage, message_id)
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact message not found")
    db.delete(message)
    db.commit()
    return {"detail": "Message deleted"}
