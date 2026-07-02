import type { Metadata } from "next"
import { listSaleProducts } from "@/services/product-service"
import { ProductGrid } from "@/components/storefront/product-grid"

export const metadata: Metadata = {
  title: "Promoções",
  description: "Peças selecionadas da Anny Moda Executiva com condições especiais.",
}

export default async function PromocoesPage() {
  const products = await listSaleProducts(24)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="font-heading text-3xl sm:text-4xl">Promoções</h1>
        <p className="mt-3 text-muted-foreground">
          Peças exclusivas com condições especiais, por tempo limitado.
        </p>
      </header>
      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </div>
  )
}
