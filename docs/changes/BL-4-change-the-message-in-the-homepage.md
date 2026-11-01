# BL-4: Change the message in the homepage

## Summary
Update the homepage headline

## What changed
- Replaced the homepage headline with “Stories that are meant to be heard.”

## Decisions
Kept the change to the existing homepage heading. The client has no configured UI test framework, so no new test infrastructure was added for this copy-only update.

## How each criterion is met
- **Update of the message:** The `Home` page heading in `client/src/pages/Home.jsx` now renders “Stories that are meant to be heard.” The source assertion `rg -n 'Stories that are meant to be heard\.' client/src/pages/Home.jsx` verifies the requested text is present and the production build compiles the page.

## How to verify
1. Run `npm --prefix client run dev`.
2. Open the homepage and confirm its heading reads “Stories that are meant to be heard.”

## Tests
- No client-side test suite or UI test framework is configured; no automated UI test was added.
- Homepage headline source assertion (`rg -n 'Stories that are meant to be heard\.' client/src/pages/Home.jsx`) — passed.
- `npm --prefix client run build` — passed.
- `npm --prefix client run lint` — passed with four pre-existing React warnings in `Layout.jsx`, `Home.jsx`, `AuthContext.jsx`, and `PostDetail.jsx`.
- `npm --prefix server test` — 8 passed, 4 failed due to the database schema missing existing columns/tables (`password_hash`, `username`, `likes`); unrelated to the homepage copy change.
- Typecheck — unavailable; the client is JavaScript-based and has no typecheck script.

## Docs updated
- Added this change note. The project README does not need updating for a homepage copy change.

## Open questions
- None.
