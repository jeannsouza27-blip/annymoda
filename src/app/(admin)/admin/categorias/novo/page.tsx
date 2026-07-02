import { CategoryForm } from "@/components/admin/category-form"

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Nova categoria</h1>
        <p className="text-sm text-muted-foreground">Cadastre uma nova categoria de produtos.</p>
      </div>

      <CategoryForm />
    </div>
  )
}
