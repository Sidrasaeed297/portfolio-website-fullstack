# API Specification Documentation

This document describes the REST API endpoints, routing patterns, authentication protocols, and error response formats implemented in the backend foundation layer.

---

## 1. OpenAPI Interactive Documentation

FastAPI automatically parses source code type annotations and exports OpenAPI compliant JSON definitions. When running the server locally, interactive UI documentation is available at:
* **Swagger UI**: `http://localhost:8000/docs`
* **ReDoc UI**: `http://localhost:8000/redoc`

---

## 2. Infrastructure Endpoints

### Health Check
Validates that the API, database connectivity, and middleware lifecycle are fully operational.
* **Route**: `GET /health`
* **Authentication**: None (Public)
* **Response `200 OK`**:
  ```json
  {
    "status": "healthy",
    "project": "Meenu-Dev API",
    "version": "1.0.0"
  }
  ```

---

## 3. Error Contract Specification

All custom errors mapped by `register_exception_handlers` inside `app/core/exceptions.py` follow a consistent JSON schema:

```json
{
  "detail": "Descriptive error message indicating the failure reason.",
  "status_code": 404
}
```

### Common HTTP Status Codes
* **`400 Bad Request`**: Malformed JSON, validation failures, or invalid operational states.
* **`401 Unauthorized`**: Missing JWT, expired token signatures, or invalid passwords.
* **`403 Forbidden`**: Insufficient permissions to view or edit the requested resource.
* **`404 Not Found`**: The requested database record does not exist.
* **`500 Internal Server Error`**: Unexpected system exceptions (raw tracebacks are logged internally while a generic client message is returned).

---

## 4. Authentication Mechanism

For CMS operations (projects, experiences, and skills modification), administrative routes are protected by JSON Web Token (JWT) credentials:
- **Token Exchange Route**: `POST /api/v1/auth/login` (Uses standard `OAuth2PasswordRequestForm` containing `username` and `password`).
- **Protected Request Headers**:
  ```http
  Authorization: Bearer <your_jwt_access_token>
  ```
