"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"
import type { ShippingRule } from "@prisma/client"
import { deleteShippingRuleAction } from "@/actions/shipping-actions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AdminDataTable, type AdminDataTableColumn } from "@/components/admin/admin-data-table"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import { formatCurrency } from "@/lib/format"

export function ShippingRulesTable({ rules }: { rules: ShippingRule[] }) {
  const router = useRouter()

  const columns: AdminDataTableColumn<ShippingRule>[] = [
    {
      key: "name",
      header: "Regra",
      sortValue: (rule) => rule.name,
      cell: (rule) => <span className="font-medium text-foreground">{rule.name}</span>,
    },
    {
      key: "state",
      header: "UF",
      cell: (rule) => (
        <span className="text-muted-foreground">{rule.state ?? "Demais estados"}</span>
      ),
    },
    {
      key: "price",
      header: "Valor",
      sortValue: (rule) => rule.priceCents,
      cell: (rule) => formatCurrency(rule.priceCents),
    },
    {
      key: "eta",
      header: "Prazo",
      cell: (rule) => (
        <span className="text-muted-foreground">
          {rule.estimatedDaysMin}–{rule.estimatedDaysMax} dias úteis
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (rule) => (
        <Badge variant={rule.isActive ? "secondary" : "outline"}>
          {rule.isActive ? "Ativa" : "Inativa"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-24 text-right",
      cell: (rule) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href={`/admin/frete/${rule.id}`} aria-label="Editar regra">
              <Pencil className="size-4" />
            </Link>
          </Button>
          <ConfirmDeleteDialog
            title="Excluir regra de frete"
            description={`Tem certeza que deseja excluir a regra "${rule.name}"?`}
            onConfirm={async () => {
              await deleteShippingRuleAction(rule.id)
              router.refresh()
            }}
            trigger={
              <Button variant="ghost" size="icon-sm" aria-label="Excluir regra">
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
      data={rules}
      rowKey={(rule) => rule.id}
      emptyMessage="Nenhuma regra de frete cadastrada ainda."
    />
  )
}
