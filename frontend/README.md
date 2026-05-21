# Fitness Tracker — Frontend (draft)

Minimal React UI that mirrors all Swagger endpoints. No styling beyond basic layout.

## Prerequisites

- Backend running at `http://localhost:5150` (see `backend/`)
- Node.js 18+

## Run

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

Optional: copy `.env.example` to `.env` and set `VITE_API_BASE` if the API URL differs.

## Usage

1. Start the API: `dotnet run --project backend`
2. **Auth** tab — register or login; JWT is stored in `localStorage` as `accessToken`
3. Other tabs — buttons call the same routes as Swagger (labels show method + path)
4. **Exercises** — public list works without login; create/delete need Admin role
5. **Admin** — list users requires Admin role

Token is sent as `Authorization: Bearer <accessToken>` on authenticated requests.
