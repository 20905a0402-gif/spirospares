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

async function clearSpareReferences() {
  const dryRun = !process.argv.includes('--apply')
  
  const spareParts = await client.fetch('*[_type == "sparePart"]{_id, name, compatibleModels}')
  
  if (spareParts.length === 0) {
    console.log('No spare parts found')
    return
  }
  
  console.log(`Found ${spareParts.length} spare parts to clear references from`)
  
  const tx = client.transaction()
  let updateCount = 0
  
  for (const spare of spareParts) {
    if (spare.compatibleModels && spare.compatibleModels.length > 0) {
      console.log(`📝 Clearing references from ${spare.name}`)
      tx.patch(spare._id, (patch) => patch.set({compatibleModels: []}))
      updateCount++
    }
  }
  
  if (updateCount === 0) {
    console.log('No references to clear')
    return
  }
  
  if (dryRun) {
    console.log('\n🔍 DRY RUN ONLY - No changes applied.')
    console.log('Run with --apply to clear references.')
    return
  }
  
  console.log('\n⚡ Clearing spare references...')
  await tx.commit()
  console.log(`✅ Successfully cleared references from ${updateCount} spare parts`)
}

clearSpareReferences().catch(console.error)
