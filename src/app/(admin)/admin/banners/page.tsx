import Link from "next/link"
import { Plus } from "lucide-react"
import { listAllBanners } from "@/services/banner-service"
import { Button } from "@/components/ui/button"
import { BannersTable } from "@/components/admin/banners-table"

export default async function AdminBannersPage() {
  const banners = await listAllBanners()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl text-foreground">Banners</h1>
          <p className="text-sm text-muted-foreground">{banners.length} banners cadastrados</p>
        </div>
        <Button asChild>
          <Link href="/admin/banners/novo">
            <Plus className="size-4" />
            Novo banner
          </Link>
        </Button>
      </div>

      <BannersTable banners={banners} />
    </div>
  )
}
