"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"
import type { Category } from "@prisma/client"
import { deleteCategoryAction } from "@/actions/category-actions"
import { Button } from "@/components/ui/button"
import { AdminDataTable, type AdminDataTableColumn } from "@/components/admin/admin-data-table"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"

export function CategoriesTable({ categories }: { categories: Category[] }) {
  const router = useRouter()

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
              await deleteCategoryAction(category.id)
              router.refresh()
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
    <AdminDataTable
      columns={columns}
      data={categories}
      rowKey={(category) => category.id}
      emptyMessage="Nenhuma categoria cadastrada ainda."
    />
  )
}
