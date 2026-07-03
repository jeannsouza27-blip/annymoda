"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"
import type { Banner } from "@prisma/client"
import { deleteBannerAction } from "@/actions/banner-actions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AdminDataTable, type AdminDataTableColumn } from "@/components/admin/admin-data-table"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"

const PLACEMENT_LABELS: Record<Banner["placement"], string> = {
  HERO: "Destaque principal",
  PROMO_STRIP: "Faixa promocional",
  CATEGORY_TOP: "Topo de categoria",
}

export function BannersTable({ banners }: { banners: Banner[] }) {
  const router = useRouter()

  const columns: AdminDataTableColumn<Banner>[] = [
    {
      key: "image",
      header: "",
      className: "w-20",
      cell: (banner) => (
        <div className="relative h-12 w-20 overflow-hidden rounded-md bg-muted">
          <Image src={banner.imageUrl} alt={banner.title} fill sizes="80px" className="object-cover" />
        </div>
      ),
    },
    {
      key: "title",
      header: "Banner",
      sortValue: (banner) => banner.title,
      cell: (banner) => (
        <div>
          <p className="font-medium text-foreground">{banner.title}</p>
          {banner.subtitle && (
            <p className="line-clamp-1 max-w-64 text-xs text-muted-foreground">{banner.subtitle}</p>
          )}
        </div>
      ),
    },
    {
      key: "placement",
      header: "Posicionamento",
      cell: (banner) => (
        <span className="text-muted-foreground">{PLACEMENT_LABELS[banner.placement]}</span>
      ),
    },
    {
      key: "position",
      header: "Ordem",
      sortValue: (banner) => banner.position,
      cell: (banner) => banner.position,
    },
    {
      key: "status",
      header: "Status",
      cell: (banner) => (
        <Badge variant={banner.isActive ? "secondary" : "outline"}>
          {banner.isActive ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-24 text-right",
      cell: (banner) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href={`/admin/banners/${banner.id}`} aria-label="Editar banner">
              <Pencil className="size-4" />
            </Link>
          </Button>
          <ConfirmDeleteDialog
            title="Excluir banner"
            description={`Tem certeza que deseja excluir o banner "${banner.title}"?`}
            onConfirm={async () => {
              await deleteBannerAction(banner.id)
              router.refresh()
            }}
            trigger={
              <Button variant="ghost" size="icon-sm" aria-label="Excluir banner">
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
      data={banners}
      rowKey={(banner) => banner.id}
      emptyMessage="Nenhum banner cadastrado ainda."
    />
  )
}
