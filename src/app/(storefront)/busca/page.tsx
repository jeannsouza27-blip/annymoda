import type { Metadata } from "next"
import { searchProducts } from "@/services/product-service"
import { ProductGrid } from "@/components/storefront/product-grid"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Buscar",
  description: "Busque peças da coleção Anny Moda Executiva.",
}

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() ?? ""
  const products = query ? await searchProducts(query) : []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="max-w-xl">
        <h1 className="font-heading text-3xl sm:text-4xl">Buscar produtos</h1>
        <form method="get" action="/busca" className="mt-6 flex gap-2">
          <Input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="O que você procura?"
            aria-label="Buscar produtos"
            className="h-11"
          />
          <Button type="submit" size="lg">
            Buscar
          </Button>
        </form>
      </header>

      <div className="mt-10">
        {!query ? (
          <p className="py-16 text-center text-muted-foreground">
            Digite um termo acima para encontrar peças da nossa coleção.
          </p>
        ) : (
          <>
            <p className="mb-8 text-sm text-muted-foreground">
              {products.length} resultado{products.length === 1 ? "" : "s"} para &ldquo;{query}&rdquo;
            </p>
            <ProductGrid products={products} />
          </>
        )}
      </div>
    </div>
  )
}
