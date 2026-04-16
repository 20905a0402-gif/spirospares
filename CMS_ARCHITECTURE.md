# 🎛️ Sanity CMS - Complete Implementation

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     SPIRO SPARES PLATFORM                        │
├─────────────────────────────┬───────────────────────────────────┤
│    SANITY CMS (Backend)     │   Next.js Website (Frontend)      │
├─────────────────────────────┼───────────────────────────────────┤
│  📊 Admin Dashboard         │  🌐 Website Pages                  │
│  ├── Content Editor         │  ├── /bikes                        │
│  ├── Asset Manager          │  ├── /spares                       │
│  ├── Image Optimizer        │  ├── /gadgets                      │
│  └── Publishing Workflow    │  ├── /services                     │
│                             │  └── /studio (Admin Panel)         │
│  📦 Content Types           │                                    │
│  ├── Bikes                  │  ⚡ GROQ Queries                  │
│  ├── Spare Parts            │  ├── getAllBikes()                 │
│  ├── Gadgets                │  ├── getAllSpareParts()            │
│  ├── Services               │  ├── getAllGadgets()               │
│  ├── Categories             │  ├── getSiteSettings()             │
│  ├── Hero Sections          │  └── ... (20+ queries)             │
│  ├── Pages                  │                                    │
│  └── Settings               │  📱 Frontend Components            │
│                             │  ├── Hero Banner                   │
│  🔄 Data Flow              │  ├── Product Grids                 │
│  Sanity JSON ────────────→  │  ├── Service Locator              │
│                │            │  └── Shopping Cart                 │
│                ├─GROQ─→     │                                    │
│                │            │  💾 Caching                        │
│                └─CDN─→      │  ├── Build-time static            │
│                             │  ├── ISR for dynamic              │
│                             │  └── Browser cache                 │
└─────────────────────────────┴───────────────────────────────────┘
```

## 📁 Project Structure

```
spirospares/
├── sanity/                          # Sanity configuration
│   ├── schemaTypes/                 # Content schemas
│   │   ├── index.ts                # Schema exports
│   │   ├── bike.ts                 # Bike schema
│   │   ├── sparePart.ts            # Spare part schema
│   │   ├── gadget.ts               # Gadget schema
│   │   ├── serviceLocation.ts      # Service location schema
│   │   ├── category.ts             # Category schema
│   │   ├── heroSection.ts          # Hero section schema
│   │   ├── page.ts                 # Page schema
│   │   └── siteSettings.ts         # Global settings schema
│   ├── desk.ts                      # Admin panel structure
│   └── ...
│
├── lib/
│   ├── sanity/
│   │   ├── client.ts               # Sanity client config
│   │   ├── queries.ts              # GROQ queries (20+)
│   │   ├── queries-data.ts         # Data fetchers & types
│   │   └── featured.ts             # Featured products logic
│   └── data.ts                      # Fallback data (legacy)
│
├── app/
│   ├── studio/
│   │   ├── page.tsx                # Studio entry point
│   │   └── layout.tsx              # Studio layout
│   ├── bikes/                       # Bike pages
│   │   ├── page.tsx                # Bikes listing (legacy)
│   │   ├── page-sanity.tsx         # Bikes with Sanity
│   │   └── [modelId]/...
│   ├── spares/
│   │   ├── page.tsx                # Spares listing (legacy)
│   │   ├── page-sanity.tsx         # Spares with Sanity
│   │   └── [partId]/...
│   ├── gadgets/
│   │   ├── page.tsx                # Gadgets listing (legacy)
│   │   ├── page-sanity.tsx         # Gadgets with Sanity
│   │   └── [gadgetId]/...
│   ├── services/
│   ├── checkout/
│   ├── page.tsx                    # Homepage
│   └── ...
│
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── HeroBanner.tsx
│   └── ... (existing components)
│
├── sanity.config.ts                 # Main Sanity configuration
├── next.config.mjs                  # Next.js config (no static export)
├── tsconfig.json
├── package.json
├── .env.local                       # Your Sanity credentials
└── SANITY_*.md                       # Documentation

