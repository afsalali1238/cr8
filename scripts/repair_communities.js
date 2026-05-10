const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://bzdcarenufxayuumlhjt.supabase.co',
  process.env.SUPABASE_ANON_KEY
)

async function repairCommunities() {
  const communities = [
    { name: 'Art & Crafts', slug: 'art-crafts', description: 'Share your paintings, drawings, mixed media work', icon: '🎨' },
    { name: 'Home Décor Makers', slug: 'home-decor', description: 'Handmade home décor, candles, pottery and more', icon: '🏠' },
    { name: 'Jewellery Artists', slug: 'jewellery', description: 'Handmade jewellery, beadwork, metalwork', icon: '💍' },
    { name: 'Kerala Crafters', slug: 'kerala', description: 'Artists based in Kerala connecting locally', icon: '🌴' },
    { name: 'Personalized Gifts', slug: 'personalized', description: 'Custom and personalized item makers', icon: '✨' },
    { name: 'General Discussion', slug: 'general', description: 'Anything craft-related — tips, resources, collabs', icon: '💬' }
  ]

  console.log('Attempting to insert communities...')
  const { data, error } = await supabase.from('communities').upsert(communities, { onConflict: 'slug' })
  
  if (error) {
    console.error('Error inserting communities:', error)
    if (error.code === 'PGRST204' || error.code === 'PGRST205') {
      console.log('Table missing. You MUST run the SQL migration in the Supabase Dashboard.')
    }
  } else {
    console.log('Successfully inserted/verified communities.')
  }
}

repairCommunities()
