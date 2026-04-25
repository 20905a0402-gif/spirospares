import dotenv from 'dotenv'
import {createClient} from '@sanity/client'
import xlsx from 'xlsx'
import path from 'path'
import fs from 'fs'

dotenv.config({path: '.env.local'})

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-04-15',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const excelPath = path.join(process.cwd(), 'public', 'm1v2_fms.xlsx')
const mediaDir = path.join(process.cwd(), 'public', 'media')

// Map category names to match existing categories
const categoryMap = {
  'Electrical system': 'Electrical',
  'Lighting': 'Electrical',
  'Braking systems': 'Frame & Suspension',
  'Others Mechanical parts': 'General',
}

async function uploadImage(imagePath) {
  if (!imagePath || !fs.existsSync(imagePath)) {
    return null
  }
  
  try {
    const buffer = await fs.promises.readFile(imagePath)
    const ext = path.extname(imagePath).toLowerCase()
    const mimeByExt = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
    }
    const contentType = mimeByExt[ext] || 'application/octet-stream'
    
    const asset = await client.assets.upload('image', buffer, {
      filename: path.basename(imagePath),
      contentType,
    })
    
    return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
  } catch (error) {
    console.error(`Failed to upload image ${imagePath}:`, error.message)
    return null
  }
}

async function importSpares() {
  const dryRun = !process.argv.includes('--apply')
  
  // Get EKON450M1V2 bike document
  const targetBike = await client.fetch('*[_type == "bike" && name == "EKON450M1V2"][0]{_id, name}')
  
  if (!targetBike) {
    console.error('EKON450M1V2 bike not found in Sanity')
    process.exit(1)
  }
  
  console.log('Target bike:', targetBike.name, 'ID:', targetBike._id)
  
  // Read Excel file
  const workbook = xlsx.readFile(excelPath)
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const data = xlsx.utils.sheet_to_json(sheet, {header: 1})
  
  // Skip header row, process data rows
  const rows = data.slice(1)
  console.log(`Found ${rows.length} spares in Excel`)
  
  const tx = client.transaction()
  let importCount = 0
  let skipCount = 0
  
  for (const row of rows) {
    const [pageNum, category, name, partCode] = row
    
    if (!name || !partCode) {
      console.log(`Skipping row with missing data: ${JSON.stringify(row)}`)
      skipCount++
      continue
    }
    
    // Find image in media folder
    const imageExtensions = ['.png', '.jpg', '.jpeg']
    let imagePath = null
    
    for (const ext of imageExtensions) {
      const testPath = path.join(mediaDir, `${partCode}${ext}`)
      if (fs.existsSync(testPath)) {
        imagePath = testPath
        break
      }
    }
    
    if (!imagePath) {
      console.log(`No image found for ${partCode} - ${name}`)
    }
    
    // Map category
    const mappedCategory = categoryMap[category] || 'General'
    
    // Generate document ID from part code
    const docId = `spare-${partCode.toLowerCase()}`
    
    console.log(`\nProcessing: ${name} (${partCode})`)
    console.log(`  Category: ${category} -> ${mappedCategory}`)
    console.log(`  Image: ${imagePath ? path.basename(imagePath) : 'None'}`)
    
    if (dryRun) {
      console.log('  [DRY RUN] Would create/update spare part')
      importCount++
      continue
    }
    
    // Upload image if exists
    let imageRef = null
    if (imagePath) {
      imageRef = await uploadImage(imagePath)
      if (imageRef) {
        console.log('  Image uploaded successfully')
      }
    }
    
    // Create or replace spare part
    tx.createOrReplace({
      _id: docId,
      _type: 'sparePart',
      name: name,
      partCode: partCode,
      price: 5000,
      category: mappedCategory,
      stock: 10,
      image: imageRef,
      compatibleModels: [{_type: 'reference', _ref: targetBike._id}],
      function: category,
      replacementCycle: '6 months',
      material: 'Standard',
      quality: 'OEM',
      isActive: true,
    })
    
    importCount++
  }
  
  if (dryRun) {
    console.log(`\nDry run complete. Would import ${importCount} spares, skipped ${skipCount}`)
    console.log('Run with --apply to actually import')
    return
  }
  
  await tx.commit()
  console.log(`\nSuccessfully imported ${importCount} spares to Sanity`)
  console.log(`Skipped ${skipCount} rows`)
  console.log(`All spares linked to ${targetBike.name}`)
}

importSpares().catch(console.error)
