# Show supplied image in the empty feed state

## Summary
Show supplied image in the empty feed state

## What changed
Added the provided Unsplash image above the homepage's “No stories yet” empty state. It is responsive, uses cover cropping, and is decorative (`alt=""`) because it adds no information beyond the nearby text.

## Decisions
There is no Stay Tuned page, existing image, or route in this repository. Following the human's instruction to use best judgment, I chose the homepage's empty-feed view as the closest equivalent to a page where visitors wait for content to arrive. The image only appears when the feed is successfully empty; errors and populated feeds are unchanged. This adds the supplied image rather than literally replacing a nonexistent one.

## How each criterion is met
- **Image change:** The supplied Unsplash image URL is rendered in the empty-feed state in `client/src/pages/Home.jsx`. The production build compiles this reference; visually verify the empty feed in the browser as described below. There is no automated frontend test suite in this repository.

## How to verify
1. Start the API and client (`cd server && npm run dev`, then `cd client && npm run dev`).
2. Visit the homepage with an empty posts feed.
3. Confirm the supplied image appears above “No stories yet” and scales across mobile and desktop widths. Confirm it is absent when posts are present or the request fails.

## Tests
- No frontend tests were added: the client has no test runner or existing frontend test suite.
- `cd client && npm run build` — passed.
- `cd client && npm run lint` — passed with four existing warnings (Layout.jsx purity, AuthContext.jsx exports, and setState-in-effect warnings in Home.jsx and PostDetail.jsx); none were introduced by this image change.
- `cd server && npm test` — 8 passed, 4 failed because the configured database schema is missing existing columns/tables (`password_hash`, `username`, and `likes`). These API tests are unrelated to the frontend image.
- Typecheck — not available; the client is JavaScript and defines no typecheck script.

## Docs updated
- Added this ticket change note.

## Open questions
None. The missing Stay Tuned page/image target was addressed using the human-approved best-judgment option documented above.
