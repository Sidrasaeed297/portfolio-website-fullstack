import pytest
from fastapi.testclient import TestClient
from app.schemas.auth import RegisterIn, LoginIn
from app.models.user import User
from app.core.security import get_password_hash
from app.repositories.user_repository import UserRepository

# Helper to register a user via the API
def register_user(client: TestClient, username: str, email: str, password: str):
    payload = {"username": username, "email": email, "password": password}
    return client.post("/auth/register", json=payload)

# Helper to login a user via the API
def login_user(client: TestClient, email: str, password: str):
    data = {"username": email, "password": password}
    return client.post("/auth/login", data=data)

@pytest.fixture
def admin_user(db):
    repo = UserRepository()
    admin = User(
        username="admin",
        email="admin@example.com",
        _password_hash=get_password_hash("adminpass"),
        role="admin",
        is_active=True,
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin

def test_register_success(client: TestClient):
    resp = register_user(client, "alice", "alice@example.com", "secret123")
    assert resp.status_code == 201
    data = resp.json()
    assert data["username"] == "alice"
    assert data["email"] == "alice@example.com"
    assert "id" in data

def test_register_duplicate_email(client: TestClient):
    # First registration
    register_user(client, "bob", "bob@example.com", "pwd123")
    # Duplicate registration
    resp = register_user(client, "bob2", "bob@example.com", "pwd456")
    assert resp.status_code == 401
    assert resp.json()["detail"] == "Email already registered"

def test_login_success(client: TestClient):
    register_user(client, "carol", "carol@example.com", "carolpwd")
    resp = login_user(client, "carol@example.com", "carolpwd")
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert "refresh_token" in data

def test_login_invalid_password(client: TestClient):
    register_user(client, "dave", "dave@example.com", "davepwd")
    resp = login_user(client, "dave@example.com", "wrongpwd")
    assert resp.status_code == 401
    assert resp.json()["detail"] == "Invalid credentials"

def test_login_disabled_user(client: TestClient, db):
    # Create a disabled user directly in DB
    repo = UserRepository()
    disabled = User(
        username="eve",
        email="eve@example.com",
        _password_hash=get_password_hash("evepwd"),
        role="user",
        is_active=False,
    )
    db.add(disabled)
    db.commit()
    db.refresh(disabled)
    resp = login_user(client, "eve@example.com", "evepwd")
    assert resp.status_code == 401
    assert resp.json()["detail"] == "User account is disabled"

def test_access_protected_me(client: TestClient):
    register_user(client, "frank", "frank@example.com", "frankpwd")
    login = login_user(client, "frank@example.com", "frankpwd")
    token = login.json()["access_token"]
    resp = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["username"] == "frank"

def test_refresh_token_success(client: TestClient):
    register_user(client, "gina", "gina@example.com", "ginapwd")
    login = login_user(client, "gina@example.com", "ginapwd")
    refresh = login.json()["refresh_token"]
    resp = client.post("/auth/refresh", json={"refresh_token": refresh})
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert "refresh_token" in data

def test_refresh_with_access_token_fails(client: TestClient):
    register_user(client, "harry", "harry@example.com", "harrypwd")
    login = login_user(client, "harry@example.com", "harrypwd")
    access = login.json()["access_token"]
    resp = client.post("/auth/refresh", json={"refresh_token": access})
    assert resp.status_code == 401
    assert resp.json()["detail"] == "Invalid refresh token"

def test_admin_route_success(client: TestClient, admin_user):
    # Login as admin
    resp_login = login_user(client, "admin@example.com", "adminpass")
    token = resp_login.json()["access_token"]
    resp = client.get("/auth/admin-only", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json()["msg"] == "admin access granted"

def test_admin_route_failure(client: TestClient):
    register_user(client, "ivan", "ivan@example.com", "ivanpwd")
    login = login_user(client, "ivan@example.com", "ivanpwd")
    token = login.json()["access_token"]
    resp = client.get("/auth/admin-only", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 403
    assert resp.json()["detail"] == "Admin privileges required"

def test_refresh_token_cannot_access_me(client: TestClient):
    register_user(client, "jane", "jane@example.com", "janepwd")
    login = login_user(client, "jane@example.com", "janepwd")
    refresh = login.json()["refresh_token"]
    # Attempt to use refresh token on /me
    resp = client.get("/auth/me", headers={"Authorization": f"Bearer {refresh}"})
    assert resp.status_code == 401
    # The error message should indicate invalid credentials for access token
    assert resp.json()["detail"] == "Could not validate credentials"
