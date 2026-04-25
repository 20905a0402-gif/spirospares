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

const renamePlan = [
  {_id: 'bike-ekon450m1', from: 'EKON400M1', to: 'EKON450M1V1'},
  {_id: 'bike-ekon450m2', from: 'EKON450M2', to: 'EKON450M1V2'},
  {_id: 'bike-ekon400m2', from: 'EKON400M3', to: 'EKON400M1'},
]

const currentBikes = await client.fetch(
  '*[_type == "bike" && _id in $ids]{_id, name}',
  {ids: renamePlan.map((item) => item._id)}
)

const currentById = new Map(currentBikes.map((bike) => [bike._id, bike.name]))

console.log('Current values:')
for (const item of renamePlan) {
  console.log(`${item._id}: ${currentById.get(item._id) || '<missing>'} -> ${item.to}`)
}

if (dryRun) {
  console.log('Dry run only. Re-run with --apply to patch Sanity bike names.')
  process.exit(0)
}

const tx = client.transaction()
for (const item of renamePlan) {
  if (!currentById.has(item._id)) {
    continue
  }
  tx.patch(item._id, (patch) => patch.set({name: item.to}))
}

await tx.commit()
console.log('Sanity bike names updated successfully.')
