# 🎛️ Sanity CMS Admin Panel Setup - Complete Guide

## 🚀 Quick Start

Your Spiro Spares website now has a **complete content management system** powered by Sanity CMS with a full-featured admin panel.

### Access Your Admin Panel

**Hosted Studio URL:**
```
https://<your-sanity-studio-url>
```

**Storefront handoff page (optional):**
```
https://spirospares.pages.dev/studio
```

The storefront route is only an access page and does not host Studio directly.

---

## 📦 What's Included

### Admin Dashboard Features
- ✅ **Visual Content Editor** - WYSIWYG editor with live previews
- ✅ **Asset Management** - Upload and manage product images automatically compressed
- ✅ **Content Relationships** - Link bikes to spare parts compatibility
- ✅ **Publishing Workflow** - Draft/Publish status for content control
- ✅ **Search & Navigation** - Quick access to all content types
- ✅ **Mobile Responsive** - Admin works on any device
- ✅ **Revision History** - Track all content changes
- ✅ **Performance Optimization** - Automatic image optimization and delivery

### Content Types Available

```
📊 DASHBOARD
├── 🏍️ BIKES
│   ├── Name, SKU, Price
│   ├── Category Assignment
│   ├── Specifications (Motor, Range, Battery, Speed)
│   ├── Multiple Images with Hotspots
│   └── Stock & Active Status
│
├── 🔧 SPARE PARTS
│   ├── Part Code, Price, Category
│   ├── Compatible Bike Models
│   ├── Function & Replacement Info
│   ├── Material & Quality Standards
│   └── Stock & Image
│
├── ⚡ GADGETS
│   ├── Price, Category
│   ├── Features List
│   ├── Technical Details
│   ├── Multiple Images
│   └── Stock & Compatibility
│
├── 📍 SERVICE LOCATIONS
│   ├── City, Area, Address
│   ├── Contact & WhatsApp
│   ├── Services & Hours
│   ├── Map Link & GPS Coordinates
│   └── Battery Swapping Info
│
├── 🎨 HERO SECTIONS
│   ├── Page Selection (Home, Bikes, etc)
│   ├── Title & Subtitle
│   ├── Background Images
│   └── CTA Button Configuration
│
├── 📄 PAGES
│   ├── Rich Text Content
│   ├── SEO Meta Tags
│   └── Publishing Status
│
├── 🏷️ CATEGORIES
│   ├── Name & Type
│   ├── Slug & Description
│   └── Category Image
│
└── ⚙️ SETTINGS
    ├── Site Name & Description
    ├── Contact Information
    ├── Social Media Links
    └── Business Hours
```

---

## 🛠️ Installation Steps

### 1. Install Dependencies
```bash
cd p:\SourceCode-PIVOT\spirospares
npm install
```
This installs all Sanity packages and dependencies.

### 2. Verify Environment Configuration
Check `.env.local` contains:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=ksr83qp0
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-04-15
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access Sanity Studio
Open your hosted Studio URL (configured in `NEXT_PUBLIC_SANITY_STUDIO_URL`).

You should see the Sanity admin panel with all content management tools.

---

## 📝 Creating Your First Content

### Add a Bike Category (Foundation)
1. Click **Categories** in the admin
2. Click **Create**
3. Fill in:
   - Name: `Urban Commuter`
   - Type: `Bike`
   - Description: `Perfect for city commuting`
4. Click **Publish**

### Add a Bike
1. Click **Bikes** in the admin
2. Click **Create**
3. Fill in details:
   - **Name:** `VEO` (or your bike model)
   - **Category:** Select the category you created
   - **Price:** `199500`
   - **SKU:** `SPI-VEO-002`
   - **Motor:** `3.5kW Peak`
   - **Range:** `95 km`
   - **Battery:** `60V 40Ah Swappable`
   - **Speed:** `70 km/h`
   - **Charging Time:** `3 hours`
4. **Upload Images** - Click the image field
5. **Set Stock:** `24`
6. **Toggle Active** - Enable for visibility
7. Click **Publish**

