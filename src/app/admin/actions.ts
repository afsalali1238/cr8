// src/app/admin/actions.ts
'use client'
import { createClient } from '@/lib/supabase/client'

export async function approveArtist(id: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('artists')
    .update({ is_approved: true })
    .eq('id', id)

  if (error) throw error
  return true
}

export async function toggleArtistActive(id: string, isActive: boolean) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('artists')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) throw error
  return true
}
