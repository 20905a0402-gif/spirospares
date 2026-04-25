import {sanityFetch} from './client'
import {
  type Bike as LegacyBike,
  type Gadget as LegacyGadget,
  type SparePart as LegacySparePart,
  type ServiceLocation as LegacyServiceLocation,
} from '@/lib/data'
import {
  bikesQuery,
  bikeDetailsQuery,
  sparePartsQuery,
  sparePartDetailsQuery,
  gadgetsQuery,
  gadgetDetailsQuery,
  serviceLocationsQuery,
  serviceLocationsByCityQuery,
  serviceLocationDetailsQuery,
  heroSectionQuery,
  pageQuery,
  allPagesQuery,
  homepageFeaturedProductsQuery,
  siteSettingsQuery,
  categoriesQuery,
  categoriesByTypeQuery,
  sparePartsByCategoryQuery,
  gadgetsByCategoryQuery,
} from './queries'

// Types
export interface Bike {
  _id: string
  name: string
  category: {_id: string; name: string; slug: {current: string}}
  price: number
  sku: string
  shortDescription?: string
  stock: number
  motor?: string
  range?: string
  battery?: string
  speed?: string
  chargingTime?: string
  images?: Array<{asset: {url: string}; alt?: string}>
}

export interface SparePart {
  _id: string
  name: string
  partCode: string
  price: number
  category: string
  stock: number
  image?: {asset: {url: string}; alt?: string}
  material?: string
  quality?: string
  compatibleModels?: Array<{_id: string; name: string}>
  function?: string
  replacementCycle?: string
}

export interface Gadget {
  _id: string
  name: string
  price: number
  category: string
  stock: number
  images?: Array<{asset: {url: string}; alt?: string}>
  features?: string[]
  compatibility?: string
  technicalDetails?: string
}

export interface ServiceLocation {
  _id: string
  name: string
  city: string
  area?: string
  address: string
  phone?: string
  whatsapp?: string
  services?: string[]
  hours?: string
  mapLink?: string
  batterySwapping?: boolean
  latitude?: number
  longitude?: number
}

export interface HeroSection {
  _id: string
  page: string
  title: string
  subtitle?: string
  backgroundImage?: {asset: {url: string}; alt?: string}
  ctaText?: string
  ctaLink?: string
}

export interface Page {
  _id: string
  title: string
  slug: {current: string}
  content?: any
  seoTitle?: string
  seoDescription?: string
}

export interface SiteSettings {
  _id: string
  siteName?: string
  siteDescription?: string
  contactEmail?: string
  contactPhone?: string
  whatsappNumber?: string
  address?: string
  businessHours?: string
  logo?: {asset: {url: string}}
  socialLinks?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
}

export interface Category {
  _id: string
  name: string
  slug: {current: string}
  type: 'bike' | 'sparePart'
  description?: string
  image?: {asset: {url: string}; alt?: string}
}

const firstImageUrl = <T extends {asset?: {url?: string}}>(items?: T[]) =>
  items?.find((item) => Boolean(item.asset?.url))?.asset?.url ?? ''

const DEFAULT_BIKE_IMAGE = '/images/bikes/bike6.png'
const DEFAULT_SPARE_IMAGE = '/images/spares/Drive%20Chain%20(Complete%20Loop).png'
const DEFAULT_GADGET_IMAGE = '/images/gadgets/Urban%20Safety%20Helmet%20Pro.png'

const bikeNames = [
  'COMMANDO',
  'VEO',
  'EKON400M2',
  'EKON400M1',
  'EKON450M1',
  'EKON450M1V1',
  'EKON450M1V2',
  'EKON450M2',
  'EKON450M2V2',
  'EKON450M3',
] as const
type BikeName = (typeof bikeNames)[number]

const safeBikeName = (name: string): BikeName => {
  return bikeNames.includes(name as BikeName) ? (name as BikeName) : 'VEO'
}

const spareCategories = ['Body & Trim', 'Frame & Suspension', 'General', 'Electrical'] as const
type SpareCategory = (typeof spareCategories)[number]

const safeSpareCategory = (category: string): SpareCategory => {
  return spareCategories.includes(category as SpareCategory)
    ? (category as SpareCategory)
    : 'General'
}

