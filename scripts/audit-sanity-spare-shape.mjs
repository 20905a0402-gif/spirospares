import dotenv from 'dotenv'
import {createClient} from '@sanity/client'

dotenv.config({path: '.env.local'})

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-04-15'
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

const doc = await client.fetch('*[_type == "sparePart" && isActive == true][0]{..., compatibleModels, "compatDeref": compatibleModels[]->{_id,name}, compatible_models}')

if (!doc) {
  console.log('No active sparePart document found')
  process.exit(0)
}

console.log('Doc id:', doc._id)
console.log('Doc name:', doc.name)
console.log('Has compatibleModels field:', Object.prototype.hasOwnProperty.call(doc, 'compatibleModels'))
console.log('compatibleModels raw length:', Array.isArray(doc.compatibleModels) ? doc.compatibleModels.length : 'not-array')
console.log('compatDeref length:', Array.isArray(doc.compatDeref) ? doc.compatDeref.length : 'not-array')
console.log('Has compatible_models field:', Object.prototype.hasOwnProperty.call(doc, 'compatible_models'))
console.log('compatible_models raw:', doc.compatible_models)
console.log('compatDeref sample:', doc.compatDeref)
