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

async function deleteAllServiceLocations() {
  const dryRun = !process.argv.includes('--apply')
  
  const locations = await client.fetch('*[_type == "serviceLocation"]{_id, name}')
  console.log(`Found ${locations.length} service locations`)
  
  if (locations.length === 0) {
    console.log('No service locations to delete')
    return
  }
  
  locations.forEach(loc => {
    console.log(`  - ${loc.name} (${loc._id})`)
  })
  
  if (dryRun) {
    console.log('\nDry run, no changes applied')
    console.log('Run with --apply to delete all service locations')
    return
  }
  
  const tx = client.transaction()
  locations.forEach(loc => {
    tx.delete(loc._id)
  })
  
  await tx.commit()
  console.log(`\nDeleted ${locations.length} service locations`)
}

deleteAllServiceLocations().catch(console.error)
