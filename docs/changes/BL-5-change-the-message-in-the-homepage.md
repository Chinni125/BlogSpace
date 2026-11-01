# Stories that are meant to be heard.

## Summary
Update the homepage headline

## What changed
Changed the homepage headline from “Stories worth sharing” to “Stories that are meant to be heard.” Added a small Node test for the displayed headline and a client test script.

## Decisions
Kept the existing homepage markup and styling. The client had no test setup, so the test uses Node's built-in test runner to check the headline text and ensure the old text is gone.

## How each criterion is met
- **Update the message:** `homepage displays the updated headline` in `client/tests/home.test.js` asserts the new headline appears and the previous headline does not.

## How to verify
From `client/`, run `npm test`, `npm run build`, and `npm run lint`.

## Tests
- `cd client && npm test` — passed (1 test).
- `cd client && npm run build` — passed.
- `cd client && npm run lint` — passed with four pre-existing Oxlint warnings in `Home.jsx`, `Layout.jsx`, `AuthContext.jsx`, and `PostDetail.jsx`.
- `cd server && npm test` — 8 passed, 4 failed because the configured PostgreSQL schema is missing columns/tables (`password_hash`, `username`, and `likes`). Failures are unrelated to this homepage text change.
- Typecheck — not available; the client has no typecheck script and uses JSX rather than TypeScript.

## Docs updated
- Added this change note. README and other project documentation were not affected.

## Open questions
None.
