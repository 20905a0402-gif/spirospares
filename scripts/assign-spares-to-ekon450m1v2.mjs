#!/usr/bin/env node
/**
 * Script to assign all existing spare parts to EKON450M1V2 bike model
 * 
 * Usage:
 *   node scripts/assign-spares-to-ekon450m1v2.mjs --dry-run  # Preview changes
 *   node scripts/assign-spares-to-ekon450m1v2.mjs --apply    # Apply changes
 */

import dotenv from 'dotenv'
import {createClient} from '@sanity/client'

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

const dryRun = process.argv.includes('--dry-run') || !process.argv.includes('--apply')

async function main() {
  console.log(`\n${dryRun ? 'DRY RUN' : 'APPLYING CHANGES'}`)
  console.log('=' .repeat(50))

  // Get EKON450M1V2 bike reference
  const bikeV2 = await client.fetch(
    `*[_type == "bike" && name == "EKON450M1V2"][0]{_id}`
  )

  if (!bikeV2) {
    console.error('Error: EKON450M1V2 bike not found in Sanity')
    process.exit(1)
  }

  console.log(`Found EKON450M1V2 bike: ${bikeV2._id}`)

  // Get all active spare parts with their current compatible models
  const spares = await client.fetch(
    `*[_type == "sparePart" && isActive == true]{_id, name, "models": compatibleModels[]->_id}`
  )

  console.log(`\nFound ${spares.length} active spare parts`)
  console.log(`\nAnalyzing compatibility...`)

  // Find spares that are NOT already assigned to EKON450M1V2
  const sparesToUpdate = spares.filter((spare) => {
    const modelIds = spare.models || []
    return !modelIds.includes(bikeV2._id)
  })

  console.log(`\n${sparesToUpdate.length} spares need to be assigned to EKON450M1V2`)

  if (sparesToUpdate.length === 0) {
    console.log('\n✓ All spares are already assigned to EKON450M1V2')
    return
  }

  // Show preview
  console.log('\nSpares to update:')
  sparesToUpdate.forEach((spare, index) => {
    console.log(`  ${index + 1}. ${spare.name} (${spare._id})`)
    if (index >= 9 && sparesToUpdate.length > 10) {
      console.log(`  ... and ${sparesToUpdate.length - 10} more`)
      return false
    }
  })

  if (dryRun) {
    console.log(`\n⚠ This was a dry run. Use --apply to execute the changes.`)
    console.log(`Command: node scripts/assign-spares-to-ekon450m1v2.mjs --apply`)
    return
  }

  // Apply changes
  console.log('\nApplying changes...')
  const transaction = client.transaction()

  for (const spare of sparesToUpdate) {
    transaction.patch(spare._id, (patch) => {
      patch.insert('after', 'compatibleModels[-1]', [{_type: 'reference', _ref: bikeV2._id}])
    })
  }

  await transaction.commit()
  console.log(`\n✓ Successfully assigned ${sparesToUpdate.length} spares to EKON450M1V2`)
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
