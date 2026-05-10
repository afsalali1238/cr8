-- ============================================
-- Migration: Social Links + Community Fields
-- Run in Supabase SQL Editor
-- ============================================

-- Add social fields to artists table
-- (whatsapp already exists — skip if column exists)
ALTER TABLE artists
  ADD COLUMN IF NOT EXISTS instagram  TEXT,   -- handle only, no @ symbol
  ADD COLUMN IF NOT EXISTS youtube    TEXT,   -- channel URL or handle
  ADD COLUMN IF NOT EXISTS facebook   TEXT,   -- page URL or username
  ADD COLUMN IF NOT EXISTS website    TEXT;   -- personal/portfolio website

-- ============================================
-- COMMUNITY TABLES
-- ============================================

-- Communities (e.g. "Ceramics Kerala", "Dreamcatcher Artists")
CREATE TABLE IF NOT EXISTS communities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  icon        TEXT,             -- emoji
  cover_url   TEXT,             -- Supabase storage
  created_by  UUID,             -- artist id (nullable for admin-created)
  member_count INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Posts (inside communities or general)
CREATE TABLE IF NOT EXISTS posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id  UUID REFERENCES communities(id) ON DELETE CASCADE,
  artist_id     UUID REFERENCES artists(id) ON DELETE SET NULL,
  author_name   TEXT NOT NULL,   -- denormalized for display
  author_photo  TEXT,            -- denormalized for display
  title         TEXT NOT NULL,
  body          TEXT NOT NULL,
  image_url     TEXT,            -- optional post image
  like_count    INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  is_pinned     BOOLEAN DEFAULT FALSE,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Comments on posts
CREATE TABLE IF NOT EXISTS comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID REFERENCES posts(id) ON DELETE CASCADE,
  artist_id   UUID REFERENCES artists(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_photo TEXT,
  body        TEXT NOT NULL,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SEED: Default communities
-- ============================================
INSERT INTO communities (name, slug, description, icon) VALUES
  ('Art & Crafts',       'art-crafts',    'Share your paintings, drawings, mixed media work', '🎨'),
  ('Home Décor Makers',  'home-decor',    'Handmade home décor, candles, pottery and more',   '🏠'),
  ('Jewellery Artists',  'jewellery',     'Handmade jewellery, beadwork, metalwork',           '💍'),
  ('Kerala Crafters',    'kerala',        'Artists based in Kerala connecting locally',         '🌴'),
  ('Personalized Gifts', 'personalized',  'Custom and personalized item makers',               '✨'),
  ('General Discussion', 'general',       'Anything craft-related — tips, resources, collabs', '💬')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- RLS for community tables
-- ============================================
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments    ENABLE ROW LEVEL SECURITY;

-- Public can read active communities
CREATE POLICY "Public read communities"
ON communities FOR SELECT USING (is_active = true);

-- Public can read active posts
CREATE POLICY "Public read posts"
ON posts FOR SELECT USING (is_active = true);

-- Public can read active comments
CREATE POLICY "Public read comments"
ON comments FOR SELECT USING (is_active = true);

-- Anyone can insert posts (Phase 1 — no auth gate, name required)
-- Phase 2: restrict to authenticated artists only
CREATE POLICY "Anyone can post"
ON posts FOR INSERT WITH CHECK (true);

-- Anyone can insert comments
CREATE POLICY "Anyone can comment"
ON comments FOR INSERT WITH CHECK (true);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_posts_community   ON posts(community_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_artist      ON posts(artist_id);
CREATE INDEX IF NOT EXISTS idx_comments_post     ON comments(post_id, created_at ASC);
