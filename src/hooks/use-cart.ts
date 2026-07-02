"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  productId: string
  name: string
  slug: string
  priceCents: number
  imageUrl: string
  quantity: number
  stock: number
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
  open: () => void
  close: () => void
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
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
        const existing = get().items.find((i) => i.productId === item.productId)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId
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
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      setQuantity: (productId, quantity) =>
        set({
          items: get().items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
              : i
          ),
        }),
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
