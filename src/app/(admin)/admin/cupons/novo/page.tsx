import { CouponForm } from "@/components/admin/coupon-form"

export default function NewCouponPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Novo cupom</h1>
        <p className="text-sm text-muted-foreground">Cadastre um novo cupom de desconto.</p>
      </div>

      <CouponForm />
    </div>
  )
}
