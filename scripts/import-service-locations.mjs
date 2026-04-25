import dotenv from 'dotenv'
import {createClient} from '@sanity/client'

dotenv.config({path: '.env.local'})

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-04-15',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const locations = [
  {
    name: "Bishan Plaza",
    city: "Nairobi",
    area: "Westlands",
    address: "Westlands, Nairobi",
    hours: "12:00 AM - 12:00 AM (24 Hours)",
    mapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.817925416544!2d36.8068443!3d-1.2655389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10e4e0e6e6e7%3A0x6b5f5f5f5f5f5f5!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1234567890"
  },
  {
    name: "Roasters",
    city: "Nairobi",
    area: "Thika Road",
    address: "Roasters, Thika Road",
    hours: "12:00 AM - 12:00 AM (24 Hours)",
    mapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.817925416544!2d36.8068443!3d-1.2655389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10e4e0e6e6e7%3A0x6b5f5f5f5f5f5f5!2sThika%20Road%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1234567890"
  },
  {
    name: "Umoja (Phase 1)",
    city: "Nairobi",
    area: "Umoja Phase 1",
    address: "Umoja Phase 1, Nairobi",
    hours: "06:00 AM - 10:00 PM",
    mapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.817925416544!2d36.8068443!3d-1.2655389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10e4e0e6e6e7%3A0x6b5f5f5f5f5f5f5!2sUmoja%20Phase%201%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1234567890"
  },
  {
    name: "Kayole",
    city: "Nairobi",
    area: "Kayole Spine Road",
    address: "Kayole Spine Road, Nairobi",
    hours: "06:00 AM - 10:00 PM",
    mapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.817925416544!2d36.8068443!3d-1.2655389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10e4e0e6e6e7%3A0x6b5f5f5f5f5f5f5!2sKayole%20Spine%20Road%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1234567890"
  },
  {
    name: "Industrial Area",
    city: "Nairobi",
    area: "Industrial Area",
    address: "Dunga Close, Nairobi",
    hours: "06:00 AM - 10:00 PM",
    mapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.817925416544!2d36.8068443!3d-1.2655389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10e4e0e6e6e7%3A0x6b5f5f5f5f5f5f5!2sIndustrial%20Area%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1234567890"
  },
  {
    name: "Stanmerpark",
    city: "Nairobi",
    area: "Joseph Kangethe Road",
    address: "Joseph Kangethe Road, Nairobi",
    hours: "06:00 AM - 10:00 PM",
    mapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.817925416544!2d36.8068443!3d-1.2655389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10e4e0e6e6e7%3A0x6b5f5f5f5f5f5f5!2sJoseph%20Kangethe%20Road%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1234567890"
  }
]

async function importServiceLocations() {
  const dryRun = !process.argv.includes('--apply')
  
  console.log(`Found ${locations.length} service locations to import`)
  
  const tx = client.transaction()
  
  locations.forEach((loc, index) => {
    const docId = `service-${loc.name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}`
    console.log(`\n${index + 1}. ${loc.name}`)
    console.log(`   ID: ${docId}`)
    console.log(`   Address: ${loc.address}`)
    console.log(`   Hours: ${loc.hours}`)
    
    if (dryRun) {
      console.log('   [DRY RUN] Would create service location')
      return
    }
    
    tx.createOrReplace({
      _id: docId,
      _type: 'serviceLocation',
      name: loc.name,
      city: loc.city,
      area: loc.area,
      address: loc.address,
      hours: loc.hours,
      mapLink: loc.mapLink,
      batterySwapping: true,
      isActive: true,
    })
  })
  
  if (dryRun) {
    console.log(`\nDry run complete. Would import ${locations.length} service locations`)
    console.log('Run with --apply to actually import')
    return
  }
  
  await tx.commit()
  console.log(`\nSuccessfully imported ${locations.length} service locations`)
}

importServiceLocations().catch(console.error)
