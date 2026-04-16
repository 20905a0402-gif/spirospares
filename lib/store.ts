import { create } from "zustand";
import { applyStockPointDiscount, DUMMY_STOCK_POINT_CREDENTIALS } from "@/lib/stockPoint";

export type ProductType = "bike" | "spare" | "gadget" | "insurance";

export type ProductActionItem = {
  id: string;
  type: ProductType;
  name: string;
  price: number;
  basePrice?: number;
  image: string;
  sku?: string;
};

export type CartItem = ProductActionItem & {
  basePrice: number;
  quantity: number;
};

type ShopState = {
  cart: CartItem[];
  wishlist: ProductActionItem[];
  isStockPointAuthenticated: boolean;
  authenticateStockPoint: (username: string, password: string) => boolean;
  logoutStockPoint: () => void;
  addToCart: (item: ProductActionItem) => void;
  removeFromCart: (id: string, type: ProductType) => void;
  updateCartQuantity: (id: string, type: ProductType, quantity: number) => void;
  toggleWishlist: (item: ProductActionItem) => void;
  removeFromWishlist: (id: string, type: ProductType) => void;
  clearCart: () => void;
  isWishlisted: (id: string, type: ProductType) => boolean;
  getCartCount: () => number;
  getWishlistCount: () => number;
};

const isSameProduct = (a: { id: string; type: ProductType }, b: { id: string; type: ProductType }) =>
  a.id === b.id && a.type === b.type;

export const useShopStore = create<ShopState>((set, get) => ({
  cart: [],
  wishlist: [],
  isStockPointAuthenticated: false,
  authenticateStockPoint: (username, password) => {
    const isValid =
      username.trim().toLowerCase() === DUMMY_STOCK_POINT_CREDENTIALS.username &&
      password === DUMMY_STOCK_POINT_CREDENTIALS.password;

    if (!isValid) {
      return false;
    }

    set((state) => ({
      isStockPointAuthenticated: true,
      cart: state.cart.map((item) => ({
        ...item,
        price: applyStockPointDiscount(item.basePrice)
      }))
    }));

    return true;
  },
  logoutStockPoint: () =>
    set((state) => ({
      isStockPointAuthenticated: false,
      cart: state.cart.map((item) => ({
        ...item,
        price: item.basePrice
      }))
    })),
  addToCart: (item) =>
    set((state) => {
      const basePrice = item.basePrice ?? item.price;
      const effectivePrice = state.isStockPointAuthenticated
        ? applyStockPointDiscount(basePrice)
        : basePrice;
      const existing = state.cart.find((cartItem) => isSameProduct(cartItem, item));

      if (existing) {
        return {
          cart: state.cart.map((cartItem) =>
            isSameProduct(cartItem, item) ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
          )
        };
      }

      return {
        cart: [...state.cart, { ...item, basePrice, price: effectivePrice, quantity: 1 }]
      };
    }),
  removeFromCart: (id, type) =>
    set((state) => ({
      cart: state.cart.filter((item) => !isSameProduct(item, { id, type }))
    })),
  updateCartQuantity: (id, type, quantity) =>
    set((state) => ({
      cart: state.cart
        .map((item) => (isSameProduct(item, { id, type }) ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter((item) => item.quantity > 0)
    })),
  toggleWishlist: (item) =>
    set((state) => {
      const alreadyExists = state.wishlist.some((wishlistItem) => isSameProduct(wishlistItem, item));

      if (alreadyExists) {
        return {
          wishlist: state.wishlist.filter((wishlistItem) => !isSameProduct(wishlistItem, item))
        };
      }

      return {
        wishlist: [...state.wishlist, item]
      };
    }),
  removeFromWishlist: (id, type) =>
    set((state) => ({
      wishlist: state.wishlist.filter((item) => !isSameProduct(item, { id, type }))
    })),
  clearCart: () => set({ cart: [] }),
  isWishlisted: (id, type) => get().wishlist.some((item) => isSameProduct(item, { id, type })),
  getCartCount: () => get().cart.reduce((accumulator, item) => accumulator + item.quantity, 0),
  getWishlistCount: () => get().wishlist.length
}));
