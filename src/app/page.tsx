// src/app/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import ArtistCard from '@/components/ArtistCard'
import HeroSection from '@/components/HeroSection'
import type { Artist, Category } from '@/types'

export const revalidate = 60 // revalidate every 60s

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
      <CategoryStrip categories={categories || []} />
      <FeaturedArtists artists={artists || []} />
      <HowItWorks />
      <JoinCTA />
    </main>
  )
}


/* ── Category Strip ────────────────────────────────────── */
function CategoryStrip({ categories }: { categories: Category[] }) {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="font-display text-3xl text-ink">Shop by Category</h2>
        <Link href="/listings" className="text-sm text-clay font-medium hover:underline">
          All listings →
        </Link>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/listings?category=${cat.slug}`}
            className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-sand border border-sand-dark
                       hover:border-clay hover:bg-clay-pale transition-all duration-200"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
              {cat.icon}
            </span>
            <span className="text-xs font-medium text-charcoal text-center leading-tight">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ── Featured Artists ──────────────────────────────────── */
function FeaturedArtists({ artists }: { artists: Partial<Artist>[] }) {
  if (!artists.length) return null

  return (
    <section className="py-16 px-4 bg-sand">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl text-ink">Meet the Makers</h2>
            <p className="text-muted mt-1">Talented artists crafting something extraordinary</p>
          </div>
          <Link href="/artists" className="text-sm text-clay font-medium hover:underline hidden sm:block">
            View all artists →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link
            href="/artists"
            className="inline-block px-6 py-2.5 rounded-full border-2 border-clay text-clay text-sm font-medium"
          >
            View all artists
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── How It Works ──────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: '01', title: 'Discover',  body: 'Browse artists by category or find makers near you on the map.' },
    { n: '02', title: 'Connect',   body: 'Reach out directly via WhatsApp or email. No middlemen.' },
    { n: '03', title: 'Collect',   body: 'Get a unique, handcrafted piece made just for you.' },
  ]

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <h2 className="font-display text-3xl text-ink text-center mb-12">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((s) => (
          <div key={s.n} className="text-center">
            <div className="font-display text-6xl text-clay/20 leading-none mb-2">{s.n}</div>
            <h3 className="text-xl font-semibold text-ink mb-2">{s.title}</h3>
            <p className="text-muted leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Join CTA ──────────────────────────────────────────── */
function JoinCTA() {
  return (
    <section className="mx-4 mb-16 rounded-3xl bg-ink text-cream overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #c2440f 0%, transparent 60%), radial-gradient(circle at 80% 50%, #e8601e 0%, transparent 60%)',
        }}
      />
      <div className="relative max-w-3xl mx-auto text-center py-16 px-6">
        <p className="text-clay font-semibold text-sm uppercase tracking-widest mb-3">For Artists</p>
        <h2 className="font-display text-4xl mb-4">Your craft deserves to be found.</h2>
        <p className="text-cream/70 text-lg mb-8 leading-relaxed">
          List your work for free. Connect directly with buyers who appreciate handmade.
          No commission. No algorithms working against you.
        </p>
        <Link
          href="/join"
          className="inline-block px-8 py-4 rounded-full bg-clay text-white font-medium text-lg
                     hover:bg-clay-light transition-colors shadow-xl shadow-clay/30"
        >
          Join CraftersUnited — Free
        </Link>
      </div>
    </section>
  )
}
