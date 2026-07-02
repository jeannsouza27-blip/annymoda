import Link from "next/link"
import Image from "next/image"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { listCategories } from "@/services/category-service"
import { deleteCategoryAction } from "@/actions/category-actions"
import type { Category } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { AdminDataTable, type AdminDataTableColumn } from "@/components/admin/admin-data-table"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"

export default async function AdminCategoriesPage() {
  const categories = await listCategories()

  const columns: AdminDataTableColumn<Category>[] = [
    {
      key: "image",
      header: "",
      className: "w-16",
      cell: (category) => (
        <div className="relative size-12 overflow-hidden rounded-md bg-muted">
          {category.imageUrl && (
            <Image src={category.imageUrl} alt={category.name} fill sizes="48px" className="object-cover" />
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "Categoria",
      sortValue: (category) => category.name,
      cell: (category) => (
        <div>
          <p className="font-medium text-foreground">{category.name}</p>
          <p className="text-xs text-muted-foreground">/{category.slug}</p>
        </div>
      ),
    },
    {
      key: "description",
      header: "Descrição",
      cell: (category) => (
        <span className="line-clamp-1 max-w-80 text-muted-foreground">
          {category.description ?? "—"}
        </span>
      ),
    },
    {
      key: "position",
      header: "Posição",
      sortValue: (category) => category.position,
      cell: (category) => category.position,
    },
    {
      key: "actions",
      header: "",
      className: "w-24 text-right",
      cell: (category) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href={`/admin/categorias/${category.id}`} aria-label="Editar categoria">
              <Pencil className="size-4" />
            </Link>
          </Button>
          <ConfirmDeleteDialog
            title="Excluir categoria"
            description={`Tem certeza que deseja excluir "${category.name}"? Produtos vinculados podem ser afetados.`}
            onConfirm={async () => {
              "use server"
              await deleteCategoryAction(category.id)
            }}
            trigger={
              <Button variant="ghost" size="icon-sm" aria-label="Excluir categoria">
                <Trash2 className="size-4 text-destructive" />
              </Button>
            }
          />
        </div>
      ),
    },
  ]

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

      <AdminDataTable
        columns={columns}
        data={categories}
        rowKey={(category) => category.id}
        emptyMessage="Nenhuma categoria cadastrada ainda."
      />
    </div>
  )
}
