"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  productId: string
  variantId?: string
  variantLabel?: string
  name: string
  slug: string
  priceCents: number
  imageUrl: string
  quantity: number
  stock: number
}

function lineKey(productId: string, variantId?: string) {
  return `${productId}::${variantId ?? ""}`
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
  open: () => void
  close: () => void
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (productId: string, variantId?: string) => void
  setQuantity: (productId: string, quantity: number, variantId?: string) => void
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      addItem: (item, quantity = 1) => {
        const key = lineKey(item.productId, item.variantId)
        const existing = get().items.find((i) => lineKey(i.productId, i.variantId) === key)
        if (existing) {
          set({
            items: get().items.map((i) =>
              lineKey(i.productId, i.variantId) === key
                ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) }
                : i
            ),
            isOpen: true,
          })
          return
        }
        set({
          items: [...get().items, { ...item, quantity: Math.min(quantity, item.stock) }],
          isOpen: true,
        })
      },
      removeItem: (productId, variantId) => {
        const key = lineKey(productId, variantId)
        set({ items: get().items.filter((i) => lineKey(i.productId, i.variantId) !== key) })
      },
      setQuantity: (productId, quantity, variantId) => {
        const key = lineKey(productId, variantId)
        set({
          items: get().items.map((i) =>
            lineKey(i.productId, i.variantId) === key
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
              : i
          ),
        })
      },
      clear: () => set({ items: [] }),
    }),
    { name: "anny-cart" }
  )
)

export function useCartTotals() {
  const items = useCart((s) => s.items)
  const subtotalCents = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  return { subtotalCents, itemCount }
}
