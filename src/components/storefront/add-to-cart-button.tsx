"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import type { ProductWithImages } from "@/services/product-service"
import { cn } from "@/lib/utils"

type SelectedVariant = {
  id: string
  stock: number
  label: string
}

export function AddToCartButton({
  product,
  variant,
  disabled,
  className,
  size = "default",
}: {
  product: ProductWithImages
  /** Variação (cor/tamanho) já escolhida — obrigatória quando o produto tem variações. */
  variant?: SelectedVariant | null
  disabled?: boolean
  className?: string
  size?: "default" | "sm" | "lg"
}) {
  const addItem = useCart((s) => s.addItem)
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0]
  const hasVariants = product.variants.length > 0

  // `variant` omitido (undefined) = uso em cards de listagem, sem seletor de
  // cor/tamanho disponível: manda para a página do produto em vez de tentar
  // adicionar direto à sacola. `variant` explicitamente `null` = já estamos na
  // página do produto (ProductPurchasePanel), só que a seleção ainda não foi
  // concluída — nesse caso o botão some desabilitado, sem redirecionar.
  if (hasVariants && variant === undefined) {
    return (
      <Button
        asChild
        size={size}
        className={cn(
          "bg-primary text-primary-foreground hover:bg-gold-500 hover:text-gold-foreground",
          className
        )}
      >
        <Link href={`/produto/${product.slug}`} onClick={(e) => e.stopPropagation()}>
          <ShoppingBag className="size-4" />
          Ver opções
        </Link>
      </Button>
    )
  }

  const effectiveStock = hasVariants ? (variant?.stock ?? 0) : product.stock
  const outOfStock = effectiveStock <= 0

  return (
    <Button
      size={size}
      disabled={outOfStock || disabled}
      className={cn(
        "bg-primary text-primary-foreground hover:bg-gold-500 hover:text-gold-foreground",
        className
      )}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        addItem({
          productId: product.id,
          variantId: variant?.id,
          variantLabel: variant?.label,
          name: product.name,
          slug: product.slug,
          priceCents: product.priceCents,
          imageUrl: primaryImage?.url ?? "",
          stock: effectiveStock,
        })
        toast.success(`${product.name} adicionado à sacola`)
      }}
    >
      <ShoppingBag className="size-4" />
      {outOfStock ? "Esgotado" : "Comprar"}
    </Button>
  )
}
