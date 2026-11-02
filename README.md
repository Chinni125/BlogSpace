# BlogSpace

Full-stack blogging app: React (Vite + Tailwind CSS) client, Express API, PostgreSQL.

## Setup
1. `createdb blogspace`
2. `cd server && cp .env.example .env` — set `DATABASE_URL` and a random `JWT_SECRET` (32+ chars), then `npm install && npm run db:setup && npm run dev`
3. `cd client && npm install && npm run dev`

The API runs on port 5001. Vite proxies `/api` to it.
Set `CLIENT_ORIGIN` in `server/.env` to the Vite URL.

Reading time is calculated from each post's full content at 200 words per minute, rounded up with a one-minute minimum. It is shown on post cards and below the title on each post page.

Tests: `cd client && npm test` (reading-time calculation); `cd server && npm test` (API, requires the API to be running).
