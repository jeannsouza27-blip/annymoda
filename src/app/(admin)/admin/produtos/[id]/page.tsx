import { notFound } from "next/navigation"
import { getProductById } from "@/services/product-service"
import { listCategories } from "@/services/category-service"
import { ProductForm } from "@/components/admin/product-form"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, categories] = await Promise.all([getProductById(id), listCategories()])

  if (!product) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Editar produto</h1>
        <p className="text-sm text-muted-foreground">{product.name}</p>
      </div>

      <ProductForm product={product} categories={categories} />
    </div>
  )
}
