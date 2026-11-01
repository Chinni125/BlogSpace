# Add a responsive homepage banner

## Summary
Add a responsive coastal banner to the homepage

## What changed
- Added `HomeBanner` below the homepage introduction and above the story feed.
- Loaded the supplied Unsplash photo at high resolution; its natural 3:2 ratio is preserved by a fluid-width image with intrinsic dimensions.
- Added descriptive alternative text and a styled fallback when the image cannot load.

## Decisions
- Used the supplied remote image URL with `auto=format`, a 2400px width, and quality 85 to keep it sharp on large screens.
- Kept the image in normal document flow instead of an overlay so it cannot cover homepage content.
- The client has no frontend test framework, so responsive layout and error fallback are documented for manual browser verification rather than adding a new testing dependency.

## How each criterion is met
- Banner is displayed prominently after the homepage introduction: `Home renders HomeBanner` (manual browser check).
- Image loads clearly without distortion: `Supplied Unsplash image request` (HTTP image downloaded successfully; 2400×1600 JPEG) and `Home banner natural-ratio check` (manual browser check).
- Prominent positioning and no overlap: `Home banner flow/layout check` (manual browser check).
- Aspect ratio and responsive display: `Home banner responsive viewport check` (manual browser check at desktop, tablet, and mobile widths).
- Image failure fallback: `Home banner image-error fallback check` (manual browser check by blocking the image URL).

## How to verify
1. Run `cd client && npm run dev` and open the homepage.
2. Check the banner at desktop, tablet, and mobile viewport widths; verify it retains its proportions and does not overlap the page content.
3. Block the Unsplash image request in browser developer tools and reload to verify the fallback message appears.

## Tests
- `cd client && npm run build` — passed.
- `cd client && npm run lint` — passed with four pre-existing warnings in `Layout.jsx`, `Home.jsx`, `AuthContext.jsx`, and `PostDetail.jsx`; no warning concerns the banner change.
- `cd server && npm test` — 8 passed, 4 failed because the configured database schema lacks expected columns/tables (`password_hash`, `likes`, `username`); unrelated to this client-only change.
- No client test runner is configured. The named responsive and image-failure checks above are manual verification cases.

## Docs updated
- Added this change note. No general README or API documentation needed changes.

## Open questions
- None.
