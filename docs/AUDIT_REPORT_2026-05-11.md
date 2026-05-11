# CraftersUnited — Code Audit Report
**Date:** 2026-05-11
**Auditor:** Claude (Cowork)
**Scope:** Full codebase review — security, correctness, architecture, Phase 1 compliance

---

## Summary

The project is well-structured and close to launch-ready. The design, component separation, database schema, and RLS policies are solid. However, there are **3 critical issues that must be fixed before going public**, plus several medium issues worth addressing soon.

---

## 🔴 CRITICAL — Fix Before Any Public Git Push or Launch

### 1. Hardcoded Supabase Credentials in Plain Files

**Files affected:**
- `test_supabase.js` (root)
- `scratch.js` (root)
- `scripts/check_listings.js`
- `scripts/check_schema.js`
- `scripts/improve_listings.js`
- `scripts/repair_communities.js`
- `scripts/seed_real_artists.js`
- `scripts/test_artists.js`
- `scripts/test_community.js`

**What's in them:** The actual Supabase project URL (`https://bzdcarenufxayuumlhjt.supabase.co`) and what appears to be a secret key are hardcoded directly in the JS files. None of these files are listed in `.gitignore`.

**Risk:** If these files are pushed to GitHub — even a private repo — the credentials are exposed. Anyone with the service role key has full unrestricted database access, bypassing all RLS policies.

**Fix:**
- Delete `test_supabase.js`, `scratch.js`, and all files in `scripts/` that contain credentials (they were throwaway dev tools).
- If you want to keep the scripts, move credentials to `.env.local` and load them with `dotenv`.
- Add these patterns to `.gitignore`:
  ```
  test_*.js
  scratch.js
  scripts/
  ```

---

### 2. Admin Dashboard Has No Role Check — Any Logged-In User Can Access It

**File:** `src/middleware.ts` and `src/app/admin/actions.ts`

**The problem:** The middleware only checks `if (!session)` — it redirects to `/login` if there's no session, but if there IS a session (i.e. any user who signed up), it lets them through to `/admin`. The `actions.ts` also only checks `if (!session)` — it does not verify the user is an admin.

**In plain terms:** If someone finds your login page at `/login`, creates a Supabase account, and logs in — they can fully access the admin dashboard, approve artists, and deactivate anyone.

**Fix option (simplest):** Hard-code your admin email in the middleware check:

```ts
// In middleware.ts, replace the admin check with:
const ADMIN_EMAIL = 'afsalali8321@gmail.com'
if (request.nextUrl.pathname.startsWith('/admin')) {
  if (!session || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
```

Apply the same check in `actions.ts`:
```ts
if (!session || session.user.email !== 'afsalali8321@gmail.com') {
  throw new Error('Unauthorized')
}
```

---

### 3. `Downloads/` Folder Is Inside the Project — Not in `.gitignore`

**What's there:** The `Downloads/` folder sitting inside `cr8un8/` contains personal documents — CVs, ID scans, bank statements, wedding invitations, and personal photos. It has **45+ sensitive files**.

**Risk:** One accidental `git add .` pushes all of it to GitHub. Even in a private repo this is a serious personal data risk.

**Fix:** Add to `.gitignore` immediately:
```
Downloads/
```
And consider moving the `Downloads` folder out of the project directory entirely. It has no relation to the project.

---

## 🟡 MEDIUM — Fix Before Soft Launch

### 4. "Deactivate Artist" Button Does Nothing

**File:** `src/app/admin/page.tsx` (line 202)

The button exists in the UI and reads "Deactivate Artist", but it has no `onClick` handler. The function `toggleArtistActive` is imported at the top but never called. Afsal will click this button and nothing will happen.

**Fix:** Wire up the button:
```tsx
<button
  onClick={(e) => { e.stopPropagation(); handleDeactivate(artist.id); }}
  ...
>
  Deactivate Artist
</button>
```
And add the handler:
```ts
async function handleDeactivate(id: string) {
  if (!confirm('Deactivate this artist?')) return
  await toggleArtistActive(id, false)
  fetchArtists()
}
```

---

### 5. Community Has Zero Spam Protection

**Files:** `src/components/CommunityFeed.tsx`, `supabase/migrations/002_social_community.sql`

Anyone can post to any community with any name — no login, no rate limit, no honeypot. The RLS policy explicitly says `"Anyone can post" WITH CHECK (true)`. The Community feature is effectively a public open message board with your brand on it.

**Options (pick one for now):**
- Add the same honeypot + time-check used in the Join form to the post form.
- Require a WhatsApp number as "identity" before posting (low friction, deters bots).
- Or hide the Community page from the Navbar until Phase 2 when proper auth is in place (simplest, least risk).

---

### 6. Hardcoded "10+ Artists" Counter on Homepage

**File:** `src/app/page.tsx` (line 51)

The hero section shows `10+` as a static number. The database currently has around 3 artists. Buyers seeing "10+ Artists" and then browsing a nearly empty directory will feel misled.

