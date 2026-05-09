export interface Artist {
  id: string
  name: string
  bio: string | null
  location_name: string
  lat: number | null
  lng: number | null
  state: string | null
  city: string | null
  whatsapp: string | null
  instagram: string | null
  email: string | null
  photo_url: string | null
  category: string | null
  is_approved: boolean
  is_active: boolean
  created_at: string
}

export interface ArtistWithListings extends Artist {
  listings: Listing[]
}

export interface Listing {
  id: string
  artist_id: string
  title: string
  description: string | null
  price: number | null
  image_url: string | null
  category: string | null
  is_available: boolean
  created_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  icon: string | null
}

export interface ArtistMapPoint {
  id: string
  name: string
  city: string
  state: string
  lat: number
  lng: number
  photo_url: string | null
  category: string | null
}
