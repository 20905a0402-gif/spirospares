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

async function checkSpareCompatibility() {
  const spareParts = await client.fetch('*[_type == "sparePart"]{_id, name, compatibleModels}')
  
  console.log('Spare parts compatibility check:')
  console.log('=====================================')
  
  for (const spare of spareParts) {
    const models = spare.compatibleModels || []
    const modelNames = await Promise.all(
      models.map(async (ref) => {
        const bike = await client.fetch(`*[_id == "${ref._ref}"][0]{name}`)
        return bike ? bike.name : 'Unknown'
      })
    )
    console.log(`${spare.name}: ${modelNames.join(', ')}`)
  }
}

checkSpareCompatibility().catch(console.error)
