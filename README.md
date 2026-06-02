# Meenu-Dev

A modern software company website and admin dashboard built with React, Tailwind CSS, Vite, and FastAPI.

## Overview

Meenu-Dev is a full-stack web application template for a software development company. It features:
- A dark luxury SaaS-style marketing frontend
- React-based client pages for Home, About, Projects, Blog, and Contact
- FastAPI backend with JWT authentication and SQLite persistence
- Admin login and dashboard for managing project and content data
- Seeded admin user and sample project/blog records for development

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, React Hook Form
- Backend: FastAPI, SQLAlchemy, SQLite, Pydantic, python-jose, Passlib
- Dev tooling: Vite, Uvicorn, pytest

## Repository Structure

```text
Portfolio/
├── backend/
│   ├── app/
│   │   ├── core/          # config, security, exception handling
│   │   ├── controllers/   # FastAPI routers for auth and portfolio data
│   │   ├── data/          # database seeding logic
│   │   ├── database/      # SQLAlchemy session and engine
│   │   ├── models/        # database models
│   │   ├── repositories/  # database access logic
│   │   ├── schemas/       # request/response schema definitions
│   │   ├── services/      # business logic services
│   │   └── utils/         # utility helpers
│   ├── requirements.txt   # Python dependencies
│   └── main.py            # FastAPI application entrypoint
├── frontend/
│   ├── src/
│   │   ├── components/    # shared UI components
│   │   ├── layouts/       # application layouts
│   │   ├── pages/         # React page views
│   │   ├── services/      # API service wrappers
│   │   └── index.css      # Tailwind and theme styles
│   ├── package.json       # frontend dependencies and scripts
│   └── tailwind.config.js # Tailwind configuration
├── architecture_design.md
└── README.md
```

## Prerequisites

- Node.js 18+ / npm
- Python 3.11+ (or compatible Python 3.10+)
- Git (optional)

## Backend Setup

1. Open a terminal in `backend/`
2. Create and activate a Python virtual environment:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
4. Run the API server:
   ```powershell
   uvicorn main:app --reload
   ```

The API will start on `http://127.0.0.1:8000` by default.

## Frontend Setup

1. Open a terminal in `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`.

## Admin Login

The project includes an admin account seeded for local development.

- **Email:** `admin@meenu-dev.com`
- **Password:** `AdminPass123!`

Use these credentials at:

```text
http://localhost:5173/admin/login
```

### Seed Script

A helper script is available to create or verify the admin account:

```powershell
cd backend
python create_admin.py
```

## API Endpoints

The backend exposes these primary endpoints under `/api/v1`:

- `POST /api/v1/auth/login` - user login, returns access and refresh JWT tokens
- `POST /api/v1/auth/register` - register a new user
- `POST /api/v1/auth/refresh` - refresh access token
- `GET /api/v1/auth/me` - current authenticated user
- `GET /health` - health check endpoint

## Environment Configuration

The backend reads settings from `.env` if present. Default values are defined in `backend/app/core/config.py`.

Key settings:

- `DATABASE_URL` - database connection string
- `SECRET_KEY` - JWT signing key
- `ALGORITHM` - JWT algorithm
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `REFRESH_TOKEN_EXPIRE_DAYS`
- `ALLOWED_ORIGINS`

## Build for Production

### Frontend

```bash
cd frontend
npm run build
``` 

### Backend

For production, run using a WSGI/ASGI server and configure a production database.

## Notes

- The app currently uses a local SQLite database for development.
- For production, replace the default `SECRET_KEY` and configure a secure database URL.
- The frontend is built with Tailwind CSS and includes a premium dark glass theme.
- The admin dashboard routes are available at `/admin/dashboard` once logged in.

## Contact

**Meenu-Dev**

Email: `sidrasaeed1289@gmail.com`

---

If you want, I can also add a dedicated `CONTRIBUTING.md` or `DEPLOYMENT.md` for production instructions.
