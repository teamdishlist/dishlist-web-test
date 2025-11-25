-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Cities
create table cities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  country text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Categories
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  is_special boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Restaurants
create table restaurants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  city_id uuid references cities(id) not null,
  neighbourhood text,
  address text,
  lat float,
  lng float,
  google_place_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Restaurant Categories (Join Table)
create table restaurant_categories (
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  category_id uuid references categories(id) on delete cascade not null,
  primary key (restaurant_id, category_id)
);

-- 5. Ratings
create table ratings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  restaurant_id uuid references restaurants(id) not null,
  score float not null check (score >= 0 and score <= 10),
  review_text text check (length(review_text) <= 160),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, restaurant_id)
);

-- 6. My List Entries
create table my_list_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  restaurant_id uuid references restaurants(id) not null,
  position integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, restaurant_id)
);

-- 7. Voice Notes (Stub)
create table voice_notes (
  id uuid primary key default uuid_generate_v4(),
  rating_id uuid references ratings(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  file_url text not null,
  duration_seconds integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)

-- Enable RLS on all tables
alter table cities enable row level security;
alter table categories enable row level security;
alter table restaurants enable row level security;
alter table restaurant_categories enable row level security;
alter table ratings enable row level security;
alter table my_list_entries enable row level security;
alter table voice_notes enable row level security;

-- Public Read Access (Cities, Categories, Restaurants)
create policy "Public cities are viewable by everyone" on cities for select using (true);
create policy "Public categories are viewable by everyone" on categories for select using (true);
create policy "Public restaurants are viewable by everyone" on restaurants for select using (true);
create policy "Public restaurant_categories are viewable by everyone" on restaurant_categories for select using (true);

-- Ratings: Public read, Authenticated create/update (own)
create policy "Ratings are viewable by everyone" on ratings for select using (true);
create policy "Users can insert their own ratings" on ratings for insert with check (auth.uid() = user_id);
create policy "Users can update their own ratings" on ratings for update using (auth.uid() = user_id);
create policy "Users can delete their own ratings" on ratings for delete using (auth.uid() = user_id);

-- My List: Authenticated read/write (own)
create policy "Users can view their own list" on my_list_entries for select using (auth.uid() = user_id);
create policy "Users can insert into their own list" on my_list_entries for insert with check (auth.uid() = user_id);
create policy "Users can update their own list" on my_list_entries for update using (auth.uid() = user_id);
create policy "Users can delete from their own list" on my_list_entries for delete using (auth.uid() = user_id);

-- Voice Notes: Public read, Authenticated create (own)
create policy "Voice notes are viewable by everyone" on voice_notes for select using (true);
create policy "Users can upload their own voice notes" on voice_notes for insert with check (auth.uid() = user_id);

-- Seed Data (London MVP)
insert into cities (name, slug, country) values ('London', 'london', 'UK');

insert into categories (name, slug, description, is_special) values 
('Burgers', 'burgers', 'Best burgers in town', false),
('Pizza', 'pizza', 'Wood fired, deep dish, and slices', false),
('Fried Chicken', 'fried-chicken', 'Crispy, crunchy, delicious', false),
('Kebabs', 'kebabs', 'Doner, shish, and shawarma', false),
('Curry', 'curry', 'Spicy, aromatic, and flavorful', false),
('Fish & Chips', 'fish-and-chips', 'Traditional British classic', false),
('Guinness', 'guinness', 'Best pints of the black stuff', true);
