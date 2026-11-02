# Summary
Show reading time in red

## What changed
- Applied Tailwind's `text-red-600` color to reading-time labels on post cards and post detail pages.
- Added a regression test asserting both display locations use the red class.

## Decisions
- Used the existing Tailwind red utility already used for destructive actions, without introducing a new color token.
- Styled both reading-time locations so the app is consistent wherever reading time appears.

## How each criterion is met
- **Reading time to show in red color:** `reading time is styled red on post cards and post pages` checks the reading-time markup in both components for `text-red-600`.

## How to verify
1. Run `cd client && npm test`.
2. Run `cd client && npm run build`.
3. View a post card and its post detail page; each reading-time label should be red.

## Tests
- Added `reading time is styled red on post cards and post pages` to `client/src/utils.test.js`.
- `cd client && npm test` — passed (3 tests).
- `cd client && npm run lint` — completed with four existing warnings in `Home.jsx`, `AuthContext.jsx`, `Layout.jsx`, and `PostDetail.jsx`; no lint errors.
- `cd client && npm run build` — passed.
- `cd server && npm test` — 8 passed, 4 failed because the configured database schema is missing expected columns/tables (`password_hash`, `username`, `likes`). This change does not touch server code.
- No typecheck script or TypeScript configuration is present in the client project.

## Docs updated
- `README.md` now documents that reading time is displayed in red.

## Open questions
- None.
