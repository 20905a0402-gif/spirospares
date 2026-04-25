import dotenv from 'dotenv'
import {createClient} from '@sanity/client'

dotenv.config({path: '.env.local'})

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-04-15'
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN

if (!projectId || !dataset) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local')
  process.exit(1)
}

if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN (or SANITY_API_READ_TOKEN) in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

async function deleteAllBikes() {
  const dryRun = !process.argv.includes('--apply')
  
  // Get all bikes
  const bikes = await client.fetch('*[_type == "bike"]{_id, name}')
  
  if (bikes.length === 0) {
    console.log('No bikes found in Sanity')
    return
  }
  
  console.log(`Found ${bikes.length} bikes to delete:`)
  bikes.forEach((bike) => {
    console.log(`  - ${bike.name} (ID: ${bike._id})`)
  })
  
  if (dryRun) {
    console.log('\n🔍 DRY RUN ONLY - No changes applied.')
    console.log('Run with --apply to delete all bikes.')
    return
  }
  
  console.log('\n⚡ Deleting all bikes from Sanity...')
  
  const tx = client.transaction()
  bikes.forEach((bike) => {
    tx.delete(bike._id)
  })
  
  await tx.commit()
  console.log(`✅ Successfully deleted ${bikes.length} bikes from Sanity`)
}

deleteAllBikes().catch((error) => {
  console.error('Failed to delete bikes:', error)
  process.exit(1)
})
