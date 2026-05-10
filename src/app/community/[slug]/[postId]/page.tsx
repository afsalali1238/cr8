// src/app/community/[slug]/[postId]/page.tsx
// Single post detail page with comments

import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PostDetail from '@/components/PostDetail'

export const revalidate = 0 // always fresh — comments need to be live

export default async function PostPage({
  params,
}: {
  params: { slug: string; postId: string }
}) {
  const supabase = createServerClient()

  const [{ data: community }, { data: post }, { data: comments }] = await Promise.all([
    supabase
      .from('communities')
      .select('id, name, slug, icon')
      .eq('slug', params.slug)
      .single(),
    supabase
      .from('posts')
      .select('*, communities(name, slug, icon)')
      .eq('id', params.postId)
      .eq('is_active', true)
      .single(),
    supabase
      .from('comments')
      .select('*')
      .eq('post_id', params.postId)
      .eq('is_active', true)
      .order('created_at', { ascending: true }),
  ])

  if (!post || !community) notFound()

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/community" className="hover:text-clay transition-colors">Community</Link>
        <span>›</span>
        <Link href={`/community/${params.slug}`} className="hover:text-clay transition-colors">
          {community.icon} {community.name}
        </Link>
      </div>

      <PostDetail post={post} initialComments={comments || []} communitySlug={params.slug} />
    </main>
  )
}
