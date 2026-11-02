# BL-2: Create a banner

## Summary
Add a welcome banner across BlogSpace pages

## What changed
- Added a prominent, responsive welcome banner below the navigation in `Layout`.
- Labeled the banner for assistive technology.
- Documented the site-wide banner in the project README.

## Decisions
Placed the banner in the shared `Layout` so it appears consistently on pages that use the app's common layout, including sign-in and sign-up. Used a brief welcome message and the existing accent color; no announcement behavior or dismissal was requested.

## How each criterion is met
- **Users should see a banner:** `Layout` renders the accessible welcome banner. `client production build` confirms the component compiles into the production app; visually confirm it on the home page and an authentication page using the verification steps below. There is no configured client component-test framework in this project.

## How to verify
1. Run `npm --prefix client run dev`.
2. Open the app and confirm the green welcome banner appears directly below the navigation.
3. Visit the home page and sign-in page to confirm it is present across shared-layout pages; check a narrow viewport to confirm the text remains visible.

## Tests
- No client component test was added: the client has no configured test runner or component-test setup.
- `npm --prefix client run build` — passed.
- `npm --prefix client run lint` — passed with four pre-existing warnings in `Layout.jsx`, `Home.jsx`, `AuthContext.jsx`, and `PostDetail.jsx`.
- `npm --prefix server test` — 8 passed, 4 failed. Existing database-schema mismatches caused failures (`password_hash`, `username`, and `likes` are missing); unrelated to this client change.
- `npm --prefix client run typecheck` — unavailable; no `typecheck` script is configured and the client uses JavaScript.

## Docs updated
- `README.md` now notes that a welcome banner appears across app pages.
- Added this change note.

## Open questions
- None.
