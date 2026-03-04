# EduElevate Backend (Demo)

Node + Express backend for EduElevate frontend.

## Run

```powershell
cd C:\Users\Lenovo\Desktop\deve\project1\backend
npm install
npm run dev
```

Server URL: `http://127.0.0.1:5000`

## Environment

- `JWT_SECRET` (recommended in production)
- `MONGODB_URI` (optional; when set, data persists in MongoDB)

If `MONGODB_URI` is not set, backend runs with in-memory demo storage.

## Key Endpoints

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /api/opportunities`
- `GET /api/opportunities/:id`
- `POST /api/opportunities`
- `GET /api/bookmarks?email=...`
- `POST /api/bookmarks/toggle`
- `GET /api/applications?email=...`
- `POST /api/applications`
- `PATCH /api/applications/:id`
- `DELETE /api/applications/:id`
- `GET /api/materials`
- `POST /api/materials`
- `GET /api/events/rsvp?email=...`
- `POST /api/events/rsvp/toggle`
- `GET /api/resume?email=...`
- `POST /api/resume`

## Demo Login

- Student: `student@test.com` / `pass123`
- Admin: `admin@test.com` / `admin123`

Note: Data persists only when `MONGODB_URI` is configured.