const gadgetCategories = ['Phone holders', 'Chargers', 'Safety', 'Security'] as const
type GadgetCategory = (typeof gadgetCategories)[number]

const safeGadgetCategory = (category: string): GadgetCategory => {
  return gadgetCategories.includes(category as GadgetCategory)
    ? (category as GadgetCategory)
    : 'Safety'
}

const mapBike = (bike: Bike): LegacyBike => {
  return {
    id: bike._id,
    name: safeBikeName(bike.name),
    category: bike.category?.name ?? 'Electric Bike',
    price: bike.price,
    SKU: bike.sku,
    short_description: bike.shortDescription ?? '',
    images:
      bike.images?.map((image) => image.asset.url).filter(Boolean).length
        ? bike.images.map((image) => image.asset.url).filter(Boolean)
        : [DEFAULT_BIKE_IMAGE],
    stock: bike.stock,
    motor: bike.motor ?? '',
    range: bike.range ?? '',
    battery: bike.battery ?? '',
    speed: bike.speed ?? '',
    charging_time: bike.chargingTime ?? '',
  }
}

const mapSparePart = (part: SparePart): LegacySparePart => {
  return {
    id: part._id,
    name: part.name,
    part_code: part.partCode,
    price: part.price,
    category: safeSpareCategory(part.category),
    compatible_models:
      part.compatibleModels?.map((model) => safeBikeName(model.name)) ?? [],
    function: part.function ?? '',
    replacement_cycle: part.replacementCycle ?? '',
    stock: part.stock,
    image: firstImageUrl(part.image ? [part.image] : []) || DEFAULT_SPARE_IMAGE,
    material: part.material ?? '',
    quality: part.quality ?? '',
  }
}

const mapGadget = (gadget: Gadget): LegacyGadget => {
  return {
    id: gadget._id,
    name: gadget.name,
    price: gadget.price,
    stock: gadget.stock,
    images:
      gadget.images?.map((image) => image.asset.url).filter(Boolean).length
        ? gadget.images.map((image) => image.asset.url).filter(Boolean)
        : [DEFAULT_GADGET_IMAGE],
    features: gadget.features ?? [],
    compatibility: gadget.compatibility ?? '',
    category: safeGadgetCategory(gadget.category),
    technical_details: gadget.technicalDetails ?? '',
  }
}

const mapServiceLocation = (location: ServiceLocation): LegacyServiceLocation => {
  return {
    id: location._id,
    name: location.name,
    city: location.city,
    area: location.area ?? '',
    address: location.address,
    phone: location.phone ?? '',
    whatsapp: location.whatsapp ?? '',
    services: location.services ?? [],
    hours: location.hours ?? '',
    map_link: location.mapLink ?? '',
    battery_swapping: location.batterySwapping ?? false,
  }
}

// Bike Data Fetchers
export async function getAllBikes(): Promise<Bike[]> {
  const data = await sanityFetch<Bike[]>(bikesQuery)
  return data || []
}

export async function getLegacyBikes(): Promise<LegacyBike[]> {
  const data = await getAllBikes()
  console.log('✅ Bikes loaded from Sanity CMS:', data.length, 'bikes')
  return data.map(mapBike)
}

export async function getBikeById(id: string): Promise<Bike | null> {
  return await sanityFetch<Bike>(bikeDetailsQuery, {id})
}

export async function getLegacyBikeById(id: string): Promise<LegacyBike | null> {
  const bike = await getBikeById(id)
  return bike ? mapBike(bike) : null
}

// Spare Parts Data Fetchers
export async function getAllSpareParts(): Promise<SparePart[]> {
  const data = await sanityFetch<SparePart[]>(sparePartsQuery)
  return data || []
}

export async function getLegacySpareParts(): Promise<LegacySparePart[]> {
  const data = await getAllSpareParts()
  return data.map(mapSparePart)
}

export async function getSparePartById(id: string): Promise<SparePart | null> {
  return await sanityFetch<SparePart>(sparePartDetailsQuery, {id})
}

export async function getLegacySparePartById(id: string): Promise<LegacySparePart | null> {
  const part = await getSparePartById(id)
  return part ? mapSparePart(part) : null
}

export async function getSparePartsByCategory(
  category: string
): Promise<SparePart[]> {
  const data = await sanityFetch<SparePart[]>(sparePartsByCategoryQuery, {
    category,
  })
  return data || []
}

