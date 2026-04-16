# 🚀 Sanity CMS Complete Setup Guide

## Installation & Deployment Steps

### Step 1: Install Dependencies
```bash
npm install
# This will install all the new Sanity packages
```

### Step 2: Configure Environment Variables

Update your `.env.local` file with your Sanity project credentials:

```env
# Existing
NEXT_PUBLIC_SANITY_PROJECT_ID=ksr83qp0
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-04-15

# Optional - for private dataset access (if needed)
# SANITY_API_READ_TOKEN=your_read_token_here
```

### Step 3: Build & Test Locally

```bash
# Build the project
npm run build

# Run locally to test Sanity Studio
npm run dev
```

Then navigate to: `http://localhost:3000/studio`

### Step 4: Deploy to Cloudflare Pages

Since we removed static export to enable Sanity Studio, deployment process changes:

**Option A: Deploy as Cloudflare Pages with Functions (Recommended)**
```bash
npm run build
npm install -g wrangler
wrangler pages deploy out --project-name spirospares
```

**Option B: Deploy to Vercel (Alternative)**
```bash
npm install -g vercel
vercel --prod
```

### Step 5: Access Sanity Studio

After deployment:
- **Local**: `http://localhost:3000/studio`
- **Production**: `https://spirospares.pages.dev/studio` (or your Cloudflare domain)

---

## 📋 Sanity Content Types (Schemas)

### 1. **Bikes** 🏍️
Fields:
- Name, Category (reference), Price, SKU
- Short & Long Description
- Images (multiple with hotspots)
- Stock Quantity
- Specs: Motor, Range, Battery, Speed, Charging Time
- Active Status

### 2. **Spare Parts** 🔧
Fields:
- Name, Part Code, Price, Category
- Compatible Models (reference to bikes)
- Function, Replacement Cycle
- Stock, Image
- Material, Quality Standards
- Active Status

### 3. **Gadgets** ⚡
Fields:
- Name, Price, Multiple Images
- Features (array), Compatibility
- Category (Phone Holders, Chargers, Safety, Security)
- Technical Details
- Stock, Full Description
- Active Status

### 4. **Service Locations** 📍
Fields:
- Name, City, Area, Address
- Phone, WhatsApp
- Services Offered (array)
- Operating Hours
- Google Maps Link
- Battery Swapping Available
- Latitude/Longitude
- Active Status

### 5. **Categories** 🏷️
Fields:
- Name, Slug
- Type (Bike or Spare Part)
- Description, Image
- Type-specific organization

### 6. **Hero Sections** 🎨
Fields:
- Page (Home, Bikes, Spares, Gadgets)
- Title, Subtitle
- Background Image
- CTA Button Text & Link

### 7. **Pages** 📄
Fields:
- Title, Slug
- Content (rich text blocks)
- SEO Title & Description
- Published Status

### 8. **Site Settings** ⚙️
Fields:
- Site Name, Description, Logo
- Contact Email, Phone, WhatsApp
- Social Media Links
- Physical Address
- Business Hours

---

## 🎛️ Admin Panel (Desk Structure)

The Sanity Studio dashboard includes:

```
📊 Dashboard
├── 🏠 Dashboard / Site Settings
├── 🏍️ Bikes
├── 🔧 Spare Parts
├── ⚡ Gadgets & Accessories
├── 📍 Service Locations
├── 🎨 Hero Sections
├── 📄 Pages
├── 🏷️ Categories
└── ⚙️ Settings
```

---

## ✨ Key Features

### Automatic Image Handling
- Sanity automatically optimizes images
- CDN delivery via `cdn.sanity.io`
- Responsive image generation with hotspots

### Type Safety
- Full TypeScript interfaces for all content types
- Auto-generated types from your Sanity schema
- Type-safe GROQ queries

### Content Relationships
- Link bikes to categories
- Link spare parts to compatible bike models
- Reference-based relationships (not duplicated data)

### Featured Content
- Automatic featured products query for homepage
- First 14 active spares and gadgets
- Easy to manage from Sanity UI

### Content Security
- Private/Published status on pages
- Active/Inactive toggles on products
- Role-based access (configure in Sanity settings)

---

## 🔗 GROQ Queries Available

### Product Queries
- `getAllBikes()` - All active bikes
- `getBikeById(id)` - Single bike details
- `getAllSpareParts()` - All spare parts
- `getSparePartById(id)` - Single part details
- `getSparePartsByCategory(category)` - Filtered spares
- `getAllGadgets()` - All gadgets
- `getGadgetById(id)` - Single gadget
- `getGadgetsByCategory(category)` - Filtered gadgets

### Service Queries
- `getAllServiceLocations()` - All service centers
- `getServiceLocationsByCity(city)` - City-specific

### Content Queries
- `getHeroSection(page)` - Hero for specific page
- `getPageBySlug(slug)` - Get page by URL slug
- `getAllPages()` - All published pages

