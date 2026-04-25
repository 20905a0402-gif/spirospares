# Restock + Payments Worker

Cloudflare Worker endpoint for storefront write operations (forms, restock, checkout, and M-Pesa payment status).

## Routes

### Existing write routes

- `POST /restock-request`
- `POST /forms/contact`

### New payment routes

- `POST /payments/checkout`
- `POST /payments/mpesa/stkpush`
- `GET /payments/order-status?orderId=<uuid>`
- `POST /payments/mpesa/callback/<MPESA_CALLBACK_TOKEN>`

## Database setup (Supabase)

Run this SQL file in Supabase SQL Editor before using payment routes:

- `supabase/ecommerce_schema.sql`

## Required Worker Secrets

Set these before deploying.

### Sanity write secrets (existing)

```powershell
npx wrangler secret put SANITY_PROJECT_ID --config workers/restock-request/wrangler.toml
npx wrangler secret put SANITY_DATASET --config workers/restock-request/wrangler.toml
npx wrangler secret put SANITY_WRITE_TOKEN --config workers/restock-request/wrangler.toml
npx wrangler secret put ALLOWED_ORIGIN --config workers/restock-request/wrangler.toml
```

### Supabase + Daraja secrets (new)

```powershell
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

`MPESA_CALLBACK_URL` must match the callback endpoint set in Daraja.
Example:

- `https://<your-worker-domain>/payments/mpesa/callback/<MPESA_CALLBACK_TOKEN>`

## Non-secret Worker vars

Configured in `workers/restock-request/wrangler.toml`:

- `MPESA_TRANSACTION_TYPE` (`CustomerPayBillOnline` or `CustomerBuyGoodsOnline`)
- `PAYMENT_IDEMPOTENCY_TTL_HOURS`
- `RESERVATION_WINDOW_MINUTES`

## Deploy

```powershell
npm run worker:deploy:restock
```

## Frontend configuration

Set these in Cloudflare Pages and local env:

- `NEXT_PUBLIC_RESTOCK_API_URL`
- `NEXT_PUBLIC_PAYMENTS_API_URL`

If `NEXT_PUBLIC_PAYMENTS_API_URL` is not set, checkout falls back to `NEXT_PUBLIC_RESTOCK_API_URL`.