```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# .env.local already has:
NEXT_PUBLIC_SANITY_PROJECT_ID=ksr83qp0
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-04-15
```

### 3. Start Development
```bash
npm run dev
```

### 4. Access Services
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/studio

---

## 📚 Content Schemas

### Bike Schema
```typescript
{
  name: string              # Bike model name
  category: reference       # Link to category
  price: number            # Price in KES
  sku: string              # Stock keeping unit
  motor: string            # Motor specifications
  range: string            # Battery range
  battery: string          # Battery details
  speed: string            # Top speed
  images: image[]          # Multiple product images
  stock: number            # Quantity available
  isActive: boolean        # Visibility toggle
}
```

### Spare Part Schema
```typescript
{
  name: string
  partCode: string
  price: number
  category: enum           # "Body & Trim" | "Electrical" | etc.
  compatibleModels: reference[] # Link to bikes
  function: string
  replacementCycle: string
  stock: number
  image: image
  material: string
  quality: string
  isActive: boolean
}
```

### Gadget Schema
```typescript
{
  name: string
  price: number
  images: image[]
  features: string[]
  compatibility: string
  category: enum          # "Phone holders" | "Chargers" | etc.
  technicalDetails: string
  stock: number
  isActive: boolean
}
```

*(See SANITY_SETUP_GUIDE.md for complete schemas)*

---

## 🔗 GROQ Queries Available

### Products (20+ queries)
```typescript
getAllBikes()              # All active bikes
getBikeById(id)           # Single bike with full details
getAllSpareParts()         # All spare parts
getSparePartById(id)       # Single part with details
getSparePartsByCategory()  # Filter parts by category
getAllGadgets()            # All gadgets
getGadgetById(id)         # Single gadget details
getGadgetsByCategory()     # Filter gadgets by category
```

### Services
```typescript
getAllServiceLocations()   # All service centers
getServiceLocationsByCity() # City-specific services
```

### Content
```typescript
getHeroSection(page)       # Hero for specific page
getPageBySlug(slug)        # Get page by URL
getAllPages()              # All published pages
```

### Settings
```typescript
getSiteSettings()          # Global site configuration
getAllCategories()         # All categories
getCategoriesByType()      # Filter categories
```

### Featured
```typescript
getHomepageFeaturedProducts() # Homepage featured section
```

## 💾 Data Fetching Pattern

### Server-Side (Recommended)
```typescript
import {getAllBikes} from '@/lib/sanity/queries-data'

export default async function BikesPage() {
  const bikes = await getAllBikes()  // Fetches at build time
  return <div>{/* render bikes */}</div>
}
```

### With Fallback
```typescript
import {getAllBikes} from '@/lib/sanity/queries-data'
import {bikes as fallbackBikes} from '@/lib/data'

export default async function BikesPage() {
  const sanityBikes = await getAllBikes()
  const bikes = sanityBikes.length > 0 ? sanityBikes : fallbackBikes
  return <div>{/* render bikes */}</div>
}
```

---

## 🎨 Admin Panel (Sanity Studio)

### Features
- ✅ **Visual Editor** - WYSIWYG for rich content
- ✅ **Media Library** - Manage all product images
- ✅ **Publishing** - Draft & Publish workflow
- ✅ **Relationships** - Link content together
- ✅ **Search** - Quickly find any content
- ✅ **History** - All changes tracked
- ✅ **Collaboration** - Team editing (if configured)

### Main Categories in Studio

1. **Bikes** - Create and manage bike models
2. **Spare Parts** - Product catalog for parts
3. **Gadgets** - Accessories inventory
4. **Service Locations** - Service center network
5. **Categories** - Organize products
6. **Hero Sections** - Page banners
7. **Pages** - CMS pages
8. **Settings** - Global configuration

---

## 🔄 Content Workflow

### Creating a New Bike

