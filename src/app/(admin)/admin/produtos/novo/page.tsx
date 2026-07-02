import { listCategories } from "@/services/category-service"
import { ProductForm } from "@/components/admin/product-form"

export default async function NewProductPage() {
  const categories = await listCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Novo produto</h1>
        <p className="text-sm text-muted-foreground">Cadastre um novo produto no catálogo.</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}
