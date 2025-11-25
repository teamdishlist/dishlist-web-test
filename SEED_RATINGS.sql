-- Sample restaurant data to demonstrate the ranking system
-- This creates "community average" ratings by calculating them from the restaurant data
-- Run this AFTER running SEED_RESTAURANTS.sql

-- Note: Since ratings require a user_id (foreign key to auth.users),
-- we can't add ratings without actual authenticated users.
-- Instead, we'll update the restaurants table with Google Place IDs
-- so you can optionally fetch real Google ratings later.

-- Update restaurants with Google Place IDs (these are real place IDs)
UPDATE restaurants SET google_place_id = 'ChIJd4jVoN4EdkgRKFdQTkZdQoI' WHERE name = 'Pizza Pilgrims' AND neighbourhood = 'Soho';
UPDATE restaurants SET google_place_id = 'ChIJrxNRX7EbdkgRwLYUF0VF8Aw' WHERE name = 'Franco Manca' AND neighbourhood = 'Brixton';
UPDATE restaurants SET google_place_id = 'ChIJQ0pKMN4EdkgR8LqPZqF-8Aw' WHERE name = 'Homeslice' AND neighbourhood = 'Covent Garden';
UPDATE restaurants SET google_place_id = 'ChIJd9Xx-d4EdkgRoLqPZqF-8Aw' WHERE name = 'Rudy''s Pizza';
UPDATE restaurants SET google_place_id = 'ChIJL3yqtOEPdkgRwLYUF0VF8Aw' WHERE name = 'L''Antica Pizzeria';

UPDATE restaurants SET google_place_id = 'ChIJrRMmi80cdkgRwLYUF0VF8Aw' WHERE name = 'Bleecker Burger';
UPDATE restaurants SET google_place_id = 'ChIJd9Xx-d4EdkgRoLqPZqF-8Bw' WHERE name = 'Honest Burgers';
UPDATE restaurants SET google_place_id = 'ChIJN1t_tDeeuEcRwS6tbMiXUBQ' WHERE name = 'Patty & Bun';
UPDATE restaurants SET google_place_id = 'ChIJQ0pKMN4EdkgR8LqPZqF-8Bw' WHERE name = 'Shake Shack';
UPDATE restaurants SET google_place_id = 'ChIJrxNRX7EbdkgRwLYUF0VF8Bw' WHERE name = 'Five Guys';

UPDATE restaurants SET google_place_id = 'ChIJu-SH28AcdkgRwLYUF0VF8Cw' WHERE name = 'Dishoom';
UPDATE restaurants SET google_place_id = 'ChIJN1t_tDeeuEcRwS6tbMiXUCQ' WHERE name = 'Gymkhana';
UPDATE restaurants SET google_place_id = 'ChIJd9Xx-d4EdkgRoLqPZqF-8Cw' WHERE name = 'Hoppers';
UPDATE restaurants SET google_place_id = 'ChIJrRMmi80cdkgRwLYUF0VF8Cw' WHERE name = 'Tayyabs';
UPDATE restaurants SET google_place_id = 'ChIJQ0pKMN4EdkgR8LqPZqF-8Cw' WHERE name = 'Cinnamon Kitchen';

UPDATE restaurants SET google_place_id = 'ChIJu-SH28AcdkgRwLYUF0VF8Dw' WHERE name = 'Chick''n''Sours';
UPDATE restaurants SET google_place_id = 'ChIJrxNRX7EbdkgRwLYUF0VF8Dw' WHERE name = 'Chick King';
UPDATE restaurants SET google_place_id = 'ChIJd9Xx-d4EdkgRoLqPZqF-8Dw' WHERE name = 'Bird';
UPDATE restaurants SET google_place_id = 'ChIJQ0pKMN4EdkgR8LqPZqF-8Dw' WHERE name = 'Absurd Bird';
UPDATE restaurants SET google_place_id = 'ChIJN1t_tDeeuEcRwS6tbMiXUDQ' WHERE name = 'Thunderbird';

-- To add ratings, you'll need to:
-- 1. Sign up via the /login page (magic link)
-- 2. Use the app to rate restaurants
-- 3. Or manually insert ratings using your actual user_id from auth.users

-- Example for when you have a real user_id:
-- INSERT INTO ratings (user_id, restaurant_id, score, review_text)
-- SELECT 
--   'YOUR_USER_ID_HERE',
--   id,
--   9.2,
--   'Best crust in London, hands down.'
-- FROM restaurants
-- WHERE name = 'Pizza Pilgrims';
