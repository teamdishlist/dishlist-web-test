-- Modify ratings table to allow null user_id for system-generated ratings
ALTER TABLE ratings ALTER COLUMN user_id DROP NOT NULL;

-- Add a column to track rating source
ALTER TABLE ratings ADD COLUMN IF NOT EXISTS source text DEFAULT 'user';

-- Update RLS policy to allow viewing all ratings
DROP POLICY IF EXISTS "Ratings are viewable by everyone" ON ratings;
CREATE POLICY "Ratings are viewable by everyone"
  ON ratings FOR SELECT
  USING (true);

-- Allow inserting system ratings (null user_id)
DROP POLICY IF EXISTS "Users can insert their own ratings" ON ratings;
CREATE POLICY "Users can insert their own ratings"
  ON ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
