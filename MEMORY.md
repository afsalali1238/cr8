# MEMORY.md — CraftersUnited Project State

> This file is the agent's persistent memory. Read it at the start of every session.
> Update it at the end of every session with new decisions, progress, and blockers.
> Never delete entries — append only (mark old decisions as superseded if changed).

---

## Project Status

**Current Phase:** Phase 1 — MVP (Buyer ↔ Seller Connection, No Payments)
**Build Status:** ✅ Design upgrade committed (`556e859`) — push pending
**Domain:** cr8un8.com (configured)
**Last Updated:** 2026-05-12
**Active Sprint Goal:** Soft launch with premium polish

---

## Infrastructure Checklist

- [x] Supabase project created
- [x] Database schema migrated (artists, listings, categories)
- [x] Seed data: 6 categories inserted
- [x] Supabase Storage bucket created (`artist-images`, `listing-images`)
- [x] RLS policies applied
- [x] GitHub repo created (`afsal/cr8un8`)
- [x] Vercel project connected to GitHub
- [x] `cr8un8.com` domain pointed to Vercel
- [x] `.env.local` configured with Supabase keys
- [x] Realistic content seeded (3 artists: Aarav, Meera, Zubair)
- [x] All Phase 1 pages built and high-fidelity verified
- [x] Homepage live at cr8un8.com
- [x] Framer Motion animations integrated
- [x] Skeleton Loading states implemented
- [x] Dynamic SEO Meta tags for all routes
- [x] Custom Favicon and Branding icons

---

## Architectural Decisions (ADR Log)

### ADR-001: No payments in Phase 1
**Date:** Project start
**Decision:** Skip all payment infrastructure. Contact via WhatsApp + Instagram only.
**Reason:** Fastest path to connecting buyers and sellers. Validate demand before complexity.
**Status:** Active

### ADR-002: Leaflet + OpenStreetMap instead of Google Maps
**Date:** Project start
**Decision:** Use Leaflet.js with OpenStreetMap tiles.
**Reason:** Google Maps requires billing setup and API key. Leaflet is fully free, no key needed.
**Status:** Active (Superseded by Custom Terracotta Markers)

### ADR-003: Supabase for all backend
**Date:** Project start
**Decision:** Supabase handles DB, Auth, and Storage. No separate backend server.
**Status:** Active

### ADR-004: Artist onboarding = self-serve form + admin approval
**Date:** Project start
**Decision:** Artists fill a form at `/join`. Afsal reviews via a custom Admin Dashboard.
**Status:** Active

### ADR-005: Contact method = WhatsApp + Instagram
**Date:** Updated Session 2
**Decision:** Artist profiles show WhatsApp + Instagram contact buttons.
**Status:** Active

### ADR-009: Animation Engine = Framer Motion
**Date:** Session 2
**Decision:** Use Framer Motion for entrance animations, card hovers, and mobile menu transitions.
**Reason:** Premium feel, 60fps performance, declarative API.
**Status:** Active

### ADR-010: Perceived Performance = Skeleton Loading
**Date:** Session 2
**Decision:** Implement shimmer skeleton placeholders for all async grids and detail views.
**Reason:** Modern aesthetic, eliminates layout shifts (CLS), feels "instant".
**Status:** Active

---

## Business Context (Agent Must Know)

- **Target users:** Handcraft artists in Kerala/Karnataka initially, all India eventually
- **Differentiator:** Location-based discovery + community, not just listings
- **Revenue model (Phase 2+):** Commission on sales, featured listings
- **Brand Essence:** "Heartfelt, Human, Handmade." Terracotta / Sand / Ink palette.

---

## Content Decisions

### Category list (final)
1. Art & Crafts 🎨
2. Home Décor 🏠
3. Collectibles & Antiques 🏺
4. Personalized Items ✨
5. Handmade Jewellery 💍
6. Handmade Clothing 👗

---

## Session Log

### Session 1 — Supabase Setup (2026-05-08)
- DB Schema, RLS, Storage Buckets configured.
- Initial project structure created.

### Session 2 — High-Fidelity MVP (2026-05-08)
- **Feature Completion**: Search, Filters, Map Discovery, Join Form, Admin Dash.
- **Premium Design**: Terracotta branding, Custom Logo, HeroSection redesign.
- **Motion & Interaction**: Framer Motion entrance/hover effects, Mobile Menu overhaul.
- **Performance & SEO**: Skeleton Loading, Dynamic Meta Tags, Custom Map Markers.
- **Content Seeding**: 3 high-quality artist profiles with generated assets.
- **Verification**: Clean `npm run build` success across 10 routes.

### Session 3 — Final Wiring & Tailwind Fixes (2026-05-09)
- **Wiring & Fixes**: Fixed Tailwind CSS missing config (`postcss.config.js`), fixed CSS variables/globals layout, fully resolved prerendering errors.
- **Completion**: Manually verified all 8 routes render correctly with zero errors.

### Session 5 — Design Upgrade from Master Brief (2026-05-12)
- **Design tokens**: Updated to master brief palette — terracotta `#B5603A`, Playfair Display headings, gold `#C49A3C`, sage `#6B8061`, footer bg `#1C0D04`
- **Navbar**: Transparent on homepage hero, goes solid/blurred on scroll — matches `cr8un8_final.jsx` spec
- **Homepage (page.tsx)**: Added trust bar, floating "Latest Sale" hero card, dual buyer/maker "How It Works", Maker Story dark banner, Testimonials section, Final CTA section
- **FeaturedMakersGrid.tsx** (new): Client component with WhatsApp slide-up CTA, wishlist heart, verified shield badge, hover animations
- **Footer**: 5-column layout — Brand, Explore, For Makers, Newsletter
- **Mass file repair**: Fixed 9 truncated components + 4 pages + 3 config files (all had missing closing tags from prior null-byte rewrites)
- **Commit**: `556e859` — 23 files, 0 null bytes, tsc --noEmit clean
- **Push**: Pending user running `git push origin main` from Windows terminal

### Session 4 — Realism, Documentation & Performance (2026-05-10)
- **Realism Overhaul**: Replaced fake artist seeds with realistic Indian artisan profiles (Anita Nair, Vikram Sethi, Sanya Kapoor) featuring professional bios and Unsplash photography.
- **Product Polish**: Updated hero image collage with real photos. Improved listing descriptions and images for a premium marketplace feel.
- **Robustness**: Fixed critical "Glitch" where detail pages would crash on data mismatches. Hardened artist and listing detail views.
- **Documentation**: Added a comprehensive `README.md` for project clarity.
- **Performance & Housekeeping**: Moved `dotenv` to `devDependencies`. Replaced `framer-motion` with CSS transitions in several components to reduce bundle weight.
- **Git History**: Transitioned from bulk-dumping to logical, individual commits.
- **Blocker**: Identified missing `communities` table in database; shared SQL fix for manual execution in Supabase.

---

## Pending Decisions (Agent Must Ask Before Proceeding)

- [ ] Phase 2: User Authentication for Buyers (Favorites/Saves)
- [ ] Phase 2: In-app Messaging for inquiry tracking
- [ ] Phase 2: Artist Dashboard (Self-service listing management)
- [ ] Phase 2: Community Feature Activation (pending SQL table creation)
