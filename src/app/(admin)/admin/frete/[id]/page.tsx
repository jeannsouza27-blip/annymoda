import { notFound } from "next/navigation"
import { listShippingRules } from "@/services/shipping-service"
import { ShippingRuleForm } from "@/components/admin/shipping-rule-form"

export default async function EditShippingRulePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const rules = await listShippingRules()
  const rule = rules.find((r) => r.id === id)

  if (!rule) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Editar regra de frete</h1>
        <p className="text-sm text-muted-foreground">{rule.name}</p>
      </div>

      <ShippingRuleForm rule={rule} />
    </div>
  )
}
