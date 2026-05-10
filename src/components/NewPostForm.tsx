// src/components/NewPostForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Community {
  id: string
  name: string
  slug: string
  icon: string | null
}

interface Props {
  communities: Community[]
  defaultCommunitySlug?: string
}

export default function NewPostForm({ communities, defaultCommunitySlug }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const defaultCommunity = communities.find(c => c.slug === defaultCommunitySlug) || communities[0]

  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(defaultCommunity || null)
  const [authorName, setAuthorName] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedCommunity) { setError('Please select a community.'); return }
    if (!authorName.trim())  { setError('Your name is required.'); return }
    if (!title.trim())       { setError('Post title is required.'); return }
    if (!body.trim())        { setError('Post message is required.'); return }

    setIsSubmitting(true)
    setError(null)

    try {
      let image_url = null
      if (imageFile) {
        const ext = imageFile.name.split('.').pop()
        const path = `posts/${Date.now()}.${ext}`
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('listing-images')
          .upload(path, imageFile)
        if (uploadErr) throw uploadErr
        image_url = supabase.storage
          .from('listing-images')
          .getPublicUrl(uploadData.path).data.publicUrl
      }

      const { data: newPost, error: insertErr } = await supabase
        .from('posts')
        .insert({
          community_id: selectedCommunity.id,
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

      // Navigate to the new post
      router.push(`/community/${selectedCommunity.slug}/${newPost.id}`)
      router.refresh()

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Community picker */}
      <div>
        <label className="block text-xs font-semibold text-charcoal uppercase tracking-wide mb-2">
          Community *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {communities.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCommunity(c)}
              className={`p-3 rounded-xl border text-left text-sm transition-all ${
                selectedCommunity?.id === c.id
                  ? 'border-clay bg-clay-pale text-clay font-medium'
                  : 'border-sand-dark bg-sand text-charcoal hover:border-clay/50'
              }`}
            >
              <span className="text-lg mr-1">{c.icon}</span> {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Your name */}
      <div>
        <label className="block text-xs font-semibold text-charcoal uppercase tracking-wide mb-1.5">
          Your Name *
        </label>
        <input
          type="text"
          value={authorName}
          onChange={e => setAuthorName(e.target.value)}
          placeholder="e.g. Rahul from Thrissur"
          required
          className="w-full px-4 py-3 rounded-xl border border-sand-dark bg-sand text-sm
                     focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay/20"
        />
      </div>

      {/* Post title */}
      <div>
        <label className="block text-xs font-semibold text-charcoal uppercase tracking-wide mb-1.5">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Give your post a clear title"
          required
          maxLength={120}
          className="w-full px-4 py-3 rounded-xl border border-sand-dark bg-sand text-sm
                     focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay/20"
        />
        <p className="text-xs text-muted mt-1 text-right">{title.length}/120</p>
      </div>

      {/* Post body */}
      <div>
        <label className="block text-xs font-semibold text-charcoal uppercase tracking-wide mb-1.5">
          Message *
        </label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Share your work, ask a question, start a discussion..."
          required
          rows={8}
          className="w-full px-4 py-3 rounded-xl border border-sand-dark bg-sand text-sm
                     focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay/20 resize-none"
        />
      </div>

      {/* Image upload */}
      <div>
        <label className="block text-xs font-semibold text-charcoal uppercase tracking-wide mb-1.5">
          Image (optional)
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={e => setImageFile(e.target.files?.[0] || null)}
          className="w-full text-sm text-muted
                     file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0
                     file:text-xs file:font-semibold file:bg-clay-pale file:text-clay
                     hover:file:bg-clay/10 cursor-pointer"
        />
        {imageFile && (
          <p className="text-xs text-clay mt-1">📎 {imageFile.name}</p>
        )}
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !selectedCommunity}
        className="w-full py-3.5 rounded-full bg-clay text-white font-semibold text-sm
                   hover:bg-clay-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Publishing...' : `Post to ${selectedCommunity?.name || 'Community'}`}
      </button>
    </form>
  )
}
