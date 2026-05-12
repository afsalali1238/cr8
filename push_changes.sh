#!/bin/bash
# Run this from your terminal inside the cr8un8 folder
# It commits all the design upgrade changes and pushes to GitHub

cd "$(dirname "$0")"

# Remove stale lock files if they exist
rm -f .git/HEAD.lock .git/index.lock .git/ORIG_HEAD.lock 2>/dev/null

# Restore the git index from HEAD (fixes the empty index issue)
git read-tree HEAD

# Stage all changed project files
git add \
  tailwind.config.ts \
  next.config.js \
  src/middleware.ts \
  src/app/globals.css \
  src/app/layout.tsx \
  src/app/page.tsx \
  src/app/actions/newsletter.ts \
  src/app/admin/actions.ts \
  src/app/admin/page.tsx \
  "src/app/artists/[id]/page.tsx" \
  "src/app/listings/[id]/page.tsx" \
  src/components/Navbar.tsx \
  src/components/Footer.tsx \
  src/components/ArtistCard.tsx \
  src/components/ArtistMapFull.tsx \
  src/components/ArtistOnboardingForm.tsx \
  src/components/ArtistsClientPage.tsx \
  src/components/CategoryIcon.tsx \
  src/components/CommunityFeed.tsx \
  src/components/FeaturedMakersGrid.tsx \
  src/components/ListingCard.tsx \
  src/components/ListingsClientPage.tsx \
  src/components/PostDetail.tsx

# Commit
git commit -m "feat: design upgrade from master brief

- Design tokens: terracotta #B5603A, Playfair Display headings, warm palette
- Navbar: transparent on homepage hero, solid on scroll
- Homepage: trust bar, floating Latest Sale card, buyer/maker How It Works,
  Maker Story section, Testimonials, Final CTA
- FeaturedMakersGrid: WhatsApp slide-up CTA, wishlist button, verified badge
- Footer: 5-column layout
- Fixed all pre-existing truncated/corrupted files (TypeScript clean)"

# Push
git push origin main

echo "Done! Check GitHub Actions for build status."
