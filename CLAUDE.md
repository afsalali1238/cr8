# CLAUDE.md — CraftersUnited (cr8un8.com)

> Agent instruction file for Google Antigravity, Claude Code, Cursor, and Codex CLI.
> Read this file fully before touching any code. These rules are non-negotiable.

---

## Project Identity

**Product:** CraftersUnited — "Etsy meets local discovery, built for artists without a following."
**Domain:** https://cr8un8.com
**Market:** India (Kerala/Karnataka initial focus, national scale target)
**Stack:** Next.js 14 · Supabase · Vercel · Tailwind CSS · Leaflet.js
**Phase:** Phase 1 MVP — Connect buyers to sellers. No payments. No checkout.
**Owner:** Afsal (non-technical — every decision must be explainable in plain language)

---

## The Four Principles (Karpathy)

### 1. Think Before Coding
- State all assumptions explicitly before writing a single line
- If two interpretations exist, present both and wait for clarification
- Never silently pick an approach — surface tradeoffs
- Stop when confused. Name what's unclear. Ask.

### 2. Simplicity First
- Minimum code that meets the stated goal. Nothing speculative.
- No abstractions for single-use code
- No "flexibility" or "configurability" that wasn't asked for
- No error handling for impossible edge cases at this stage
- If 200 lines could be 50, rewrite it
- **Test:** Would a senior engineer call this overcomplicated? If yes, simplify.

### 3. Surgical Changes
- Touch only what the task requires
- Do not "improve" adjacent code, comments, or formatting
- Match existing code style even if you'd do it differently
- If you notice unrelated dead code, mention it — don't delete it
- Every changed line must trace directly back to the user's request

### 4. Goal-Driven Execution
- Transform every task into a verifiable success criterion before starting
- Multi-step tasks: write the plan first, get approval, then execute
- Loop until the criterion is met — don't declare victory early
- Format for plans:

```
1. [Step] → verify: [how to confirm it worked]
2. [Step] → verify: [how to confirm it worked]
```

---

## Architecture Overview

```
cr8un8/
├── CLAUDE.md           ← You are here
├── MEMORY.md           ← Project state, decisions, context
├── .agents/
│   └── skills/         ← Workspace-scoped Antigravity skills
├── src/
│   ├── app/            ← Next.js 14 App Router pages
│   ├── components/     ← Shared UI components
│   ├── lib/            ← Supabase client, utils
│   └── types/          ← TypeScript interfaces
├── supabase/
│   └── migrations/     ← Database schema SQL
├── public/             ← Static assets
└── docs/               ← Architecture decisions, API docs
```

---

## Tech Stack — Canonical Decisions

| Layer | Tool | Reason | Free Tier Limit |
|---|---|---|---|
| Frontend | Next.js 14 (App Router) | File-based routing, SSR, Vercel-native | Unlimited |
| Styling | Tailwind CSS + shadcn/ui | Fast, consistent, no custom CSS needed | Free |
| Database | Supabase (PostgreSQL) | Auth + DB + Storage in one, visual admin | 500MB / 50k rows |
| Auth | Supabase Auth | Built-in, email + Google OAuth | Free |
| Storage | Supabase Storage | Artist photos and listing images | 1GB |
| Maps | Leaflet.js + OpenStreetMap | Fully free, no API key needed | Unlimited |
| Hosting | Vercel | Auto-deploy from GitHub, custom domain | Free hobby |
| Contact | WhatsApp deep link + Instagram URL | Zero backend needed | Free |
| Admin | Supabase table editor | Point-and-click for Afsal | Free |
| Forms | Supabase direct insert (Superbase form) | Artist onboarding | Free |

**DO NOT introduce any tool not on this list without asking first.**

---

## Database Schema (Source of Truth)

```sql
-- artists
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
name        text NOT NULL
bio         text
location_name text NOT NULL
lat         decimal(10,7)
lng         decimal(10,7)
state       text                    -- e.g. 'Kerala'
city        text
whatsapp    text                    -- format: 91XXXXXXXXXX
instagram   text                    -- handle only, no @
email       text
photo_url   text                    -- Supabase storage path
category    text                    -- see CATEGORIES below
is_approved boolean DEFAULT false   -- admin review gate
is_active   boolean DEFAULT true
created_at  timestamptz DEFAULT now()

-- listings
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
artist_id   uuid REFERENCES artists(id) ON DELETE CASCADE
title       text NOT NULL
description text
price       numeric(10,2)           -- INR, display only, no checkout
image_url   text                    -- Supabase storage path
category    text
is_available boolean DEFAULT true
created_at  timestamptz DEFAULT now()

-- categories (seed data)
id          serial PRIMARY KEY
name        text NOT NULL           -- 'Art & Crafts', 'Home Décor', etc.
slug        text UNIQUE NOT NULL    -- 'art-crafts', 'home-decor', etc.
icon        text                    -- emoji for display
```

