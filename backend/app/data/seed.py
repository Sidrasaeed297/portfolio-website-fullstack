from datetime import date

from sqlalchemy.orm import Session

from app.models.contact import ContactMessage
from app.models.content import Blog, Project
from app.models.portfolio import Education, Experience, Skill
from app.models.user import User


def seed_database(db: Session) -> None:
    """Create an admin account and portfolio seed records when the database is empty."""
    admin = db.query(User).filter(User.email == "admin@meenu-dev.com").first()
    if admin is None:
        admin = User(username="meenu_admin", email="admin@meenu-dev.com", role="admin", is_active=True)
        admin.set_password("AdminPass123!")
        db.add(admin)
        db.commit()
        db.refresh(admin)

    admin_id = admin.id

    if db.query(Project).count() == 0:
        db.add_all([
            Project(
                title="SaaS Analytics Dashboard",
                description="Designed a responsive dashboard with real-time charts, user management, and performance monitoring for data-driven teams.",
                tech_stack="React, Tailwind, FastAPI, PostgreSQL",
                demo_url="https://example.com/demo-dashboard",
                repo_url="https://github.com/portfolio/dashboard",
            ),
            Project(
                title="Content Publishing Platform",
                description="Built a flexible CMS for technical authors with markdown editing, media uploads, and fast search.",
                tech_stack="Next.js, Python, SQLite, AWS S3",
                demo_url="https://example.com/demo-cms",
                repo_url="https://github.com/portfolio/cms",
            ),
            Project(
                title="Portfolio Website Redesign",
                description="Modernized a designer portfolio with motion UI, dark mode, and accessible mobile layouts.",
                tech_stack="React, Tailwind CSS, Vite",
                demo_url="https://example.com/demo-portfolio",
                repo_url="https://github.com/portfolio/portfolio-redesign",
            ),
        ])

    if db.query(Blog).count() == 0:
        db.add_all([
            Blog(
                title="Designing Accessible SaaS Interfaces",
                body="Accessibility should be part of the design process from day one. In this post, I walk through keyboard-friendly layouts, color contrast, and responsive interactions.",
            ),
            Blog(
                title="Scaling FastAPI for Production",
                body="This article covers deployment strategies, database connection management, background tasks, and logging best practices for modern APIs.",
            ),
        ])

    if db.query(Skill).count() == 0:
        db.add_all([
            Skill(name="React", category="Frontend", proficiency=95, is_verified=True),
            Skill(name="Tailwind CSS", category="Frontend", proficiency=92, is_verified=True),
            Skill(name="FastAPI", category="Backend", proficiency=88, is_verified=True),
            Skill(name="Python", category="Backend", proficiency=90, is_verified=True),
            Skill(name="SQL", category="Data", proficiency=83, is_verified=True),
            Skill(name="Figma", category="Design", proficiency=78, is_verified=False),
        ])

    if db.query(Experience).count() == 0:
        db.add_all([
            Experience(
                company="BrightStack Labs",
                role="Senior Product Engineer",
                description="Led full-stack delivery for enterprise product initiatives and raised team velocity with design system automation.",
                start_date=date(2023, 1, 1),
                end_date=None,
                is_current=True,
            ),
            Experience(
                company="Nova Creative",
                role="Frontend Developer",
                description="Implemented high-performance user interfaces and reusable component libraries for B2B applications.",
                start_date=date(2021, 6, 1),
                end_date=date(2022, 12, 31),
                is_current=False,
            ),
        ])

    if db.query(Education).count() == 0:
        db.add_all([
            Education(
                institution="State University",
                degree="Bachelor of Science",
                field_of_study="Computer Science",
                start_date=date(2017, 9, 1),
                end_date=date(2021, 5, 15),
                is_current=False,
            ),
            Education(
                institution="Online Academy",
                degree="Professional Certificate",
                field_of_study="UX & Product Design",
                start_date=date(2022, 2, 1),
                end_date=date(2022, 8, 31),
                is_current=False,
            ),
        ])

    if db.query(ContactMessage).count() == 0:
        db.add_all([
            ContactMessage(
                sender_name="Alex Morgan",
                sender_email="alex.morgan@example.com",
                subject="Website feedback",
                message_body="Great work on the portfolio layout. The new sections are very professional.",
                is_read=True,
            ),
        ])

    db.commit()
