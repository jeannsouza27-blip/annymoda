import Link from "next/link"
import { Plus } from "lucide-react"
import { listShippingRules } from "@/services/shipping-service"
import { Button } from "@/components/ui/button"
import { ShippingRulesTable } from "@/components/admin/shipping-rules-table"

export default async function AdminShippingPage() {
  const rules = await listShippingRules()

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

      <ShippingRulesTable rules={rules} />
    </div>
  )
}
