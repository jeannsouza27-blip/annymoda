"use client"

import * as React from "react"
import type { ProductWithImages } from "@/services/product-service"
import { AddToCartButton } from "@/components/storefront/add-to-cart-button"
import { WishlistButton } from "@/components/storefront/wishlist-button"
import { cn } from "@/lib/utils"

export function ProductPurchasePanel({
  product,
  wishlisted,
}: {
  product: ProductWithImages
  wishlisted: boolean
}) {
  const colors = React.useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.color).filter((c): c is string => !!c))),
    [product.variants]
  )
  const sizes = React.useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.size).filter((s): s is string => !!s))),
    [product.variants]
  )

  const [selectedColor, setSelectedColor] = React.useState<string | undefined>(colors[0])
  const [selectedSize, setSelectedSize] = React.useState<string | undefined>(sizes[0])

  const hasVariants = product.variants.length > 0
  const selectedVariant = hasVariants
    ? product.variants.find(
        (v) => (v.color ?? undefined) === selectedColor && (v.size ?? undefined) === selectedSize
      )
    : undefined

  const effectiveStock = hasVariants ? (selectedVariant?.stock ?? 0) : product.stock
  const missingSelection = hasVariants && (!selectedVariant || (colors.length > 0 && !selectedColor) || (sizes.length > 0 && !selectedSize))

  return (
    <div className="space-y-5">
      {colors.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Cor</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition-colors",
                  selectedColor === color
                    ? "border-gold-500 bg-gold-500/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-gold-400"
                )}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Tamanho</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const availableForThisSize = product.variants.some(
                (v) =>
                  v.size === size &&
                  (colors.length === 0 || (v.color ?? undefined) === selectedColor) &&
                  v.stock > 0
              )
              return (
                <button
                  key={size}
                  type="button"
                  disabled={!availableForThisSize}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "min-w-11 rounded-full border px-3 py-1.5 text-sm transition-colors",
                    selectedSize === size
                      ? "border-gold-500 bg-gold-500/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-gold-400",
                    !availableForThisSize && "cursor-not-allowed opacity-40 hover:border-border"
                  )}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <p
        className={cn(
          "text-sm font-medium",
          effectiveStock > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
        )}
      >
        {missingSelection
          ? "Selecione as opções para ver a disponibilidade"
          : effectiveStock > 0
            ? effectiveStock <= 5
              ? `Últimas ${effectiveStock} unidades`
              : "Em estoque"
            : "Esgotado nessa opção"}
      </p>

      <div className="flex items-center gap-3">
        <AddToCartButton
          product={product}
          size="lg"
          className="flex-1"
          disabled={missingSelection}
          variant={
            hasVariants && selectedVariant
              ? {
                  id: selectedVariant.id,
                  stock: selectedVariant.stock,
                  label: [selectedColor, selectedSize].filter(Boolean).join(" / "),
                }
              : hasVariants
                ? null
                : undefined
          }
        />
        <WishlistButton productId={product.id} initialActive={wishlisted} />
      </div>
    </div>
  )
}
