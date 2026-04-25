import dotenv from 'dotenv'
import {createClient} from '@sanity/client'
import {readFile} from 'node:fs/promises'
import path from 'node:path'
import fs from 'node:fs'

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

// CSV format: name,category,price,sku,shortDescription,longDescription,stock,motor,range,battery,speed,chargingTime,isActive,imagePath1,imagePath2,imagePath3
// Example: EKON450M1V2,Commercial Delivery,269000,SPI-EK45V1-002,Short desc,Long desc,12,5.5kW,130 km,72V 50Ah,90 km/h,4 hours,true,/images/bikes/image1.png,/images/bikes/image2.png

async function parseCSV(filePath) {
  const content = await readFile(filePath, 'utf-8')
  const lines = content.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim())
  
  const updates = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    if (values.length === 0 || values[0] === '') continue
    
    const update = {}
    headers.forEach((header, index) => {
      if (values[index]) {
        if (header === 'price' || header === 'stock') {
          update[header] = parseFloat(values[index])
        } else if (header === 'isActive') {
          update[header] = values[index].toLowerCase() === 'true'
        } else if (header.startsWith('imagePath')) {
          if (!update.images) update.images = []
          update.images.push(values[index])
        } else {
          update[header] = values[index]
        }
      }
    })
    updates.push(update)
  }
  return updates
}

async function uploadImage(imagePath) {
  if (!imagePath || !imagePath.startsWith('/')) {
    return null
  }
  
  try {
    const publicRelative = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
    const filePath = path.join(process.cwd(), 'public', publicRelative)
    const buffer = await fs.promises.readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    const mimeByExt = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
    }
    const contentType = mimeByExt[ext] || 'application/octet-stream'
    
    const asset = await client.assets.upload('image', buffer, {
      filename: path.basename(filePath),
      contentType,
    })
    
    return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
  } catch (error) {
    console.error(`Failed to upload image ${imagePath}:`, error.message)
    return null
  }
}

async function bulkUpdateBikes() {
  const args = process.argv.slice(2)
  const csvPath = args.find(arg => !arg.startsWith('--')) || './scripts/bike-template.csv'
  const dryRun = !args.includes('--apply')
  
  console.log(`Reading updates from ${csvPath}...`)
  const updates = await parseCSV(csvPath)
  
  if (updates.length === 0) {
    console.log('No updates found in CSV file.')
    return
  }
  
  console.log(`Found ${updates.length} bike updates to process.`)
  
  // Get current bikes from Sanity
  const currentBikes = await client.fetch('*[_type == "bike"]{_id, name, price, images, category, sku, stock, motor, range, battery, speed, chargingTime, shortDescription}')
  const bikeByName = new Map(currentBikes.map(b => [b.name, b]))
  
  // Get bikes category
  const bikeCategory = await client.fetch('*[_type == "category" && type == "bike"][0]{_id}')
  
  const tx = client.transaction()
  let updateCount = 0
  let createCount = 0
  
  for (const update of updates) {
    const bikeName = update.name
    const current = bikeByName.get(bikeName)
    
    // Always create/replace bikes from template
    const bikeId = `bike-${bikeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
    const newBike = {
      _id: bikeId,
      _type: 'bike',
      name: update.name,
      price: update.price || 0,
      category: {_type: 'reference', _ref: bikeCategory?._id || 'category-bikes'},
      sku: update.sku || `SPI-${bikeName.toUpperCase().slice(0, 8)}-001`,
      shortDescription: update.shortDescription || '',
      longDescription: update.longDescription || '',
      stock: update.stock || 0,
      motor: update.motor || '',
      range: update.range || '',
      battery: update.battery || '',
      speed: update.speed || '',
      chargingTime: update.chargingTime || '',
      isActive: update.isActive !== undefined ? update.isActive : true,
    }
    
    if (update.images && update.images.length > 0) {
      console.log(`  Uploading ${update.images.length} images for ${bikeName}...`)
      const imageRefs = []
      for (const imagePath of update.images) {
        const imageRef = await uploadImage(imagePath)
        if (imageRef) {
          imageRefs.push(imageRef)
        }
      }
      if (imageRefs.length > 0) {
        newBike.images = imageRefs
      }
    }
    
    console.log(`➕ Creating/Replacing bike ${bikeName}`)
    tx.createOrReplace(newBike)
    createCount++
  }
  
  if (updateCount === 0 && createCount === 0) {
    console.log('No updates or creations to apply.')
    return
  }
  
  if (dryRun) {
    console.log('\n🔍 DRY RUN ONLY - No changes applied.')
    console.log(`Run with --apply to apply ${updateCount} updates and ${createCount} new bikes.`)
    return
  }
  
  console.log('\n⚡ Applying updates to Sanity...')
  await tx.commit()
  console.log(`✅ Successfully updated ${updateCount} bikes and created ${createCount} new bikes in Sanity.`)
}

bulkUpdateBikes().catch((error) => {
  console.error('Failed to bulk update bikes:', error)
  process.exit(1)
})
