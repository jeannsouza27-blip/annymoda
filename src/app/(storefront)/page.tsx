import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { listActiveBanners } from "@/services/banner-service"
import { listCategories } from "@/services/category-service"
import { listFeaturedProducts } from "@/services/product-service"
import { listFeaturedTestimonials } from "@/services/review-service"
import { Hero } from "@/components/storefront/hero"
import { ProductGrid } from "@/components/storefront/product-grid"
import { SectionHeading } from "@/components/shared/section-heading"
import { BrandStory } from "@/components/storefront/brand-story"
import { TestimonialsSection } from "@/components/storefront/testimonials-section"
import { InstagramFeedGrid } from "@/components/storefront/instagram-feed-grid"
import { NewsletterForm } from "@/components/storefront/newsletter-form"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Início",
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
}

export default async function HomePage() {
  const [banners, categories, featured, testimonials] = await Promise.all([
    listActiveBanners("HERO"),
    listCategories(),
    listFeaturedProducts(),
    listFeaturedTestimonials(),
  ])

  const heroBanner = banners[0]

  return (
    <>
      {heroBanner ? (
        <Hero banner={heroBanner} />
      ) : (
        <section className="relative flex h-[70vh] min-h-[440px] w-full items-center justify-center bg-sidebar text-center">
          <div className="mx-auto max-w-2xl px-6">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em] text-gold-400">
              Anny Moda Executiva
            </p>
            <h1 className="font-heading text-4xl italic leading-[1.1] text-white sm:text-6xl">
              {siteConfig.tagline}
            </h1>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="rounded-none bg-gold-500 px-8 text-sm uppercase tracking-widest text-gold-foreground hover:bg-gold-400"
              >
                <Link href="/novidades">Ver novidades</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Categorias"
          title="Vista-se para liderar"
          description="Peças pensadas para cada momento da sua rotina executiva."
        />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categoria/${category.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-md bg-muted"
            >
              {category.imageUrl && (
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute bottom-4 left-4 font-heading text-lg text-white">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Seleção da semana"
          title="Destaques"
          description="As peças favoritas de quem veste Anny."
        />
        <div className="mt-12">
          <ProductGrid products={featured} />
        </div>
      </section>

      <BrandStory />
      <TestimonialsSection reviews={testimonials} />
      <InstagramFeedGrid />

      <section className="bg-sidebar py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-heading text-2xl text-white sm:text-3xl">
            Receba novidades em primeira mão
          </h2>
          <p className="mt-3 text-sm text-white/70">
            Lançamentos, promoções exclusivas e inspirações de estilo direto no seu e-mail.
          </p>
          <NewsletterForm className="mt-8 text-white" />
        </div>
      </section>
    </>
  )
}
