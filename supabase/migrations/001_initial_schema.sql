-- ============================================
-- CraftersUnited (cr8un8.com)
-- Phase 1 Migration — Full Schema
-- Run in Supabase SQL Editor
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id    SERIAL PRIMARY KEY,
  name  TEXT NOT NULL,
  slug  TEXT UNIQUE NOT NULL,
  icon  TEXT
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
  whatsapp       TEXT,
  instagram      TEXT,
  email          TEXT,
  photo_url      TEXT,
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
  price        NUMERIC(10, 2),
  image_url    TEXT,
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

DROP POLICY IF EXISTS "Public read approved artists" ON artists;
DROP POLICY IF EXISTS "Public read available listings" ON listings;
DROP POLICY IF EXISTS "Public read categories" ON categories;

CREATE POLICY "Public read approved artists"
ON artists FOR SELECT
USING (is_approved = true AND is_active = true);

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

CREATE POLICY "Public read categories"
ON categories FOR SELECT
USING (true);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_artists_category   ON artists(category);
CREATE INDEX IF NOT EXISTS idx_artists_state      ON artists(state);
CREATE INDEX IF NOT EXISTS idx_artists_approved   ON artists(is_approved, is_active);
CREATE INDEX IF NOT EXISTS idx_listings_artist    ON listings(artist_id);
CREATE INDEX IF NOT EXISTS idx_listings_category  ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_available ON listings(is_available);

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

-- ============================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can subscribe to newsletter"
ON newsletter_subscribers FOR INSERT
WITH CHECK (true);

