// src/components/ArtistOnboardingForm.tsx
'use client'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

// Strip HTML tags to prevent XSS in text fields
function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim()
}

const CATEGORIES = [
  'Art & Crafts', 'Home Décor', 'Collectibles & Antiques',
  'Personalized Items', 'Handmade Jewellery', 'Handmade Clothing'
]

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
]

export default function ArtistOnboardingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountTime = useRef(Date.now())
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const form = e.currentTarget
    const data = new FormData(form)
    const photoFile = data.get('photo') as File

    // Honeypot — bots fill hidden fields, humans don't
    if (data.get('website_url')) {
      setIsSuccess(true) // silently pretend success
      return
    }

    // Time-based check — reject submissions < 3 seconds after page load
    if (Date.now() - mountTime.current < 3000) {
      setError('Please take a moment to fill out the form completely.')
      setIsSubmitting(false)
      return
    }

    // Validate fields
    const name = stripHtml(data.get('name') as string || '')
    const bio = stripHtml(data.get('bio') as string || '')
    const city = stripHtml(data.get('city') as string || '')
    const state = data.get('state') as string
    const category = data.get('category') as string
    const rawWhatsapp = (data.get('whatsapp') as string || '').replace(/\D/g, '')

    if (name.length < 2 || name.length > 80) {
      setError('Name must be 2–80 characters.'); setIsSubmitting(false); return
    }
    if (bio.length < 50 || bio.length > 300) {
      setError('Bio must be 50–300 characters.'); setIsSubmitting(false); return
    }
    if (city.length < 2) {
      setError('Please enter a valid city.'); setIsSubmitting(false); return
    }
    if (!INDIAN_STATES.includes(state)) {
      setError('Please select a valid state.'); setIsSubmitting(false); return
    }
    if (!CATEGORIES.includes(category)) {
      setError('Please select a valid category.'); setIsSubmitting(false); return
    }
    if (rawWhatsapp.length < 10 || rawWhatsapp.length > 12) {
      setError('WhatsApp number must be 10 digits.'); setIsSubmitting(false); return
    }

    try {
      // 1. Upload photo to Supabase Storage
      let photo_url = null
      if (photoFile && photoFile.size > 0) {
        const fileExt = photoFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('artist-images')
          .upload(fileName, photoFile)

        if (uploadError) throw uploadError
        photo_url = supabase.storage.from('artist-images').getPublicUrl(uploadData.path).data.publicUrl
      }

      // 2. Clean data
      const instagram = (data.get('instagram') as string)?.replace('@', '') || null
      let whatsapp = rawWhatsapp
      if (whatsapp && !whatsapp.startsWith('91')) whatsapp = `91${whatsapp}`

      // 3. Insert artist row (using sanitized values)
      const { error: insertError } = await supabase.from('artists').insert({
        name,
        bio,
        city,
        state,
        location_name: `${city}, ${state}`,
        whatsapp,
        instagram,
        email: data.get('email') as string || null,
        category,
        photo_url,
        is_approved: false,
      })

      if (insertError) throw insertError
      setIsSuccess(true)

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12 px-6 bg-clay-pale rounded-2xl border border-sand-dark">
        <div className="text-6xl mb-6">✨</div>
        <h2 className="font-display text-4xl text-clay mb-4">Application Sent!</h2>
        <p className="text-charcoal text-lg mb-8">
          Thank you for joining CraftersUnited. We'll review your profile and get back to you 
          on WhatsApp within 24 hours.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-8 py-3 rounded-full bg-clay text-white font-medium hover:bg-clay-light transition-colors shadow-lg shadow-clay/20"
        >
          Back to Homepage
        </button>
      </div>
    )
  }

  const inputClasses = "w-full px-4 py-3 rounded-xl bg-white border border-sand-dark focus:border-clay focus:ring-1 focus:ring-clay outline-none transition-all placeholder:text-muted/50 text-ink"
  const labelClasses = "block text-sm font-semibold text-charcoal mb-1.5 ml-1"

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Honeypot — hidden from humans, bots auto-fill it */}
      <input type="text" name="website_url" tabIndex={-1} autoComplete="off"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }} />
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className={labelClasses}>Full Name *</label>
          <input id="name" name="name" required placeholder="Afsal Ali" className={inputClasses} />
        </div>

        <div>
          <label htmlFor="bio" className={labelClasses}>About Your Craft *</label>
          <textarea
            id="bio" name="bio" required
            placeholder="Tell us what makes your work unique (50–300 characters)"
            minLength={50} maxLength={300} rows={4}
            className={`${inputClasses} resize-none`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="city" className={labelClasses}>City *</label>
            <input id="city" name="city" required placeholder="e.g. Kochi" className={inputClasses} />
          </div>
          <div>
            <label htmlFor="state" className={labelClasses}>State *</label>
            <select name="state" required className={inputClasses}>
              <option value="">Select state</option>
              {INDIAN_STATES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="category" className={labelClasses}>Primary Category *</label>
          <select name="category" required className={inputClasses}>
            <option value="">What do you make?</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="whatsapp" className={labelClasses}>WhatsApp Number *</label>
            <input
              id="whatsapp" name="whatsapp" type="tel" required
              placeholder="10-digit mobile number"
              className={inputClasses}
            />
            <p className="text-[10px] text-muted mt-1.5 ml-1">Format: 9876543210</p>
          </div>
          <div>
            <label htmlFor="instagram" className={labelClasses}>Instagram Handle</label>
            <input id="instagram" name="instagram" placeholder="e.g. @cr8un8" className={inputClasses} />
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelClasses}>Email Address</label>
          <input id="email" name="email" type="email" placeholder="your@email.com" className={inputClasses} />
        </div>

        <div>
          <label htmlFor="photo" className={labelClasses}>Profile Photo *</label>
          <div className="relative group">
            <input 
              id="photo" name="photo" type="file" required 
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            />
            <div className="py-8 px-4 rounded-xl border-2 border-dashed border-sand-dark bg-cream/50 text-center group-hover:border-clay transition-colors">
              <span className="text-2xl mb-2 block">📸</span>
              <p className="text-sm text-charcoal font-medium">Click to upload your profile picture</p>
              <p className="text-xs text-muted mt-1">JPG, PNG or WebP up to 5MB</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
          ⚠️ {error}
        </div>
      )}

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full py-4 rounded-full bg-clay text-white font-semibold text-lg hover:bg-clay-light transition-all shadow-xl shadow-clay/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Submitting...
          </span>
        ) : 'Submit Application'}
      </button>

      <p className="text-center text-xs text-muted italic">
        By submitting, you agree to showcase your work on CraftersUnited.
      </p>
    </form>
  )
}
