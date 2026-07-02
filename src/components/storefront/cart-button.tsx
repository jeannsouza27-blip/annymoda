"use client"

import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart, useCartTotals } from "@/hooks/use-cart"

export function CartButton() {
  const open = useCart((s) => s.open)
  const { itemCount } = useCartTotals()

  return (
    <Button variant="ghost" size="icon" className="relative" aria-label="Abrir sacola" onClick={open}>
      <ShoppingBag className="size-5" />
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-semibold text-gold-foreground">
          {itemCount}
        </span>
      )}
    </Button>
  )
}
