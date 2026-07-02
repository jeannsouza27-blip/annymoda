import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCategoryBySlug } from "@/services/category-service"
import { listProductsByCategorySlug } from "@/services/product-service"
import { ProductGrid } from "@/components/storefront/product-grid"
import { Breadcrumbs } from "@/components/storefront/breadcrumbs"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return {}

  const description =
    category.description ?? `Confira a coleção ${category.name} da Anny Moda Executiva.`

  return {
    title: category.name,
    description,
    openGraph: { title: category.name, description },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const products = await listProductsByCategorySlug(slug)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: category.name }]} />
      <header className="mt-6 max-w-2xl">
        <h1 className="font-heading text-3xl sm:text-4xl">{category.name}</h1>
        {category.description && (
          <p className="mt-3 text-muted-foreground">{category.description}</p>
        )}
      </header>
      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </div>
  )
}
