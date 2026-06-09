# Loris E-9

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
STORE_EMAIL=admin@lorise9.com
SUPPORT_WHATSAPP=0780275685
```

The backend API provides a `/api/config` endpoint that returns the current store configuration:

```bash
curl http://localhost:5000/api/config
```

## GitHub Pages

The frontend site is published at:

- `https://omoit699.github.io/Trusan-Electronics-/`

## Documentation

- [Customer Guide](CUSTOMER_GUIDE.md)
- [Terms and Conditions](TERMS_AND_CONDITIONS.md)
