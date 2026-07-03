import Link from "next/link"
import { Plus } from "lucide-react"
import { listCoupons } from "@/services/coupon-service"
import { Button } from "@/components/ui/button"
import { CouponsTable } from "@/components/admin/coupons-table"

export default async function AdminCouponsPage() {
  const coupons = await listCoupons()

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

      <CouponsTable coupons={coupons} />
    </div>
  )
}