1. **Login** to http://localhost:3000/studio
2. **Click** "Bikes" in left sidebar
3. **Click** "Create" button
4. **Fill Form**:
   - Name: `VEO`
   - Category: Select existing or create new
   - Price: `199500`
   - Add specifications
   - Upload images
5. **Set Stock**: `24`
6. **Toggle Active**: ON
7. **Click Publish**
8. **Website Updates** - Fetch latest on rebuild

### Updating Existing Content

1. **Find Content** - Use search or browse
2. **Click to Edit** - Opens editor
3. **Make Changes** - Update Fields
4. **Preview Changes** - Right panel
5. **Publish** - Makes live (on next rebuild)

### Managing Inventory

1. **Go to Products** (Bikes/Spares/Gadgets)
2. **Click Product** to edit
3. **Update Stock** field
4. **Publish** changes
5. **Stock Updates** - Reflected on website

---

## 📊 Analytics & Insights

Sanity tracks:
- Content creation/modification timestamps
- User who made changes
- Version history with rollback
- Document revisions
- Publishing activity

**Access in Studio:**
1. Click any document
2. Click "Info" tab (bottom)
3. See history & metadata

---

## 🔐 Security & Permissions

### Dataset Settings
- **Public Read** - Website can fetch all active content
- **Private Write** - Only admin can publish
- **Webhooks** - Trigger deploys on publish (optional)

### API Tokens
- **Read Token** - Fetch data (optional, auto-use public API)
- **Write Token** - Publishing (only needed for CI/CD)

### Admin Access
- Control via Sanity member settings
- Email-based invitations
- Role-based permissions (Viewer/Editor/Admin)

---

## 🚀 Deployment

### Build Locally
```bash
npm run build
```

### Deploy to Cloudflare Pages
```bash
npm run build
npx wrangler pages deploy out --project-name spirospares
```

### Live Admin
```
https://spirospares.pages.dev/studio
```

### Alternative: Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

---

## 📈 Performance Optimizations

### Image Optimization
```typescript
// Automatic via Sanity
// - CDN delivery (cdn.sanity.io)
// - Format conversion (WebP, etc.)
// - Responsive sizing
// - Quality optimization
```

### Data Caching
```typescript
// Build-time caching
// - Content fetched at npm run build
// - Served as static HTML
// - Rebuilds needed for new content

// ISR (Optional)
// - Revalidate: 3600 (1 hour)
// - Background refresh
```

### Content Delivery
```
Sanity CMS → GROQ Query → Next.js → HTML/JSON → CDN → Browser
```

---

## ❓ Common Questions

**Q: How often should I rebuild?**
A: After publishing new content. Set up webhooks for auto-rebuilds.

**Q: Can multiple people edit?**
A: Yes! Sanity supports team collaboration. Invite members in Sanity settings.

**Q: What if Sanity goes down?**
A: Your website stays live with cached content until your next rebuild.

**Q: How do I export data?**
A: Sanity provides export tools in dataset settings.

**Q: Can I use this with static export again?**
A: No, Sanity Studio requires server-side rendering.

---

## 📞 Support

### Documentation
- [Sanity Docs](https://www.sanity.io/docs)
- [GROQ Language](https://www.sanity.io/docs/groq)
- [API Reference](https://www.sanity.io/help)

### Files in This Project
- `SANITY_SETUP_GUIDE.md` - Complete setup instructions
- `SANITY_ADMIN_GUIDE.md` - Admin panel usage guide
- `lib/sanity/queries-data.ts` - All available data fetchers

---

## 🎯 Next Steps

1. ✅ **Setup Complete** - Sanity is configured
2. ⏭️ **Content Creation** - Start adding products
3. ⏭️ **Test Website** - Verify data displays
4. ⏭️ **Deploy** - Go live on Cloudflare
5. ⏭️ **Team Access** - Invite collaborators

**Start by visiting**: http://localhost:3000/studio

---

**Your Sanity CMS is ready. Happy content creation! 🚀**
