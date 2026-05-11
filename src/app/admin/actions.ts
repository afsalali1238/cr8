// src/app/admin/actions.ts
'use server'
import { createServerClient } from '@/lib/supabase/server'

export async function approveArtist(id: string) {
  const supabase = createServerClient()

  // Verify the caller is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Unauthorized')

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
  if (!session) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('artists')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) throw error
  return true
}
