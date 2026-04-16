import {config as dotenvConfig} from 'dotenv'
import {createClient} from '@sanity/client'

dotenvConfig({path: '.env.local'})

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-04-15',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const parts = await client.fetch(
  '*[_type == "sparePart" && isActive == true] | order(name asc)[0...2]{_id, name, stock}'
)

for (const part of parts) {
  await client.patch(part._id).set({stock: 0}).commit()
}

console.log(
  'Updated to out-of-stock:',
  parts.map((part) => `${part.name} (${part._id})`).join('; ')
)
