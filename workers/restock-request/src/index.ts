type ProductType = "spare" | "bike" | "gadget";
type CheckoutProductType = ProductType | "insurance";
type FulfillmentMode = "delivery" | "pickup";

type RestockRequestPayload = {
  productId?: string;
  productName?: string;
  productType?: ProductType;
  sku?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  note?: string;
};

type ContactRequestPayload = {
  name?: string;
  phone?: string;
  email?: string;
  subject?: string;
  message?: string;
};

type CheckoutItemPayload = {
  productId?: string;
  productType?: CheckoutProductType;
  productName?: string;
  sku?: string;
  quantity?: number;
  unitPriceKes?: number;
};

type CheckoutPayload = {
  customerName?: string;
  phone?: string;
  email?: string;
  fulfillmentMode?: FulfillmentMode;
  pickupPoint?: string;
  expressDelivery?: boolean;
  deliveryFeeKes?: number;
  accountReference?: string;
  transactionDesc?: string;
  items?: CheckoutItemPayload[];
};

type StkRetryPayload = {
  orderId?: string;
  phone?: string;
  transactionDesc?: string;
};

type Env = {
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  SANITY_API_VERSION?: string;
  SANITY_WRITE_TOKEN?: string;
  ALLOWED_ORIGIN?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  MPESA_CONSUMER_KEY?: string;
  MPESA_CONSUMER_SECRET?: string;
  MPESA_SHORTCODE?: string;
  MPESA_PASSKEY?: string;
  MPESA_BASE_URL?: string;
  MPESA_CALLBACK_URL?: string;
  MPESA_CALLBACK_TOKEN?: string;
  MPESA_TRANSACTION_TYPE?: "CustomerPayBillOnline" | "CustomerBuyGoodsOnline";
  PAYMENT_IDEMPOTENCY_TTL_HOURS?: string;
  RESERVATION_WINDOW_MINUTES?: string;
};

type SupabaseOrderRow = {
  id: string;
  order_ref: string;
  customer_phone: string;
  payment_status: string;
  order_status: string;
  total_kes: number;
  created_at: string;
  paid_at?: string | null;
  cancelled_at?: string | null;
};

type SupabasePaymentAttemptRow = {
  id: string;
  order_id: string;
  status: string;
  checkout_request_id?: string | null;
  merchant_request_id?: string | null;
  mpesa_receipt_number?: string | null;
  result_code?: number | null;
  result_desc?: string | null;
  updated_at: string;
};

type IdempotencyRow = {
  key: string;
  route: string;
  request_hash: string;
  status_code?: number | null;
  response_payload?: unknown;
};

const ALLOWED_TYPES: ProductType[] = ["spare", "bike", "gadget"];
const CHECKOUT_ALLOWED_TYPES: CheckoutProductType[] = ["spare", "bike", "gadget", "insurance"];

function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

function normalizeText(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function normalizePhoneForMpesa(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");

  if (/^254\d{9}$/.test(digits)) {
    return digits;
  }

  if (/^0\d{9}$/.test(digits)) {
    return `254${digits.slice(1)}`;
  }

  if (/^\d{9}$/.test(digits) && digits.startsWith("7")) {
    return `254${digits}`;
  }

  return null;
}

function corsHeaders(requestOrigin: string | null, allowedOrigin?: string): Record<string, string> {
  const origin = allowedOrigin?.trim() || requestOrigin || "*";

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,Idempotency-Key",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function buildOrderRef(): string {
  const stamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const suffix = Math.floor(Math.random() * 9000 + 1000).toString();
  return `ORD-${stamp}-${suffix}`;
}

function buildTimestamp(date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((item) => item.toString(16).padStart(2, "0"))
    .join("");
}

function getSupabaseUrl(env: Env): string {
  const base = env.SUPABASE_URL?.trim();
  if (!base) {
    throw new Error("Missing SUPABASE_URL.");
  }

  return `${base.replace(/\/$/, "")}/rest/v1`;
}

function getSupabaseServiceKey(env: Env): string {
  const key = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  return key;
}

async function supabaseRequest<T>(env: Env, path: string, init: RequestInit): Promise<T> {
  const serviceKey = getSupabaseServiceKey(env);

  const headers: Record<string, string> = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };

  const response = await fetch(`${getSupabaseUrl(env)}/${path}`, {
    ...init,
    headers,
  });

  const raw = await response.text();
  const payload = raw ? (JSON.parse(raw) as unknown) : null;

  if (!response.ok) {
    throw new Error(typeof payload === "string" ? payload : JSON.stringify(payload));
  }

  return payload as T;
}

