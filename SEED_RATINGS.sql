-- Sample ratings based on typical Google ratings converted to 0-10 scale
-- Google ratings are typically 3.5-5.0 stars, which converts to 7.0-10.0 in our system
-- Run this AFTER running SEED_RESTAURANTS.sql

DO $$
DECLARE
  test_user_id uuid := '00000000-0000-0000-0000-000000000001'; -- Placeholder user ID
  restaurant record;
BEGIN
  -- Create a test user (you can replace this with your actual user ID later)
  -- This is just for demonstration purposes
  
  -- Add ratings for Pizza restaurants
  FOR restaurant IN 
    SELECT r.id, r.name FROM restaurants r
    JOIN restaurant_categories rc ON r.id = rc.restaurant_id
    JOIN categories c ON rc.category_id = c.id
    WHERE c.slug = 'pizza'
  LOOP
    INSERT INTO ratings (user_id, restaurant_id, score, review_text)
    VALUES (
      test_user_id,
      restaurant.id,
      CASE restaurant.name
        WHEN 'Pizza Pilgrims' THEN 9.2
        WHEN 'Franco Manca' THEN 8.8
        WHEN 'Homeslice' THEN 8.5
        WHEN 'Rudy''s Pizza' THEN 9.0
        WHEN 'L''Antica Pizzeria' THEN 8.7
        ELSE 8.0
      END,
      CASE restaurant.name
        WHEN 'Pizza Pilgrims' THEN 'Best crust in London, hands down.'
        WHEN 'Franco Manca' THEN 'Sourdough base is incredible. Simple but perfect.'
        WHEN 'Homeslice' THEN 'Huge slices, great for sharing.'
        WHEN 'Rudy''s Pizza' THEN 'Authentic Neapolitan style, amazing.'
        WHEN 'L''Antica Pizzeria' THEN 'Traditional Italian, very good.'
        ELSE NULL
      END
    )
    ON CONFLICT (user_id, restaurant_id) DO NOTHING;
  END LOOP;

  -- Add ratings for Burger restaurants
  FOR restaurant IN 
    SELECT r.id, r.name FROM restaurants r
    JOIN restaurant_categories rc ON r.id = rc.restaurant_id
    JOIN categories c ON rc.category_id = c.id
    WHERE c.slug = 'burgers'
  LOOP
    INSERT INTO ratings (user_id, restaurant_id, score, review_text)
    VALUES (
      test_user_id,
      restaurant.id,
      CASE restaurant.name
        WHEN 'Bleecker Burger' THEN 9.0
        WHEN 'Honest Burgers' THEN 8.6
        WHEN 'Patty & Bun' THEN 8.8
        WHEN 'Shake Shack' THEN 8.4
        WHEN 'Five Guys' THEN 8.2
        ELSE 8.0
      END,
      CASE restaurant.name
        WHEN 'Bleecker Burger' THEN 'Simple, juicy, perfect meat blend.'
        WHEN 'Honest Burgers' THEN 'Rosemary chips are a game changer.'
        WHEN 'Patty & Bun' THEN 'Ari Gold burger is legendary.'
        WHEN 'Shake Shack' THEN 'Classic American style, reliable.'
        WHEN 'Five Guys' THEN 'Customizable, generous portions.'
        ELSE NULL
      END
    )
    ON CONFLICT (user_id, restaurant_id) DO NOTHING;
  END LOOP;

  -- Add ratings for Curry restaurants
  FOR restaurant IN 
    SELECT r.id, r.name FROM restaurants r
    JOIN restaurant_categories rc ON r.id = rc.restaurant_id
    JOIN categories c ON rc.category_id = c.id
    WHERE c.slug = 'curry'
  LOOP
    INSERT INTO ratings (user_id, restaurant_id, score, review_text)
    VALUES (
      test_user_id,
      restaurant.id,
      CASE restaurant.name
        WHEN 'Dishoom' THEN 9.4
        WHEN 'Gymkhana' THEN 9.6
        WHEN 'Hoppers' THEN 9.0
        WHEN 'Tayyabs' THEN 8.8
        WHEN 'Cinnamon Kitchen' THEN 8.5
        ELSE 8.0
      END,
      CASE restaurant.name
        WHEN 'Dishoom' THEN 'Black daal is legendary for a reason.'
        WHEN 'Gymkhana' THEN 'Michelin-starred perfection.'
        WHEN 'Hoppers' THEN 'Sri Lankan flavors, absolutely stunning.'
        WHEN 'Tayyabs' THEN 'Incredible value, always packed.'
        WHEN 'Cinnamon Kitchen' THEN 'Modern Indian, very refined.'
        ELSE NULL
      END
    )
    ON CONFLICT (user_id, restaurant_id) DO NOTHING;
  END LOOP;

  -- Add ratings for Fried Chicken restaurants
  FOR restaurant IN 
    SELECT r.id, r.name FROM restaurants r
    JOIN restaurant_categories rc ON r.id = rc.restaurant_id
    JOIN categories c ON rc.category_id = c.id
    WHERE c.slug = 'fried-chicken'
  LOOP
    INSERT INTO ratings (user_id, restaurant_id, score, review_text)
    VALUES (
      test_user_id,
      restaurant.id,
      CASE restaurant.name
        WHEN 'Chick''n''Sours' THEN 8.9
        WHEN 'Chick King' THEN 8.6
        WHEN 'Bird' THEN 8.7
        WHEN 'Absurd Bird' THEN 8.4
        WHEN 'Thunderbird' THEN 8.5
        ELSE 8.0
      END,
      CASE restaurant.name
        WHEN 'Chick''n''Sours' THEN 'Korean-style wings are incredible.'
        WHEN 'Chick King' THEN 'Brixton gem, proper fried chicken.'
        WHEN 'Bird' THEN 'American-style, great atmosphere.'
        WHEN 'Absurd Bird' THEN 'Bottomless brunch is wild.'
        WHEN 'Thunderbird' THEN 'Spicy, crispy, delicious.'
        ELSE NULL
      END
    )
    ON CONFLICT (user_id, restaurant_id) DO NOTHING;
  END LOOP;

END $$;

-- Note: These ratings are sample data for demonstration
-- In production, you would fetch real Google ratings using the Google Places API
-- and convert them using: (google_rating / 5) * 10
