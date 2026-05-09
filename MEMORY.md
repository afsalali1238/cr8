# MEMORY.md — CraftersUnited Project State

> This file is the agent's persistent memory. Read it at the start of every session.
> Update it at the end of every session with new decisions, progress, and blockers.
> Never delete entries — append only (mark old decisions as superseded if changed).

---

## Project Status

**Current Phase:** Phase 1 — MVP (Buyer ↔ Seller Connection, No Payments)
**Build Status:** ✅ Phase 1 MVP Complete & High-Fidelity Polished
**Domain:** cr8un8.com (configured)
**Last Updated:** 2026-05-09
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

---

## Pending Decisions (Agent Must Ask Before Proceeding)

- [ ] Phase 2: User Authentication for Buyers (Favorites/Saves)
- [ ] Phase 2: In-app Messaging for inquiry tracking
- [ ] Phase 2: Artist Dashboard (Self-service listing management)
