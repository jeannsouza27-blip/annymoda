import Link from "next/link"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { listCoupons } from "@/services/coupon-service"
import { deleteCouponAction } from "@/actions/coupon-actions"
import type { Coupon } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AdminDataTable, type AdminDataTableColumn } from "@/components/admin/admin-data-table"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import { formatCurrency } from "@/lib/format"

export default async function AdminCouponsPage() {
  const coupons = await listCoupons()

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
              "use server"
              await deleteCouponAction(coupon.id)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl text-foreground">Cupons</h1>
          <p className="text-sm text-muted-foreground">{coupons.length} cupons cadastrados</p>
        </div>
        <Button asChild>
          <Link href="/admin/cupons/novo">
            <Plus className="size-4" />
            Novo cupom
          </Link>
        </Button>
      </div>

      <AdminDataTable
        columns={columns}
        data={coupons}
        rowKey={(coupon) => coupon.id}
        emptyMessage="Nenhum cupom cadastrado ainda."
      />
    </div>
  )
}
