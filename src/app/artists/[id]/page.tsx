// src/app/artists/[id]/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ArtistProfileLayout from '@/components/ArtistProfileLayout'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createServerClient()
  const { data: artist } = await supabase
    .from('artists')
    .select('name, bio, photo_url')
    .eq('id', params.id)
    .single()

  if (!artist) return { title: 'Artist Not Found' }

  return {
    title: `${artist.name} | CraftersUnited`,
    description: artist.bio || `Discover handcrafted work by ${artist.name} on CraftersUnited.`,
    openGraph: {
      title: `${artist.name} | CraftersUnited`,
      description: artist.bio || `Discover handcrafted work by ${artist.name} on CraftersUnited.`,
      images: artist.photo_url ? [{ url: artist.photo_url }] : [],
    },
  }
}

export default async function ArtistPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  const { data: artist } = await supabase
    .from('artists')
    .select('*, listings(*)')
    .eq('id', params.id)
    .eq('is_approved', true)
    .single()

  if (!artist) notFound()

  return <ArtistProfileLayout artist={artist} />
}
