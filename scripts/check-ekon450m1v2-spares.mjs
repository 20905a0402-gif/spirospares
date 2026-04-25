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

async function checkSpares() {
  // Get EKON450M1V2 bike
  const bike = await client.fetch('*[_type == "bike" && name == "EKON450M1V2"][0]{_id, name}')
  console.log('Target bike:', bike)
  
  // Get all spares
  const spares = await client.fetch('*[_type == "sparePart"]{_id, name, partCode, category, compatibleModels}')
  console.log(`\nTotal spares in Sanity: ${spares.length}`)
  
  // Check spares linked to EKON450M1V2
  const linkedSpares = spares.filter(spare => 
    spare.compatibleModels && spare.compatibleModels.some(model => model._ref === bike._id)
  )
  console.log(`\nSpares linked to EKON450M1V2: ${linkedSpares.length}`)
  
  linkedSpares.forEach(spare => {
    console.log(`  - ${spare.name} (${spare.partCode}) - ${spare.category}`)
  })
  
  // Check the newly imported spares
  const newPartCodes = ['EG01309020', 'E066302010', 'EG01310020', 'ES01315010', 'E066406010', 'E066409010', 'EG01524010', 'E066604010', 'E066608010', 'E066609010', 'E066611010', 'E066616100', 'E066803010']
  const newSpares = spares.filter(spare => newPartCodes.includes(spare.partCode))
  console.log(`\nNewly imported spares: ${newSpares.length}`)
  
  newSpares.forEach(spare => {
    console.log(`  - ${spare.name} (${spare.partCode})`)
    console.log(`    Compatible models: ${spare.compatibleModels ? spare.compatibleModels.map(m => m._ref).join(', ') : 'None'}`)
  })
}

checkSpares().catch(console.error)
