"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"
import type { ProductWithImages } from "@/services/product-service"
import { deleteProductAction } from "@/actions/product-actions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AdminDataTable, type AdminDataTableColumn } from "@/components/admin/admin-data-table"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import { formatCurrency } from "@/lib/format"

export function ProductsTable({ products }: { products: ProductWithImages[] }) {
  const router = useRouter()

  const columns: AdminDataTableColumn<ProductWithImages>[] = [
    {
      key: "image",
      header: "",
      className: "w-16",
      cell: (product) => {
        const primary = product.images.find((i) => i.isPrimary) ?? product.images[0]
        return (
          <div className="relative size-12 overflow-hidden rounded-md bg-muted">
            {primary && (
              <Image src={primary.url} alt={primary.altText || product.name} fill sizes="48px" className="object-cover" />
            )}
          </div>
        )
      },
    },
    {
      key: "name",
      header: "Produto",
      sortValue: (product) => product.name,
      cell: (product) => (
        <div className="max-w-64">
          <p className="truncate font-medium text-foreground">{product.name}</p>
          {product.sku && <p className="text-xs text-muted-foreground">{product.sku}</p>}
        </div>
      ),
    },
    {
      key: "category",
      header: "Categoria",
      sortValue: (product) => product.category.name,
      cell: (product) => <span className="text-muted-foreground">{product.category.name}</span>,
    },
    {
      key: "price",
      header: "Preço",
      sortValue: (product) => product.priceCents,
      cell: (product) => (
        <div className="flex flex-col">
          <span className="font-medium">{formatCurrency(product.priceCents)}</span>
          {product.compareAtPriceCents && (
            <span className="text-xs text-muted-foreground line-through">
              {formatCurrency(product.compareAtPriceCents)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "stock",
      header: "Estoque",
      sortValue: (product) => product.stock,
      cell: (product) => (
        <span
          className={
            product.stock === 0
              ? "font-medium text-destructive"
              : product.stock < 5
                ? "font-medium text-gold-700 dark:text-gold-400"
                : "text-foreground"
          }
        >
          {product.stock}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (product) => (
        <div className="flex flex-wrap gap-1">
          <Badge variant={product.isActive ? "secondary" : "outline"}>
            {product.isActive ? "Ativo" : "Inativo"}
          </Badge>
          {product.isFeatured && (
            <Badge className="bg-gold-500 text-gold-foreground hover:bg-gold-500">Destaque</Badge>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-24 text-right",
      cell: (product) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href={`/admin/produtos/${product.id}`} aria-label="Editar produto">
              <Pencil className="size-4" />
            </Link>
          </Button>
          <ConfirmDeleteDialog
            title="Excluir produto"
            description={`Tem certeza que deseja excluir "${product.name}"? Esta ação não pode ser desfeita.`}
            onConfirm={async () => {
              await deleteProductAction(product.id)
              router.refresh()
            }}
            trigger={
              <Button variant="ghost" size="icon-sm" aria-label="Excluir produto">
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
      data={products}
      rowKey={(product) => product.id}
      emptyMessage="Nenhum produto cadastrado ainda."
    />
  )
}
