const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://bzdcarenufxayuumlhjt.supabase.co',
  process.env.SUPABASE_ANON_KEY
)

async function updateToRealArtists() {
  const { data: artists, error } = await supabase.from('artists').select('id, name')
  if (error) {
    console.error(error)
    return
  }

  const realArtists = [
    {
      oldName: 'Aarav',
      name: 'Anita Nair',
      bio: 'Master potter with 15 years of experience in traditional Kerala earthenware. I blend ancient firing techniques with modern minimal aesthetics.',
      city: 'Kochi',
      state: 'Kerala',
      lat: 9.9312,
      lng: 76.2673,
      photo_url: 'https://images.unsplash.com/photo-1565193298357-3f360742cc4e?auto=format&fit=crop&q=80&w=400',
      category: 'Home Décor'
    },
    {
      oldName: 'Meera',
      name: 'Vikram Sethi',
      bio: 'Jaipur-based artisan specializing in hand-stitched vegetable-tanned leather goods. Each piece is crafted using tools passed down through three generations.',
      city: 'Jaipur',
      state: 'Rajasthan',
      lat: 26.9124,
      lng: 75.7873,
      photo_url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&q=80&w=400',
      category: 'Art & Crafts'
    },
    {
      oldName: 'Zubair',
      name: 'Sanya Kapoor',
      bio: 'Textile designer focusing on natural dyes and hand-loom weaving. My mission is to preserve the intricate patterns of South Indian weaves.',
      city: 'Bengaluru',
      state: 'Karnataka',
      lat: 12.9716,
      lng: 77.5946,
      photo_url: 'https://images.unsplash.com/photo-1536176561669-612921102426?auto=format&fit=crop&q=80&w=400',
      category: 'Handmade Clothing'
    }
  ]

  for (const real of realArtists) {
    const a = artists.find(item => item.name.includes(real.oldName))
    if (a) {
      const { error: updateError } = await supabase.from('artists').update({
        name: real.name,
        bio: real.bio,
        city: real.city,
        state: real.state,
        lat: real.lat,
        lng: real.lng,
        photo_url: real.photo_url,
        category: real.category,
        location_name: `${real.city}, ${real.state}`
      }).eq('id', a.id)
      
      if (updateError) console.error(`Error updating ${real.name}:`, updateError)
      else console.log(`Successfully updated ${real.oldName} to ${real.name}`)
    }
  }
}

updateToRealArtists()
