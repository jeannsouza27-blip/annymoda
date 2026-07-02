import { ShippingRuleForm } from "@/components/admin/shipping-rule-form"

export default function NewShippingRulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Nova regra de frete</h1>
        <p className="text-sm text-muted-foreground">Cadastre uma nova regra de cálculo de frete.</p>
      </div>

      <ShippingRuleForm />
    </div>
  )
}
