---
name: build-artist-onboarding-form
description: "Builds the /join page where artists self-register. Form submits to Supabase with is_approved=false. Afsal reviews and approves via Supabase dashboard. Use when building or modifying the artist signup flow."
---

# Skill: Build Artist Onboarding Form

## What This Skill Does
Creates the `/join` page with a complete artist registration form. On submit, inserts a new row into the `artists` table with `is_approved = false`. Afsal then sets `is_approved = true` in Supabase to make them visible.

## Success Criterion
Artist fills form → submits → Supabase `artists` table has new row with `is_approved = false` → success message shown. Afsal goes to Supabase → table editor → sets `is_approved = true` → artist appears on site.

## Form Fields

| Field | Required | Type | Notes |
|---|---|---|---|
| Full Name | Yes | text | |
| Bio | Yes | textarea | 50–300 chars |
| City | Yes | text | |
| State | Yes | select | Indian states only |
| WhatsApp Number | Yes | tel | Auto-prepend 91 |
| Instagram Handle | No | text | Strip @ if included |
| Email | No | email | |
| Category | Yes | select | From categories table |
| Photo | Yes | file | Upload to Supabase Storage |
| Location (lat/lng) | Auto | hidden | From city/state geocode |

## Step-by-Step Plan

### Step 1: Build the form page
```
→ verify: form renders all fields, no TypeScript errors
```

```tsx
// src/app/join/page.tsx
import ArtistOnboardingForm from '@/components/ArtistOnboardingForm'

export default function JoinPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Join CraftersUnited</h1>
      <p className="text-muted-foreground mb-8">
        List your handcrafted work and connect with buyers across India.
        Your profile will go live after a quick review (usually within 24 hours).
      </p>
      <ArtistOnboardingForm />
    </main>
  )
}
```

### Step 2: Build ArtistOnboardingForm (client component)
```
→ verify: submits → Supabase has new row → success state shown → no crash on invalid data
```

```tsx
// src/components/ArtistOnboardingForm.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const CATEGORIES = [
  'Art & Crafts', 'Home Décor', 'Collectibles & Antiques',
  'Personalized Items', 'Handmade Jewellery', 'Handmade Clothing'
]

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Goa', 'Gujarat',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha',
  'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh',
  'West Bengal'
]

export default function ArtistOnboardingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const form = e.currentTarget
    const data = new FormData(form)
    const photoFile = data.get('photo') as File

    try {
      // 1. Upload photo to Supabase Storage
      let photo_url = null
      if (photoFile && photoFile.size > 0) {
        const fileExt = photoFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('artist-images')
          .upload(fileName, photoFile)

        if (uploadError) throw uploadError
        photo_url = supabase.storage.from('artist-images').getPublicUrl(uploadData.path).data.publicUrl
      }

      // 2. Clean instagram handle (remove @ if present)
      const instagram = (data.get('instagram') as string)?.replace('@', '') || null

      // 3. Clean WhatsApp (ensure starts with 91)
      let whatsapp = (data.get('whatsapp') as string)?.replace(/\D/g, '')
      if (whatsapp && !whatsapp.startsWith('91')) whatsapp = `91${whatsapp}`

      // 4. Insert artist row
      const { error: insertError } = await supabase.from('artists').insert({
        name: data.get('name') as string,
        bio: data.get('bio') as string,
        city: data.get('city') as string,
        state: data.get('state') as string,
        location_name: `${data.get('city')}, ${data.get('state')}`,
        whatsapp,
        instagram,
        email: data.get('email') as string || null,
        category: data.get('category') as string,
        photo_url,
        is_approved: false,  // Always starts unapproved
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
      <div className="text-center py-12 px-4 bg-green-50 rounded-xl border border-green-200">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-xl font-semibold text-green-800">Application Received!</h2>
        <p className="text-green-700 mt-2">
          We'll review your profile and get you live within 24 hours.
          We'll contact you on WhatsApp once you're approved.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input id="name" name="name" required placeholder="Your name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">About You *</Label>
        <Textarea
          id="bio" name="bio" required
          placeholder="Tell buyers about yourself and what you make (50–300 characters)"
          minLength={50} maxLength={300} rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input id="city" name="city" required placeholder="e.g. Kochi" />
        </div>
        <div className="space-y-2">
          <Label>State *</Label>
          <Select name="state" required>
            <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
            <SelectContent>
              {INDIAN_STATES.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Category *</Label>
        <Select name="category" required>
          <SelectTrigger><SelectValue placeholder="What do you make?" /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsapp">WhatsApp Number *</Label>
        <Input
          id="whatsapp" name="whatsapp" type="tel" required
          placeholder="10-digit mobile number (e.g. 9876543210)"
        />
        <p className="text-xs text-muted-foreground">Buyers will contact you on this number</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagram">Instagram Handle</Label>
        <Input id="instagram" name="instagram" placeholder="@yourhandle (optional)" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="your@email.com (optional)" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo">Profile Photo *</Label>
        <Input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" required />
        <p className="text-xs text-muted-foreground">JPG, PNG or WebP. Max 5MB.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting} size="lg">
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </Button>
    </form>
  )
}
```

## Post-Build Checklist
- [ ] Form renders all fields without errors
- [ ] Photo uploads to `artist-images` Supabase bucket
- [ ] New row appears in `artists` table with `is_approved = false`
- [ ] Instagram `@` is stripped before saving
- [ ] WhatsApp gets `91` prefix if not present
- [ ] Success state shows after submission
- [ ] Error state shows if Supabase fails
- [ ] Mobile keyboard types correctly on number/email fields

## Admin Approval Workflow (for Afsal, no code needed)
1. Go to Supabase dashboard → Table Editor → `artists`
2. Find rows where `is_approved = false`
3. Click the cell → change to `true` → click Save
4. Artist's profile is now live on the website
