import type { Metadata } from "next"
import { listNewProducts } from "@/services/product-service"
import { ProductGrid } from "@/components/storefront/product-grid"

export const metadata: Metadata = {
  title: "Novidades",
  description: "Confira os lançamentos mais recentes da Anny Moda Executiva.",
}

export default async function NovidadesPage() {
  const products = await listNewProducts(24)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="font-heading text-3xl sm:text-4xl">Novidades</h1>
        <p className="mt-3 text-muted-foreground">
          As últimas peças a chegar na coleção Anny, para quem quer estar sempre à frente.
        </p>
      </header>
      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </div>
  )
}
