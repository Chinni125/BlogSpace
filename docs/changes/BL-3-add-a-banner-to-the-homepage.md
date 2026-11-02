# BL-3: Add a banner to the homepage

## Summary
Add a responsive featured image banner

## What changed
- Added `HomeBanner` to the homepage directly below the introductory heading.
- Loaded the provided Unsplash image at a bounded 1920px width and quality 80.
- Preserved the image's intrinsic aspect ratio with responsive width and automatic height.
- Added a styled, accessible fallback when the image cannot load.

## Decisions
Kept the banner in normal document flow and within the existing page content width so it does not obscure posts or other homepage content. Used a remote resized Unsplash rendition rather than a cropped fixed-ratio background so the image retains its aspect ratio across screen sizes. The surrounding rounded border and paper/white palette align with the site's editorial styling.

## How each criterion is met
- **Banner on homepage using the provided image:** `Home.jsx` renders `HomeBanner` beneath the page heading; the image uses the supplied Unsplash photo. Build check: `npm --prefix client run build`.
- **Image loads without distortion or pixelation:** image source requests a 1920px rendition and uses natural height (`h-auto`) and `object-contain`. Verify visually at desktop width; the image endpoint returned HTTP 200 during implementation.
- **Prominent homepage placement:** placed immediately after the homepage heading. Verify in homepage browser check.
- **Aspect ratio at different widths:** responsive `w-full` with `h-auto`; verify in homepage browser check at desktop, tablet, and mobile widths.
- **Responsive desktop, tablet, and mobile behavior:** fluid width and natural image height avoid breakpoint-specific fixed sizing; verify in homepage browser check at desktop, tablet, and mobile widths.
- **No overlap with homepage content:** banner uses normal flow and margin spacing; verify in homepage browser check.
- **Existing theme and styling:** rounded border, white surface, subtle shadow, and muted fallback colors use the existing editorial palette; verify in homepage browser check.
- **Image-load failure fallback:** `HomeBanner` switches to an accessible featured-stories panel on image `onError`; manually simulate a failed request in browser devtools and confirm the fallback.

## How to verify
1. Run `npm --prefix client run dev` and open the homepage.
2. Check the banner and post list at desktop, tablet, and mobile viewport sizes.
3. Block the Unsplash image request in browser devtools and confirm the fallback panel appears without layout overlap.

## Tests
- Existing client tests: `npm --prefix client test` — passed (3 tests; reading-time utility tests). No browser/component test harness is configured, so banner rendering, responsive behavior, and the image-error fallback are covered by the manual verification steps above.
- `npm --prefix client run build` — passed.
- `npm --prefix client run lint` — passed with four existing warnings (`Layout.jsx`, `Home.jsx`, `PostDetail.jsx`, and `AuthContext.jsx`); no new warnings were introduced by the banner component.
- Typecheck — not available; the client is JavaScript and has no typecheck script.

## Docs updated
- Added this change note. No README or API documentation changes are needed for the visual homepage update.

## Open questions
- None.
