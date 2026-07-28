# Ilyas Hassan Mohamed — Full-Stack Portfolio

Monorepo with three parts matching the primary stack:

```
profile_ilyas/
├── frontend/   → React + TypeScript + Tailwind (portfolio website)
├── backend/    → Node.js + Express + MongoDB (REST API)
└── app/        → Flutter (mobile portfolio app)
```

## Primary Stack

| Folder | Technology |
|--------|------------|
| `frontend/` | React, TypeScript, Tailwind CSS, Vite |
| `backend/` | Node.js, Express, MongoDB, Mongoose |
| `app/` | Flutter, Dart |

---

## Frontend (Web)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

**Profile management:** [http://localhost:5173/admin/profile](http://localhost:5173/admin/profile) — create, view, update, and delete profile data (requires backend + MongoDB).

Set `VITE_API_URL=http://localhost:5000` in `frontend/.env`.

---

## Profile Management (CRUD)

Full-stack profile system: React admin UI + Express REST API + MongoDB.

| Action | Admin UI | API |
|--------|----------|-----|
| **Create** | + Create Profile | `POST /api/profile` |
| **Read** | View on list / detail panel | `GET /api/profile`, `GET /api/profile/:id` |
| **Update** | Edit form + Save | `PUT /api/profile/:id` |
| **Delete** | Delete button (with confirm) | `DELETE /api/profile/:id` |

Also: avatar upload (`POST /api/profile/:id/avatar`), primary profile selection, auto-seed on first run.

Static fallback data lives in `frontend/src/data/profile.ts` if the API is unavailable.

---

## Backend (API)

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

API at **http://localhost:5000**

### Postman

Import the API collection and local environment:

1. Open Postman → **Import**
2. Select both files from `backend/postman/`:
   - `Profile_API.postman_collection.json`
   - `Profile_API_Local.postman_environment.json`
3. Choose environment **Profile API — Local**
4. Run **Health Check**, then **Get All Profiles** or **Create Profile**

`profileId` is auto-saved after create/list/seed requests for use in Update, Delete, and Avatar endpoints.

---

## App (Flutter Mobile)

```bash
cd app
flutter pub get
flutter run
```

---

## Deploy

| Part | Platform |
|------|----------|
| Frontend | Vercel / Netlify (`frontend/dist`) |
| Backend | Railway / Render / VPS |
| App | Google Play / App Store |
