#!/bin/bash

# Deploy to Cloudflare Pages - WSL script
set -e

PROJECT_DIR="/mnt/p/SourceCode-PIVOT/spirospares"
cd "$PROJECT_DIR"

echo "🚀 Starting Cloudflare deployment from WSL..."

# Step 1: Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Step 2: Build Next.js
echo "🔨 Building Next.js project..."
npm run build

# Step 3: Run Cloudflare adapter
echo "⚙️ Running Cloudflare Pages adapter..."
npx @cloudflare/next-on-pages --skip-build

# Step 4: Verify output
if [ -d ".vercel/output/static" ]; then
    echo "✅ Build successful! Static files ready at .vercel/output/static"
    ls -la .vercel/output/static/ | head -10
else
    echo "❌ Build failed - no static output directory"
    exit 1
fi

# Step 5: Deploy with Wrangler
echo "📤 Deploying to Cloudflare Pages..."
npx wrangler pages deploy .vercel/output/static --project-name spirospares --branch production

echo "✅ Deployment complete!"
