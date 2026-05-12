// src/components/PostDetail.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import SafeImage from './SafeImage'
import { createClient } from '@/lib/supabase/client'

interface Comment {
  id: string
  author_name: string
  author_photo: string | null
  body: string
  created_at: string
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
  created_at: string
  communities?: { name: string; slug: string; icon: string | null }
}

interface Props {
  post: Post
  initialComments: Comment[]
  communitySlug: string
}

export default function PostDetail({ post, initialComments, communitySlug }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [likes, setLikes] = useState(post.like_count)
  const [liked, setLiked] = useState(false)
  const [commentName, setCommentName] = useState('')
  const [commentBody, setCommentBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)

  const supabase = createClient()

  // Like a post — optimistic update, no auth required
  async function handleLike() {
    if (liked) return // prevent double-like per session
    setLiked(true)
    setLikes(l => l + 1)
    await supabase
      .from('posts')
      .update({ like_count: likes + 1 })
      .eq('id', post.id)
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    if (!commentName.trim() || !commentBody.trim()) {
      setCommentError('Name and comment are required.')
      return
    }

    setIsSubmitting(true)
    setCommentError(null)

    try {
      const { data: newComment, error } = await supabase
        .from('comments')
        .insert({
          post_id: post.id,
          author_name: commentName.trim(),
          body: commentBody.trim(),
        })
        .select()
        .single()

      if (error) throw error

      // Update comment count on post
      await supabase
        .from('posts')
        .update({ comment_count: comments.length + 1 })
        .eq('id', post.id)

      setComments([...comments, newComment])
      setCommentBody('')
    } catch (err: any) {
      setCommentError(err.message || 'Failed to post comment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <article>
      {/* Post header */}
      <div className="mb-6">
        <h1 className="font-display text-4xl text-ink mb-3">{post.title}</h1>

        {/* Author + date */}
        <div className="flex items-center gap-3 text-sm text-muted">
          {post.author_photo ? (
            <SafeImage 
              src={post.author_photo} 
              alt={post.author_name}
              className="w-8 h-8 rounded-full object-cover" 
              fallback={<div className="w-8 h-8 rounded-full bg-sand-dark flex items-center justify-center text-sm">🎨</div>}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-sand-dark flex items-center justify-center text-sm">
              🎨
            </div>
          )}
          <div>
            <span className="font-medium text-charcoal">{post.author_name}</span>
            <span className="mx-2">·</span>
            <span>
              {new Date(post.created_at).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Post image */}
      {post.image_url && (
        <div className="rounded-2xl overflow-hidden mb-6 max-h-96 bg-sand">
          <SafeImage 
            src={post.image_url} 
            alt={post.title} 
            className="w-full h-full object-cover" 
            fallback={<div className="w-full h-full flex items-center justify-center text-4xl">🎨</div>}
          />
        </div>
      )}

      {/* Post body */}
      <div className="prose prose-sm max-w-none text-charcoal leading-relaxed mb-8 whitespace-pre-wrap">
        {post.body}
      </div>

      {/* Like + share bar */}
      <div className="flex items-center gap-4 py-4 border-t border-b border-sand-dark mb-8">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            liked
              ? 'bg-red-50 text-red-500 border border-red-200'
              : 'bg-sand border border-sand-dark text-charcoal hover:border-clay hover:text-clay'
          }`}
        >
          {liked ? '❤️' : '🤍'} {likes} {likes === 1 ? 'Like' : 'Likes'}
        </button>

        <span className="text-sm text-muted">
          💬 {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </span>

        {/* Back to community */}
        <Link
          href={`/community/${communitySlug}`}
          className="ml-auto text-sm text-clay hover:underline"
        >
          ← Back to {post.communities?.name || 'Community'}
        </Link>
      </div>

      {/* Comments section */}
      <section>
        <h2 className="font-display text-2xl text-ink mb-5">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h2>

        {/* Existing comments */}
        {comments.length > 0 && (
          <div className="space-y-4 mb-8">
            {comments.map(comment => (
              <div
                key={comment.id}
                className="p-4 rounded-xl bg-sand border border-sand-dark"
              >
                <div className="flex items-center gap-2 mb-2">
                  {comment.author_photo ? (
                    <SafeImage 
                      src={comment.author_photo} 
                      alt={comment.author_name}
                      className="w-6 h-6 rounded-full object-cover" 
                      fallback={<div className="w-6 h-6 rounded-full bg-sand-dark flex items-center justify-center text-xs">🎨</div>}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-sand-dark flex items-center justify-center text-xs">
                      🎨
                    </div>
                  )}
                  <span className="text-sm font-medium text-charcoal">{comment.author_name}</span>
                  <span className="text-xs text-muted">·</span>
                  <span className="text-xs text-muted">
                    {new Date(comment.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short',
                    })}
                  </span>
                </div>
                <p className="text-sm text-charcoal leading-relaxed whitespace-pre-wrap">
                  {comment.body}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Add comment form */}
        <div className="p-5 rounded-2xl bg-cream border border-sand-dark">
          <h3 className="font-semibold text-ink mb-4">Leave a Comment</h3>
          <form onSubmit={handleComment} className="space-y-3">
            <input
              type="text"
              value={commentName}
              onChange={e => setCommentName(e.target.value)}
              placeholder="Your name *"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-sand text-sm
                         focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay/20"
            />
            <textarea
              value={commentBody}
              onChange={e => setCommentBody(e.target.value)}
              placeholder="Write your comment..."
              required
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-sand-dark bg-sand text-sm
                         focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay/20 resize-none"
            />

            {commentError && (
              <p className="text-red-600 text-sm">{commentError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full bg-clay text-white text-sm font-medium
                         hover:bg-clay-light transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </div>
      </section>
    </article>
  )
}
