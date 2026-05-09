---
name: build-homepage
description: "Builds the / homepage with hero section, category grid, featured artists carousel, and CTA to join as an artist. Use when creating or updating the homepage."
---

# Skill: Build Homepage

## Success Criterion
Homepage renders: hero headline, 6 category cards, grid of 6 featured artists (from Supabase), "Join as Artist" CTA. Mobile-responsive. No layout shift on load.

## Step-by-Step Plan

### Step 1: Homepage server component
```
→ verify: page renders with real data from Supabase (not placeholder)
```

```tsx
// src/app/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import HeroSection from '@/components/HeroSection'
import CategoryGrid from '@/components/CategoryGrid'
import FeaturedArtists from '@/components/FeaturedArtists'
import JoinCTA from '@/components/JoinCTA'

export default async function HomePage() {
  const supabase = createServerClient()

  const [{ data: artists }, { data: categories }] = await Promise.all([
    supabase
      .from('artists')
      .select('id, name, city, state, category, photo_url')
      .eq('is_approved', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(6),
    supabase.from('categories').select('*').order('id'),
  ])

  return (
    <main>
      <HeroSection />
      <CategoryGrid categories={categories || []} />
      <FeaturedArtists artists={artists || []} />
      <JoinCTA />
    </main>
  )
}
```

### Step 2: HeroSection
```tsx
// src/components/HeroSection.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-amber-50 to-orange-100 py-20 px-4 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
        Discover Handcrafted Art<br />
        <span className="text-orange-600">From Local Makers Near You</span>
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
        CraftersUnited connects buyers with independent artists across India.
        Find unique, personalized pieces made with love.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
          <Link href="/artists">Browse Artists</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/map">View Map</Link>
        </Button>
      </div>
    </section>
  )
}
```

### Step 3: CategoryGrid
```tsx
// src/components/CategoryGrid.tsx
import Link from 'next/link'
import type { Category } from '@/types'

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/artists?category=${cat.slug}`}
            className="flex flex-col items-center p-4 rounded-xl border hover:border-orange-400 hover:bg-orange-50 transition-colors text-center"
          >
            <span className="text-3xl mb-2">{cat.icon}</span>
            <span className="text-sm font-medium text-gray-700">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

### Step 4: FeaturedArtists grid
```tsx
// src/components/FeaturedArtists.tsx
import ArtistCard from './ArtistCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Artist } from '@/types'

export default function FeaturedArtists({ artists }: { artists: Partial<Artist>[] }) {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Featured Artists</h2>
        <p className="text-muted-foreground mb-8">Meet the makers behind the craft</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg">
            <Link href="/artists">View All Artists →</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
```

### Step 5: ArtistCard
```tsx
// src/components/ArtistCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { Artist } from '@/types'

export default function ArtistCard({ artist }: { artist: Partial<Artist> }) {
  return (
    <Link href={`/artists/${artist.id}`} className="block group">
      <div className="rounded-xl overflow-hidden border bg-white hover:shadow-md transition-shadow">
        <div className="relative h-48 bg-gray-100">
          <Image
            src={artist.photo_url || '/placeholder-artist.jpg'}
            alt={artist.name || 'Artist'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900">{artist.name}</h3>
          <p className="text-sm text-muted-foreground">{artist.city}, {artist.state}</p>
          {artist.category && (
            <Badge variant="secondary" className="mt-2 text-xs">{artist.category}</Badge>
          )}
        </div>
      </div>
    </Link>
  )
}
```

### Step 6: JoinCTA
```tsx
// src/components/JoinCTA.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function JoinCTA() {
  return (
    <section className="py-20 px-4 bg-orange-600 text-white text-center">
      <h2 className="text-3xl font-bold mb-4">Are You a Crafter?</h2>
      <p className="text-orange-100 mb-8 max-w-lg mx-auto text-lg">
        List your work for free and connect directly with buyers across India.
        No commissions. No middlemen. Just you and your craft.
      </p>
      <Button asChild size="lg" variant="secondary">
        <Link href="/join">Join as an Artist — It's Free</Link>
      </Button>
    </section>
  )
}
```

## Post-Build Checklist
- [ ] Hero renders with correct copy
- [ ] 6 category cards link to `/artists?category=[slug]`
- [ ] 6 artist cards load from Supabase (not hardcoded)
- [ ] Artist cards link to correct profile pages
- [ ] "View All Artists" button works
- [ ] "Join as an Artist" button works
- [ ] Mobile layout looks correct (single column cards)
- [ ] No layout shift on initial load
