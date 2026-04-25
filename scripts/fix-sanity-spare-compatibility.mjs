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

const dryRun = !process.argv.includes('--apply')

const bikes = await client.fetch('*[_type == "bike" && isActive == true]{_id, name}')
const spares = await client.fetch('*[_type == "sparePart" && isActive == true]{_id, name, compatibleModels}')

if (!bikes.length) {
  console.error('No active bikes found. Aborting patch.')
  process.exit(1)
}

const bikeRefs = bikes.map((bike) => ({_type: 'reference', _ref: bike._id}))

const emptySpares = spares.filter(
  (spare) => !Array.isArray(spare.compatibleModels) || spare.compatibleModels.length === 0
)

console.log('Active bikes:', bikes.length)
console.log('Active spares:', spares.length)
console.log('Spares with empty compatibleModels:', emptySpares.length)

if (!emptySpares.length) {
  console.log('No empty compatibility arrays found. Nothing to update.')
  process.exit(0)
}

console.log('Sample affected spares:', emptySpares.slice(0, 10).map((spare) => spare.name).join(' | '))

if (dryRun) {
  console.log('Dry run only. Re-run with --apply to patch Sanity documents.')
  process.exit(0)
}

const tx = client.transaction()
for (const spare of emptySpares) {
  tx.patch(spare._id, (patch) => patch.set({compatibleModels: bikeRefs}))
}

await tx.commit()
console.log(`Patched ${emptySpares.length} spare documents with bike compatibility references.`)
