from sqlalchemy.orm import Mapped, mapped_column, Session
from app.models.base import Base
from app.repositories.base import GenericRepository
from fastapi.testclient import TestClient

# Define a test-scoped concrete model to validate GenericRepository structures
class DummyItem(Base):
    name: Mapped[str] = mapped_column(nullable=False)

class DummyItemRepository(GenericRepository[DummyItem]):
    pass

def test_health_endpoint(client: TestClient):
    """Verify that the service health-check endpoint responds correctly."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "project" in data
    assert "version" in data

def test_generic_repository_crud(db: Session):
    """Verify database CRUD lifecycle operations in GenericRepository."""
    # Ensure test-scoped table schema is dynamically registered
    DummyItem.__table__.create(bind=db.bind, checkfirst=True)
    
    repo = DummyItemRepository(DummyItem)
    
    # 1. Create Assertion
    item = repo.create(db, {"name": "infrastructure-test-item"})
    assert item.id is not None
    assert item.name == "infrastructure-test-item"
    assert item.created_at is not None
    assert item.updated_at is not None
    
    # 2. Read Assertion
    fetched = repo.get_by_id(db, item.id)
    assert fetched is not None
    assert fetched.id == item.id
    assert fetched.name == "infrastructure-test-item"
    
    # 3. Collection Fetch Assertion
    items = repo.list(db)
    assert len(items) == 1
    assert items[0].name == "infrastructure-test-item"
    
    # 4. Update Assertion
    updated = repo.update(db, fetched, {"name": "updated-test-item"})
    assert updated.name == "updated-test-item"
    assert updated.id == item.id
    
    # 5. Delete Assertion
    deleted = repo.delete(db, item.id)
    assert deleted is not None
    assert deleted.id == item.id
    
    # 6. Read Verification Post-Delete
    assert repo.get_by_id(db, item.id) is None
