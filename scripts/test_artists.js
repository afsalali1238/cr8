const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://bzdcarenufxayuumlhjt.supabase.co',
  process.env.SUPABASE_ANON_KEY
)

async function test() {
  const { data, error } = await supabase.from('artists').select('*').limit(1).single()
  if (error) console.error(error)
  else {
    console.log('Artist keys:', Object.keys(data))
  }
}

test()
