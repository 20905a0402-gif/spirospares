import {NextResponse} from 'next/server'
import {createClient} from '@sanity/client'

type RestockRequestPayload = {
  productId?: string
  productName?: string
  productType?: 'spare' | 'bike' | 'gadget'
  sku?: string
  customerName?: string
  phone?: string
  email?: string
  note?: string
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-04-15'
const token = process.env.SANITY_API_WRITE_TOKEN

const hasConfig = Boolean(projectId && dataset && token)

const sanityWriteClient = hasConfig
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token,
    })
  : null

export async function POST(request: Request) {
  if (!sanityWriteClient) {
    return NextResponse.json(
      {error: 'Sanity write client is not configured. Add SANITY_API_WRITE_TOKEN in .env.local'},
      {status: 500}
    )
  }

  let payload: RestockRequestPayload

  try {
    payload = (await request.json()) as RestockRequestPayload
  } catch {
    return NextResponse.json({error: 'Invalid request body.'}, {status: 400})
  }

  const productId = payload.productId?.trim()
  const productName = payload.productName?.trim()
  const productType = payload.productType
  const customerName = payload.customerName?.trim()
  const phone = payload.phone?.trim()
  const email = payload.email?.trim()
  const note = payload.note?.trim()
  const sku = payload.sku?.trim()

  if (!productId || !productName || !productType || !customerName || !phone) {
    return NextResponse.json(
      {error: 'productId, productName, productType, customerName, and phone are required.'},
      {status: 400}
    )
  }

  try {
    await sanityWriteClient.create({
      _type: 'restockRequest',
      productId,
      productName,
      productType,
      sku,
      customerName,
      phone,
      email,
      note,
      status: 'new',
      requestedAt: new Date().toISOString(),
    })

    return NextResponse.json({ok: true})
  } catch {
    return NextResponse.json({error: 'Failed to save request. Try again.'}, {status: 500})
  }
}