### Add a Spare Part
1. Click **Spare Parts** in the admin
2. Click **Create**
3. Fill in:
   - **Name:** `Drive Chain (Complete Loop)`
   - **Part Code:** `SP-DRC-001`
   - **Price:** `5400`
   - **Category:** `General`
   - **Compatible Models:** Select bikes this part fits
   - **Function:** Describe what it does
   - **Material:** `Heat-treated alloy steel`
4. **Upload Image** - Single image for the part
5. **Set Stock:** `46`
6. Click **Publish**

### Add a Gadget
1. Click **Gadgets & Accessories**
2. Click **Create**
3. Fill in:
   - **Name:** `Smart Quad Phone Holder`
   - **Price:** `4500`
   - **Category:** `Phone holders`
   - **Features:** Add multiple features (e.g., "Anti-vibration mount", "One-twist locking")
4. **Upload Images**
5. **Add Compatibility Info**
6. Click **Publish**

### Add a Service Location
1. Click **Service Locations**
2. Click **Create**
3. Fill in:
   - **Name:** `Nairobi Downtown Service Center`
   - **City:** `Nairobi`
   - **Area:** `CBD`
   - **Address:** Full street address
   - **Phone:** `+254 7xx xxx xxx`
   - **WhatsApp:** Same or different number
   - **Services:** List services offered (e.g., "Battery Swap", "Maintenance", "Repairs")
   - **Hours:** `Mon-Fri: 8AM-6PM, Sat: 9AM-4PM`
   - **Battery Swapping:** Toggle ON if available
4. Click **Publish**

---

## 🎨 Configuring Hero Sections

1. Click **Hero Sections**
2. Click **Create**
3. Select **Page:** `home` (or bikes/spares/gadgets)
4. Fill in:
   - **Title:** Main headline
   - **Subtitle:** Supporting text
   - **Upload Background Image**
   - **CTA Text:** Button text (e.g., "Shop Now")
   - **CTA Link:** URL the button goes to
5. Click **Publish**

---

## ⚙️ Global Settings

1. Click **Settings** in admin
2. Configure:
   - **Site Name:** `Spiro Spares`
   - **Contact Email:** `info@spirospares.com`
   - **WhatsApp Number:** `+254 7xx xxx xxx`
   - **Social Media Links:** Add your social profiles
   - **Business Hours:** `Mon-Fri: 8AM-6PM`
3. **Upload Logo**
4. Click **Publish**

---

## 🔗 How Content Flows to Your Website

```
Sanity CMS (Admin Panel)
    ↓
    ├─→ GROQ Queries (lib/sanity/queries.ts)
    ↓
    ├─→ Data Fetchers (lib/sanity/queries-data.ts)
    ↓
    ├─→ Next.js Pages (async components)
    ↓
    └─→ Website Display (https://spirospares.pages.dev)
```

### Example: How a Bike Appears on Your Site

1. **You add a bike in Sanity Studio** (hosted Studio URL)
   - Fill bike details
   - Upload images
   - Click Publish

2. **Website fetches your data** (using `getAllBikes()`)
   - Sanity API returns JSON of all active bikes
   - Images are optimized and served from CDN

3. **Website displays the bike**
   - Shows on `/bikes` page
   - Featured on homepage
   - Available in cart

---

## 📱 Features by Content Type

### Bikes
- **Smart Fields:** Linked to bike models for spare part compatibility
- **Gallery:** Upload multiple images with hotspot selection
- **SEO Ready:** Title, description for search engines
- **Stock Control:** Track inventory in real-time
- **Publishing:** Draft before publishing

### Spare Parts
- **Relationship Field:** Auto-suggest compatible bike models
- **Categories:** Organized as "Body & Trim", "Electrical", etc.
- **Lifecycle Info:** Replacement cycles and maintenance schedules
- **Quality Standards:** Document material and quality grade
- **Image Management:** One primary image per part

### Gadgets
- **Feature Management:** Add unlimited features as array
- **Multi-Image:** Upload gallery for product showcase
- **Category Organization:** Group by type (Chargers, Safety, etc.)
- **Technical Specs:** Store detailed technical information
- **Compatibility Tracking:** Document which bikes it works with

### Service Locations
- **Geographic Data:** Latitude/longitude for map display
- **Service Types:** Array of offered services
- **Contact Management:** Phone, WhatsApp, email all tracked
- **Map Integration:** Google Maps link for directions
- **Specializations:** Track which locations offer battery swapping

