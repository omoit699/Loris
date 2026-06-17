# Loris E-9

> **We value customer satisfaction**

Full-stack ecommerce platform for electronics with dynamic store branding.

## Local Development

1. Start the backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
2. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev -- --host 0.0.0.0
   ```
3. Open the frontend in your browser:
   - `http://localhost:3001`

> Note: If port `3000` is already in use, Vite may open the frontend on `http://localhost:3001`.

## Dynamic Configuration

The store name and branding are now dynamic! To change them, modify the environment variables in your `.env` file or update `backend/config/store-config.js`:

```bash
STORE_NAME=Loris E-9
STORE_EMAIL=lawrenceomoit66y@gmail.com
SUPPORT_WHATSAPP=0790206354
```

The backend API provides a `/api/config` endpoint that returns the current store configuration:

```bash
curl http://localhost:5000/api/config
```

## Contact & Support

- **WhatsApp**: 0790206354
- **WhatsApp Channel**: [Join here](https://whatsapp.com/channel/0029VbCseMv7IUYSEy2fqX2P)
- **Phone**: +256790206354 or +256787772067
- **Email**: lawrenceomoit66y@gmail.com
- **Mobile Money Payment**: +256790206354

## Deployment: Vercel + Render

This repository is configured to deploy the frontend to Vercel and the backend to Render.

### Exact Vercel settings

- Root directory: `Loris-main/trusan-electronics-store/frontend`
- Framework preset: `Vite` (or `Other` with build command)
- Build command: `npm install && npm run build`
- Output directory: `dist`
- Install command: `npm install`
- Environment variable:
  - `VITE_API_BASE_URL` = `https://<your-render-backend>.onrender.com`
- Redirect all routes to `index.html` for client-side routing.

If Vercel detects a monorepo, set the project root explicitly to `Loris-main/trusan-electronics-store/frontend`.

### Exact Render service values

- Service name: `loris-e9-backend`
- Environment: `Node`
- Branch: `main`
- Root directory: `Loris-main/trusan-electronics-store/backend`
- Build command: `npm install`
- Start command: `npm start`
- Auto deploy: `Enabled`
- Environment variables:
  - `NODE_ENV=production`
  - `FRONTEND_URL=https://<your-vercel-project>.vercel.app` ← Set this to your deployed Vercel frontend URL for CORS
  - `JWT_SECRET=<strong-random-secret>` ← Required in production

Do **not** set `PORT` manually on Render. Render injects `PORT` automatically.

The repository includes `render.yaml` at the repo root so Render can use the same service definition if Blueprint deploy is enabled.

**Note:** The backend uses `FRONTEND_URL` environment variable for CORS configuration. This must match your Vercel frontend domain to allow cross-origin requests.

### Local development with `.env`

Copy `.env.example` to `.env` in the repo root and update values as needed.

## Documentation

- [Customer Guide](CUSTOMER_GUIDE.md)
- [Terms and Conditions](TERMS_AND_CONDITIONS.md)
