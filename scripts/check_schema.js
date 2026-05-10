const https = require('https')

async function checkSchema() {
  const options = {
    hostname: 'bzdcarenufxayuumlhjt.supabase.co',
    path: '/rest/v1/',
    headers: {
      'apikey': 'sb_publishable_yBG3AwTIsmhzWTByyvUlXg_uDi-3C_2',
      'Authorization': 'Bearer sb_publishable_yBG3AwTIsmhzWTByyvUlXg_uDi-3C_2'
    }
  }

  https.get(options, (res) => {
    let data = ''
    res.on('data', (chunk) => { data += chunk })
    res.on('end', () => {
      try {
        const schema = JSON.parse(data)
        console.log('Tables found in OpenAPI schema:', Object.keys(schema.definitions))
      } catch (e) {
        console.error('Failed to parse response:', e.message)
        console.log(data)
      }
    })
  }).on('error', (err) => {
    console.error('Error:', err.message)
  })
}

checkSchema()
