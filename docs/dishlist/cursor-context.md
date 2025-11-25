# DishList – Build Context (Cursor)

You are helping build **DishList**, a location-first food discovery web app.

## Product Summary

DishList is a **location-led, category-led** food discovery app that ranks the best places to eat based on:
- Simple **numeric ratings**
- **One-line reviews** (120–150 characters)
- Short **voice notes** (8–10 seconds) – can be stubbed initially

MVP is **London-only**, but all UX, data model and navigation must be **multi-city ready** from day one.

Users can:
- Browse **Top 100 lists** per category (e.g. London Pizza 100)
- Browse the **DishList100** – top 100 restaurants across all categories in a city (excluding Guinness)
- Explore restaurants via an **Explore view** (eventually a map, initially can be cards/grid)
- Build a personal ranked list called **"My List"**
- Leave **one-sentence reviews**
- Optionally leave **voice notes**
- View rich **restaurant pages** with reviews, photos and (later) booking / delivery links

## Tech Stack (Option B – Web App First)

- **Frontend:** Next.js (React, TypeScript)
- **Styling:** Tailwind CSS (or similar utility-first)
- **Backend:** Supabase (Postgres, Auth, Storage)
- **Auth:** Email magic link (Supabase Auth)
- **Location / Places:** Google Places / Maps (can be stubbed initially)
- **State Management:** React Query / TanStack Query for server state (optional but recommended)
- **Routing:** Next.js App Router

Goal: a **simple, clean, production-leaning web app** that can later be ported or complemented by a mobile app.

## Core UX Principles

- **Location-led:** Every list and ranking is scoped to a selected city.
- **Category-led:** Users think in categories (Pizza, Burgers, Fried Chicken, etc.).
- **Instantly scannable:** Lists should be compact, high signal, minimal noise.
- **One-sentence content:** Text is short, punchy, no essays.
- **Lightweight, fun, modern:** Rounded, friendly UI, not overly serious.
- **Scalable IA:** Everything must scale to multiple cities and categories later.

## Cities & Categories

- **MVP City:** London
- **MVP Categories:**
  - Burgers
  - Pizza
  - Fried Chicken
  - Kebabs
  - Curry
  - Fish & Chips
  - Guinness (special category, excluded from global DishList100)

Later, we will add more cities: Manchester, Glasgow, Dublin, NYC, etc.

## Core Screens (Web)

1. **Homepage**
   - City selector (e.g. "London ▾")
   - Entry to DishList100
   - Category cards (e.g. "London Pizza", "London Burgers")
   - "Continue My List"
   - "Trending / Recently Reviewed"
   - Small "Explore nearby" element (map or list)

2. **My List**
   - User's personal ranked list (global, but filterable by city)
   - Each row: rank number, restaurant name, category, location, user rating, snippet
   - Actions per row: "Edit rating", "Remove", "View"
   - Sorting: by **Rating**, **Recently added**, **Distance** (distance only when location is available)
   - "Add Restaurant" button → search/submit flow

3. **Category Tables**
   - e.g. "London Pizza 100"
   - Ranks 1–100 for a city + category
   - Each row: rank, name, neighbourhood or "Multiple locations", global rating, small actions
   - Filters: distance, rating, style, price (some can be stubbed or added later)

4. **DishList100 (Global per City)**
   - Top 100 across all categories in a city (excluding Guinness)
   - Mixed categories, still scoped to one city

5. **Explore**
   - MVP: grid of category cards + optional basic map preview
   - Later: full-screen map with filters (distance, category, rating, price, "Open now")

6. **Restaurant Page**
   - Hero section: name, neighbourhood, city
   - Category ranking (e.g. "#7 in London for Burgers")
   - One-line reviews
   - Voice notes (stubbed or basic playback)
   - Map microview
   - (Later) Booking links, delivery links, photos

7. **Account / Auth**
   - Email / social sign-in (start with email only)
   - Onboarding: pick city + favourite categories
   - Review history
   - Basic settings

## Key Interaction Rules

- One-line reviews: **hard limit ~150 characters**.
- Voice notes: **8–10 seconds** (can be enforced later).
- Categories and top lists are always **scoped to the selected city**.
- **My List is global**, but can be **filtered by city** in the UI.
- Distance-based sorting only works with user location permission.

## MVP Scope (for building now)

For the current build, focus on:

1. **Web app only**, using Next.js + Supabase.
2. **London-only**, but with multi-city support in the data model.
3. Implement:
   - Auth (Supabase magic link)
   - City selector (default: London)
   - Category Top 100 list page (e.g. Pizza)
   - My List page (personal ranked list with editing)
   - Basic Explore page (grid of categories)
   - Basic Restaurant page
   - Search/Add Restaurant flow
4. Voice notes, photos, affiliate links, advanced filters and map-heavy Explore can be added later.

Use this file as high-level context whenever generating code, components, or API integration for DishList.
