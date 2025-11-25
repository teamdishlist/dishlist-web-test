-- Create a table to store individual chain locations for map display
CREATE TABLE IF NOT EXISTS restaurant_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text,
  lat decimal,
  lng decimal,
  google_place_id text,
  created_at timestamptz DEFAULT now()
);

-- Add RLS policies
ALTER TABLE restaurant_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Restaurant locations are viewable by everyone"
  ON restaurant_locations FOR SELECT
  USING (true);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_restaurant_locations_restaurant_id 
  ON restaurant_locations(restaurant_id);
