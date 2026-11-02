# Blogspace

Full-stack blogging app: React (Vite + Tailwind CSS) client, Express API, PostgreSQL.

## Setup
1. `createdb blogspace`
2. `cd server && cp .env.example .env` — set `DATABASE_URL` and a random `JWT_SECRET` (32+ chars), then `npm install && npm run db:setup && npm run dev`
3. `cd client && npm install && npm run dev`

The API runs on port 5001. Vite proxies `/api` to it.
Set `CLIENT_ORIGIN` in `server/.env` to the Vite URL.

The app is branded Blogspace across its page title and user-facing interface. Blog posts show an estimated reading time based on 200 words per minute, rounded up to at least one minute.

Tests: `cd client && npm test`; API tests (API must be running): `cd server && npm test`
