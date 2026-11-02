# Display estimated reading time on posts

## Summary
Display estimated reading time on blog posts

## What changed
- Added a shared reading-time formatter that counts whitespace-separated words and estimates duration at 200 words per minute, rounded up with a one-minute minimum.
- Displayed the estimate in each post card and directly beneath the title on the post detail page. Both views derive the estimate from the current `content` value, so edits and updated responses automatically recalculate it.
- Added focused utility tests and documented the behavior and test command in the root README.

## Decisions
- Reading time is calculated at render time rather than stored, preventing stale values as content changes and keeping card and detail estimates consistent.
- Content is plain text in this application; words are counted by splitting on whitespace. Empty content still displays one minute, matching the minimum-duration requirement.

## How each criterion is met
- **Post cards show `N min read`:** `getReadingTime` tests cover the output format and the `PostCard` renders that shared output in its metadata row.
- **Post detail shows the same estimate below its title:** `PostDetail` renders `getReadingTime(post.content)` immediately under the title; the shared helper ensures identical output.
- **200 words per minute, dynamically based on content, rounded up:** `getReadingTime rounds up at 200 words per minute` covers 200/201 and 400/401 word boundaries. `getReadingTime derives the result from the current content` verifies changes in content change the estimate.
- **Fewer than 200 words show one minute:** `getReadingTime returns at least one minute for empty and short content` covers empty, whitespace-only, and 199-word input.
- **Updates are reflected automatically and consistently:** both views call the same pure helper from their current post object during render; no stored/cached duration can become stale. This is covered at helper level by `getReadingTime derives the result from the current content`.
- **Visible without disrupting layout:** the card estimate joins its existing compact metadata row; the detail estimate is a small muted line between title and existing author metadata.

## How to verify
- Run `cd client && npm test`.
- Run `cd client && npm run lint` and `cd client && npm run build`.
- Start the app and inspect any post card and its detail page; confirm the duration matches for both and changes after editing post content.

## Tests
- Added `client/src/utils.test.js` (three tests) for minimum duration, 200-WPM rounding boundaries, and recalculation after content changes.
- `cd client && npm test`: passed, 3/3 tests.
- `cd client && npm run lint`: completed successfully with four warnings in existing files (`Home.jsx`, `Layout.jsx`, `AuthContext.jsx`, and the existing load effect in `PostDetail.jsx`); no warning was introduced by reading-time code.
- `cd client && npm run build`: passed.
- `cd server && npm test`: 8 passed, 4 failed because the configured database schema is incompatible with the existing API tests (`password_hash`/`username` columns and `likes` relation missing). This is unrelated to the client change.
- Typecheck: no typecheck script or TypeScript configuration is present in the project.

## Docs updated
- `README.md` documents the estimate and the client test command.

## Open questions
- None.