export async function getLegacySparePartsByCategory(
  category: string
): Promise<LegacySparePart[]> {
  const data = await getSparePartsByCategory(category)
  return data.map(mapSparePart)
}

// Gadgets Data Fetchers
export async function getAllGadgets(): Promise<Gadget[]> {
  const data = await sanityFetch<Gadget[]>(gadgetsQuery)
  return data || []
}

export async function getLegacyGadgets(): Promise<LegacyGadget[]> {
  const data = await getAllGadgets()
  return data.map(mapGadget)
}

export async function getGadgetById(id: string): Promise<Gadget | null> {
  return await sanityFetch<Gadget>(gadgetDetailsQuery, {id})
}

export async function getLegacyGadgetById(id: string): Promise<LegacyGadget | null> {
  const gadget = await getGadgetById(id)
  return gadget ? mapGadget(gadget) : null
}

export async function getGadgetsByCategory(category: string): Promise<Gadget[]> {
  const data = await sanityFetch<Gadget[]>(gadgetsByCategoryQuery, {category})
  return data || []
}

export async function getLegacyGadgetsByCategory(category: string): Promise<LegacyGadget[]> {
  const data = await getGadgetsByCategory(category)
  return data.map(mapGadget)
}

// Service Locations Data Fetchers
export async function getAllServiceLocations(): Promise<ServiceLocation[]> {
  const data = await sanityFetch<ServiceLocation[]>(serviceLocationsQuery)
  return data || []
}

export async function getLegacyServiceLocations(): Promise<LegacyServiceLocation[]> {
  const data = await getAllServiceLocations()
  return data.map(mapServiceLocation)
}

export async function getLegacyServiceLocationById(
  id: string
): Promise<LegacyServiceLocation | null> {
  const location = await sanityFetch<ServiceLocation>(serviceLocationDetailsQuery, {id})
  return location ? mapServiceLocation(location) : null
}

export async function getServiceLocationsByCity(
  city: string
): Promise<ServiceLocation[]> {
  const data = await sanityFetch<ServiceLocation[]>(
    serviceLocationsByCityQuery,
    {city}
  )
  return data || []
}

export async function getLegacyServiceLocationsByCity(
  city: string
): Promise<LegacyServiceLocation[]> {
  const data = await getServiceLocationsByCity(city)
  return data.map(mapServiceLocation)
}

// Hero Sections Data Fetchers
export async function getHeroSection(page: string): Promise<HeroSection | null> {
  return await sanityFetch<HeroSection>(heroSectionQuery, {page})
}

// Pages Data Fetchers
export async function getPageBySlug(slug: string): Promise<Page | null> {
  return await sanityFetch<Page>(pageQuery, {slug})
}

export async function getAllPages(): Promise<Page[]> {
  const data = await sanityFetch<Page[]>(allPagesQuery)
  return data || []
}

// Featured Products
export async function getHomepageFeaturedProducts(): Promise<{
  spares: SparePart[]
  gadgets: Gadget[]
} | null> {
  return await sanityFetch<{spares: SparePart[]; gadgets: Gadget[]}>(
    homepageFeaturedProductsQuery
  )
}

// Site Settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
  return await sanityFetch<SiteSettings>(siteSettingsQuery)
}

export async function getLegacySiteSettings(): Promise<{
  siteName?: string
  siteDescription?: string
  contactEmail?: string
  contactPhone?: string
  whatsappNumber?: string
  address?: string
  businessHours?: string
  socialLinks?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
} | null> {
  const settings = await getSiteSettings()
  if (!settings) {
    return null
  }

  return {
    siteName: settings.siteName,
    siteDescription: settings.siteDescription,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    whatsappNumber: settings.whatsappNumber,
    address: settings.address,
    businessHours: settings.businessHours,
    socialLinks: settings.socialLinks,
  }
}

// Categories
export async function getAllCategories(): Promise<Category[]> {
  const data = await sanityFetch<Category[]>(categoriesQuery)
  return data || []
}

export async function getCategoriesByType(
  type: 'bike' | 'sparePart'
): Promise<Category[]> {
  const data = await sanityFetch<Category[]>(categoriesByTypeQuery, {type})
  return data || []
}
