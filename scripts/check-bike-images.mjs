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

async function checkBikeImages() {
  const bike = await client.fetch('*[_type == "bike" && name == "EKON450M2V2"][0]{name, images}')
  console.log(JSON.stringify(bike, null, 2))
}

checkBikeImages().catch(console.error)