function ensureSanityConfig(env: Env): string | null {
  if (!env.SANITY_PROJECT_ID || !env.SANITY_DATASET || !env.SANITY_WRITE_TOKEN) {
    return "SANITY_PROJECT_ID, SANITY_DATASET, and SANITY_WRITE_TOKEN are required.";
  }

  return null;
}

function ensurePaymentConfig(env: Env): string | null {
  const required: Array<keyof Env> = [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "MPESA_CONSUMER_KEY",
    "MPESA_CONSUMER_SECRET",
    "MPESA_SHORTCODE",
    "MPESA_PASSKEY",
    "MPESA_BASE_URL",
    "MPESA_CALLBACK_URL",
  ];

  const missing = required.filter((key) => !env[key] || !String(env[key]).trim());
  if (missing.length > 0) {
    return `Missing payment configuration: ${missing.join(", ")}.`;
  }

  return null;
}

function callbackMetadataMap(callbackPayload: any): Record<string, unknown> {
  const items = callbackPayload?.CallbackMetadata?.Item;
  if (!Array.isArray(items)) {
    return {};
  }

  const map: Record<string, unknown> = {};

  for (const item of items) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const name = normalizeText((item as { Name?: unknown }).Name);
    if (!name) {
      continue;
    }

    map[name] = (item as { Value?: unknown }).Value;
  }

  return map;
}

async function getIdempotencyRecord(env: Env, key: string): Promise<IdempotencyRow | null> {
  const rows = await supabaseRequest<IdempotencyRow[]>(
    env,
    `idempotency_keys?key=eq.${encodeURIComponent(key)}&select=key,route,request_hash,status_code,response_payload`,
    {
      method: "GET",
    }
  );

  return asArray<IdempotencyRow>(rows)[0] ?? null;
}

async function createIdempotencyRecord(env: Env, key: string, route: string, requestHash: string): Promise<void> {
  const ttlHours = Number(env.PAYMENT_IDEMPOTENCY_TTL_HOURS || "24");
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000).toISOString();

  await supabaseRequest(
    env,
    "idempotency_keys",
    {
      method: "POST",
      headers: {
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        key,
        route,
        request_hash: requestHash,
        expires_at: expiresAt,
      }),
    }
  );
}

async function finalizeIdempotencyRecord(
  env: Env,
  key: string,
  statusCode: number,
  responsePayload: unknown
): Promise<void> {
  await supabaseRequest(
    env,
    `idempotency_keys?key=eq.${encodeURIComponent(key)}`,
    {
      method: "PATCH",
      headers: {
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        status_code: statusCode,
        response_payload: responsePayload,
      }),
    }
  );
}

