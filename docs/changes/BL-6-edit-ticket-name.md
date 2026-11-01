# BL-6 — Edit Ticket Name

## Summary
Rename BlogSpace branding to BlogMake

## What changed
- Updated the browser title, description, navigation brand, footer, login/signup copy, README heading, and schema comment to BlogMake.
- Added a client branding regression test and a `test` script for it.

## Decisions
The ticket originally referred to renaming a “Blog 1” record to “New Blog,” but no such record or blog-name entity exists in this repository. In response to the clarification, the human explicitly said to change the Blogspace title to “BlogMake.” That clarification is treated as the requested scope; the database name `blogspace` remains unchanged because it is an infrastructure identifier, not the displayed application title.

## How each criterion is met
- **Blog name/title is updated:** `BlogMake is used as the document and in-app brand` in `client/tests/branding.test.js` checks the document title and metadata, checks in-app branding files, and rejects stale BlogSpace branding. The browser title and user-facing brand now show BlogMake.

## How to verify
- `cd client && npm test`
- `cd client && npm run build`
- `cd client && npm run lint`
- To run the server integration suite, initialize the database using the project setup instructions, start the API, then run `cd server && npm test`.

## Tests
- Added `client/tests/branding.test.js`; `cd client && npm test` passed (1 test).
- `cd client && npm run build` passed.
- `cd client && npm run lint` completed with four existing warnings in `Home.jsx`, `Layout.jsx`, `PostDetail.jsx`, and `AuthContext.jsx`; no lint errors.
- `cd server && npm test` ran but failed 4 tests because the configured local database schema is incompatible with the current server tests (`password_hash`/`username` columns and the `likes` relation are missing). The failure is unrelated to the branding change.
- No typecheck script or TypeScript sources are configured in the client project.

## Docs updated
- `README.md` application heading.
- This change note.

## Open questions
None; the human clarification specifies BlogMake as the intended displayed title.
