// src/app/actions/newsletter.ts
'use client' // I'll use a standard export and call it from a client component or use 'use server' if I want to keep it purely server-side.
// Actually, I'll make it a Server Action.

import { createClient } from '@/lib/supabase/client'

export async function subscribeToNewsletter(email: string) {
  const supabase = createClient()
  
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email address')
  }

  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email })

  if (error) {
    if (error.code === '23505') {
      throw new Error('You are already subscribed!')
    }
    throw new Error(error.message)
  }

  return { success: true }
}
