# DishList – Product Overview

## What is DishList?

DishList is a **location-first, category-led food discovery app**.  
It helps people find the best places to eat in a city by ranking restaurants using:

- **Simple 0–10 ratings**
- **One-sentence reviews** (short, punchy)
- **Short voice notes**

Instead of long reviews or infinite scroll, DishList leans into **ranking** and **personal lists**.

- Each city has **Top 100** rankings per category.
- Each city has one **DishList100**: the top 100 restaurants across all categories (except Guinness).
- Each user has their own **"My List"**: a personal, ranked list of places they've rated.

## Core Concept

- **Location is central.** Everything is scoped to a city.
- **Categories are the entry point.** Users think in Pizza, Burgers, Curry, etc.
- **Rankings replace star ratings.** "#7 in London for Burgers" is more meaningful than 4.3 stars.
- **Personalisation via My List.** Users build and maintain a ranked list of their favourite places.

## Supported Cities & Categories

- **MVP City:** London only (for now), but the UI and data structures must support multiple cities by design.
- **MVP Categories:**
  - Burgers
  - Pizza
  - Fried Chicken
  - Kebabs
  - Curry
  - Fish & Chips
  - Guinness (special category, excluded from DishList100)

Each city will have:
- A **DishList100** (global top 100 across categories, minus Guinness).
- A **Top 100** list per category.

## Primary User Flows

1. **Browse by category**
   - Example: "London Pizza 100"
   - See ranked list of the top 100 pizza spots in London.
   - Tap into a restaurant to see details.

2. **See the DishList100**
   - The ultimate list for a city.
   - Mixed categories, ranked by overall quality.

3. **Explore**
   - Discover places via categories and (later) a map view.
   - Filter by distance, price, rating, category, "Open now" (some filters may be added post-MVP).

4. **My List**
   - The user's personal list of restaurants they've rated.
   - Sortable by rating, recently added, distance.
   - Filterable by city.
   - Editable ratings, one-line reviews, and (later) voice notes.

5. **Rate & Review**
   - Add a rating (0–10 scale).
   - Write a one-sentence review (max ~150 characters).
   - Optionally record a short voice note (8–10 seconds).

6. **Restaurant Detail**
   - See:
     - Name, neighbourhood, city
     - Category ranking (e.g. "#9 in London for Pizza")
     - One-line reviews
     - Voice notes
     - Map microview
     - (Later) booking/delivery links and photos.

## Design & UX Principles

- **Location-led:** City selection should be visible and easily changeable.
- **Category-led:** Users enter through strong category pages and cards.
- **Instantly scannable:** Lists should be short, high contrast, and readable at a glance.
- **One-sentence content:** No long reviews; one-liners rule.
- **Lightweight & modern:** Rounded UI, friendly microcopy, minimal clutter.
- **Scalable information architecture:** All navigation and naming should work when there are multiple cities and more categories.

## Constraints

- MVP launch is **web-only** (Next.js), but nothing should block a future mobile app.
- **London-only** data at launch, but:
  - Schema must support multiple cities.
  - API and UI patterns must not assume "London hard-coded".
- Reviews are intentionally short; this is part of the brand.

## Out of Scope for MVP (but planned)

- Full social graph (friends, following, shared lists).
- Trip planning and itineraries.
- Sponsored ranking slots.
- Complex loyalty / perks.
- Advanced heatmaps and trending visuals.

Focus now is: **a fast, clean, opinionated way to discover and rank places to eat in London.**
