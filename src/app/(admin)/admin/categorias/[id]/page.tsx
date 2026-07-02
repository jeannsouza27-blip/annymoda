import { notFound } from "next/navigation"
import { getCategoryById } from "@/services/category-service"
import { CategoryForm } from "@/components/admin/category-form"

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const category = await getCategoryById(id)

  if (!category) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Editar categoria</h1>
        <p className="text-sm text-muted-foreground">{category.name}</p>
      </div>

      <CategoryForm category={category} />
    </div>
  )
}
