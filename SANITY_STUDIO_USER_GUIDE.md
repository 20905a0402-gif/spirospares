# Sanity Studio User Guide

## Table of Contents
1. [Accessing the Studio](#accessing-the-studio)
2. [Dashboard Overview](#dashboard-overview)
3. [Managing Bikes](#managing-bikes)
4. [Managing Spare Parts](#managing-spare-parts)
5. [Managing Service Locations](#managing-service-locations)
6. [Managing Gadgets](#managing-gadgets)
7. [Best Practices](#best-practices)
8. [Common Tasks](#common-tasks)

---

## Accessing the Studio

### URL
- **Production Studio:** https://160c012d.spirospares.pages.dev/studio/
- **Local Development:** http://localhost:3000/studio/ (when running `npm run dev`)

### Login
1. Navigate to the Studio URL
2. Click "Sign in with Sanity"
3. Enter your Sanity credentials
4. If you don't have an account, you'll need to be invited as a team member

---

## Dashboard Overview

The Sanity Studio is divided into several main sections:

### Structure
- **Bikes** - Manage electric bike models
- **Spare Parts** - Manage spare parts inventory
- **Service Locations** - Manage pickup/service points
- **Gadgets** - Manage accessories and gadgets
- **Media** - View and manage uploaded images

### Navigation
- Use the left sidebar to navigate between content types
- The search bar at the top allows quick searching across all content
- Filter and sort options are available in each section

---

## Managing Bikes

### Viewing Bikes
1. Click "Bikes" in the left sidebar
2. You'll see a list of all bike models
3. Click on any bike to view its details

### Adding a New Bike
1. Click the "+ Create new" button in the Bikes section
2. Fill in the required fields:
   - **Name** - Bike model name (e.g., "EKON450M2V2")
   - **SKU** - Unique stock keeping unit
   - **Price** - Price in KES
   - **Category** - Select from available categories
   - **Stock** - Available quantity
   - **Short Description** - Brief product description
3. Optional fields:
   - **Motor** - Motor specifications
   - **Range** - Range per charge
   - **Battery** - Battery details
   - **Speed** - Maximum speed
   - **Charging Time** - Time to fully charge
4. **Images** - Upload bike images:
   - Click "Upload" to add images from your computer
   - Images should be high quality (recommended: 1920x1080px or higher)
   - You can upload multiple images
   - Drag to reorder images (first image is the main display image)
5. Click "Publish" to make the bike live on the website

### Editing a Bike
1. Click on the bike you want to edit
2. Make your changes
3. Click "Publish" to save changes
4. Changes are reflected immediately on the website after rebuild

### Deleting a Bike
1. Click on the bike you want to delete
2. Click the "..." menu (three dots)
3. Select "Delete"
4. Confirm the deletion
5. **Warning:** This action cannot be undone

---

## Managing Spare Parts

### Viewing Spare Parts
1. Click "Spare Parts" in the left sidebar
2. You'll see a list of all spare parts
3. Use filters to view by category or bike model

### Adding a New Spare Part
1. Click "+ Create new" in the Spare Parts section
2. Fill in the required fields:
   - **Name** - Part name (e.g., "Front Brake Pad Kit")
   - **Part Code** - Unique part identifier (e.g., "E066302010")
   - **Price** - Price in KES
   - **Category** - Select from:
     - Body & Trim
     - Frame & Suspension
     - General
     - Electrical
   - **Stock** - Available quantity
3. Optional fields:
   - **Function** - Description of what the part does
   - **Replacement Cycle** - Recommended replacement interval
   - **Material** - Material composition
   - **Quality** - Quality rating (e.g., OEM, Aftermarket)
4. **Image** - Upload a product image:
   - Recommended size: 800x800px or higher
   - Use clean, well-lit product photos
5. **Compatible Models** - Link to bike models:
   - Click "Add compatible model"
   - Select the bike(s) this part fits
   - A part can be compatible with multiple bike models
6. **Active Status** - Toggle to show/hide on website
7. Click "Publish" to make the part live

### Editing a Spare Part
1. Click on the spare part you want to edit
2. Make your changes
3. Click "Publish" to save

### Linking Spare Parts to Bikes
When adding or editing a spare part:
1. Scroll to "Compatible Models"
2. Click "Add compatible model"
3. Select the bike model(s) from the dropdown
4. The part will now appear when filtering by that bike on the website

---

## Managing Service Locations

### Viewing Service Locations
1. Click "Service Locations" in the left sidebar
2. You'll see all pickup/service points

### Adding a New Service Location
1. Click "+ Create new" in the Service Locations section
2. Fill in the required fields:
   - **Name** - Location name (e.g., "Bishan Plaza")
   - **City** - City name (e.g., "Nairobi")
   - **Area** - Specific area/neighborhood
   - **Address** - Full street address
3. Optional fields:
   - **Phone** - Contact phone number
   - **WhatsApp** - WhatsApp number for customer support
   - **Hours** - Operating hours (e.g., "06:00 AM - 10:00 PM")
   - **Services** - List of services offered
4. **Map Link** - Embed Google Maps:
   - Go to Google Maps
   - Search for the location
   - Click "Share" → "Embed a map"
   - Copy the embed URL
   - Paste into the Map Link field
5. **Battery Swapping** - Toggle if this location offers battery swapping
6. **Active Status** - Toggle to show/hide on website
7. Click "Publish"

### Editing a Service Location
1. Click on the location you want to edit
2. Make your changes
3. Click "Publish" to save

---

## Managing Gadgets

### Viewing Gadgets
1. Click "Gadgets" in the left sidebar
2. You'll see all accessories and gadgets

### Adding a New Gadget
1. Click "+ Create new" in the Gadgets section
2. Fill in the required fields:
   - **Name** - Gadget name (e.g., "Anti-Theft Disc Lock")
   - **Price** - Price in KES
   - **Category** - Select category
   - **Stock** - Available quantity
3. Optional fields:
   - **Features** - List of key features (add each as a separate item)
   - **Compatibility** - Which bikes/models it's compatible with
   - **Technical Details** - Additional specifications
4. **Images** - Upload product images (multiple images supported)
5. **Active Status** - Toggle to show/hide on website
6. Click "Publish"

---

## Best Practices

### Image Guidelines
- **Bike Images:** Use high-resolution images (1920x1080px minimum)
- **Spare Part Images:** Use clean, well-lit photos on white backgrounds (800x800px recommended)
- **File Formats:** Use JPG or PNG
- **File Size:** Keep images under 5MB for faster loading
- **Naming:** Use descriptive filenames (e.g., "ekon450m2v2-red-side-view.jpg")

### Content Management
- **Consistent Naming:** Use consistent naming conventions for SKUs and part codes
- **Descriptions:** Write clear, concise descriptions that help customers
- **Stock Updates:** Keep stock levels accurate to prevent overselling
- **Active Status:** Use the "Active" toggle to temporarily hide items instead of deleting

### SEO Best Practices
- **Titles:** Use descriptive, keyword-rich names
- **Descriptions:** Include relevant keywords naturally
- **Categories:** Place items in the most relevant category

---

## Common Tasks

### Bulk Stock Updates
Currently, stock updates are done individually per item. For bulk updates, contact your technical team to run a script.

### Adding Multiple Images
1. When editing an item, click "Upload" in the images section
2. Select multiple files at once
3. Drag images to reorder (first image is primary)
4. Click "Publish"

### Changing Category
1. Edit the item
2. Change the category dropdown
3. Click "Publish"
4. The item will appear in the new category on the website

### Temporarily Hiding an Item
1. Edit the item
2. Toggle the "Active" switch to OFF
3. Click "Publish"
4. The item will no longer appear on the website but remains in the database

### Restoring a Hidden Item
1. Edit the item
2. Toggle the "Active" switch to ON
3. Click "Publish"

---

## Troubleshooting

### Changes Not Appearing on Website
- The website needs to be rebuilt after content changes
- Contact your technical team to rebuild and redeploy
- Changes typically appear within a few minutes after deployment

### Image Upload Fails
- Check file size (must be under 10MB)
- Ensure file format is JPG or PNG
- Try a different browser
- Check your internet connection

### Can't Find an Item
- Use the search bar at the top of the Studio
- Check if the item is marked as "Inactive"
- Verify you're looking in the correct section

---

## Support

For technical issues or questions:
- Contact your development team
- Sanity documentation: https://www.sanity.io/docs

---

## Quick Reference

### Bike Fields
- Name, SKU, Price, Category, Stock (Required)
- Motor, Range, Battery, Speed, Charging Time (Optional)
- Images (Required for display)

### Spare Part Fields
- Name, Part Code, Price, Category, Stock (Required)
- Function, Replacement Cycle, Material, Quality (Optional)
- Image, Compatible Models (Required for display)

### Service Location Fields
- Name, City, Address (Required)
- Area, Phone, WhatsApp, Hours, Services (Optional)
- Map Link, Battery Swapping (Optional)

### Gadget Fields
- Name, Price, Category, Stock (Required)
- Features, Compatibility, Technical Details (Optional)
- Images (Required for display)
