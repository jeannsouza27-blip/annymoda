import { notFound } from "next/navigation"
import { listCoupons } from "@/services/coupon-service"
import { CouponForm } from "@/components/admin/coupon-form"

export default async function EditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const coupons = await listCoupons()
  const coupon = coupons.find((c) => c.id === id)

  if (!coupon) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Editar cupom</h1>
        <p className="text-sm text-muted-foreground">{coupon.code}</p>
      </div>

      <CouponForm coupon={coupon} />
    </div>
  )
}
