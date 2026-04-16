export const STOCK_POINT_DISCOUNT_RATE = 0.1

export const DUMMY_STOCK_POINT_CREDENTIALS = {
  username: 'stockpoint',
  password: 'stock@123',
}

export const applyStockPointDiscount = (price: number) => {
  return Math.round(price * (1 - STOCK_POINT_DISCOUNT_RATE))
}
