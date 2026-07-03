"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart, useCartTotals } from "@/hooks/use-cart"
import { formatCurrency } from "@/lib/format"

export function CartSheet() {
  const isOpen = useCart((s) => s.isOpen)
  const close = useCart((s) => s.close)
  const items = useCart((s) => s.items)
  const setQuantity = useCart((s) => s.setQuantity)
  const removeItem = useCart((s) => s.removeItem)
  const { subtotalCents } = useCartTotals()

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? useCart.setState({ isOpen: true }) : close())}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle className="font-heading text-xl">Sua sacola</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" />
            <p className="text-muted-foreground">Sua sacola está vazia.</p>
            <Button variant="outline" onClick={close} asChild>
              <Link href="/">Continuar comprando</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-5">
                {items.map((item) => (
                  <li key={`${item.productId}::${item.variantId ?? ""}`} className="flex gap-4">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted">
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/produto/${item.slug}`}
                          onClick={close}
                          className="text-sm font-medium leading-snug hover:text-gold-600"
                        >
                          {item.name}
                          {item.variantLabel && (
                            <span className="block text-xs font-normal text-muted-foreground">
                              {item.variantLabel}
                            </span>
                          )}
                        </Link>
                        <button
                          aria-label="Remover item"
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="-m-2 p-2 text-muted-foreground hover:text-destructive"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-md border">
                          <button
                            className="p-2.5 disabled:opacity-40"
                            disabled={item.quantity <= 1}
                            onClick={() => setQuantity(item.productId, item.quantity - 1, item.variantId)}
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-4 text-center text-sm">{item.quantity}</span>
                          <button
                            className="p-2.5 disabled:opacity-40"
                            disabled={item.quantity >= item.stock}
                            onClick={() => setQuantity(item.productId, item.quantity + 1, item.variantId)}
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <span className="text-sm font-medium">
                          {formatCurrency(item.priceCents * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter className="border-t">
              <div className="flex w-full items-center justify-between py-2 text-base">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-heading text-lg">{formatCurrency(subtotalCents)}</span>
              </div>
              <Button asChild size="lg" className="w-full bg-primary hover:bg-gold-500 hover:text-gold-foreground" onClick={close}>
                <Link href="/checkout">Finalizar compra</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full" onClick={close}>
                <Link href="/carrinho">Ver sacola completa</Link>
              </Button>
            </SheetFooter>
            <Separator />
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
