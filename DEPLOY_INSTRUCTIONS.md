# Deploy Spirospares (Static Pages + Worker APIs)

This project uses the production architecture below:

- Static storefront deployed to Cloudflare Pages (`out` output from Next.js static export)
- Cloudflare Worker for write operations and payments (`workers/restock-request`)
- Supabase for transactional ecommerce data (orders, payments, callbacks, idempotency)
- Daraja M-Pesa STK push via Worker backend
- Sanity Studio hosted outside this storefront app
- Sanity publish webhook -> Cloudflare Pages deploy hook for automatic rebuilds

## 1) One-Time Setup

### Connect This Local Repo To GitHub

If you do not see `spirospares` in GitHub yet, this local project is not connected to any remote repository.

Create an empty GitHub repository, then run:

```powershell
git remote add origin https://github.com/<your-username>/spirospares.git
git push -u origin master
```

If you prefer `main` as default branch:

```powershell
git branch -M main
git push -u origin main
```

### Cloudflare Pages Project

Use the existing Pages project `spirospares`.

Build settings:

- Build command: `npm run build`
- Build output directory: `out`

### GitHub Secrets

Add these repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The workflow in `.github/workflows/deploy.yml` deploys:

- Push to `main` or `master` -> Cloudflare branch `production`
- Pull request -> Cloudflare preview branch `pr-<number>`

The workflow in `.github/workflows/deploy-worker.yml` deploys Worker APIs automatically when files under `workers/restock-request/` change on `main` or `master`.

### Pages Environment Variables

Set these in Cloudflare Pages project settings:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_RESTOCK_API_URL` (Worker base URL, no trailing slash)
- `NEXT_PUBLIC_PAYMENTS_API_URL` (Worker base URL, no trailing slash)
- `NEXT_PUBLIC_SANITY_STUDIO_URL` (external Studio URL)

## 2) Deploy the Restock Worker

Worker source:

- `workers/restock-request/src/index.ts`
- `workers/restock-request/wrangler.toml`

Current write routes:

- `POST /restock-request`
- `POST /forms/contact`
- `POST /payments/checkout`
- `POST /payments/mpesa/stkpush`
- `GET /payments/order-status`
- `POST /payments/mpesa/callback/<token>`

### Apply Supabase ecommerce schema

Run this SQL file in Supabase SQL Editor first:

- `supabase/ecommerce_schema.sql`

### Set Worker Secrets

Run from the repository root:

```powershell
npx wrangler secret put SANITY_PROJECT_ID --config workers/restock-request/wrangler.toml
npx wrangler secret put SANITY_DATASET --config workers/restock-request/wrangler.toml
npx wrangler secret put SANITY_WRITE_TOKEN --config workers/restock-request/wrangler.toml
npx wrangler secret put ALLOWED_ORIGIN --config workers/restock-request/wrangler.toml
npx wrangler secret put SUPABASE_URL --config workers/restock-request/wrangler.toml
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --config workers/restock-request/wrangler.toml
npx wrangler secret put MPESA_CONSUMER_KEY --config workers/restock-request/wrangler.toml
npx wrangler secret put MPESA_CONSUMER_SECRET --config workers/restock-request/wrangler.toml
npx wrangler secret put MPESA_SHORTCODE --config workers/restock-request/wrangler.toml
npx wrangler secret put MPESA_PASSKEY --config workers/restock-request/wrangler.toml
npx wrangler secret put MPESA_BASE_URL --config workers/restock-request/wrangler.toml
npx wrangler secret put MPESA_CALLBACK_URL --config workers/restock-request/wrangler.toml
npx wrangler secret put MPESA_CALLBACK_TOKEN --config workers/restock-request/wrangler.toml
```

Use your storefront domain for `ALLOWED_ORIGIN` (for example `https://spirospares.pages.dev`).
Set `MPESA_CALLBACK_URL` to your Worker callback endpoint, for example:

- `https://<worker-domain>/payments/mpesa/callback/<MPESA_CALLBACK_TOKEN>`

### Deploy Worker

```powershell
npm run worker:deploy:restock
```

After deploy, copy the Worker URL and set it as:

- `NEXT_PUBLIC_RESTOCK_API_URL`
- `NEXT_PUBLIC_PAYMENTS_API_URL`

The frontend appends `/restock-request` internally.

## 3) Auto Rebuild on Sanity Publish (Deploy Hook)

### Create Cloudflare Deploy Hook

In Cloudflare Pages:

1. Open project `spirospares`
2. Go to Settings -> Builds & deployments -> Deploy hooks
3. Create a new hook for production branch
4. Copy the generated hook URL

### Add Sanity Webhook

In Sanity Manage UI:

1. Open your project -> API -> Webhooks
2. Create webhook with method `POST`
3. URL = Cloudflare deploy hook URL
4. Trigger on create/update/delete for relevant document types
5. Save

Now every content publish in Sanity triggers a new Pages build.

## 4) Local Validation Checklist

```powershell
npm ci
npm run build
```

Validation targets:

- Build completes and outputs `out`
- Product pages render with Sanity data
- `Notify Me` sends POST successfully through Worker
- `/studio` shows external-studio handoff page

## 5) Operational Notes

- Do not use Next.js API routes for production writes in this static architecture.
- Add new write endpoints as Worker routes (for forms and future APIs).
- Keep Sanity Studio deployed separately from storefront runtime.
- Rotate Worker and CI secrets regularly.
- Typical deployment time is not instantaneous: expect about 2-8 minutes for Pages builds and around 30-120 seconds for Worker deploys.