### Settings Queries
- `getSiteSettings()` - Global site config
- `getAllCategories()` - All categories
- `getCategoriesByType(type)` - Filtered categories

### Featured Queries
- `getHomepageFeaturedProducts()` - Homepage featured section

---

## 📝 Usage Examples

### In a Next.js Page Component

```typescript
import {getAllBikes} from '@/lib/sanity/queries-data'

export default async function BikesPage() {
  const bikes = await getAllBikes()
  
  return (
    <div>
      {bikes.map((bike) => (
        <div key={bike._id}>
          <h2>{bike.name}</h2>
          <p>KES {bike.price.toLocaleString()}</p>
          {bike.images?.[0] && (
            <img src={bike.images[0].asset.url} alt={bike.name} />
          )}
        </div>
      ))}
    </div>
  )
}
```

### In a Client Component

```typescript
'use client'
import {useEffect, useState} from 'react'
import {getAllGadgets} from '@/lib/sanity/queries-data'

export function GadgetsList() {
  const [gadgets, setGadgets] = useState([])
  
  useEffect(() => {
    getAllGadgets().then(setGadgets)
  }, [])
  
  return (
    <div>
      {gadgets.map((gadget) => (
        <div key={gadget._id}>{gadget.name}</div>
      ))}
    </div>
  )
}
```

---

## 👺 Initial Content Migration (From data.ts)

Your existing data in `lib/data.ts` can be migrated to Sanity:

1. **Log into Sanity Studio** at `/studio`
2. **Create Categories** first:
   - Utility Cargo, Urban Commuter, Commercial Delivery, etc.
3. **Add Bikes** using the Bikes section
4. **Add Spare Parts** with category and compatible model references
5. **Add Gadgets** with proper categories
6. **Add Service Locations** with their details
7. **Configure Site Settings** with your company info

---

## 🔄 Build & Deploy Commands

```bash
# Development
npm run dev

# Production Build
npm run build

# Lint
npm run lint

# Deploy to Cloudflare
npm run build && npx wrangler pages deploy out --project-name spirospares

# Deploy to Vercel (Alternative)
vercel --prod
```

---

## 🛡️ Security & Access

### Public Queries (Read-Only)
- All product data is public by default
- Content visible to anyone accessing the site

### API Tokens (Optional)
- Add `SANITY_API_READ_TOKEN` for private datasets
- Configure dataset visibility in Sanity dashboard
- Add `SANITY_API_WRITE_TOKEN` for CI/CD content updates

### Admin Access
- Control who can edit content via Sanity member settings
- Role-based permissions (Viewer, Editor, Admin)
- Activity logs for all changes

---

## 📊 Performance Optimizations

### Image Optimization
```typescript
import {urlFor} from '@/lib/sanity/image'

// Get optimized image URL
const imageUrl = urlFor(imageObject)
  .width(400)
  .height(300)
  .fit('crop')
  .url()
```

### Query Caching
- Next.js automatically caches static data at build time
- Configure revalidate intervals for dynamic updates
- Use ISR (Incremental Static Regeneration) for content

### CDN Delivery
- All images served from Sanity CDN
- Automatic format conversion (WebP, etc.)
- Regional edge caching

---

## ❓ Troubleshooting

### Sanity Studio Not Loading
- Check if you're on http://localhost:3000/studio (local dev)
- Ensure `npm install` completed with Sanity packages
- Clear browser cache and hard refresh (Ctrl+Shift+R)

### Images Not Showing
- Verify image is uploaded in Sanity as an asset
- Check `cdn.sanity.io` is not blocked in your network
- Ensure image asset has proper URL

### Build Errors
- Run `npm install` to ensure all dependencies installed
- Check `.env.local` has correct SANITY_PROJECT_ID and DATASET
- Clear `.next` folder: `rm -rf .next` then `npm run build`

### Queries Returning Null
- Verify content is marked as "Active" in Sanity
- Check GROQ query syntax in `lib/sanity/queries.ts`
- Test query in Sanity Vision tool (right sidebar in Studio)

---

## 📚 Additional Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Next.js Integration](https://www.sanity.io/docs/getting-started-with-next-js)
- [Sanity Studio Customization](https://www.sanity.io/docs/studio-configuration)
- [Image Optimization](https://www.sanity.io/docs/image-url)

---

## 🎯 Next Steps

1. **Install dependencies**: `npm install`
2. **Start dev server**: `npm run dev`
3. **Visit Sanity Studio**: `http://localhost:3000/studio`
4. **Create sample content**: Bikes, Spare Parts, Gadgets
5. **Build & Deploy**: `npm run build && wrangler pages deploy out`
6. **Access live studio**: Your Cloudflare domain `/studio`

---

**Your complete CMS is now ready! 🚀**
