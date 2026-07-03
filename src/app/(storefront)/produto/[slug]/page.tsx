import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getProductBySlug, listRelatedProducts } from "@/services/product-service"
import { listApprovedReviewsForProduct } from "@/services/review-service"
import { isInWishlist } from "@/services/wishlist-service"
import { getOptionalUser } from "@/lib/auth-guards"
import { ProductImageGallery } from "@/components/storefront/product-image-gallery"
import { PriceTag } from "@/components/storefront/price-tag"
import { ProductPurchasePanel } from "@/components/storefront/product-purchase-panel"
import { StarRating } from "@/components/storefront/star-rating"
import { ReviewList } from "@/components/storefront/review-list"
import { ReviewForm } from "@/components/storefront/review-form"
import { Breadcrumbs } from "@/components/storefront/breadcrumbs"
import { ProductGrid } from "@/components/storefront/product-grid"
import { SectionHeading } from "@/components/shared/section-heading"
import { siteConfig } from "@/lib/constants"
import { totalStock } from "@/lib/utils"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product || !product.isActive) return {}

  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0]
  const description = product.description.slice(0, 155)

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: primaryImage
        ? [{ url: primaryImage.url, width: 1200, height: 1500, alt: primaryImage.altText || product.name }]
        : undefined,
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product || !product.isActive) notFound()

  const [reviews, user, related] = await Promise.all([
    listApprovedReviewsForProduct(product.id),
    getOptionalUser(),
    listRelatedProducts(product.categoryId, product.id),
  ])

  const wishlisted = user ? await isInWishlist(user.id, product.id) : false
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0]
  const inStock = totalStock(product) > 0

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: primaryImage ? [primaryImage.url] : [],
    description: product.description,
    sku: product.sku ?? undefined,
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/produto/${product.slug}`,
      priceCurrency: "BRL",
      price: (product.priceCents / 100).toFixed(2),
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(reviews.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: averageRating.toFixed(1),
        reviewCount: reviews.length,
      },
    }),
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: product.category.name, href: `/categoria/${product.category.slug}` },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductImageGallery images={product.images} productName={product.name} />

        <div className="space-y-6">
          <div>
            <Link
              href={`/categoria/${product.category.slug}`}
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-gold-600 dark:hover:text-gold-400"
            >
              {product.category.name}
            </Link>
            <h1 className="mt-2 font-heading text-3xl leading-tight sm:text-4xl">{product.name}</h1>
            {reviews.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <StarRating rating={averageRating} />
                <span className="text-sm text-muted-foreground">
                  {reviews.length} avaliaç{reviews.length === 1 ? "ão" : "ões"}
                </span>
              </div>
            )}
          </div>

          <PriceTag
            priceCents={product.priceCents}
            compareAtPriceCents={product.compareAtPriceCents}
            installmentsMax={product.installmentsMax}
            className="text-xl"
          />

          <ProductPurchasePanel product={product} wishlisted={wishlisted} />

          <div className="space-y-2 border-t border-border pt-6">
            <h2 className="font-heading text-lg">Descrição</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-heading text-2xl">Avaliações</h2>
          <div className="mt-6">
            <ReviewList reviews={reviews} />
          </div>
        </div>
        <div>
          <h2 className="font-heading text-2xl">Deixe sua avaliação</h2>
          <div className="mt-6">
            <ReviewForm productId={product.id} canReview={!!user} />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-20">
          <SectionHeading title="Você também vai gostar" align="left" />
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  )
}
