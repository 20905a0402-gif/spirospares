#!/usr/bin/env node
/**
 * Script to import spare parts from Excel/CSV for EKON450M1V1
 * 
 * Expected CSV format:
 *   name,partCode,price,category,function,replacementCycle,material,quality,stock
 * 
 * Usage:
 *   node scripts/import-spares-for-ekon450m1v1.mjs spares.csv --dry-run  # Preview
 *   node scripts/import-spares-for-ekon450m1v1.mjs spares.csv --apply   # Import
 */

import dotenv from 'dotenv'
import {createClient} from '@sanity/client'
import fs from 'fs'
import path from 'path'

dotenv.config({path: '.env.local'})

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-04-15'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!token) {
  console.error('Error: SANITY_API_WRITE_TOKEN is required. Set it in .env.local')
  process.exit(1)
}

const client = createClient({projectId, dataset, apiVersion, token, useCdn: false})

const csvFile = process.argv.find((arg, i) => i >= 2 && !arg.startsWith('--'))
const dryRun = process.argv.includes('--dry-run') || !process.argv.includes('--apply')

// Valid categories
const validCategories = ['Body & Trim', 'Frame & Suspension', 'General', 'Electrical']

function parseCSV(content) {
  const lines = content.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  
  return lines.slice(1).map((line, index) => {
    // Handle quoted values with commas
    const values = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())
    
    const row = {}
    headers.forEach((header, i) => {
      row[header] = values[i]?.replace(/^"|"$/g, '') || ''
    })
    row._lineNumber = index + 2
    return row
  })
}

function validateRow(row) {
  const errors = []
  
  if (!row.name?.trim()) errors.push('name is required')
  if (!row.partCode?.trim()) errors.push('partCode is required')
  if (!row.price?.trim()) errors.push('price is required')
  
  const price = parseFloat(row.price)
  if (isNaN(price) || price <= 0) errors.push('price must be a positive number')
  
  if (!row.category?.trim()) errors.push('category is required')
  if (!validCategories.includes(row.category)) {
    errors.push(`category must be one of: ${validCategories.join(', ')}`)
  }
  
  const stock = row.stock ? parseInt(row.stock, 10) : 0
  if (isNaN(stock) || stock < 0) errors.push('stock must be a non-negative number')
  
  return { isValid: errors.length === 0, errors, price, stock }
}

async function main() {
  console.log(`\n${dryRun ? 'DRY RUN' : 'IMPORTING'}`)
  console.log('=' .repeat(50))

  if (!csvFile) {
    console.error('Error: Please provide a CSV file path')
    console.log('\nUsage:')
    console.log('  node scripts/import-spares-for-ekon450m1v1.mjs spares.csv --dry-run')
    console.log('  node scripts/import-spares-for-ekon450m1v1.mjs spares.csv --apply')
    console.log('\nExpected CSV columns:')
    console.log('  name,partCode,price,category,function,replacementCycle,material,quality,stock')
    process.exit(1)
  }

  if (!fs.existsSync(csvFile)) {
    console.error(`Error: File not found: ${csvFile}`)
    process.exit(1)
  }

  // Get EKON450M1V1 bike reference
  const bikeV1 = await client.fetch(
    `*[_type == "bike" && name == "EKON450M1V1"][0]{_id}`
  )

  if (!bikeV1) {
    console.error('Error: EKON450M1V1 bike not found in Sanity')
    process.exit(1)
  }

  console.log(`Found EKON450M1V1 bike: ${bikeV1._id}`)
  console.log(`Reading CSV: ${csvFile}`)

  // Read and parse CSV
  const content = fs.readFileSync(csvFile, 'utf-8')
  const rows = parseCSV(content)

  console.log(`\nFound ${rows.length} rows to import`)

  // Validate rows
  const validRows = []
  const invalidRows = []

  for (const row of rows) {
    const validation = validateRow(row)
    if (validation.isValid) {
      validRows.push({ ...row, ...validation })
    } else {
      invalidRows.push({ ...row, errors: validation.errors })
    }
  }

  console.log(`\n✓ Valid rows: ${validRows.length}`)
  if (invalidRows.length > 0) {
    console.log(`✗ Invalid rows: ${invalidRows.length}`)
    invalidRows.forEach((row) => {
      console.log(`  Line ${row._lineNumber}: ${row.name || 'Unknown'}`)
      row.errors.forEach((err) => console.log(`    - ${err}`))
    })
  }

  if (validRows.length === 0) {
    console.log('\nNo valid rows to import. Fix errors and try again.')
    process.exit(1)
  }

  // Check for existing spares with same partCode
  const existingCodes = await client.fetch(
    `*[_type == "sparePart" && partCode in ${JSON.stringify(validRows.map(r => r.partCode))}]{partCode}`
  )
  const existingCodeSet = new Set(existingCodes.map(s => s.partCode))

  const newRows = []
  const duplicateRows = []

  for (const row of validRows) {
    if (existingCodeSet.has(row.partCode)) {
      duplicateRows.push(row)
    } else {
      newRows.push(row)
    }
  }

  console.log(`\nNew spares: ${newRows.length}`)
  if (duplicateRows.length > 0) {
    console.log(`Already exist (will be skipped): ${duplicateRows.length}`)
    duplicateRows.forEach((row) => {
      console.log(`  - ${row.partCode}: ${row.name}`)
    })
  }

  // Preview
  console.log('\nNew spares to import:')
  newRows.forEach((row, index) => {
    console.log(`  ${index + 1}. ${row.name} (${row.partCode}) - KES ${row.price}`)
  })

  if (dryRun) {
    console.log(`\n⚠ This was a dry run. Use --apply to execute the import.`)
    console.log(`Command: node scripts/import-spares-for-ekon450m1v1.mjs ${csvFile} --apply`)
    return
  }

  // Import
  console.log('\nImporting...')
  const transaction = client.transaction()

  for (const row of newRows) {
    const doc = {
      _type: 'sparePart',
      name: row.name,
      partCode: row.partCode,
      price: row.price,
      category: row.category,
      stock: row.stock,
      isActive: true,
      ...(row.function && { function: row.function }),
      ...(row.replacementCycle && { replacementCycle: row.replacementCycle }),
      ...(row.material && { material: row.material }),
      ...(row.quality && { quality: row.quality }),
      compatibleModels: [{ _type: 'reference', _ref: bikeV1._id }]
    }

    transaction.create(doc)
  }

  await transaction.commit()
  console.log(`\n✓ Successfully imported ${newRows.length} spares for EKON450M1V1`)
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
