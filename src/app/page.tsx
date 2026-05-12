import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import SafeImage from '@/components/SafeImage'
import CategoryIcon from '@/components/CategoryIcon'

export const revalidate = 60

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
      {/* HERO */}
      <section className="relative overflow-hidden bg-clay-pale min-h-[88vh] flex items-center">
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #c2440f 0%, transparent 70%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-clay text-sm font-semibold uppercase tracking-widest mb-4">
              India's local craft marketplace
            </p>
            <h1 className="font-display text-6xl sm:text-7xl text-ink leading-tight mb-6">
              Handmade.<br />
              <span className="text-clay">Heartfelt.</span><br />
              Human.
            </h1>
            <p className="text-charcoal text-lg leading-relaxed mb-8 max-w-md">
              Discover unique art and crafts made by independent artists near you.
              Every piece has a story. Every purchase supports a maker directly.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/artists"
                className="px-6 py-3 rounded-full bg-clay text-white font-medium hover:bg-clay-light transition-colors shadow-lg shadow-clay/20">
                Browse Artists
              </Link>
              <Link href="/map"
                className="px-6 py-3 rounded-full border-2 border-clay text-clay font-medium hover:bg-clay hover:text-white transition-colors">
                🗺 View Map
              </Link>
            </div>
            <div className="flex gap-8 mt-10">
              <div>
                <p className="font-display text-3xl text-clay">{(artists || []).length}+</p>
                <p className="text-xs text-muted uppercase tracking-wide">Artists</p>
              </div>
              <div>
                <p className="font-display text-3xl text-clay">6</p>
                <p className="text-xs text-muted uppercase tracking-wide">Categories</p>
              </div>
              <div>
                <p className="font-display text-3xl text-clay">Kerala</p>
                <p className="text-xs text-muted uppercase tracking-wide">Based In</p>
              </div>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-3 h-[480px]">
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl bg-sand-dark flex-1 flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400" alt="Painting" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl bg-sand h-36 flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400" alt="Pottery" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl bg-sand h-36 flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400" alt="Jewelry" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl bg-sand-dark flex-1 flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400" alt="Handmade crafts" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display text-4xl text-ink">Shop by Category</h2>
          <Link href="/listings" className="text-sm text-clay font-medium hover:underline">All listings →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(categories || []).map((cat: any) => (
            <Link key={cat.slug} href={`/listings?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-sand border border-sand-dark hover:border-clay hover:bg-clay-pale transition-all duration-200">
              <span className="group-hover:scale-110 transition-transform duration-200">
                <CategoryIcon slug={cat.slug} size={44} />
              </span>
              <span className="text-xs font-medium text-charcoal text-center leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED ARTISTS */}
      {(artists || []).length > 0 && (
        <section className="py-16 px-4 bg-sand">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-baseline justify-between mb-8">
              <div>
                <h2 className="font-display text-4xl text-ink">Meet the Makers</h2>
                <p className="text-muted mt-1">Talented artists crafting something extraordinary</p>
              </div>
              <Link href="/artists" className="text-sm text-clay font-medium hover:underline hidden sm:block">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(artists || []).map((artist: any) => (
                <Link key={artist.id} href={`/artists/${artist.id}`}
                  className="group bg-cream rounded-2xl overflow-hidden border border-sand-dark hover:border-clay hover:shadow-lg hover:shadow-clay/10 transition-all duration-300">
                  <div className="relative h-52 bg-sand overflow-hidden">
                    <SafeImage
                      src={artist.photo_url || ''}
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallback={<div className="w-full h-full flex items-center justify-center text-6xl">🎨</div>}
                    />
                    {artist.category && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-cream/90 text-xs font-medium text-clay">
                        {artist.category}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-ink">{artist.name}</h3>
                    <p className="text-sm text-muted mt-0.5">{artist.city}, {artist.state}</p>
                    <p className="text-xs text-clay font-medium mt-3 group-hover:underline">View profile →</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="font-display text-4xl text-ink text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { n: '01', title: 'Discover', body: 'Browse artists by category or find makers near you on the map.' },
            { n: '02', title: 'Connect', body: 'Reach out directly via WhatsApp or email. No middlemen.' },
            { n: '03', title: 'Collect', body: 'Get a unique, handcrafted piece made just for you.' },
          ].map(s => (
            <div key={s.n} className="text-center">
              <div className="font-display text-6xl text-clay/20 leading-none mb-2">{s.n}</div>
              <h3 className="text-xl font-semibold text-ink mb-2">{s.title}</h3>
              <p className="text-muted leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JOIN CTA */}
      <section className="mx-4 mb-16 rounded-3xl bg-ink text-cream overflow-hidden relative">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #c2440f 0%, transparent 60%), radial-gradient(circle at 80% 50%, #e8601e 0%, transparent 60%)' }} />
        <div className="relative max-w-3xl mx-auto text-center py-16 px-6">
          <p className="text-clay font-semibold text-sm uppercase tracking-widest mb-3">For Artists</p>
          <h2 className="font-display text-5xl mb-4">Your craft deserves to be found.</h2>
          <p className="text-cream/70 text-lg mb-8 leading-relaxed">
            List your work for free. Connect directly with buyers. No commission. No algorithms working against you.
          </p>
          <Link href="/join"
            className="inline-block px-8 py-4 rounded-full bg-clay text-white font-medium text-lg hover:bg-clay-light transition-colors">
            Join CraftersUnited — Free
          </Link>
        </div>
      </section>
    </main>
  )
}
