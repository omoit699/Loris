
# Loris-E-9

This repository contains the Loris project: the Trusan Electronics Store example application (backend + frontend).

Project layout
- `Loris-main/trusan-electronics-store/` — primary project folder containing the backend and frontend apps.
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

The Vite dev server runs on port `3000` by default. The frontend is configured to use the same origin for API requests by default; if your backend runs on a separate host, set `VITE_API_BASE_URL` in your environment to the backend origin.

Environment variables
- `JWT_SECRET` — JWT secret for auth (backend).
- `PORT` — backend port (default `5000`).
- `FRONTEND_URL` — allowed frontend origin for socket connections/CORS.
- `VITE_API_BASE_URL` — frontend environment variable to point to a separate backend origin (optional).

If you'd like, I can reorganize folders (move documentation into `docs/`, etc.).

---
Generated: repository root README (non-monorepo wording)
