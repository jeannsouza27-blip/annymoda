import Image from "next/image"
import Link from "next/link"
import type { ProductWithImages } from "@/services/product-service"
import { PriceTag } from "@/components/storefront/price-tag"
import { AddToCartButton } from "@/components/storefront/add-to-cart-button"
import { Badge } from "@/components/ui/badge"

export function ProductCard({ product }: { product: ProductWithImages }) {
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0]
  const secondaryImage = product.images.find((i) => !i.isPrimary)
  const onSale = product.compareAtPriceCents !== null

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group flex flex-col"
      aria-label={product.name}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted">
        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-contain transition-opacity duration-500 group-hover:opacity-0"
            priority={false}
          />
        )}
        {secondaryImage && (
          <Image
            src={secondaryImage.url}
            alt={secondaryImage.altText || product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {onSale && (
            <Badge className="bg-gold-500 text-gold-foreground hover:bg-gold-500">
              Promoção
            </Badge>
          )}
          {product.isFeatured && !onSale && (
            <Badge variant="secondary">Destaque</Badge>
          )}
        </div>

        <div className="absolute bottom-3 right-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <AddToCartButton product={product} size="sm" />
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {product.category.name}
        </p>
        <h3 className="font-heading text-base leading-snug text-foreground">
          {product.name}
        </h3>
        <PriceTag
          priceCents={product.priceCents}
          compareAtPriceCents={product.compareAtPriceCents}
          installmentsMax={product.installmentsMax}
        />
      </div>
    </Link>
  )
}