**Fix:** Either query the real count from Supabase (it's already fetching artists, just use `artists?.length`) or change the copy to something honest like "Growing" or remove the stats block until there are real numbers.

---

### 7. `newsletter.ts` Is Broken — Wrong Client + Misleading Comment

**File:** `src/app/actions/newsletter.ts`

The file has a comment at the top saying `'use client'` (which is wrong for a server action), then uses the **browser client** (`createClient`) instead of the server client. Server Actions must use the server client. Additionally, this function is never called from any UI component — there's no newsletter signup form anywhere.

**Fix:** Either wire up a newsletter signup box to the Footer/Homepage CTA (and fix it to use `'use server'` + `createServerClient`), or delete the file for now.

---

### 8. Orphaned Duplicate Directories in Project Root

**Directories:** `cr8un8-map/` and `cr8un8-social/`

These appear to be old experimental branches that were copied as folders instead of proper Git branches. They contain duplicate versions of components that now exist in `src/`. Having them in the project root is confusing and could cause edits to land in the wrong place.

**Fix:** Delete both directories. Everything useful from them is already merged into `src/`.

---

### 9. Migration 002 Adds Columns Not in the TypeScript Types

**Files:** `supabase/migrations/002_social_community.sql`, `src/types/index.ts`

Migration 002 adds `youtube`, `facebook`, and `website` columns to the `artists` table. None of these appear in the `Artist` TypeScript interface, the CLAUDE.md schema, or any UI component. They exist in the database but are invisible to the application.

**Fix:** Either add them to `src/types/index.ts` (if you plan to use them), or don't add them to the DB until they're actually needed.

---

## 🟢 LOW — Polish Items

### 10. Raw `<img>` Tags Used Everywhere
`next.config.js` has `remotePatterns` configured for `next/image`, but the codebase uses raw `<img>` tags throughout (homepage, artist cards, listing cards, etc.). The config is harmless but misleading — `next/image` optimization is never actually used. Not urgent, but switching to `<Image />` from `next/image` would give you automatic WebP conversion, lazy loading, and faster page loads for free.

### 11. In-Memory Rate Limiter Resets on Cold Starts
The rate limiter in `middleware.ts` uses a JavaScript `Map` in memory. On Vercel, serverless functions can spin up fresh instances, wiping the map. This means the 3-submissions-per-hour limit resets every time a new instance starts. Fine for now at low traffic, but worth knowing.

### 12. Sitemap Doesn't Include Artist/Listing Pages
`src/app/sitemap.ts` only lists 5 static routes. Individual artist pages (`/artists/[id]`) and listing pages are not included. Google can't index them from the sitemap. Consider fetching all approved artist IDs from Supabase in `sitemap.ts` and adding them dynamically.

### 13. Test/Scratch Files in Project Root
`test_supabase.js`, `scratch.js`, `test_listing.js` are loose in the project root. Even after removing credentials, these clutter the repo.

---

## ✅ What's Done Well

These are genuinely good — worth keeping as-is.

- **Database schema and RLS** are clean and correct. Public read only sees approved artists.
- **Component architecture** follows the naming conventions in CLAUDE.md precisely.
- **Server vs Client component split** is correct throughout — data fetching in server components, interactivity in client components.
- **`ArtistOnboardingForm`** has solid bot protection: honeypot field, time-based check, input sanitization (`stripHtml`), and server-side WhatsApp number formatting.
- **`notFound()`** is used correctly on all detail pages to give proper 404s.
- **`revalidate = 60`** on all data pages — good balance of freshness and performance.
- **Middleware rate limiting on `/join`** — a practical spam deterrent for the form endpoint.
- **TypeScript types** are well-defined and used throughout.
- **Tailwind custom color palette** (terracotta/clay/cream) is consistently applied.
- **WhatsApp + Instagram contact logic** is clean and zero-backend as designed.

---

## Priority Action List

| # | Issue | Effort | Do When |
|---|-------|--------|---------|
| 1 | Delete/gitignore files with hardcoded credentials | 5 min | **Right now** |
| 2 | Add `Downloads/` to `.gitignore` | 1 min | **Right now** |
| 3 | Add admin email check to middleware + actions | 10 min | Before inviting anyone to test |
| 4 | Fix "Deactivate Artist" button | 10 min | Before using the admin dashboard |
| 5 | Fix homepage "10+" counter | 5 min | Before launch |
| 6 | Delete `cr8un8-map/` and `cr8un8-social/` | 1 min | Before launch |
| 7 | Hide Community from Navbar or add spam protection | 15 min | Before launch |
| 8 | Fix/delete `newsletter.ts` | 5 min | Soon |
| 9 | Add extra columns to TypeScript types | 10 min | When using them |
| 10 | Dynamic sitemap | 20 min | After first real artists are live |

---

*Report generated from full source review of `src/`, `supabase/migrations/`, `middleware.ts`, `package.json`, and root-level scripts.*
