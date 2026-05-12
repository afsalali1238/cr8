import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import CategoryIcon from '@/components/CategoryIcon'
import FeaturedMakersGrid from '@/components/FeaturedMakersGrid'
import type { Category } from '@/types'

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

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden min-h-[92vh] flex items-center"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 80% 50%, #F2DDD1 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 10% 80%, #FBF3DC 0%, transparent 60%),
            #F9F3EC
          `,
        }}
      >
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{ backgroundImage: 'radial-gradient(circle, #E8D5C0 1px, transparent 1px)', backgroundSize: '48px 48px' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-28 grid md:grid-cols-2 gap-16 items-center w-full z-10">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-clay-pale rounded-full px-4 py-1.5 mb-7">
              <span className="text-base">🇮🇳</span>
              <span className="text-xs font-bold text-clay uppercase tracking-widest">Made in India · By Hand</span>
            </div>

            <h1 className="font-display text-6xl sm:text-7xl text-ink leading-[1.05] mb-6">
              Handmade<br />Stories,<br />
              <em className="text-clay not-italic">Direct to You</em>
            </h1>

            <p className="text-charcoal text-lg leading-relaxed mb-10 max-w-md">
              Discover unique handcrafted goods from talented makers in your city.
              No algorithms. No middlemen. No fees. Just craft and the people who make it.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link
                href="/artists"
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-clay text-cream font-bold text-base
                           hover:bg-clay-dark transition-colors shadow-lg shadow-clay/25"
              >
                Browse Makers
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link
                href="/join"
                className="flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-ink text-ink font-bold text-base hover:bg-ink hover:text-cream transition-colors"
              >
                Join as Artist
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-10 flex-wrap">
              {[
                { v: `${(artists || []).length}+`, l: 'Active Makers' },
                { v: '₹0',                          l: 'Platform Fee'  },
                { v: 'Kerala',                       l: 'Based In'      },
              ].map(s => (
                <div key={s.l}>
                  <p className="font-display text-3xl text-clay font-bold">{s.v}</p>
                  <p className="text-xs text-muted uppercase tracking-widest mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>

            {/* Mobile image strip */}
            <div className="flex gap-3 overflow-x-auto mt-8 md:hidden pb-2 -mx-4 px-4 scrollbar-hide">
              <img src="https://images.unsplash.com/photo-1534531173927-aeb928db54f7?w=400" alt="Handcraft" className="h-36 w-44 flex-shrink-0 rounded-2xl object-cover" />
              <img src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400" alt="Pottery"   className="h-36 w-44 flex-shrink-0 rounded-2xl object-cover" />
              <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400" alt="Jewelry"   className="h-36 w-44 flex-shrink-0 rounded-2xl object-cover" />
            </div>
          </div>

          {/* Right — image collage */}
          <div className="hidden md:block relative h-[520px]">
            {/* Main image */}
            <div className="absolute top-0 right-0 w-3/4 h-[70%] rounded-2xl overflow-hidden shadow-2xl shadow-ink/20">
              <img src="https://images.unsplash.com/photo-1534531173927-aeb928db54f7?w=700&h=500&fit=crop&q=80"
                alt="Handcrafted" className="w-full h-full object-cover" />
            </div>
            {/* Secondary image */}
            <div className="absolute bottom-8 left-0 w-[52%] h-[48%] rounded-2xl overflow-hidden shadow-xl shadow-ink/15"
              style={{ border: '4px solid #F9F3EC' }}>
              <img src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=350&fit=crop&q=80"
                alt="Pottery" className="w-full h-full object-cover" />
            </div>
            {/* Floating "Latest Sale" card */}
            <div className="absolute top-[38%] left-[18%] bg-cream rounded-xl px-4 py-3 shadow-xl border border-sand-dark z-10">
              <p className="text-[10px] font-bold text-clay uppercase tracking-wider">Latest Sale</p>
              <p className="font-display text-sm font-bold text-ink mt-1">Resin Art · ₹1,200</p>
              <p className="text-[11px] text-muted mt-0.5">Meera R. · Kochi · 2h ago</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ──────────────────────────────────────────── */}
      <div className="bg-cream border-t border-b border-sand-dark">
        <div className="max-w-7xl mx-auto px-4 py-5 flex justify-center gap-14 flex-wrap">
          {[
            { icon: '🛡️', label: 'Zero Commission',  sub: 'Makers keep 100%'        },
            { icon: '💬', label: 'Direct WhatsApp',   sub: 'Chat with the maker'     },
            { icon: '📍', label: 'Local Discovery',   sub: 'Find talent near you'    },
          ].map(({ icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-clay-pale flex items-center justify-center text-lg flex-shrink-0">
                {icon}
              </div>
              <div>
                <p className="text-sm font-bold text-ink">{label}</p>
                <p className="text-xs text-muted">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ─────────────────────────────────────────── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="font-display text-4xl text-ink">Explore by Craft</h2>
            <p className="text-muted text-sm mt-1">Six categories, thousands of one-of-a-kind pieces</p>
          </div>
          <Link href="/listings" className="text-sm text-clay font-semibold hover:underline flex items-center gap-1">
            All listings
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(categories || []).map((cat: Category) => (
            <Link key={cat.slug} href={`/listings?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-sand border border-sand-dark
                         hover:border-clay hover:bg-clay-pale hover:-translate-y-1 hover:shadow-lg hover:shadow-clay/10
                         transition-all duration-200">
              <span className="group-hover:scale-110 transition-transform duration-200">
                <CategoryIcon slug={cat.slug} size={44} />
              </span>
              <span className="text-xs font-semibold text-charcoal text-center leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED MAKERS ────────────────────────────────────── */}
      {(artists || []).length > 0 && (
        <section className="py-16 px-4 bg-sand">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-baseline justify-between mb-8">
              <div>
                <h2 className="font-display text-4xl text-ink">Featured Makers</h2>
                <p className="text-muted text-sm mt-1">Talented artisans selling right now — hover to connect</p>
              </div>
              <Link href="/artists" className="text-sm text-clay font-semibold hover:underline hidden sm:flex items-center gap-1">
                View all
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              </Link>
            </div>
            <FeaturedMakersGrid artists={artists || []} />
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl text-ink mb-3">How It Works</h2>
          <p className="text-muted text-base max-w-sm mx-auto">Two journeys, three steps. Simple, direct, fee-free.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              n: '01', emoji: '🔍', title: 'Discover',
              buyer: 'Browse a curated feed of makers near you — no algorithm, no ads.',
              maker: 'List your work in minutes. Your craft, your profile, your story.',
            },
            {
              n: '02', emoji: '💬', title: 'Connect',
              buyer: 'Message the maker directly on WhatsApp. Ask questions, request customs.',
              maker: 'Chat with interested buyers. No platform fees, no middleman.',
            },
            {
              n: '03', emoji: '🤝', title: 'Support',
              buyer: 'Pay directly. Own a piece of someone\'s story — not a factory\'s.',
              maker: 'Receive payment straight to your account. Keep every rupee.',
            },
          ].map(step => (
            <div key={step.n} className="bg-cream rounded-2xl p-9 border border-sand-dark relative overflow-hidden">
              {/* Watermark number */}
              <div className="absolute top-0 right-4 font-display text-8xl font-bold text-clay-pale leading-none select-none">
                {step.n}
              </div>
              <div className="relative z-10">
                <div className="text-4xl mb-4">{step.emoji}</div>
                <h3 className="font-display text-2xl font-bold text-ink mb-6">{step.title}</h3>
                <div className="mb-4">
                  <p className="text-[10px] font-bold text-clay uppercase tracking-widest mb-1.5">For Buyers</p>
                  <p className="text-sm text-charcoal leading-relaxed">{step.buyer}</p>
                </div>
                <div className="border-t border-sand-dark pt-4">
                  <p className="text-[10px] font-bold text-sage uppercase tracking-widest mb-1.5">For Makers</p>
                  <p className="text-sm text-charcoal leading-relaxed">{step.maker}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAKER STORY ────────────────────────────────────────── */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #1C0D04 0%, #3A1C0C 100%)' }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-clay text-xs font-bold tracking-[0.18em] uppercase mb-5">Maker Story · Bangalore</p>
            <blockquote
              className="font-display text-3xl font-bold text-cream leading-snug mb-6"
              style={{ borderLeft: '4px solid #B5603A', paddingLeft: '1.5rem' }}
            >
              "I was gifting these to friends for free. cr8un8 showed me there was a real market."
            </blockquote>
            <p className="text-base leading-relaxed mb-9" style={{ color: '#C8A898' }}>
              Priya started customising shoes as a weekend hobby. Three months after joining CraftersUnited,
              she's sold 24 pairs — with zero platform fees and buyers she now calls regulars.
            </p>
            <div className="flex gap-10">
              {[{ v: '24', l: 'Pairs Sold' }, { v: '₹0', l: 'Fees Paid' }, { v: '3mo', l: 'To First Sale' }].map(s => (
                <div key={s.l}>
                  <p className="font-display text-3xl font-bold text-clay">{s.v}</p>
                  <p className="text-xs uppercase tracking-wider mt-1" style={{ color: '#C8A898' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden h-80 shadow-2xl" style={{ border: '3px solid #8F4628' }}>
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=360&fit=crop&q=80"
              alt="Maker story"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────── */}
      <section className="py-20 px-4" style={{ background: '#F9F3EC' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl text-ink text-center mb-10">From the Community</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: 'I wanted something unique for my home, not another factory piece. Finding the maker on cr8un8 felt like discovering a local secret — and WhatsApp made it feel like buying from a friend.',
                name: 'Rohit K.',
                loc: 'Mumbai',
                role: 'Buyer',
              },
              {
                q: 'I posted my ceramics on Instagram for 8 months. Not a single sale. Within two weeks on cr8un8, I had my first three orders. The local discovery actually works.',
                name: 'Arjun N.',
                loc: 'Kochi',
                role: 'Ceramic Maker',
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-cream rounded-2xl p-8 border border-sand-dark"
                style={{ borderLeft: '4px solid #B5603A' }}
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="#C49A3C"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <p className="font-display text-base text-charcoal leading-relaxed mb-6 italic">"{t.q}"</p>
                <div>
                  <p className="font-semibold text-ink text-sm">{t.name} · {t.loc}</p>
                  <p className="text-xs text-clay font-semibold mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-clay-pale border-t border-sand-dark text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-display text-5xl text-ink leading-tight mb-4">
            Own Something<br />
            <em className="text-clay not-italic">Made by Hand</em>
          </h2>
          <p className="text-charcoal text-base leading-relaxed mb-10 max-w-md mx-auto">
            Whether you're buying your first handmade piece or listing your first craft — welcome. This is your community.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/listings"
              className="px-10 py-4 rounded-xl bg-clay text-cream font-bold text-base
                         hover:bg-clay-dark transition-colors shadow-lg shadow-clay/25"
            >
              Start Shopping
            </Link>
            <Link
              href="/join"
              className="px-10 py-4 rounded-xl bg-ink text-cream font-bold text-base
                         hover:bg-charcoal transition-colors"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
