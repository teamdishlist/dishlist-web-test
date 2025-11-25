# DishList – Domain Model (MVP)

This document defines the **core entities and relationships** for DishList, to inform the database schema and API design.

## Entities

### City

Represents a city in which DishList operates.

- `id` (UUID)
- `name` (string) – e.g. "London"
- `slug` (string) – e.g. "london"
- `country` (string) – e.g. "UK"
- `created_at` (timestamp)

Notes:
- MVP has one city: London.
- Schema must support multiple cities from day one.

---

### Category

Represents a cuisine/category type used in lists and filters.

- `id` (UUID)
- `name` (string) – e.g. "Pizza"
- `slug` (string) – e.g. "pizza"
- `description` (string, optional)
- `is_special` (boolean, default false) – e.g. `true` for "Guinness"
- `created_at` (timestamp)

MVP categories:
- Burgers
- Pizza
- Fried Chicken
- Kebabs
- Curry
- Fish & Chips
- Guinness (special: excluded from DishList100)

---

### Restaurant

A place a user can rate and add to My List.

- `id` (UUID)
- `name` (string)
- `city_id` (FK → City)
- `neighbourhood` (string, optional) – e.g. "Soho", "Shoreditch"
- `address` (string, optional)
- `lat` (float, optional)
- `lng` (float, optional)
- `google_place_id` (string, optional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

Relationships:
- Many-to-many with `Category` via a join table:
  - `restaurant_categories (restaurant_id, category_id)`
- One restaurant belongs to **one city**.

---

### User

Application user. Backed by Supabase Auth.

- `id` (UUID) – matches Supabase auth user id
- `display_name` (string, optional)
- `avatar_url` (string, optional)
- `default_city_id` (FK → City, optional)
- `created_at` (timestamp)

Auth details (email, etc.) are handled by Supabase.

---

### Rating

Represents a **user's rating and one-line review** for a restaurant.

- `id` (UUID)
- `user_id` (FK → User)
- `restaurant_id` (FK → Restaurant)
- `score` (float) – likely 0.0–10.0, with 0.1 or 0.5 increments
- `review_text` (string, max ~150 chars)
- `created_at` (timestamp)
- `updated_at` (timestamp)

Constraints:
- A user can have **at most one** rating per restaurant.
- This rating is used to:
  - Populate My List
  - Populate personal views on Restaurant Page
- Aggregate/global rankings per category/city can be derived later.

---

### MyListEntry

Represents a restaurant's presence in a user's **personal ranked list**, "My List".

- `id` (UUID)
- `user_id` (FK → User)
- `restaurant_id` (FK → Restaurant)
- `position` (integer) – the rank (1, 2, 3, …)
- `created_at` (timestamp)
- `updated_at` (timestamp)

Notes:
- **My List is global** by user, but:
  - The UI can filter entries by city using the restaurant's `city_id`.
- Position can be:
  - Calculated based on rating + recency, or
  - Explicitly stored and updated when the user reorders.

MVP approach:
- Start with `position` derived from rating + created_at (no manual drag-and-drop).
- Later, allow explicit drag-and-drop reordering and persist `position`.

---

### VoiceNote (later / stub)

Represents an optional short audio note attached to a rating.

- `id` (UUID)
- `rating_id` (FK → Rating)
- `user_id` (FK → User)
- `file_url` (string) – Supabase Storage
- `duration_seconds` (integer)
- `created_at` (timestamp)

MVP:
- This table can exist from the start but the UI and upload workflow can be added later.

---

## Relationships Summary

- **City**
  - 1 → many **Restaurants**
  - 1 → many **Users** (via preferred default city, optional)

- **Category**
  - Many ↔ many **Restaurants** via `restaurant_categories`

- **User**
  - 1 → many **Ratings**
  - 1 → many **MyListEntries**
  - 1 → many **VoiceNotes**

- **Restaurant**
  - 1 → many **Ratings**
  - 1 → many **MyListEntries**
  - belongs to **one City**
  - belongs to **many Categories**

- **Rating**
  - 1 → 1 (optional) **VoiceNote**

---

## Ranking Concepts

There are two main types of rankings:

1. **Global rankings (per city + category)**  
   - For Category Top 100 and DishList100.
   - Derived from aggregate data (e.g. average scores, popularity, quality).
   - For MVP, a simple ranking algorithm is enough (or even manual/semi-manual).

2. **Personal rankings (My List)**  
   - Per user.
   - Derived from their `Rating` entries and/or explicitly stored `position` in `MyListEntry`.

Initial implementation:
- When a user rates a restaurant:
  - Create or update a `Rating`.
  - Add the restaurant to `MyListEntry` if not already present.
  - Set `position` based on rating + recency or a simple rule.

---

## City & Filtering Behaviour

- Lists such as **"London Pizza 100"** are scoped by:
  - `city_id` = London
  - `category` = Pizza

- **DishList100 (London)**:
  - `city_id` = London
  - all categories except `Guinness`

- **My List filtering**:
  - Base data: all `MyListEntry` rows for a user.
  - Filter by city using `restaurant.city_id`.
  - Sort by:
    - `score` (from Rating)
    - `created_at` or `updated_at` (for "Recently added")
    - Distance (later using `lat`/`lng` + user location)
