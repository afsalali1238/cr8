// src/app/admin/actions.ts
'use server'
import { createServerClient } from '@/lib/supabase/server'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'craftersunitedin@gmail.com'

export async function approveArtist(id: string) {
  const supabase = createServerClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session || session.user.email !== ADMIN_EMAIL) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('artists')
    .update({ is_approved: true })
    .eq('id', id)

  if (error) throw error
  return true
}

export async function toggleArtistActive(id: string, isActive: boolean) {
  const supabase = createServerClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session || session.user.email !== ADMIN_EMAIL) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('artists')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) throw error
  return true
}
