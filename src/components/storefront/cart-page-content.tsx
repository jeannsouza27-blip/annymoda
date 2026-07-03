"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart, useCartTotals } from "@/hooks/use-cart"
import { formatCurrency } from "@/lib/format"

export function CartPageContent() {
  const items = useCart((s) => s.items)
  const setQuantity = useCart((s) => s.setQuantity)
  const removeItem = useCart((s) => s.removeItem)
  const { subtotalCents, itemCount } = useCartTotals()

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <ShoppingBag className="size-12 text-muted-foreground" />
        <h1 className="font-heading text-2xl">Sua sacola está vazia</h1>
        <p className="text-muted-foreground">
          Explore nossa coleção e encontre peças perfeitas para o seu estilo.
        </p>
        <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-gold-500 hover:text-gold-foreground">
          <Link href="/novidades">Ver novidades</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
      <div className="lg:col-span-2">
        <h1 className="mb-8 font-heading text-3xl">
          Sua sacola ({itemCount} {itemCount === 1 ? "item" : "itens"})
        </h1>
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={`${item.productId}::${item.variantId ?? ""}`} className="flex gap-4 py-6">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-md bg-muted sm:size-28">
                {item.imageUrl && (
                  <Image src={item.imageUrl} alt={item.name} fill sizes="112px" className="object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/produto/${item.slug}`}
                    className="font-heading text-base hover:text-gold-600 dark:hover:text-gold-400"
                  >
                    {item.name}
                    {item.variantLabel && (
                      <span className="block font-sans text-xs font-normal text-muted-foreground">
                        {item.variantLabel}
                      </span>
                    )}
                  </Link>
                  <button
                    aria-label="Remover item"
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-md border border-border">
                    <button
                      className="p-2 disabled:opacity-40"
                      disabled={item.quantity <= 1}
                      onClick={() => setQuantity(item.productId, item.quantity - 1, item.variantId)}
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm">{item.quantity}</span>
                    <button
                      className="p-2 disabled:opacity-40"
                      disabled={item.quantity >= item.stock}
                      onClick={() => setQuantity(item.productId, item.quantity + 1, item.variantId)}
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <span className="font-heading text-base">{formatCurrency(item.priceCents * item.quantity)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="text-lg">Resumo do pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotalCents)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Frete e cupom são calculados no checkout.</p>
            <Separator />
            <div className="flex items-center justify-between font-heading text-lg">
              <span>Total estimado</span>
              <span>{formatCurrency(subtotalCents)}</span>
            </div>
            <Button asChild size="lg" className="w-full bg-primary text-primary-foreground hover:bg-gold-500 hover:text-gold-foreground">
              <Link href="/checkout">Finalizar compra</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/">Continuar comprando</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
