# Testing Framework Guide

This document describes the testing architecture, pytest runner configurations, and dependency mock testing strategies implemented for the backend.

---

## 1. Testing Stack

The testing harness leverages the following components:
* **Pytest**: The core test runner.
* **Pytest-Asyncio**: Supports writing asynchronous integration tests.
* **Pytest-Cov**: Provides test coverage analytics using the Coverage.py engine.
* **FastAPI TestClient (via HTTPX)**: Simulates client-side REST requests directly against the app instance without needing an external web server process.

---

## 2. Test DB Transaction Isolation

To keep tests isolated and fast, we use an in-memory SQLite database (`sqlite:///:memory:`) configured in `tests/conftest.py`:
1. **Schema Set Up**: In-memory tables are initialized once before the test session starts.
2. **Transaction rollback**: Each test function gets its own transaction block. Pytest rolls back the transaction after the test completes, ensuring data is clean for subsequent tests.

---

## 3. Mocking & Dependency Overrides

FastAPI routes that require database operations rely on the `get_db` dependency. During testing, the `client` fixture in `conftest.py` overrides this injection:

```python
from app.database.session import get_db

app.dependency_overrides[get_db] = get_db_override_fixture
```

This routes all controller database sessions directly through the mock transactional database session.

---

## 4. Execution Command Reference

Execute tests from the `backend/` root directory.

### Run all tests
```bash
.venv\Scripts\python -m pytest
```

### Run tests with detailed log output
```bash
.venv\Scripts\python -m pytest -v
```

### Run tests with code coverage report
```bash
.venv\Scripts\python -m pytest --cov=app tests/
```

### Target a specific test file
```bash
.venv\Scripts\python -m pytest tests/test_infra.py
```
