# BlogSpace

Full-stack blogging app: React (Vite + Tailwind CSS) client, Express API, PostgreSQL.

## Setup
1. `createdb blogspace`
2. `cd server && cp .env.example .env` — set `DATABASE_URL` and a random `JWT_SECRET` (32+ chars), then `npm install && npm run db:setup && npm run dev`
3. `cd client && npm install && npm run dev`

The API runs on port 5001. Vite proxies `/api` to it.
Set `CLIENT_ORIGIN` in `server/.env` to the Vite URL.

Stories can include an optional PNG, JPEG, GIF, or WebP image (up to 5 MB). Images are stored with the story in PostgreSQL and shown on story cards and detail pages.

Tests (API and database must be running): `cd server && npm test`
Client checks: `cd client && npm run lint && npm run build`
