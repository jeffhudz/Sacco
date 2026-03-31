# SACCO React Frontend

This folder contains the React + Vite frontend for the SACCO app.

## Files

- `package.json`  React app dependencies and scripts
- `vite.config.js`  Vite configuration
- `src/`  React source files
- `styles.css`  app styling
- `admin.html` / `index.html`  legacy static files; use the React app instead

## Setup

1. Start the backend services with Docker Compose:

```powershell
Set-Location 'D:\Automation\Sacco'
docker compose up -d
```

2. Install frontend dependencies:

```powershell
Set-Location 'D:\Automation\Sacco\frontend'
npm install
```

3. Start the React frontend:

```powershell
npm run dev
```

4. Open the app in your browser:

```text
http://localhost:5173/
```

## Login

- Admin: `admin` / `admin123`
- Member: enter your member number and continue

## Notes

- The app uses n8n webhook endpoints at `http://localhost:5678/webhook-test`
- Make sure the n8n workflows are imported and active, including `admin-summary`
- Do not open `admin.html` or `index.html` directly; use the React app URL instead
