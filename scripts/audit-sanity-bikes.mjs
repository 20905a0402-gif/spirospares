import dotenv from 'dotenv'
import {createClient} from '@sanity/client'

dotenv.config({path: '.env.local'})

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-04-15'
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN

const client = createClient({projectId, dataset, apiVersion, token, useCdn: false})

const bikes = await client.fetch('*[_type == "bike" && isActive == true] | order(_id asc){_id, name, sku}')
console.log(JSON.stringify(bikes, null, 2))