---

## 🚀 Deployment & Going Live

### Step 1: Build Locally
```bash
npm run build
```
Verify: "Compiled successfully"

### Step 2: Deploy to Cloudflare Pages
```bash
npm run build
npx wrangler pages deploy out --project-name spirospares
```

### Step 3: Access Live Admin Panel
```
https://<your-sanity-studio-url>
```

---

## 🔍 Sanity Vision Tool

Inside Sanity Studio, click the **Vision** button (bottom right) to:
- **Test GROQ queries** in real-time
- **Preview query results** before using in code
- **Debug data structure** issues
- **Explore relationships** between documents

---

## 🛡️ Best Practices

### Content Organization
- ✅ Create all **Categories** before adding products
- ✅ Use consistent **naming conventions**
- ✅ Always **upload high-quality images** (min 1000x1000px)
- ✅ Write **SEO-friendly** descriptions

### Image Management
- ✅ Sanity automatically optimizes images
- ✅ Images are stored securely on Sanity CDN
- ✅ Use hotspots for focal points in images
- ✅ Alt text is required for accessibility

### Publishing Workflow
- ✅ Keep content as **Draft** while creating
- ✅ **Preview** before publishing
- ✅ **Publish** only when complete
- ✅ Use **Revision history** to track changes

### Maintenance
- ✅ Regularly **update stock levels**
- ✅ Mark discontinued items as **Inactive** (not deleted)
- ✅ Update **pricing** centrally in Sanity
- ✅ Review analytics for **popular products**

---

## ❓ FAQ

**Q: Why did static export get removed?**
A: Static export prevents server-side features like Sanity Studio from running. Server rendering allows both your website and admin panel to coexist.

**Q: Can I still use Cloudflare Pages?**
A: Yes! Cloudflare Pages now supports server-side rendering with Functions. Your deployment command stays the same.

**Q: Will my site still be fast?**
A: Yes! Next.js caches pages at build time. Content updates require a rebuild (automatic on Cloudflare).

**Q: How do I update content live?**
A: You have two options:
1. **Webhook:** Set up Sanity webhooks to trigger deploys
2. **Manual:** Deploy changes with `wrangler pages deploy` command

**Q: What if Sanity is down?**
A: Your website stays live! Next.js serves cached versions. New content updates won't work until Sanity is back.

**Q: Can I have private/draft content?**
A: Yes! Use the "Active" toggle on products to hide them from website.

**Q: How do I back up my data?**
A: Sanity automatically backs up all content. Your data is never lost. Export is also available in Sanity settings.

---

## 📞 Help & Support

### Common Issues

**Studio Not Loading:**
```bash
# Clear cache
rm -rf .next

# Reinstall
npm install

# Restart
npm run dev
```

**Images Not Showing:**
- Check image is in "Published" state (not Draft)
- Verify `cdn.sanity.io` domain is accessible
- Check image URL in browser console

**Build Errors:**
```bash
# Clean rebuild
rm -rf .next node_modules
npm install
npm run build
```

---

## 🎓 Learning Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Desk Structure](https://www.sanity.io/docs/structure-builder-reference)
- [Studio Customization](https://www.sanity.io/docs/sanity-studio)
- [Image Optimization](https://www.sanity.io/docs/image-url)

---

## 📊 Content Roadmap

### Phase 1 (Now): ✅ Complete
- Sanity Studio setup
- All schemas created
- Admin panel live
- Integration with Next.js

### Phase 2 (Next): Content Population
- [ ] Create all bike categories
- [ ] Add all bicycle models
- [ ] Upload spare part catalog
- [ ] Configure gadgets & accessories
- [ ] Add service locations
- [ ] Set up hero sections
- [ ] Configure site settings

### Phase 3: Enhancement
- [ ] Set up webhooks for auto-deploy
- [ ] Configure content scheduling
- [ ] Add custom editor validation
- [ ] Implement content workflows
- [ ] Set up team collaboration

---

**Your complete Sanity CMS is ready to use! Start adding content now.** 🚀

*Next: Open your hosted Studio URL and start creating content!*
