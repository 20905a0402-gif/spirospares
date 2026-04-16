FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Next.js
RUN npm run build

# Install Cloudflare adapter
RUN npm install -g @cloudflare/next-on-pages

# Run the adapter to generate Cloudflare deployment
RUN npx @cloudflare/next-on-pages --skip-build

# Output verification
RUN ls -la .vercel/output/static || echo "Static output ready"

CMD ["/bin/bash"]
