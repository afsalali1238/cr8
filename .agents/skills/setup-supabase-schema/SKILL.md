---
name: setup-supabase-schema
description: "Creates the complete Supabase database schema for CraftersUnited: artists, listings, categories tables with RLS policies and seed data. Run this first before any frontend work."
---

# Skill: Setup Supabase Schema

## What This Skill Does
Runs the complete SQL migration to create all Phase 1 tables, enable RLS, set policies, and seed the categories table.

## Success Criterion
Supabase table editor shows: `artists`, `listings`, `categories` tables. RLS is ON for all three. 6 category rows exist. A test artist with `is_approved = true` can be queried from the frontend.

## Pre-Conditions
- Supabase project created at supabase.com
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

## Step 1: Run this SQL in Supabase SQL Editor

Go to: Supabase Dashboard → SQL Editor → New Query → paste and run:

```sql
-- ============================================
-- CraftersUnited Phase 1 Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES (seed table)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id     SERIAL PRIMARY KEY,
  name   TEXT NOT NULL,
  slug   TEXT UNIQUE NOT NULL,
  icon   TEXT
);

INSERT INTO categories (name, slug, icon) VALUES
  ('Art & Crafts',            'art-crafts',     '🎨'),
  ('Home Décor',              'home-decor',     '🏠'),
  ('Collectibles & Antiques', 'collectibles',   '🏺'),
  ('Personalized Items',      'personalized',   '✨'),
  ('Handmade Jewellery',      'jewellery',      '💍'),
  ('Handmade Clothing',       'clothing',       '👗')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ARTISTS
-- ============================================
CREATE TABLE IF NOT EXISTS artists (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  bio            TEXT,
  location_name  TEXT NOT NULL,
  lat            DECIMAL(10, 7),
  lng            DECIMAL(10, 7),
  state          TEXT,
  city           TEXT,
  whatsapp       TEXT,       -- format: 91XXXXXXXXXX (country code + number, no +)
  instagram      TEXT,       -- handle only, no @ symbol
  email          TEXT,
  photo_url      TEXT,       -- Supabase Storage path
  category       TEXT,
  is_approved    BOOLEAN DEFAULT FALSE,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LISTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS listings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id    UUID REFERENCES artists(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  price        NUMERIC(10, 2),  -- INR display only
  image_url    TEXT,            -- Supabase Storage path
  category     TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE artists    ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public: read approved active artists
CREATE POLICY "Public read approved artists"
ON artists FOR SELECT
USING (is_approved = true AND is_active = true);

-- Public: read available listings (of approved artists only)
CREATE POLICY "Public read available listings"
ON listings FOR SELECT
USING (
  is_available = true
  AND EXISTS (
    SELECT 1 FROM artists
    WHERE artists.id = listings.artist_id
    AND artists.is_approved = true
  )
);

-- Public: read all categories
CREATE POLICY "Public read categories"
ON categories FOR SELECT
USING (true);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_artists_category     ON artists(category);
CREATE INDEX IF NOT EXISTS idx_artists_state        ON artists(state);
CREATE INDEX IF NOT EXISTS idx_artists_approved     ON artists(is_approved, is_active);
CREATE INDEX IF NOT EXISTS idx_listings_artist_id   ON listings(artist_id);
CREATE INDEX IF NOT EXISTS idx_listings_category    ON listings(category);

-- ============================================
-- SEED: One test artist (update with real data later)
-- ============================================
INSERT INTO artists (
  name, bio, location_name, lat, lng, state, city,
  whatsapp, instagram, category, is_approved
) VALUES (
  'Test Artist',
  'This is a test artist entry. Replace with real artist data.',
  'Kochi, Kerala',
  9.9312,
  76.2673,
  'Kerala',
  'Kochi',
  '919999999999',
  'testartist',
  'Art & Crafts',
  true
);
```

## Step 2: Create Supabase Storage Buckets

In Supabase Dashboard → Storage → New Bucket:

1. Bucket name: `artist-images` → Public: YES
2. Bucket name: `listing-images` → Public: YES

Set file size limit: 5MB. Allowed MIME types: `image/jpeg, image/png, image/webp`

## Step 3: Verify in Supabase Table Editor
- [ ] `categories` table has 6 rows
- [ ] `artists` table has 1 test row with `is_approved = true`
- [ ] RLS shows as "Enabled" on all tables
- [ ] Storage shows 2 buckets

## Step 4: Configure Supabase client in Next.js

```bash
npm install @supabase/supabase-js @supabase/ssr
```

```ts
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```ts
// src/lib/supabase/server.ts
import { createServerClient as createSSRClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerClient() {
  const cookieStore = cookies()
  return createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }) } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options }) } catch {}
        },
      },
    }
  )
}
```

## Post-Build Checklist
- [ ] All 3 tables created in Supabase
- [ ] 6 category rows exist
- [ ] 1 test artist with `is_approved = true`
- [ ] RLS enabled on all tables
- [ ] Both storage buckets created
- [ ] Supabase client files created at `src/lib/supabase/`
- [ ] Frontend can query test artist without errors
