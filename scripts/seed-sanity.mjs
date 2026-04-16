import dotenv from 'dotenv'
import {createClient} from '@sanity/client'
import {readFile} from 'node:fs/promises'
import path from 'node:path'

dotenv.config({path: '.env.local'})

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-04-15'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET.')
  process.exit(1)
}

if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN. Add it to .env.local before seeding.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

const mimeByExt = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
}

const toSlug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const assetCache = new Map()

async function uploadImageFromPublic(imagePath) {
  if (!imagePath || !imagePath.startsWith('/')) {
    return null
  }

  if (assetCache.has(imagePath)) {
    return assetCache.get(imagePath)
  }

  try {
    const decoded = decodeURIComponent(imagePath)
    const publicRelative = decoded.startsWith('/') ? decoded.slice(1) : decoded
    const filePath = path.join(process.cwd(), 'public', publicRelative)
    const buffer = await readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    const contentType = mimeByExt[ext] || 'application/octet-stream'

    const asset = await client.assets.upload('image', buffer, {
      filename: path.basename(filePath),
      contentType,
    })

    const ref = {_type: 'reference', _ref: asset._id}
    assetCache.set(imagePath, ref)
    return ref
  } catch {
    return null
  }
}

async function toImageArray(paths) {
  const refs = []
  for (const imagePath of paths || []) {
    const assetRef = await uploadImageFromPublic(imagePath)
    if (assetRef) {
      refs.push({_type: 'image', asset: assetRef})
    }
  }
  return refs
}

async function toSingleImage(pathValue) {
  const assetRef = await uploadImageFromPublic(pathValue)
  return assetRef ? {_type: 'image', asset: assetRef} : undefined
}

