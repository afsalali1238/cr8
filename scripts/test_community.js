const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://bzdcarenufxayuumlhjt.supabase.co',
  process.env.SUPABASE_ANON_KEY
)

async function test() {
  const { data, error } = await supabase.from('communities').select('*')
  if (error) console.error(error)
  else {
    console.log('Communities:', data.length)
    console.log(data)
  }
}

test()
