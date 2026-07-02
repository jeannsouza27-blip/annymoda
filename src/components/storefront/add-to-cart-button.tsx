"use client"

import { ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import type { ProductWithImages } from "@/services/product-service"
import { cn } from "@/lib/utils"

export function AddToCartButton({
  product,
  className,
  size = "default",
}: {
  product: ProductWithImages
  className?: string
  size?: "default" | "sm" | "lg"
}) {
  const addItem = useCart((s) => s.addItem)
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0]
  const outOfStock = product.stock <= 0

  return (
    <Button
      size={size}
      disabled={outOfStock}
      className={cn(
        "bg-primary text-primary-foreground hover:bg-gold-500 hover:text-gold-foreground",
        className
      )}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        addItem({
          productId: product.id,
          name: product.name,
          slug: product.slug,
          priceCents: product.priceCents,
          imageUrl: primaryImage?.url ?? "",
          stock: product.stock,
        })
        toast.success(`${product.name} adicionado à sacola`)
      }}
    >
      <ShoppingBag className="size-4" />
      {outOfStock ? "Esgotado" : "Comprar"}
    </Button>
  )
}
