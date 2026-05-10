const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://bzdcarenufxayuumlhjt.supabase.co',
  process.env.SUPABASE_ANON_KEY
)

async function checkListings() {
  const { data, error } = await supabase.from('listings').select('id, title, price')
  if (error) console.error(error)
  else {
    console.log('Listings found:', data.length)
    console.log(data.slice(0, 5))
  }
}

checkListings()
