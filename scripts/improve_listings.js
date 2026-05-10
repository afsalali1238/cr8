const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://bzdcarenufxayuumlhjt.supabase.co',
  process.env.SUPABASE_ANON_KEY
)

async function improveListings() {
  const { data: listings } = await supabase.from('listings').select('id, title')
  
  const realisticListings = [
    {
      title: 'Indigo Floral Bedspread',
      newTitle: 'Hand-Block Printed Indigo Bedspread',
      description: 'Authentic hand-block printed bedspread using natural indigo dyes. Featuring traditional Bagru floral motifs on premium organic cotton.',
      price: 3499,
      image_url: 'https://images.unsplash.com/photo-1536176561669-612921102426?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Silver Peacock Earrings',
      newTitle: 'Antiqued Silver Peacock Jhumkas',
      description: 'Intricately designed peacock motif earrings in antiqued silver finish. Handcrafted with delicate beadwork by master smiths.',
      price: 1850,
      image_url: 'https://images.unsplash.com/photo-1611085583191-a3b1a6a939db?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Carved Sheesham Mirror',
      newTitle: 'Hand-Carved Sheesham Wood Mirror',
      description: 'Solid Sheesham wood mirror frame featuring intricate hand-carved jali patterns. A timeless piece of Rajasthan craftsmanship.',
      price: 5200,
      image_url: 'https://images.unsplash.com/photo-1565193298357-3f360742cc4e?auto=format&fit=crop&q=80&w=600'
    }
  ]

  for (const item of realisticListings) {
    const l = listings.find(listing => listing.title.includes(item.title))
    if (l) {
      await supabase.from('listings').update({
        title: item.newTitle,
        description: item.description,
        price: item.price,
        image_url: item.image_url
      }).eq('id', l.id)
      console.log(`Updated listing: ${item.newTitle}`)
    }
  }
}

improveListings()