### Categories (seed these first)
- Art & Crafts (`art-crafts`) 🎨
- Home Décor (`home-decor`) 🏠
- Collectibles & Antiques (`collectibles`) 🏺
- Personalized Items (`personalized`) ✨
- Handmade Jewellery (`jewellery`) 💍
- Handmade Clothing (`clothing`) 👗

---

## Pages — Phase 1 (Build in this order)

| Priority | Route | Description | Success Criterion |
|---|---|---|---|
| 1 | `/` | Homepage: hero + featured artists + categories | Renders 6 artist cards from Supabase |
| 2 | `/artists` | Artist directory: filterable grid | Filter by category + state works |
| 3 | `/artists/[id]` | Artist profile: bio + listings + contact buttons | WhatsApp + Instagram links resolve |
| 4 | `/map` | Interactive map with all geo-tagged artists | Pins cluster correctly on mobile |
| 5 | `/listings` | Browse all listings across all artists | Filter by category works |
| 6 | `/listings/[id]` | Listing detail: photos + price + seller info | "Contact Seller" button works |
| 7 | `/join` | Artist onboarding form | Data saves to Supabase artists table |
| 8 | `/admin` | Protected admin: approve/reject artist applications | Only accessible with admin role |

---

## Component Rules

- **Never build a component that does more than one thing**
- Keep components under 150 lines — split if longer
- All data fetching happens in Server Components (app/ directory pattern)
- Client Components (`"use client"`) only for interactivity (map, filters, forms)
- Use shadcn/ui for all UI primitives — never write custom buttons/inputs/modals

### Naming Conventions
```
components/
  ArtistCard.tsx          ← single artist in grid
  ArtistGrid.tsx          ← wraps multiple ArtistCards
  ListingCard.tsx         ← single listing
  MapView.tsx             ← Leaflet map (client component)
  CategoryFilter.tsx      ← filter bar (client component)
  ContactButtons.tsx      ← WhatsApp + Instagram buttons
  ArtistOnboardingForm.tsx
```

---

## Contact Logic (No Backend Needed)

```tsx
// WhatsApp deep link
const whatsappUrl = `https://wa.me/${artist.whatsapp}?text=Hi, I found you on CraftersUnited! I'm interested in your work.`

// Instagram profile link
const instagramUrl = `https://instagram.com/${artist.instagram}`
```

That's it. No messaging backend, no database writes. Pure links.

---

## Environment Variables

```env
# .env.local (never commit this file)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # admin operations only, server-side
NEXT_PUBLIC_SITE_URL=https://cr8un8.com
```

---

## Supabase Row-Level Security (RLS) Rules

```sql
-- Artists: public can read approved artists only
CREATE POLICY "Public read approved artists"
ON artists FOR SELECT
USING (is_approved = true AND is_active = true);

-- Listings: public can read available listings of approved artists
CREATE POLICY "Public read available listings"
ON listings FOR SELECT
USING (is_available = true);

-- Admin: service role bypasses all RLS (used only server-side)
```

---

## What NOT to Build in Phase 1

- ❌ Cart / checkout / payments
- ❌ In-app messaging (WhatsApp link replaces this)
- ❌ Reviews or ratings
- ❌ Artist dashboard / self-service editing
- ❌ Email notifications
- ❌ Search (text search) — filters only for now
- ❌ Mobile app
- ❌ Any third-party paid API

If a feature isn't in the Pages table above, ask before building it.

---

## Deployment

1. Push to GitHub (`main` branch)
2. Vercel auto-deploys on every push
3. Custom domain: set `cr8un8.com` as primary in Vercel dashboard
4. Supabase project stays on free tier — no changes needed

---

## Agent Execution Protocol

When Afsal gives a task:

1. **Read MEMORY.md first** — check if a decision was already made
2. **State your plan** in the format above — get confirmation before writing code
3. **Build the smallest possible thing** that meets the success criterion
4. **Verify** by checking the criterion explicitly
5. **Update MEMORY.md** with any new decisions made during this session

Never start coding without a plan. Never declare success without verifying.
