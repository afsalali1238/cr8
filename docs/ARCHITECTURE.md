# CraftersUnited — Architecture Reference

## System Overview

```
Browser (User)
      │
      ▼
  Vercel CDN
      │
      ▼
Next.js 14 App (cr8un8.com)
  ├── Server Components  → Supabase (DB read, RLS enforced)
  ├── Client Components  → Supabase (form submissions, auth)
  │                      → Leaflet (maps, no API key)
  └── Static Assets      → Supabase Storage (images)

Admin (Afsal)
      │
      ▼
 Supabase Dashboard
  ├── Table Editor  → Review + approve artist applications
  ├── Storage       → View uploaded photos
  └── SQL Editor    → Run migrations if needed
```

## Data Flow: Artist Onboarding

```
Artist fills /join form
      │
      ▼ (client-side, anon key)
Upload photo → Supabase Storage (artist-images bucket)
      │
      ▼
INSERT artists row (is_approved = false)
      │
      ▼
Afsal opens Supabase Table Editor
      │
      ▼
Sets is_approved = true
      │
      ▼
Artist appears on site (RLS allows SELECT when approved)
```

## Data Flow: Buyer Discovery

```
Buyer visits /map or /artists
      │
      ▼ (server-side, anon key, RLS applied)
SELECT from artists WHERE is_approved = true
      │
      ▼
Renders artist grid or map pins
      │
      ▼
Buyer clicks artist → /artists/[id]
      │
      ▼
Clicks WhatsApp button
      │
      ▼
Opens WhatsApp with pre-filled message
      │
      ▼
Buyer and artist connect directly
```

## Security Model

| Layer | How |
|---|---|
| Database | Row Level Security — anon users can only read approved artists |
| Storage | Public buckets — images are read-only, no delete/overwrite possible via anon key |
| Admin | Afsal uses Supabase dashboard directly — no admin UI in the app |
| API Keys | `SUPABASE_SERVICE_ROLE_KEY` never exposed client-side |
| Secrets | All in `.env.local`, never committed to Git |

## Free Tier Limits & When to Upgrade

| Service | Free Limit | Expected Usage | When to Upgrade |
|---|---|---|---|
| Supabase DB | 500MB / 50k rows | 1,000 artists ≈ 5MB | Never in Phase 1 |
| Supabase Storage | 1GB | 1,000 photos × 200KB ≈ 200MB | Phase 2 |
| Supabase Auth | 50k MAU | — (no auth needed Phase 1) | Phase 2 |
| Vercel | 100GB bandwidth/month | Easily sufficient | Phase 2 |
| OpenStreetMap | Unlimited (tiles) | No limits | Never |

## Phase 2 Additions (Not Now)

- Razorpay payment integration
- Artist self-service dashboard (edit listings, update profile)
- In-app messaging (Socket.io or Supabase Realtime)
- Review / rating system
- Email notifications (Resend, free tier: 3k/month)
- Text search (Supabase pg_trgm or Algolia)
