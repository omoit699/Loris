# Loris-E-9

Monorepo containing the Loris project(s). This repository holds the `Loris-main` project which includes the Trusan Electronics Store example application (backend + frontend).

Root layout
- `Loris-main/` — main project folder (contains `trusan-electronics-store/`).
- `lfs/` — Git LFS files/storage used by this repo.
- `BACKEND_FRONTEND_FIXES.md` — notes and fixes.

Quick start

Backend (API)
1. Open a terminal and change to the backend folder:

```bash
cd Loris-main/trusan-electronics-store/backend
```

2. Install dependencies and start in development mode:

```bash
npm install
npm run dev
```

The API server listens on port `5000` by default (override with `PORT`).

Frontend (Vite + React)
1. Open a terminal and change to the frontend folder:

```bash
cd Loris-main/trusan-electronics-store/frontend
```

2. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The Vite dev server runs on the default `5173` port. The backend expects the frontend origin to be configured via the environment variable `FRONTEND_URL` if needed.

Environment variables
- `JWT_SECRET` — JWT secret for auth (backend).
- `PORT` — backend port (default `5000`).
- `FRONTEND_URL` — allowed frontend origin for socket connections/CORS.

Proposed repo organization
- `docs/` — consolidate documentation like `BACKEND_FRONTEND_FIXES.md` and policy docs.
- `projects/` — group application folders such as `trusan-electronics-store`.

If you'd like, I can apply this reorganization (move docs into `docs/` and create `projects/`).

---
Generated: repository root README
