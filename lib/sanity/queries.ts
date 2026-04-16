import groq from 'groq'

// ============ BIKES QUERIES ============
export const bikesQuery = groq`
  *[_type == "bike" && isActive == true] | order(name asc) {
    _id,
    name,
    category->{
      _id,
      name,
      slug
    },
    price,
    sku,
    shortDescription,
    longDescription,
    images[] {
      asset->{
        _id,
        url,
        metadata {
          dimensions
        }
      },
      alt,
      hotspot,
      crop
    },
    stock,
    motor,
    range,
    battery,
    speed,
    chargingTime
  }
`

export const bikeDetailsQuery = groq`
  *[_type == "bike" && _id == $id][0] {
    _id,
    name,
    category->{
      _id,
      name,
      slug
    },
    price,
    sku,
    shortDescription,
    longDescription,
    images[] {
      asset->{
        _id,
        url,
        metadata {
          dimensions
        }
      },
      alt,
      hotspot,
      crop
    },
    stock,
    motor,
    range,
    battery,
    speed,
    chargingTime
  }
`

export const bikesCountQuery = groq`
  count(*[_type == "bike" && isActive == true])
`

// ============ SPARE PARTS QUERIES ============
export const sparePartsQuery = groq`
  *[_type == "sparePart" && isActive == true] | order(name asc) {
    _id,
    name,
    partCode,
    price,
    category,
    compatibleModels[]->{
      _id,
      name
    },
    function,
    replacementCycle,
    stock,
    image {
      asset->{
        _id,
        url,
        metadata {
          dimensions
        }
      },
      alt,
      hotspot,
      crop
    },
    material,
    quality
  }
`

export const sparePartDetailsQuery = groq`
  *[_type == "sparePart" && _id == $id][0] {
    _id,
    name,
    partCode,
    price,
    category,
    compatibleModels[]->{
      _id,
      name
    },
    function,
    replacementCycle,
    stock,
    image {
      asset->{
        _id,
        url,
        metadata {
          dimensions
        }
      },
      alt,
      hotspot,
      crop
    },
    material,
    quality
  }
`

export const sparePartsByCategoryQuery = groq`
  *[_type == "sparePart" && category == $category && isActive == true] | order(name asc) {
    _id,
    name,
    partCode,
    price,
    category,
    stock,
    image {
      asset->{
        _id,
        url
      },
      alt
    },
    material,
    quality
  }
`

export const sparePartsCountQuery = groq`
  count(*[_type == "sparePart" && isActive == true])
`

// ============ GADGETS QUERIES ============
export const gadgetsQuery = groq`
  *[_type == "gadget" && isActive == true] | order(name asc) {
    _id,
    name,
    price,
    images[] {
      asset->{
        _id,
        url,
        metadata {
          dimensions
        }
      },
      alt,
      hotspot,
      crop
    },
    features[],
    compatibility,
    category,
    technicalDetails,
    stock,
    description
  }
`

export const gadgetDetailsQuery = groq`
  *[_type == "gadget" && _id == $id][0] {
    _id,
    name,
    price,
    images[] {
      asset->{
        _id,
        url,
        metadata {
          dimensions
        }
      },
      alt,
      hotspot,
      crop
    },
    features[],
    compatibility,
    category,
    technicalDetails,
    stock,
    description
  }
`

export const gadgetsByCategoryQuery = groq`
  *[_type == "gadget" && category == $category && isActive == true] | order(name asc) {
    _id,
    name,
    price,
    images[] {
      asset->{
        _id,
        url
      },
      alt
    },
    features[],
    category,
    stock
  }
`

export const gadgetsCountQuery = groq`
  count(*[_type == "gadget" && isActive == true])
`

// ============ SERVICE LOCATIONS QUERIES ============
export const serviceLocationsQuery = groq`
  *[_type == "serviceLocation" && isActive == true] | order(city asc) {
    _id,
    name,
    city,
    area,
    address,
    phone,
    whatsapp,
    services[],
    hours,
    mapLink,
    batterySwapping,
    latitude,
    longitude
  }
`

export const serviceLocationsByCityQuery = groq`
  *[_type == "serviceLocation" && city == $city && isActive == true] {
    _id,
    name,
    city,
    area,
    address,
    phone,
    whatsapp,
    services[],
    hours,
    mapLink,
    batterySwapping,
    latitude,
    longitude
  }
`

export const serviceLocationDetailsQuery = groq`
  *[_type == "serviceLocation" && _id == $id][0] {
    _id,
    name,
    city,
    area,
    address,
    phone,
    whatsapp,
    services[],
    hours,
    mapLink,
    batterySwapping,
    latitude,
    longitude
  }
`

export const serviceLocationsCountQuery = groq`
  count(*[_type == "serviceLocation" && isActive == true])
`

// ============ HERO SECTIONS QUERIES ============
export const heroSectionQuery = groq`
  *[_type == "heroSection" && page == $page][0] {
    _id,
    page,
    title,
    subtitle,
    backgroundImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions
        }
      },
      alt,
      hotspot,
      crop
    },
    ctaText,
    ctaLink
  }
`

export const allHeroSectionsQuery = groq`
  *[_type == "heroSection"] {
    _id,
    page,
    title,
    subtitle,
    backgroundImage {
      asset->{
        _id,
        url
      },
      alt
    },
    ctaText,
    ctaLink
  }
`

// ============ PAGES QUERIES ============
export const pageQuery = groq`
  *[_type == "page" && slug.current == $slug && isPublished == true][0] {
    _id,
    title,
    slug,
    content,
    seoTitle,
    seoDescription
  }
`

export const allPagesQuery = groq`
  *[_type == "page" && isPublished == true] | order(title asc) {
    _id,
    title,
    slug,
    seoTitle
  }
`

// ============ FEATURED PRODUCTS QUERY ============
export const homepageFeaturedProductsQuery = groq`
  {
    "spares": *[_type == "sparePart" && isActive == true][0...14] {
      _id,
      name,
      partCode,
      price,
      category,
      stock,
      image {
        asset->{
          _id,
          url
        },
        alt
      }
    },
    "gadgets": *[_type == "gadget" && isActive == true][0...14] {
      _id,
      name,
      price,
      images[0] {
        asset->{
          _id,
          url
        },
        alt
      },
      category,
      stock
    }
  }
`

// ============ SITE SETTINGS QUERY ============
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    _id,
    siteName,
    siteDescription,
    logo {
      asset->{
        _id,
        url
      },
      alt
    },
    contactEmail,
    contactPhone,
    whatsappNumber,
    socialLinks,
    address,
    businessHours
  }
`

// ============ CATEGORIES QUERIES ============
export const categoriesQuery = groq`
  *[_type == "category"] | order(name asc) {
    _id,
    name,
    slug,
    type,
    description,
    image {
      asset->{
        _id,
        url
      },
      alt
    }
  }
`

export const categoriesByTypeQuery = groq`
  *[_type == "category" && type == $type] | order(name asc) {
    _id,
    name,
    slug,
    type,
    description,
    image {
      asset->{
        _id,
        url
      },
      alt
    }
  }
`
