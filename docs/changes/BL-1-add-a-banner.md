# BL-1: Add a banner

## Summary
Added a blogging-themed image banner to the homepage using the Unsplash image supplied in the ticket.

## What changed
- Added a responsive, rounded banner image beneath the homepage introduction in `client/src/pages/Home.jsx`.
- Added a client-side test command and a rendered homepage banner test in `client/package.json` and `client/tests/home.test.js`.
- Updated the root README test instructions.

## Decisions
- Used the provided image URL directly, avoiding an extra asset download or dependency.
- Kept the existing homepage copy and layout intact; used an accessible region label and descriptive image alternative text.

## How each criterion is met
- **A banner should be there:** the homepage renders the image in a labeled banner region. Covered by `homepage banner > renders the provided blogging banner image with alternative text` in `client/tests/home.test.js`.

## How to verify
From `client/`, run `npm test`, `npm run lint`, and `npm run build`, then open the homepage and verify the image appears below the introductory heading.

## Tests
- `cd client && npm test` — passed (1 test).
- `cd client && npm run lint` — completed with no errors; reports four existing React warnings (Fast Refresh export, impure render date, and synchronous state updates in Home and PostDetail).
- `cd client && npm run build` — passed.
- `cd server && npm test` — 8 passed, 4 failed because the connected database schema lacks expected columns/tables (`password_hash`, `username`, and `likes`). This is outside the client banner change.
- Typecheck — not run; the client package has no typecheck script and the project uses JavaScript/JSX.

## Docs updated
- `README.md` now lists the client test command.

## Open questions
- None for the requested banner. The API test database schema needs attention separately before its full test suite passes.
