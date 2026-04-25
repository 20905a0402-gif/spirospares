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

async function checkSpareIds() {
  const spares = await client.fetch('*[_type == "sparePart"]{_id, name, partCode, isActive}')
  console.log(`Total spares: ${spares.length}`)
  
  const newPartCodes = ['EG01309020', 'E066302010', 'EG01310020', 'ES01315010', 'E066406010', 'E066409010', 'EG01524010', 'E066604010', 'E066608010', 'E066609010', 'E066611010', 'E066616100', 'E066803010']
  
  console.log('\nNew spares:')
  spares.filter(s => newPartCodes.includes(s.partCode)).forEach(spare => {
    console.log(`  ${spare.name} - ID: ${spare._id} - isActive: ${spare.isActive}`)
  })
  
  console.log('\nOther spares:')
  spares.filter(s => !newPartCodes.includes(s.partCode)).forEach(spare => {
    console.log(`  ${spare.name} - ID: ${spare._id} - isActive: ${spare.isActive}`)
  })
}

checkSpareIds().catch(console.error)
