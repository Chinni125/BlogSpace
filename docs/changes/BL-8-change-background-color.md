# BL-8: Change background color

## Summary
Use a warm paper background for the blog

## What changed
- Added the `paper` color token (`#faf9f6`) to the Tailwind theme.
- Applied it to the page body in place of pure white.

## Decisions
Chose a subtle warm off-white to keep the minimal reading-focused style while adding a softer, editorial feel. Kept content surfaces such as form fields and the navigation white for contrast.

## How each criterion is met
- **Background color update:** `client/src/index.css` applies `bg-paper` to `body`. The Vite production build confirms the Tailwind CSS compiles with the change; visually verify the rendered page as described below.

## How to verify
1. Run `npm --prefix client run dev`.
2. Open the app in a browser and confirm the page background is warm off-white (`#faf9f6`), while white controls/navigation remain distinguishable.

## Tests
- No client-side test suite or CSS test harness is configured in this project. No test was added for this styling-only change.
- `npm --prefix client run build` — passed; generated production assets successfully.
- `npm --prefix client run lint` — passed with four existing React warnings in `Layout.jsx`, `Home.jsx`, `AuthContext.jsx`, and `PostDetail.jsx`.
- `npm --prefix server test` — 8 passed, 4 failed. Failures are from the configured database schema missing existing columns/tables (`password_hash`, `username`, `likes`); unrelated to the client CSS change.
- Typecheck — not available; the client package has no typecheck script and is JavaScript-based.

## Docs updated
- Added this change note. The project README does not need a setup or usage change for this visual styling update.

## Open questions
- None.
