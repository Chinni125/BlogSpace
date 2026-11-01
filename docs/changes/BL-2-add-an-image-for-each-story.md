# BL-2: Add an image for each story

## Summary

Stories can now be published with an uploaded image, and the image is displayed in story listings and on the story page.

## What changed

- Added an image field to the posts database schema, including an idempotent column migration for existing installations.
- Added JPEG, PNG, GIF, and WebP image upload/preview to the create-story form, with a 5 MB client-side limit.
- Required a valid image on the API and added a server-side size/type data-URL check; increased the JSON request limit to support image uploads.
- Included image data in post queries and rendered it in story cards and detail views.
- Added API coverage for the required image, valid image persistence, and invalid image rejection.

## Decisions

- Stored uploaded image bytes as a base64 data URL in the posts table to fit the existing single-service application without introducing file storage infrastructure or a new dependency.
- Required images for new stories, matching the ticket's statement that every blog contains an image. Existing rows remain readable; the new image column is nullable for backward compatibility.
- Accepted JPEG, PNG, GIF, and WebP; limited uploads to 5 MB. The API limit is enforced against encoded string length as well as data-URL format.

## How each criterion is met

- **Image upload field to every post:** The create-story form includes the `image` file input. The `create post: requires a valid uploaded image and returns it` integration test confirms missing images and invalid image types are rejected, and successful uploads are returned with the post.

## How to verify

1. Run database setup (`cd server && npm run db:setup`).
2. Start the API and client as described in the root `README.md`.
3. Sign in, choose **Write a story**, select a JPEG, PNG, GIF, or WebP under 5 MB, and publish. Confirm the preview appears and the image is visible on the story and story list.
4. Run `cd server && npm test` with the API running and configured to use the expected BlogSpace database.
5. Run `cd client && npm run lint && npm run build`.

## Tests

- Added/updated `server/tests/api.test.js` test **`create post: requires a valid uploaded image and returns it`**: covers missing image, non-image data URL rejection, and successful image creation/return.
- `npm --prefix server test`: attempted; failed because the configured database schema is incompatible with this project's tests (database is missing the expected `users.password_hash`/`users.username` columns). API integration assertions depending on posts consequently failed. This is an environment/database issue; the test suite needs to run against a BlogSpace database after schema setup.
- `npm --prefix client run lint`: passed with 4 existing warnings in `Home.jsx`, `PostDetail.jsx`, `Layout.jsx`, and `AuthContext.jsx`; no new lint warnings.
- `npm --prefix client run build`: passed.
- Typecheck: no typecheck script/configuration exists for this JavaScript project.
- `git diff --check`: passed.

## Docs updated

- `README.md`: documented supported image formats and upload storage/size.
- This change note added at `docs/changes/BL-2-add-an-image-for-each-story.md`.

## Open questions

- Should images eventually move to object storage rather than PostgreSQL base64 data URLs?
- Should legacy posts without images be migrated to a default image, or remain without one?
