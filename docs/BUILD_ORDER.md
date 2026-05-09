# Build Order — CraftersUnited Phase 1

Follow these steps in exact order. Do not skip ahead.
Each step has a verification check before moving to the next.

---

## Phase 0: Infrastructure (Day 1)

### 0.1 Create Supabase project
1. Go to supabase.com → New Project
2. Name: `cr8un8-prod`
3. Region: `ap-south-1` (Mumbai — closest to India)
4. Copy `Project URL` and `anon public` key

### 0.2 Run database migration
1. Supabase Dashboard → SQL Editor → New Query
2. Paste contents of `supabase/migrations/001_initial_schema.sql`
3. Click Run
4. ✅ Verify: Tables `artists`, `listings`, `categories` appear in Table Editor

### 0.3 Create Storage buckets
1. Supabase → Storage → New Bucket → `artist-images` → Public: ON
2. Supabase → Storage → New Bucket → `listing-images` → Public: ON
3. ✅ Verify: Both buckets show in Storage

### 0.4 Create GitHub repo + connect Vercel
1. GitHub → New repo → `cr8un8` → Private
2. Push this folder to the repo
3. Vercel → New Project → Import from GitHub
4. Set environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Add custom domain: `cr8un8.com`
6. ✅ Verify: `cr8un8.com` loads without errors

---

## Phase 1: Core Pages (Days 2–7)

Build in this exact order. Each page depends on the previous.

| Day | Page | Agent Prompt |
|---|---|---|
| 2 | Database + Supabase client | `@setup-supabase-schema` |
| 3 | Homepage (/) | `@build-homepage` |
| 4 | Artist directory (/artists) | "Build the /artists page with a grid of all approved artists, filterable by category and state. Use the CategoryFilter client component." |
| 5 | Artist profile (/artists/[id]) | `@build-artist-profile-page` |
| 6 | Map view (/map) | `@build-map-view` |
| 7 | Listings page (/listings) | "Build /listings showing all available listings as a grid. Filter by category. Each card shows title, price, photo, and links to /listings/[id]." |

---

## Phase 2: Onboarding + Admin (Days 8–10)

| Day | Feature | Agent Prompt |
|---|---|---|
| 8 | Artist signup form (/join) | `@build-artist-onboarding-form` |
| 9 | Listing detail page (/listings/[id]) | "Build /listings/[id] showing full listing details with the artist's contact buttons." |
| 10 | Navigation + footer | "Add a top navigation bar with links: Home, Artists, Map, Listings, + Join. Add a footer with the CraftersUnited tagline." |

---

## Phase 3: Polish + Launch (Days 11–14)

| Day | Task |
|---|---|
| 11 | Mobile QA — test every page on iPhone Safari |
| 12 | Add 10 real artists via Supabase table editor + approve them |
| 13 | SEO meta tags on all pages |
| 14 | Share on WhatsApp groups, Instagram, art communities |

---

## How to Prompt the Agent in Antigravity

For each task, open Agent Manager and send:

```
Read CLAUDE.md and MEMORY.md first.

Task: [describe the page/feature]
Success criterion: [exact what done looks like]

Use the skill @[skill-name] if relevant.
Write your plan before coding. Wait for my approval.
```

After each session, remind the agent:

```
Update MEMORY.md with what was built today and any new decisions made.
```
