import Link from "next/link"
import { Plus } from "lucide-react"
import { listAllProductsForAdmin } from "@/services/product-service"
import { Button } from "@/components/ui/button"
import { ProductsTable } from "@/components/admin/products-table"

export default async function AdminProductsPage() {
  const products = await listAllProductsForAdmin()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl text-foreground">Produtos</h1>
          <p className="text-sm text-muted-foreground">{products.length} produtos cadastrados</p>
        </div>
        <Button asChild>
          <Link href="/admin/produtos/novo">
            <Plus className="size-4" />
            Novo produto
          </Link>
        </Button>
      </div>

      <ProductsTable products={products} />
    </div>
  )
}
