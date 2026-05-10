// src/app/community/page.tsx
// Community hub — lists all communities with post counts
// Links to individual community pages

import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const revalidate = 60

export default async function CommunityPage() {
  const supabase = createServerClient()

  const [{ data: communities }, { data: recentPosts }] = await Promise.all([
    supabase
      .from('communities')
      .select('*, posts(count)')
      .eq('is_active', true)
      .order('member_count', { ascending: false }),
    supabase
      .from('posts')
      .select('id, title, author_name, author_photo, created_at, community_id, communities(name, slug, icon)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  return (
    <main>
      {/* Header */}
      <section className="bg-clay-pale border-b border-sand-dark px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-clay text-sm font-semibold uppercase tracking-widest mb-2">
            CraftersUnited
          </p>
          <h1 className="font-display text-5xl text-ink mb-3">Community</h1>
          <p className="text-charcoal text-lg max-w-xl">
            Connect with fellow artists. Share your work, ask questions, find collaborators.
          </p>
          <Link
            href="/community/new-post"
            className="mt-6 inline-block px-6 py-3 rounded-full bg-clay text-white font-medium hover:bg-clay-light transition-colors"
          >
            + Start a Discussion
          </Link>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">

        {/* Communities grid */}
        <div className="lg:col-span-2">
          <h2 className="font-display text-3xl text-ink mb-5">Communities</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {(communities || []).map((community: any) => {
              const postCount = community.posts?.[0]?.count || 0
              return (
                <Link
                  key={community.id}
                  href={`/community/${community.slug}`}
                  className="group p-5 rounded-2xl bg-cream border border-sand-dark
                             hover:border-clay hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{community.icon || '💬'}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-ink group-hover:text-clay transition-colors">
                        {community.name}
                      </h3>
                      <p className="text-sm text-muted mt-1 line-clamp-2">
                        {community.description}
                      </p>
                      <p className="text-xs text-clay font-medium mt-2">
                        {postCount} post{postCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent activity sidebar */}
        <div>
          <h2 className="font-display text-3xl text-ink mb-5">Recent Posts</h2>
          <div className="space-y-3">
            {(recentPosts || []).length === 0 ? (
              <div className="p-5 rounded-2xl bg-sand border border-sand-dark text-center">
                <p className="text-muted text-sm">No posts yet.</p>
                <Link href="/community/new-post" className="text-clay text-sm font-medium mt-2 inline-block">
                  Be the first to post →
                </Link>
              </div>
            ) : (
              (recentPosts || []).map((post: any) => (
                <Link
                  key={post.id}
                  href={`/community/${post.communities?.slug}/${post.id}`}
                  className="block p-4 rounded-xl bg-cream border border-sand-dark
                             hover:border-clay transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {post.author_photo ? (
                      <img src={post.author_photo} alt={post.author_name}
                        className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-sand-dark flex items-center justify-center text-xs">
                        🎨
                      </div>
                    )}
                    <span className="text-xs text-muted">{post.author_name}</span>
                    <span className="text-xs text-muted">·</span>
                    <span className="text-xs text-clay">{post.communities?.icon} {post.communities?.name}</span>
                  </div>
                  <p className="text-sm font-medium text-ink line-clamp-2">{post.title}</p>
                  <p className="text-xs text-muted mt-1">
                    {new Date(post.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short'
                    })}
                  </p>
                </Link>
              ))
            )}
          </div>

          {/* CTA for artists */}
          <div className="mt-6 p-5 rounded-2xl bg-ink text-cream">
            <p className="font-display text-2xl mb-2">Are you an artist?</p>
            <p className="text-cream/70 text-sm mb-4">
              Join CraftersUnited to connect with other makers and share your work.
            </p>
            <Link href="/join"
              className="block text-center px-4 py-2.5 rounded-full bg-clay text-white text-sm font-medium hover:bg-clay-light transition-colors">
              Join as Artist
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
