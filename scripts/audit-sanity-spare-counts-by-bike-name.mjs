import dotenv from 'dotenv'
import {createClient} from '@sanity/client'

dotenv.config({path: '.env.local'})

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-04-15'
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN

const client = createClient({projectId, dataset, apiVersion, token, useCdn: false})

const spares = await client.fetch(
  '*[_type == "sparePart" && isActive == true]{name, "models": compatibleModels[]->name}'
)

const targetModels = ['EKON450M1V1', 'EKON450M1V2', 'VEO', 'EKON400M1']

for (const target of targetModels) {
  const count = spares.filter((spare) => Array.isArray(spare.models) && spare.models.includes(target)).length
  console.log(`${target}: ${count}`)
}
