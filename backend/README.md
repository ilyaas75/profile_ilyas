# Backend — Node.js + MongoDB

REST API for the Ilyas Hassan Mohamed portfolio.

## Stack

- Node.js + Express
- MongoDB + Mongoose
- CORS enabled for frontend

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

API runs at **http://localhost:5000**

## Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/profile` | List all profiles |
| GET | `/api/profile?primary=true` | Get primary portfolio profile |
| GET | `/api/profile/:id` | Get profile by ID |
| POST | `/api/profile` | Create profile |
| PUT | `/api/profile/:id` | Update profile |
| DELETE | `/api/profile/:id` | Delete profile |
| POST | `/api/profile/:id/avatar` | Upload profile image (multipart, field: `avatar`) |
| DELETE | `/api/profile/:id/avatar` | Remove profile image |
| POST | `/api/profile/seed/default` | Seed default profile (if empty) |
| POST | `/api/contact` | Save contact form message |
| GET | `/api/contact` | List messages (admin) |

## MongoDB

Start MongoDB locally, or set `MONGODB_URI` in `.env` to a cloud connection (e.g. MongoDB Atlas).
