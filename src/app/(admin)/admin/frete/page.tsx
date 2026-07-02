import Link from "next/link"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { listShippingRules } from "@/services/shipping-service"
import { deleteShippingRuleAction } from "@/actions/shipping-actions"
import type { ShippingRule } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AdminDataTable, type AdminDataTableColumn } from "@/components/admin/admin-data-table"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import { formatCurrency } from "@/lib/format"

export default async function AdminShippingPage() {
  const rules = await listShippingRules()

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
              "use server"
              await deleteShippingRuleAction(rule.id)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl text-foreground">Frete</h1>
          <p className="text-sm text-muted-foreground">{rules.length} regras cadastradas</p>
        </div>
        <Button asChild>
          <Link href="/admin/frete/novo">
            <Plus className="size-4" />
            Nova regra
          </Link>
        </Button>
      </div>

      <AdminDataTable
        columns={columns}
        data={rules}
        rowKey={(rule) => rule.id}
        emptyMessage="Nenhuma regra de frete cadastrada ainda."
      />
    </div>
  )
}
