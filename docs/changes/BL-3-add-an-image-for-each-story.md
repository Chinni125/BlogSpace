# Add optional story image uploads

## Summary
Add optional image uploads to stories

## What changed
- Added an optional image picker with preview to the story creation form. PNG, JPEG, GIF, and WebP files up to 5 MB are accepted.
- Persisted image data on posts, returned it from post reads, and displayed it on story cards and detail pages.
- Added an idempotent database column migration and increased the JSON request limit to support image payloads.

## Decisions
- Images are stored as data URLs in a nullable PostgreSQL `TEXT` column, keeping the existing JSON API and avoiding an external storage service.
- Images remain optional so existing stories and clients that do not send an image continue to work.

## How each criterion is met
- **Image upload option:** the story form has a file picker, type/size validation, and preview. The API integration test **“create post: validation + image upload persists and is returned”** checks image validation and stored/returned image data.

## How to verify
1. Apply the schema with `cd server && npm run db:setup`.
2. Run the API and database, then `cd server && npm test`.
3. Run `cd client && npm run lint && npm run build`.
4. In the client, create a story with a supported image and confirm it appears in the preview, published story, and story list. Try an unsupported or >5 MB file and confirm it is rejected.

## Tests
- Added/updated `server/tests/api.test.js` test **“create post: validation + image upload persists and is returned”** for invalid image data and successful image persistence in the create response. This integration test could not complete successfully in this environment: the configured database schema is incompatible with the existing app (`users.username` and `users.password_hash` are missing), causing dependent API tests to fail. The test setup requires the project's database schema to be applied to a compatible database.
- `cd server && node --check src/controllers/posts.js && node --check src/models/posts.js && node --check tests/api.test.js` — passed.
- `cd client && npm run lint` — passed with four existing warnings (Layout, Home, AuthContext, PostDetail).
- `cd client && npm run build` — passed.
- No typecheck script or TypeScript source is configured in this JavaScript project.
- `npm test` from the repository root was also attempted; there is no root `package.json`, so tests must run from `server`.

## Docs updated
- Updated `README.md` with supported image formats, size limit, storage behavior, and check commands.

## Open questions
- None.