async function getMpesaAccessToken(env: Env): Promise<string> {
  const consumerKey = env.MPESA_CONSUMER_KEY?.trim() || "";
  const consumerSecret = env.MPESA_CONSUMER_SECRET?.trim() || "";
  const baseUrl = env.MPESA_BASE_URL?.trim().replace(/\/$/, "") || "";

  const basicAuth = btoa(`${consumerKey}:${consumerSecret}`);
  const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${basicAuth}`,
    },
  });

  const body = (await response.json()) as { access_token?: string };

  if (!response.ok || !body.access_token) {
    throw new Error("Failed to obtain M-Pesa access token.");
  }

  return body.access_token;
}

async function initiateStkPush(
  env: Env,
  orderRef: string,
  amountKes: number,
  phone: string,
  transactionDesc: string
): Promise<{ merchantRequestId: string; checkoutRequestId: string; responsePayload: unknown; customerMessage?: string }> {
  const token = await getMpesaAccessToken(env);
  const timestamp = buildTimestamp();
  const shortCode = env.MPESA_SHORTCODE?.trim() || "";
  const passkey = env.MPESA_PASSKEY?.trim() || "";
  const password = btoa(`${shortCode}${passkey}${timestamp}`);
  const transactionType = env.MPESA_TRANSACTION_TYPE?.trim() || "CustomerPayBillOnline";
  const callbackUrl = env.MPESA_CALLBACK_URL?.trim() || "";
  const baseUrl = env.MPESA_BASE_URL?.trim().replace(/\/$/, "") || "";

  const payload = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: transactionType,
    Amount: amountKes,
    PartyA: phone,
    PartyB: shortCode,
    PhoneNumber: phone,
    CallBackURL: callbackUrl,
    AccountReference: orderRef.slice(0, 20),
    TransactionDesc: transactionDesc.slice(0, 120),
  };

  const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const responsePayload = (await response.json()) as {
    ResponseCode?: string;
    ResponseDescription?: string;
    CustomerMessage?: string;
    MerchantRequestID?: string;
    CheckoutRequestID?: string;
  };

  if (!response.ok || responsePayload.ResponseCode !== "0") {
    throw new Error(responsePayload.ResponseDescription || "STK push request failed.");
  }

  if (!responsePayload.MerchantRequestID || !responsePayload.CheckoutRequestID) {
    throw new Error("STK push response is missing request identifiers.");
  }

  return {
    merchantRequestId: responsePayload.MerchantRequestID,
    checkoutRequestId: responsePayload.CheckoutRequestID,
    customerMessage: responsePayload.CustomerMessage,
    responsePayload,
  };
}

async function handleRestockRequest(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  const sanityConfigError = ensureSanityConfig(env);
  if (sanityConfigError) {
    return json({ error: sanityConfigError }, 500, headers);
  }

  let payload: RestockRequestPayload;

  try {
    payload = (await request.json()) as RestockRequestPayload;
  } catch {
    return json({ error: "Invalid request body." }, 400, headers);
  }

  const productId = normalizeText(payload.productId);
  const productName = normalizeText(payload.productName);
  const productType = payload.productType;
  const customerName = normalizeText(payload.customerName);
  const phone = normalizeText(payload.phone);
  const email = normalizeText(payload.email);
  const note = normalizeText(payload.note);
  const sku = normalizeText(payload.sku);

  if (!productId || !productName || !customerName || !phone || !productType || !ALLOWED_TYPES.includes(productType)) {
    return json({ error: "productId, productName, productType, customerName, and phone are required." }, 400, headers);
  }

  const apiVersion = env.SANITY_API_VERSION?.trim() || "2026-04-15";
  const mutationEndpoint = `https://${env.SANITY_PROJECT_ID}.api.sanity.io/v${apiVersion}/data/mutate/${env.SANITY_DATASET}`;
  const mutationBody = {
    mutations: [
      {
        create: {
          _type: "restockRequest",
          productId,
          productName,
          productType,
          sku,
          customerName,
          phone,
          email,
          note,
          status: "new",
          requestedAt: new Date().toISOString(),
        },
      },
    ],
  };

  try {
    const mutationResponse = await fetch(mutationEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.SANITY_WRITE_TOKEN}`,
      },
      body: JSON.stringify(mutationBody),
    });

    if (!mutationResponse.ok) {
      return json({ error: "Failed to save request. Try again." }, 500, headers);
    }

    return json({ ok: true }, 200, headers);
  } catch {
    return json({ error: "Failed to save request. Try again." }, 500, headers);
  }
}

async function handleContactRequest(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  const sanityConfigError = ensureSanityConfig(env);
  if (sanityConfigError) {
    return json({ error: sanityConfigError }, 500, headers);
  }

  let payload: ContactRequestPayload;

  try {
    payload = (await request.json()) as ContactRequestPayload;
  } catch {
    return json({ error: "Invalid request body." }, 400, headers);
  }

  const name = normalizeText(payload.name);
  const message = normalizeText(payload.message);
  const phone = normalizeText(payload.phone);
  const email = normalizeText(payload.email);
  const subject = normalizeText(payload.subject);

  if (!name || !message) {
    return json({ error: "name and message are required." }, 400, headers);
  }

  const apiVersion = env.SANITY_API_VERSION?.trim() || "2026-04-15";
  const mutationEndpoint = `https://${env.SANITY_PROJECT_ID}.api.sanity.io/v${apiVersion}/data/mutate/${env.SANITY_DATASET}`;
  const mutationBody = {
    mutations: [
      {
        create: {
          _type: "contactRequest",
          name,
          phone,
          email,
          subject,
          message,
          status: "new",
          submittedAt: new Date().toISOString(),
        },
      },
    ],
  };

  try {
    const mutationResponse = await fetch(mutationEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.SANITY_WRITE_TOKEN}`,
      },
      body: JSON.stringify(mutationBody),
    });

    if (!mutationResponse.ok) {
      return json({ error: "Failed to save request. Try again." }, 500, headers);
    }

    return json({ ok: true }, 200, headers);
  } catch {
    return json({ error: "Failed to save request. Try again." }, 500, headers);
  }
}

async function handlePaymentCheckout(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  const paymentConfigError = ensurePaymentConfig(env);
  if (paymentConfigError) {
    return json({ error: paymentConfigError }, 500, headers);
  }

  const idempotencyKey = normalizeText(request.headers.get("Idempotency-Key"));
  if (!idempotencyKey) {
    return json({ error: "Idempotency-Key header is required." }, 400, headers);
  }

  const rawBody = await request.text();

  let payload: CheckoutPayload;
  try {
    payload = JSON.parse(rawBody) as CheckoutPayload;
  } catch {
    return json({ error: "Invalid request body." }, 400, headers);
  }

  const requestHash = await sha256Hex(rawBody);
  const existingRecord = await getIdempotencyRecord(env, idempotencyKey);

  if (existingRecord) {
    if (existingRecord.request_hash !== requestHash) {
      return json({ error: "Idempotency key conflict with different payload." }, 409, headers);
    }

    if (existingRecord.status_code && existingRecord.response_payload) {
      return json(existingRecord.response_payload, existingRecord.status_code, headers);
    }

    return json({ error: "A request with this idempotency key is already in progress." }, 409, headers);
  }

  await createIdempotencyRecord(env, idempotencyKey, "/payments/checkout", requestHash);

  const customerName = normalizeText(payload.customerName);
  const customerPhoneRaw = normalizeText(payload.phone);
  const customerEmail = normalizeText(payload.email);
  const fulfillmentMode = payload.fulfillmentMode === "pickup" ? "pickup" : "delivery";
  const pickupPoint = normalizeText(payload.pickupPoint);
  const expressDelivery = Boolean(payload.expressDelivery);
  const deliveryFeeKes = Number.isFinite(payload.deliveryFeeKes) ? Math.max(0, Number(payload.deliveryFeeKes)) : 0;
  const items = Array.isArray(payload.items) ? payload.items : [];
  const transactionDesc = normalizeText(payload.transactionDesc) || "Spiro order payment";

  if (!customerName || !customerPhoneRaw) {
    const responsePayload = { error: "customerName and phone are required." };
    await finalizeIdempotencyRecord(env, idempotencyKey, 400, responsePayload);
    return json(responsePayload, 400, headers);
  }

  const normalizedPhone = normalizePhoneForMpesa(customerPhoneRaw);
  if (!normalizedPhone) {
    const responsePayload = { error: "Phone must be a valid Kenyan mobile number (e.g. 2547XXXXXXXX)." };
    await finalizeIdempotencyRecord(env, idempotencyKey, 400, responsePayload);
    return json(responsePayload, 400, headers);
  }

  if (items.length === 0) {
    const responsePayload = { error: "At least one order item is required." };
    await finalizeIdempotencyRecord(env, idempotencyKey, 400, responsePayload);
    return json(responsePayload, 400, headers);
  }

  const normalizedItems = items
    .map((item) => {
      const productId = normalizeText(item.productId);
      const productName = normalizeText(item.productName);
      const productType = item.productType;
      const quantity = Number(item.quantity ?? 1);
      const unitPriceKes = Number(item.unitPriceKes ?? 0);

      if (
        !productId ||
        !productName ||
        !productType ||
        !CHECKOUT_ALLOWED_TYPES.includes(productType) ||
        !Number.isFinite(quantity) ||
        !Number.isFinite(unitPriceKes) ||
        quantity <= 0 ||
        unitPriceKes < 0
      ) {
        return null;
      }

      return {
        productId,
        productName,
        productType,
        sku: normalizeText(item.sku),
        quantity: Math.floor(quantity),
        unitPriceKes: Math.round(unitPriceKes),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (normalizedItems.length !== items.length) {
    const responsePayload = { error: "One or more items are invalid." };
    await finalizeIdempotencyRecord(env, idempotencyKey, 400, responsePayload);
    return json(responsePayload, 400, headers);
  }

  const subtotalKes = normalizedItems.reduce((total, item) => total + item.quantity * item.unitPriceKes, 0);
  const totalKes = subtotalKes + deliveryFeeKes;

  if (totalKes <= 0) {
    const responsePayload = { error: "Total amount must be greater than zero." };
    await finalizeIdempotencyRecord(env, idempotencyKey, 400, responsePayload);
    return json(responsePayload, 400, headers);
  }

  const reservationWindowMinutes = Math.max(5, Number(env.RESERVATION_WINDOW_MINUTES || "15"));
  const reservationExpiry = new Date(Date.now() + reservationWindowMinutes * 60 * 1000).toISOString();
  const orderRef = normalizeText(payload.accountReference) || buildOrderRef();

  let order: SupabaseOrderRow | null = null;
  let paymentAttempt: SupabasePaymentAttemptRow | null = null;

  try {
    const orderRows = await supabaseRequest<SupabaseOrderRow[]>(
      env,
      "orders",
      {
        method: "POST",
        headers: {
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          order_ref: orderRef,
          customer_name: customerName,
          customer_phone: normalizedPhone,
          customer_email: customerEmail,
          fulfillment_mode: fulfillmentMode,
          pickup_point: fulfillmentMode === "pickup" ? pickupPoint : null,
          express_delivery: expressDelivery,
          subtotal_kes: subtotalKes,
          delivery_fee_kes: deliveryFeeKes,
          payment_status: "pending_payment",
          order_status: "pending_payment",
        }),
      }
    );

    order = asArray<SupabaseOrderRow>(orderRows)[0] ?? null;

    if (!order) {
      throw new Error("Failed to create order record.");
    }

    await supabaseRequest(
      env,
      "order_items",
      {
        method: "POST",
        headers: {
          Prefer: "return=minimal",
        },
        body: JSON.stringify(
          normalizedItems.map((item) => ({
            order_id: order?.id,
            product_id: item.productId,
            product_type: item.productType,
            product_name: item.productName,
            sku: item.sku,
            quantity: item.quantity,
            unit_price_kes: item.unitPriceKes,
          }))
        ),
      }
    );

    await supabaseRequest(
      env,
      "stock_reservations",
      {
        method: "POST",
        headers: {
          Prefer: "return=minimal",
        },
        body: JSON.stringify(
          normalizedItems.map((item) => ({
            order_id: order?.id,
            product_id: item.productId,
            product_type: item.productType,
            quantity: item.quantity,
            status: "active",
            expires_at: reservationExpiry,
          }))
        ),
      }
    );

    const paymentAttemptRows = await supabaseRequest<SupabasePaymentAttemptRow[]>(
      env,
      "payment_attempts",
      {
        method: "POST",
        headers: {
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          order_id: order.id,
          provider: "mpesa",
          idempotency_key: idempotencyKey,
          status: "initiated",
          amount_kes: totalKes,
        }),
      }
    );

    paymentAttempt = asArray<SupabasePaymentAttemptRow>(paymentAttemptRows)[0] ?? null;

    if (!paymentAttempt) {
      throw new Error("Failed to create payment attempt.");
    }

    const stkResult = await initiateStkPush(env, order.order_ref, totalKes, normalizedPhone, transactionDesc);

    await supabaseRequest(
      env,
      `payment_attempts?id=eq.${encodeURIComponent(paymentAttempt.id)}`,
      {
        method: "PATCH",
        headers: {
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          status: "pending",
          merchant_request_id: stkResult.merchantRequestId,
          checkout_request_id: stkResult.checkoutRequestId,
          raw_response: stkResult.responsePayload,
          result_desc: "STK push initiated",
        }),
      }
    );

    await supabaseRequest(
      env,
      "audit_logs",
      {
        method: "POST",
        headers: {
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          actor_type: "customer",
          action: "checkout_started",
          entity_type: "order",
          entity_id: order.id,
          metadata: {
            orderRef: order.order_ref,
            checkoutRequestId: stkResult.checkoutRequestId,
          },
        }),
      }
    );

    const responsePayload = {
      ok: true,
      orderId: order.id,
      orderRef: order.order_ref,
      totalKes,
      paymentStatus: "pending_payment",
      checkoutRequestId: stkResult.checkoutRequestId,
      customerMessage: stkResult.customerMessage || "STK prompt sent. Complete payment on your phone.",
      reservationExpiresAt: reservationExpiry,
    };

    await finalizeIdempotencyRecord(env, idempotencyKey, 200, responsePayload);
    return json(responsePayload, 200, headers);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Checkout failed.";

    if (paymentAttempt?.id) {
      await supabaseRequest(
        env,
        `payment_attempts?id=eq.${encodeURIComponent(paymentAttempt.id)}`,
        {
          method: "PATCH",
          headers: {
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            status: "failed",
            result_desc: reason,
            completed_at: new Date().toISOString(),
          }),
        }
      );
    }

    if (order?.id) {
      await supabaseRequest(
        env,
        `orders?id=eq.${encodeURIComponent(order.id)}`,
        {
          method: "PATCH",
          headers: {
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            payment_status: "payment_failed",
            order_status: "cancelled",
            cancelled_at: new Date().toISOString(),
          }),
        }
      );

      await supabaseRequest(
        env,
        `stock_reservations?order_id=eq.${encodeURIComponent(order.id)}&status=eq.active`,
        {
          method: "PATCH",
          headers: {
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            status: "released",
          }),
        }
      );

      await supabaseRequest(
        env,
        "audit_logs",
        {
          method: "POST",
          headers: {
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            actor_type: "system",
            action: "checkout_failed",
            entity_type: "order",
            entity_id: order.id,
            metadata: {
              reason,
            },
          }),
        }
      );
    }

    const responsePayload = { error: reason };
    await finalizeIdempotencyRecord(env, idempotencyKey, 500, responsePayload);
    return json(responsePayload, 500, headers);
  }
}

async function handleStkRetry(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  const paymentConfigError = ensurePaymentConfig(env);
  if (paymentConfigError) {
    return json({ error: paymentConfigError }, 500, headers);
  }

  const idempotencyKey = normalizeText(request.headers.get("Idempotency-Key"));
  if (!idempotencyKey) {
    return json({ error: "Idempotency-Key header is required." }, 400, headers);
  }

  let payload: StkRetryPayload;
  try {
    payload = (await request.json()) as StkRetryPayload;
  } catch {
    return json({ error: "Invalid request body." }, 400, headers);
  }

  const orderId = normalizeText(payload.orderId);
  if (!orderId) {
    return json({ error: "orderId is required." }, 400, headers);
  }

  const orderRows = await supabaseRequest<SupabaseOrderRow[]>(
    env,
    `orders?id=eq.${encodeURIComponent(orderId)}&select=id,order_ref,customer_phone,total_kes,payment_status,order_status,created_at&limit=1`,
    {
      method: "GET",
    }
  );

  const order = asArray<SupabaseOrderRow>(orderRows)[0] ?? null;
  if (!order) {
    return json({ error: "Order not found." }, 404, headers);
  }

  if (order.payment_status === "paid") {
    return json({ error: "Order is already paid." }, 409, headers);
  }

  const phone = normalizePhoneForMpesa(normalizeText(payload.phone) || order.customer_phone);
  if (!phone) {
    return json({ error: "A valid phone number is required." }, 400, headers);
  }

  const paymentAttemptRows = await supabaseRequest<SupabasePaymentAttemptRow[]>(
    env,
    "payment_attempts",
    {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        order_id: order.id,
        provider: "mpesa",
        idempotency_key: idempotencyKey,
        status: "initiated",
        amount_kes: order.total_kes,
      }),
    }
  );

  const paymentAttempt = asArray<SupabasePaymentAttemptRow>(paymentAttemptRows)[0] ?? null;
  if (!paymentAttempt) {
    return json({ error: "Failed to create payment attempt." }, 500, headers);
  }

  try {
    const stkResult = await initiateStkPush(
      env,
      order.order_ref,
      order.total_kes,
      phone,
      normalizeText(payload.transactionDesc) || "Retry order payment"
    );

    await supabaseRequest(
      env,
      `payment_attempts?id=eq.${encodeURIComponent(paymentAttempt.id)}`,
      {
        method: "PATCH",
        headers: {
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          status: "pending",
          merchant_request_id: stkResult.merchantRequestId,
          checkout_request_id: stkResult.checkoutRequestId,
          raw_response: stkResult.responsePayload,
          result_desc: "STK retry initiated",
        }),
      }
    );

    return json(
      {
        ok: true,
        orderId: order.id,
        orderRef: order.order_ref,
        checkoutRequestId: stkResult.checkoutRequestId,
        customerMessage: stkResult.customerMessage || "STK prompt sent. Complete payment on your phone.",
      },
      200,
      headers
    );
  } catch (error) {
    await supabaseRequest(
      env,
      `payment_attempts?id=eq.${encodeURIComponent(paymentAttempt.id)}`,
      {
        method: "PATCH",
        headers: {
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          status: "failed",
          result_desc: error instanceof Error ? error.message : "STK retry failed.",
          completed_at: new Date().toISOString(),
        }),
      }
    );

    return json({ error: error instanceof Error ? error.message : "STK retry failed." }, 500, headers);
  }
}

async function handleOrderStatus(url: URL, env: Env, headers: Record<string, string>): Promise<Response> {
  const paymentConfigError = ensurePaymentConfig(env);
  if (paymentConfigError) {
    return json({ error: paymentConfigError }, 500, headers);
  }

  const orderId = normalizeText(url.searchParams.get("orderId"));
  const orderRef = normalizeText(url.searchParams.get("orderRef"));

  if (!orderId && !orderRef) {
    return json({ error: "orderId or orderRef is required." }, 400, headers);
  }

  const orderFilter = orderId
    ? `id=eq.${encodeURIComponent(orderId)}`
    : `order_ref=eq.${encodeURIComponent(orderRef || "")}`;

  const orderRows = await supabaseRequest<SupabaseOrderRow[]>(
    env,
    `orders?${orderFilter}&select=id,order_ref,payment_status,order_status,total_kes,created_at,paid_at,cancelled_at&limit=1`,
    {
      method: "GET",
    }
  );

  const order = asArray<SupabaseOrderRow>(orderRows)[0] ?? null;
  if (!order) {
    return json({ error: "Order not found." }, 404, headers);
  }

  const paymentAttemptRows = await supabaseRequest<SupabasePaymentAttemptRow[]>(
    env,
    `payment_attempts?order_id=eq.${encodeURIComponent(order.id)}&select=status,checkout_request_id,merchant_request_id,mpesa_receipt_number,result_code,result_desc,updated_at&order=created_at.desc&limit=1`,
    {
      method: "GET",
    }
  );

  const reservationRows = await supabaseRequest<Array<{ expires_at: string }>>(
    env,
    `stock_reservations?order_id=eq.${encodeURIComponent(order.id)}&status=eq.active&select=expires_at&order=expires_at.asc&limit=1`,
    {
      method: "GET",
    }
  );

  const latestAttempt = asArray<SupabasePaymentAttemptRow>(paymentAttemptRows)[0] ?? null;
  const activeReservation = asArray<{ expires_at: string }>(reservationRows)[0] ?? null;

  return json(
    {
      ok: true,
      orderId: order.id,
      orderRef: order.order_ref,
      paymentStatus: order.payment_status,
      orderStatus: order.order_status,
      totalKes: order.total_kes,
      paidAt: order.paid_at || null,
      cancelledAt: order.cancelled_at || null,
      checkoutRequestId: latestAttempt?.checkout_request_id || null,
      merchantRequestId: latestAttempt?.merchant_request_id || null,
      mpesaReceiptNumber: latestAttempt?.mpesa_receipt_number || null,
      resultCode: latestAttempt?.result_code ?? null,
      resultDesc: latestAttempt?.result_desc || null,
      reservationExpiresAt: activeReservation?.expires_at || null,
      updatedAt: latestAttempt?.updated_at || order.created_at,
    },
    200,
    headers
  );
}

async function handleMpesaCallback(
  request: Request,
  env: Env,
  headers: Record<string, string>,
  callbackToken: string
): Promise<Response> {
  const paymentConfigError = ensurePaymentConfig(env);
  if (paymentConfigError) {
    return json({ error: paymentConfigError }, 500, headers);
  }

  const expectedToken = normalizeText(env.MPESA_CALLBACK_TOKEN);
  if (!expectedToken) {
    return json({ error: "Missing MPESA_CALLBACK_TOKEN." }, 500, headers);
  }

  if (callbackToken !== expectedToken) {
    return json({ error: "Unauthorized callback." }, 401, headers);
  }

  const rawBody = await request.text();

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return json({ error: "Invalid callback payload." }, 400, headers);
  }

  const callback = payload?.Body?.stkCallback;
  const checkoutRequestId = normalizeText(callback?.CheckoutRequestID);
  const merchantRequestId = normalizeText(callback?.MerchantRequestID);
  const resultCode = Number(callback?.ResultCode ?? -1);
  const resultDesc = normalizeText(callback?.ResultDesc) || "Unknown callback result";

  const callbackRows = await supabaseRequest<Array<{ id: string }>>(
    env,
    "mpesa_callbacks",
    {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        checkout_request_id: checkoutRequestId,
        merchant_request_id: merchantRequestId,
        result_code: Number.isFinite(resultCode) ? resultCode : -1,
        payload,
        processed: false,
      }),
    }
  );

  const callbackLogId = asArray<{ id: string }>(callbackRows)[0]?.id;

  if (!checkoutRequestId) {
    if (callbackLogId) {
      await supabaseRequest(
        env,
        `mpesa_callbacks?id=eq.${encodeURIComponent(callbackLogId)}`,
        {
          method: "PATCH",
          headers: {
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            processed: true,
            processed_at: new Date().toISOString(),
          }),
        }
      );
    }

    return json({ ok: true }, 200, headers);
  }

  const attemptRows = await supabaseRequest<SupabasePaymentAttemptRow[]>(
    env,
    `payment_attempts?checkout_request_id=eq.${encodeURIComponent(checkoutRequestId)}&select=id,order_id,status,checkout_request_id,merchant_request_id,mpesa_receipt_number,result_code,result_desc,updated_at&limit=1`,
    {
      method: "GET",
    }
  );

  const paymentAttempt = asArray<SupabasePaymentAttemptRow>(attemptRows)[0] ?? null;

  if (!paymentAttempt) {
    if (callbackLogId) {
      await supabaseRequest(
        env,
        `mpesa_callbacks?id=eq.${encodeURIComponent(callbackLogId)}`,
        {
          method: "PATCH",
          headers: {
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            processed: true,
            processed_at: new Date().toISOString(),
          }),
        }
      );
    }

    return json({ ok: true }, 200, headers);
  }

  if (paymentAttempt.status === "paid" || paymentAttempt.status === "failed") {
    if (callbackLogId) {
      await supabaseRequest(
        env,
        `mpesa_callbacks?id=eq.${encodeURIComponent(callbackLogId)}`,
        {
          method: "PATCH",
          headers: {
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            processed: true,
            processed_at: new Date().toISOString(),
          }),
        }
      );
    }

    return json({ ok: true, duplicate: true }, 200, headers);
  }

  if (resultCode === 0) {
    const metadata = callbackMetadataMap(callback);
    const receipt = normalizeText(metadata.MpesaReceiptNumber);
    const paidPhone = normalizeText(String(metadata.PhoneNumber ?? ""));
    const amount = Number(metadata.Amount ?? 0);

    await supabaseRequest(
      env,
      `payment_attempts?id=eq.${encodeURIComponent(paymentAttempt.id)}`,
      {
        method: "PATCH",
        headers: {
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          status: "paid",
          result_code: resultCode,
          result_desc: resultDesc,
          mpesa_receipt_number: receipt,
          paid_phone: paidPhone,
          amount_kes: Number.isFinite(amount) ? Math.round(amount) : null,
          callback_payload: payload,
          completed_at: new Date().toISOString(),
        }),
      }
    );

    await supabaseRequest(
      env,
      `orders?id=eq.${encodeURIComponent(paymentAttempt.order_id)}`,
      {
        method: "PATCH",
        headers: {
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          payment_status: "paid",
          order_status: "paid",
          paid_at: new Date().toISOString(),
        }),
      }
    );

    await supabaseRequest(
      env,
      `stock_reservations?order_id=eq.${encodeURIComponent(paymentAttempt.order_id)}&status=eq.active`,
      {
        method: "PATCH",
        headers: {
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          status: "committed",
        }),
      }
    );

    await supabaseRequest(
      env,
      "audit_logs",
      {
        method: "POST",
        headers: {
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          actor_type: "system",
          action: "payment_confirmed",
          entity_type: "order",
          entity_id: paymentAttempt.order_id,
          metadata: {
            checkoutRequestId,
            receipt,
            resultCode,
          },
        }),
      }
    );
  } else {
    await supabaseRequest(
      env,
      `payment_attempts?id=eq.${encodeURIComponent(paymentAttempt.id)}`,
      {
        method: "PATCH",
        headers: {
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          status: "failed",
          result_code: resultCode,
          result_desc: resultDesc,
          callback_payload: payload,
          completed_at: new Date().toISOString(),
        }),
      }
    );

    await supabaseRequest(
      env,
      `orders?id=eq.${encodeURIComponent(paymentAttempt.order_id)}`,
      {
        method: "PATCH",
        headers: {
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          payment_status: "payment_failed",
          order_status: "cancelled",
          cancelled_at: new Date().toISOString(),
        }),
      }
    );

    await supabaseRequest(
      env,
      `stock_reservations?order_id=eq.${encodeURIComponent(paymentAttempt.order_id)}&status=eq.active`,
      {
        method: "PATCH",
        headers: {
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          status: "released",
        }),
      }
    );

    await supabaseRequest(
      env,
      "audit_logs",
      {
        method: "POST",
        headers: {
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          actor_type: "system",
          action: "payment_failed",
          entity_type: "order",
          entity_id: paymentAttempt.order_id,
          metadata: {
            checkoutRequestId,
            resultCode,
            resultDesc,
          },
        }),
      }
    );
  }

  if (callbackLogId) {
    await supabaseRequest(
      env,
      `mpesa_callbacks?id=eq.${encodeURIComponent(callbackLogId)}`,
      {
        method: "PATCH",
        headers: {
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          processed: true,
          processed_at: new Date().toISOString(),
        }),
      }
    );
  }

  return json({ ok: true }, 200, headers);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const headers = corsHeaders(request.headers.get("Origin"), env.ALLOWED_ORIGIN);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    try {
      if (url.pathname === "/restock-request") {
        if (request.method !== "POST") {
          return json({ error: "Method not allowed" }, 405, headers);
        }

        return handleRestockRequest(request, env, headers);
      }

      if (url.pathname === "/forms/contact") {
        if (request.method !== "POST") {
          return json({ error: "Method not allowed" }, 405, headers);
        }

        return handleContactRequest(request, env, headers);
      }

      if (url.pathname === "/payments/checkout") {
        if (request.method !== "POST") {
          return json({ error: "Method not allowed" }, 405, headers);
        }

        return handlePaymentCheckout(request, env, headers);
      }

      if (url.pathname === "/payments/mpesa/stkpush") {
        if (request.method !== "POST") {
          return json({ error: "Method not allowed" }, 405, headers);
        }

        return handleStkRetry(request, env, headers);
      }

      if (url.pathname === "/payments/order-status") {
        if (request.method !== "GET") {
          return json({ error: "Method not allowed" }, 405, headers);
        }

        return handleOrderStatus(url, env, headers);
      }

      if (url.pathname.startsWith("/payments/mpesa/callback/")) {
        if (request.method !== "POST") {
          return json({ error: "Method not allowed" }, 405, headers);
        }

        const callbackToken = url.pathname.replace("/payments/mpesa/callback/", "").trim();
        return handleMpesaCallback(request, env, headers, callbackToken);
      }

      return json({ error: "Not found" }, 404, headers);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected server error";
      return json({ error: message }, 500, headers);
    }
  },
};