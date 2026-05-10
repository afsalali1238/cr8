// src/app/community/[slug]/page.tsx
// Individual community — post feed + create post form

import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CommunityFeed from '@/components/CommunityFeed'

export const revalidate = 30

export default async function CommunitySlugPage({ params }: { params: { slug: string } }) {
  const supabase = createServerClient()

  const [{ data: community }, { data: posts }] = await Promise.all([
    supabase
      .from('communities')
      .select('*')
      .eq('slug', params.slug)
      .eq('is_active', true)
      .single(),
    supabase
      .from('posts')
      .select('*, comments(count)')
      .eq('is_active', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  if (!community) notFound()

  // Filter posts to this community after fetch
  const communityPosts = (posts || []).filter((p: any) => p.community_id === community.id)

  return (
    <main>
      {/* Header */}
      <section className="bg-clay-pale border-b border-sand-dark px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <Link href="/community" className="text-sm text-clay hover:underline mb-4 inline-block">
            ← All Communities
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{community.icon || '💬'}</span>
            <div>
              <h1 className="font-display text-4xl text-ink">{community.name}</h1>
              <p className="text-muted mt-1">{community.description}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <CommunityFeed community={community} initialPosts={communityPosts} />
      </div>
    </main>
  )
}
