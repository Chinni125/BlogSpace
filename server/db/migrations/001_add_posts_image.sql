-- Add optional image upload support to posts.
-- Stores the image as a data URL (e.g. "data:image/png;base64,...") in a nullable
-- TEXT column, so existing posts and clients that send no image keep working.
-- Idempotent: safe to run on databases that already have the column.

ALTER TABLE posts ADD COLUMN IF NOT EXISTS image TEXT;

-- Rollback (run manually if needed):
--   ALTER TABLE posts DROP COLUMN IF EXISTS image;
