import dotenv from 'dotenv'
import {createClient} from '@sanity/client'

dotenv.config({path: '.env.local'})

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-04-15',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

async function checkBikeDetails() {
  const bikes = await client.fetch('*[_type == "bike"]{_id, name, sku, price, images}')
  
  console.log('Bikes in Sanity:')
  console.log('================')
  bikes.forEach((bike) => {
    console.log(`\n${bike.name} (SKU: ${bike.sku}, Price: ${bike.price})`)
    console.log(`  Images: ${bike.images ? bike.images.length : 0}`)
    if (bike.images && bike.images.length > 0) {
      bike.images.forEach((img, idx) => {
        console.log(`    ${idx + 1}. ${img.asset._ref}`)
      })
    }
  })
}

checkBikeDetails().catch(console.error)
