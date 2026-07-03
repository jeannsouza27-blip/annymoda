import Link from "next/link"
import { Plus } from "lucide-react"
import { listCategories } from "@/services/category-service"
import { Button } from "@/components/ui/button"
import { CategoriesTable } from "@/components/admin/categories-table"

export default async function AdminCategoriesPage() {
  const categories = await listCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl text-foreground">Categorias</h1>
          <p className="text-sm text-muted-foreground">{categories.length} categorias cadastradas</p>
        </div>
        <Button asChild>
          <Link href="/admin/categorias/novo">
            <Plus className="size-4" />
            Nova categoria
          </Link>
        </Button>
      </div>

      <CategoriesTable categories={categories} />
    </div>
  )
}
