# PrintSupport — Setup Guide

## Local Development

### Prerequisites
- Node 18+
- PostgreSQL running locally

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL and a JWT_SECRET
npm install
npm run db:push        # apply schema to DB
npm run db:seed        # creates admin + 2 agents
npm run dev            # starts on port 3001
```

**Default seed accounts:**
| Role  | Email                       | Password  |
|-------|-----------------------------|-----------|
| Admin | admin@printsupport.com      | admin123  |
| Agent | agent1@printsupport.com     | agent123  |
| Agent | agent2@printsupport.com     | agent123  |

### Frontend

```bash
cd frontend
npm install
npm run dev            # starts on port 5173 with proxy to :3001
```

No `.env` needed in development — Vite proxies `/api` and socket to the backend.

---

## Railway Deployment

Deploy as **two separate Railway services** from the same repo.

### Backend service

- Root directory: `backend`
- Environment variables:
  - `DATABASE_URL` — from Railway PostgreSQL plugin
  - `JWT_SECRET` — long random string (e.g. `openssl rand -hex 32`)
  - `FRONTEND_URL` — your frontend Railway URL (e.g. `https://printsupport.up.railway.app`)
  - `PORT` — set automatically by Railway

### Frontend service

- Root directory: `frontend`
- Install `serve` for static hosting: add `"serve": "^14.2.1"` to dependencies
- Environment variables:
  - `VITE_API_URL` — your backend Railway URL + `/api` (e.g. `https://printsupport-api.up.railway.app/api`)
  - `VITE_BACKEND_URL` — your backend Railway URL (e.g. `https://printsupport-api.up.railway.app`)

After deploying backend, run seed via Railway CLI:
```bash
railway run npm run db:seed
```

---

## URL Map

| URL                    | Who accesses it       |
|------------------------|-----------------------|
| `/`                    | Public homepage       |
| `/diagnose`            | Diagnostic flow       |
| `/about`               | About page            |
| `/privacy`             | Privacy policy        |
| `/agent/login`         | Support agents        |
| `/agent/dashboard`     | Agent dashboard       |
| `/admin/login`         | Admins only           |
| `/admin/dashboard`     | Admin control panel   |

Agent and admin login pages are **not linked in the main nav** — share them only with staff.
