-- Seed data for DishList MVP
-- Run this in your Supabase SQL Editor

-- Get London city ID (should already exist from initial seed)
DO $$
DECLARE
  london_id uuid;
  pizza_id uuid;
  burgers_id uuid;
  curry_id uuid;
  chicken_id uuid;
BEGIN
  -- Get city and category IDs
  SELECT id INTO london_id FROM cities WHERE slug = 'london';
  SELECT id INTO pizza_id FROM categories WHERE slug = 'pizza';
  SELECT id INTO burgers_id FROM categories WHERE slug = 'burgers';
  SELECT id INTO curry_id FROM categories WHERE slug = 'curry';
  SELECT id INTO chicken_id FROM categories WHERE slug = 'fried-chicken';

  -- Insert Pizza restaurants
  INSERT INTO restaurants (name, city_id, neighbourhood, address) VALUES
    ('Pizza Pilgrims', london_id, 'Soho', '11 Dean St, London W1D 3RP'),
    ('Franco Manca', london_id, 'Brixton', 'Unit 4, Market Row, London SW9 8LD'),
    ('Homeslice', london_id, 'Covent Garden', '13 Neal''s Yard, London WC2H 9DP'),
    ('Rudy''s Pizza', london_id, 'Soho', '9 Peter St, London W1F 0AD'),
    ('L''Antica Pizzeria', london_id, 'Notting Hill', '66 Notting Hill Gate, London W11 3HT')
  ON CONFLICT DO NOTHING;

  -- Link pizza restaurants to pizza category
  INSERT INTO restaurant_categories (restaurant_id, category_id)
  SELECT r.id, pizza_id
  FROM restaurants r
  WHERE r.name IN ('Pizza Pilgrims', 'Franco Manca', 'Homeslice', 'Rudy''s Pizza', 'L''Antica Pizzeria')
  ON CONFLICT DO NOTHING;

  -- Insert Burger restaurants
  INSERT INTO restaurants (name, city_id, neighbourhood, address) VALUES
    ('Bleecker Burger', london_id, 'Victoria', 'Victoria Station, London SW1E 5ND'),
    ('Honest Burgers', london_id, 'Soho', '12 Meard St, London W1F 0EQ'),
    ('Patty & Bun', london_id, 'Marylebone', '54 James St, London W1U 1HE'),
    ('Shake Shack', london_id, 'Covent Garden', '24 The Market, London WC2E 8RD'),
    ('Five Guys', london_id, 'Leicester Square', '1-3 Long Acre, London WC2E 9LH')
  ON CONFLICT DO NOTHING;

  -- Link burger restaurants to burgers category
  INSERT INTO restaurant_categories (restaurant_id, category_id)
  SELECT r.id, burgers_id
  FROM restaurants r
  WHERE r.name IN ('Bleecker Burger', 'Honest Burgers', 'Patty & Bun', 'Shake Shack', 'Five Guys')
  ON CONFLICT DO NOTHING;

  -- Insert Curry restaurants
  INSERT INTO restaurants (name, city_id, neighbourhood, address) VALUES
    ('Dishoom', london_id, 'Shoreditch', '7 Boundary St, London E2 7JE'),
    ('Gymkhana', london_id, 'Mayfair', '42 Albemarle St, London W1S 4JH'),
    ('Hoppers', london_id, 'Soho', '49 Frith St, London W1D 4SG'),
    ('Tayyabs', london_id, 'Whitechapel', '83-89 Fieldgate St, London E1 1JU'),
    ('Cinnamon Kitchen', london_id, 'City', '9 Devonshire Square, London EC2M 4YL')
  ON CONFLICT DO NOTHING;

  -- Link curry restaurants to curry category
  INSERT INTO restaurant_categories (restaurant_id, category_id)
  SELECT r.id, curry_id
  FROM restaurants r
  WHERE r.name IN ('Dishoom', 'Gymkhana', 'Hoppers', 'Tayyabs', 'Cinnamon Kitchen')
  ON CONFLICT DO NOTHING;

  -- Insert Fried Chicken restaurants
  INSERT INTO restaurants (name, city_id, neighbourhood, address) VALUES
    ('Chick''n''Sours', london_id, 'Haggerston', '390 Kingsland Rd, London E8 4AA'),
    ('Chick King', london_id, 'Brixton', 'Brixton Village, London SW9 8PR'),
    ('Bird', london_id, 'Shoreditch', '42 Kingsland Rd, London E2 8DA'),
    ('Absurd Bird', london_id, 'Soho', '25 Peter St, London W1F 0AH'),
    ('Thunderbird', london_id, 'Bethnal Green', '1 Ezra St, London E2 7RH')
  ON CONFLICT DO NOTHING;

  -- Link chicken restaurants to fried-chicken category
  INSERT INTO restaurant_categories (restaurant_id, category_id)
  SELECT r.id, chicken_id
  FROM restaurants r
  WHERE r.name IN ('Chick''n''Sours', 'Chick King', 'Bird', 'Absurd Bird', 'Thunderbird')
  ON CONFLICT DO NOTHING;

END $$;
