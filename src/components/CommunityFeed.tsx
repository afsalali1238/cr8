// src/components/CommunityFeed.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import SafeImage from './SafeImage'
import { createClient } from '@/lib/supabase/client'

interface Community {
  id: string
  name: string
  slug: string
  icon: string | null
}

interface Post {
  id: string
  title: string
  body: string
  author_name: string
  author_photo: string | null
  image_url: string | null
  like_count: number
  comment_count: number
  is_pinned: boolean
  created_at: string
  comments?: { count: number }[]
}

interface Props {
  community: Community
  initialPosts: Post[]
}

export default function CommunityFeed({ community, initialPosts }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !body.trim() || !authorName.trim()) {
      setFormError('Name, title and message are all required.')
      return
    }

    setIsSubmitting(true)
    setFormError(null)

    try {
      // Optional image upload
      let image_url = null
      if (imageFile) {
        const ext = imageFile.name.split('.').pop()
        const path = `posts/${Date.now()}.${ext}`
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('listing-images')
          .upload(path, imageFile)
        if (uploadErr) throw uploadErr
        image_url = supabase.storage.from('listing-images').getPublicUrl(uploadData.path).data.publicUrl
      }

      const { data: newPost, error: insertErr } = await supabase
        .from('posts')
        .insert({
          community_id: community.id,
          title: title.trim(),
          body: body.trim(),
          author_name: authorName.trim(),
          image_url,
          like_count: 0,
          comment_count: 0,
        })
        .select()
        .single()

      if (insertErr) throw insertErr

      // Optimistically add to feed
      setPosts([newPost, ...posts])
      setTitle('')
      setBody('')
      setAuthorName('')
      setImageFile(null)
      setShowForm(false)

    } catch (err: any) {
      setFormError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Action bar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted text-sm">
          {posts.length} post{posts.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 rounded-full bg-clay text-white text-sm font-medium
                     hover:bg-clay-light transition-colors"
        >
          {showForm ? '✕ Cancel' : '+ New Post'}
        </button>
      </div>

      {/* Inline create form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 rounded-2xl bg-sand border border-sand-dark space-y-4"
        >
          <h3 className="font-semibold text-ink text-lg">
            Post in {community.icon} {community.name}
          </h3>

          <div>
            <label className="block text-xs font-medium text-charcoal mb-1.5 uppercase tracking-wide">
              Your Name *
            </label>
            <input
              type="text"
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              placeholder="e.g. Priya from Kochi"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-cream text-sm
                         focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal mb-1.5 uppercase tracking-wide">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What's your post about?"
              required
              maxLength={120}
              className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-cream text-sm
                         focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal mb-1.5 uppercase tracking-wide">
              Message *
            </label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Share your thoughts, work, questions..."
              required
              rows={5}
              className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-cream text-sm
                         focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay/20 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal mb-1.5 uppercase tracking-wide">
              Image (optional)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={e => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-muted file:mr-3 file:py-1.5 file:px-3
                         file:rounded-full file:border-0 file:text-xs file:font-medium
                         file:bg-clay-pale file:text-clay hover:file:bg-clay/10"
            />
          </div>

          {formError && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {formError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-full bg-clay text-white font-medium text-sm
                       hover:bg-clay-light transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post to Community'}
          </button>
        </form>
      )}

      {/* Posts feed */}
      {posts.length === 0 ? (
        <div className="text-center py-16 bg-sand rounded-2xl border border-sand-dark">
          <p className="text-4xl mb-3">{community.icon || '💬'}</p>
          <p className="font-medium text-charcoal">No posts yet in {community.name}</p>
          <p className="text-muted text-sm mt-1">Be the first to start a conversation!</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 px-5 py-2.5 rounded-full bg-clay text-white text-sm font-medium"
          >
            Start Discussion
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => {
            const commentCount = post.comments?.[0]?.count ?? post.comment_count ?? 0
            return (
              <Link
                key={post.id}
                href={`/community/${community.slug}/${post.id}`}
                className="group block p-5 rounded-2xl bg-cream border border-sand-dark
                           hover:border-clay hover:shadow-md transition-all duration-200"
              >
                {/* Pinned badge */}
                {post.is_pinned && (
                  <span className="inline-block mb-2 px-2.5 py-0.5 rounded-full bg-clay-pale
                                   text-clay text-xs font-medium border border-clay/20">
                    📌 Pinned
                  </span>
                )}

                {/* Post image */}
                {post.image_url && (
                  <div className="rounded-xl overflow-hidden h-48 mb-3 bg-sand">
                    <SafeImage
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallback={<div className="w-full h-full flex items-center justify-center text-4xl">🎨</div>}
                    />
                  </div>
                )}

                <h3 className="font-semibold text-ink group-hover:text-clay transition-colors text-base mb-1">
                  {post.title}
                </h3>
                <p className="text-sm text-charcoal line-clamp-2 leading-relaxed mb-3">
                  {post.body}
                </p>

                {/* Meta row */}
                <div className="flex items-center gap-3 text-xs text-muted">
                  <div className="flex items-center gap-1.5">
                    {post.author_photo ? (
                      <SafeImage 
                        src={post.author_photo} 
                        alt={post.author_name}
                        className="w-5 h-5 rounded-full object-cover" 
                        fallback={<div className="w-5 h-5 rounded-full bg-sand-dark flex items-center justify-center text-[10px]">🎨</div>}
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-sand-dark flex items-center justify-center text-[10px]">
                        🎨
                      </div>
                    )}
                    <span className="font-medium text-charcoal">{post.author_name}</span>
                  </div>
                  <span>·</span>
                  <span>
                    {new Date(post.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </span>
                  <span>·</span>
                  <span>💬 {commentCount} comment{commentCount !== 1 ? 's' : ''}</span>
                  {post.like_count > 0 && (
                    <>
                      <span>·</span>
                      <span>❤️ {post.like_count}</span>
                    </>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
