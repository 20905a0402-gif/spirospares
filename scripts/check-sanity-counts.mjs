import dotenv from 'dotenv'
import {createClient} from '@sanity/client'

dotenv.config({path: '.env.local'})

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: false,
})

async function run() {
  const bike = await client.fetch('count(*[_type == "bike"])')
  const sparePart = await client.fetch('count(*[_type == "sparePart"])')
  const gadget = await client.fetch('count(*[_type == "gadget"])')
  const serviceLocation = await client.fetch('count(*[_type == "serviceLocation"])')
  const category = await client.fetch('count(*[_type == "category"])')
  console.log({bike, sparePart, gadget, serviceLocation, category})
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