async function seed() {
  const dataModule = await import('../lib/data.ts')
  const {bikes, spareParts, gadgets, serviceLocations} = dataModule

  const bikeCategoryMap = new Map()
  for (const bike of bikes) {
    const id = `category-bike-${toSlug(bike.category)}`
    bikeCategoryMap.set(bike.category, id)
  }

  const spareCategoryMap = new Map()
  for (const part of spareParts) {
    const id = `category-spare-${toSlug(part.category)}`
    spareCategoryMap.set(part.category, id)
  }

  const bikeDocIdByName = new Map()
  for (const bike of bikes) {
    bikeDocIdByName.set(bike.name, `bike-${bike.id}`)
  }

  const bikeDocs = []
  for (const bike of bikes) {
    bikeDocs.push({
      _id: `bike-${bike.id}`,
      _type: 'bike',
      name: bike.name,
      category: {_type: 'reference', _ref: bikeCategoryMap.get(bike.category)},
      price: bike.price,
      sku: bike.SKU,
      shortDescription: bike.short_description,
      images: await toImageArray(bike.images),
      stock: bike.stock,
      motor: bike.motor,
      range: bike.range,
      battery: bike.battery,
      speed: bike.speed,
      chargingTime: bike.charging_time,
      isActive: true,
    })
  }

  const spareDocs = []
  for (const part of spareParts) {
    spareDocs.push({
      _id: `spare-${part.id}`,
      _type: 'sparePart',
      name: part.name,
      partCode: part.part_code,
      price: part.price,
      category: part.category,
      compatibleModels: part.compatible_models
        .map((modelName) => bikeDocIdByName.get(modelName))
        .filter(Boolean)
        .map((ref) => ({_type: 'reference', _ref: ref})),
      function: part.function,
      replacementCycle: part.replacement_cycle,
      stock: part.stock,
      image: await toSingleImage(part.image),
      material: part.material,
      quality: part.quality,
      isActive: true,
    })
  }

  const gadgetDocs = []
  for (const gadget of gadgets) {
    gadgetDocs.push({
      _id: `gadget-${gadget.id}`,
      _type: 'gadget',
      name: gadget.name,
      price: gadget.price,
      images: await toImageArray(gadget.images),
      features: gadget.features,
      compatibility: gadget.compatibility,
      category: gadget.category,
      technicalDetails: gadget.technical_details,
      stock: 40,
      isActive: true,
    })
  }

  const serviceDocs = serviceLocations.map((location) => ({
    _id: `service-${location.id}`,
    _type: 'serviceLocation',
    name: location.name,
    city: location.city,
    area: location.area,
    address: location.address,
    phone: location.phone,
    whatsapp: location.whatsapp,
    services: location.services,
    hours: location.hours,
    mapLink: location.map_link,
    batterySwapping: location.battery_swapping,
    isActive: true,
  }))

  const categoryDocs = [
    ...Array.from(bikeCategoryMap.entries()).map(([name, id]) => ({
      _id: id,
      _type: 'category',
      name,
      slug: {current: toSlug(name)},
      type: 'bike',
      description: `${name} bike category`,
    })),
    ...Array.from(spareCategoryMap.entries()).map(([name, id]) => ({
      _id: id,
      _type: 'category',
      name,
      slug: {current: toSlug(name)},
      type: 'sparePart',
      description: `${name} spare category`,
    })),
  ]

  const brandDoc = {
    _id: 'brand-spiro',
    _type: 'brand',
    name: 'Spiro',
    slug: {current: 'spiro'},
    description: 'Spiro EV bikes, spares, and rider accessories',
  }

  const productDocs = [
    ...bikeDocs.map((bike) => ({
      _id: `product-${bike._id}`,
      _type: 'product',
      name: bike.name,
      slug: {current: toSlug(bike.name)},
      productType: 'bike',
      brand: {_type: 'reference', _ref: 'brand-spiro'},
      category: bike.category,
      sku: bike.sku,
      price: bike.price,
      stock: bike.stock,
      images: bike.images,
      description: bike.shortDescription,
      isActive: true,
    })),
    ...spareDocs.map((spare) => ({
      _id: `product-${spare._id}`,
      _type: 'product',
      name: spare.name,
      slug: {current: toSlug(spare.name)},
      productType: 'sparePart',
      brand: {_type: 'reference', _ref: 'brand-spiro'},
      category: {_type: 'reference', _ref: spareCategoryMap.get(spare.category)},
      sku: spare.partCode,
      price: spare.price,
      stock: spare.stock,
      images: spare.image ? [spare.image] : [],
      description: spare.function,
      isActive: true,
    })),
    ...gadgetDocs.map((gadget) => ({
      _id: `product-${gadget._id}`,
      _type: 'product',
      name: gadget.name,
      slug: {current: toSlug(gadget.name)},
      productType: 'gadget',
      brand: {_type: 'reference', _ref: 'brand-spiro'},
      category: {_type: 'reference', _ref: 'category-spare-general'},
      sku: `GAD-${toSlug(gadget.name).toUpperCase().slice(0, 12)}`,
      price: gadget.price,
      stock: gadget.stock,
      images: gadget.images,
      description: gadget.compatibility,
      isActive: true,
    })),
  ]

  const globalDocs = [
    {
      _id: 'siteSettings',
      _type: 'siteSettings',
      siteName: 'SPIRO SPARES',
      siteDescription:
        'Genuine Spiro EV spares, bikes, gadgets, and service support across Nairobi and Kenya.',
      contactEmail: 'info@spirospares.com',
      contactPhone: '+254733959383',
      whatsappNumber: '+254733959383',
      address:
        'Dunga Close, Near Car & General Roundabout, Industrial Area, Nairobi, Kenya',
      businessHours: 'Mon-Sat: 8AM-6PM',
    },
    {
      _id: 'navigation',
      _type: 'navigation',
      headerLinks: [
        {label: 'Home', href: '/'},
        {label: 'Bikes', href: '/bikes'},
        {label: 'Spares', href: '/spares'},
        {label: 'Gadgets', href: '/gadgets'},
        {label: 'Services', href: '/services'},
      ],
      footerLinks: [
        {label: 'About', href: '/about'},
        {label: 'Contact', href: '/contact'},
        {label: 'Insurance', href: '/insurance'},
      ],
    },
    {
      _id: 'seoDefaults',
      _type: 'seoDefaults',
      defaultTitle: 'SPIRO SPARES',
      defaultDescription:
        'Buy genuine Spiro EV spares, bikes, and rider gadgets with service support in Kenya.',
    },
    {
      _id: 'homePage',
      _type: 'homePage',
      headline: 'Spares at Your Doorstep',
      subheadline:
        'From electric bikes to fast-moving spares and service support, SPIRO SPARES helps riders scale with confidence.',
    },
  ]

  const docs = [
    ...globalDocs,
    ...categoryDocs,
    brandDoc,
    ...bikeDocs,
    ...spareDocs,
    ...gadgetDocs,
    ...serviceDocs,
    ...productDocs,
  ]

  const tx = client.transaction()

  for (const document of docs) {
    tx.createOrReplace(document)
  }

  await tx.commit()
  console.log(`Seeded ${docs.length} documents into Sanity.`)
}

seed().catch((error) => {
  console.error('Failed to seed Sanity:', error)
  process.exit(1)
})