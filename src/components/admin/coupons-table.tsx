"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"
import type { Coupon } from "@prisma/client"
import { deleteCouponAction } from "@/actions/coupon-actions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AdminDataTable, type AdminDataTableColumn } from "@/components/admin/admin-data-table"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import { formatCurrency } from "@/lib/format"

export function CouponsTable({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter()

  const columns: AdminDataTableColumn<Coupon>[] = [
    {
      key: "code",
      header: "Código",
      sortValue: (coupon) => coupon.code,
      cell: (coupon) => <span className="font-medium text-foreground">{coupon.code}</span>,
    },
    {
      key: "type",
      header: "Desconto",
      cell: (coupon) => (
        <span>
          {coupon.type === "PERCENTAGE" ? `${coupon.value}%` : formatCurrency(coupon.value)}
        </span>
      ),
    },
    {
      key: "minOrder",
      header: "Pedido mínimo",
      cell: (coupon) => (
        <span className="text-muted-foreground">
          {coupon.minOrderCents ? formatCurrency(coupon.minOrderCents) : "—"}
        </span>
      ),
    },
    {
      key: "uses",
      header: "Usos",
      cell: (coupon) => (
        <span className="text-muted-foreground">
          {coupon.usedCount}
          {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (coupon) => (
        <Badge variant={coupon.isActive ? "secondary" : "outline"}>
          {coupon.isActive ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-24 text-right",
      cell: (coupon) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href={`/admin/cupons/${coupon.id}`} aria-label="Editar cupom">
              <Pencil className="size-4" />
            </Link>
          </Button>
          <ConfirmDeleteDialog
            title="Excluir cupom"
            description={`Tem certeza que deseja excluir o cupom "${coupon.code}"?`}
            onConfirm={async () => {
              await deleteCouponAction(coupon.id)
              router.refresh()
            }}
            trigger={
              <Button variant="ghost" size="icon-sm" aria-label="Excluir cupom">
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
      data={coupons}
      rowKey={(coupon) => coupon.id}
      emptyMessage="Nenhum cupom cadastrado ainda."
    />
  )
}
