// src/app/community/new-post/page.tsx
// Create a new post — pick community, write title + body, submit

import { createServerClient } from '@/lib/supabase/server'
import NewPostForm from '@/components/NewPostForm'
import Link from 'next/link'

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: { community?: string }
}) {
  const supabase = createServerClient()
  const { data: communities } = await supabase
    .from('communities')
    .select('id, name, slug, icon')
    .eq('is_active', true)
    .order('name')

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/community" className="text-sm text-clay hover:underline mb-6 inline-block">
        ← Back to Community
      </Link>
      <h1 className="font-display text-4xl text-ink mb-2">Start a Discussion</h1>
      <p className="text-muted mb-8">
        Share your work, ask a question, or start a conversation with the community.
      </p>
      <NewPostForm
        communities={communities || []}
        defaultCommunitySlug={searchParams.community}
      />
    </main>
  )
}
