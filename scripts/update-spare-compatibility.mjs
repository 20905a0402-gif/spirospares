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

async function updateSpareCompatibility() {
  const dryRun = !process.argv.includes('--apply')
  
  // Get EKON450M2V2 bike document
  const targetBike = await client.fetch('*[_type == "bike" && name == "EKON450M2V2"][0]{_id, name}')
  
  if (!targetBike) {
    console.error('EKON450M2V2 bike not found in Sanity')
    process.exit(1)
  }
  
  console.log(`Target bike: ${targetBike.name} (ID: ${targetBike._id})`)
  
  // Get all spare parts
  const spareParts = await client.fetch('*[_type == "sparePart"]{_id, name, compatibleModels}')
  
  if (spareParts.length === 0) {
    console.log('No spare parts found in Sanity')
    return
  }
  
  console.log(`Found ${spareParts.length} spare parts to update`)
  
  const tx = client.transaction()
  let updateCount = 0
  
  for (const spare of spareParts) {
    const currentModels = spare.compatibleModels || []
    
    // Check if already only has EKON450M2V2
    if (currentModels.length === 1 && currentModels[0]._ref === targetBike._id) {
      console.log(`ℹ️  ${spare.name} already only linked to EKON450M2V2`)
      continue
    }
    
    console.log(`📝 Updating ${spare.name}:`)
    console.log(`   Current models: ${currentModels.length}`)
    console.log(`   New models: 1 (EKON450M2V2 only)`)
    
    // Update to only have EKON450M2V2
    tx.patch(spare._id, (patch) => patch.set({
      compatibleModels: [{_type: 'reference', _ref: targetBike._id}]
    }))
    updateCount++
  }
  
  if (updateCount === 0) {
    console.log('No updates needed')
    return
  }
  
  if (dryRun) {
    console.log('\n🔍 DRY RUN ONLY - No changes applied.')
    console.log(`Run with --apply to update ${updateCount} spare parts.`)
    return
  }
  
  console.log('\n⚡ Applying updates to Sanity...')
  await tx.commit()
  console.log(`✅ Successfully updated ${updateCount} spare parts to only link to EKON450M2V2`)
}

updateSpareCompatibility().catch((error) => {
  console.error('Failed to update spare compatibility:', error)
  process.exit(1)
})
