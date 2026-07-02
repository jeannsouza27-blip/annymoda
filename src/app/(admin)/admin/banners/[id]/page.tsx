import { notFound } from "next/navigation"
import { getBannerById } from "@/services/banner-service"
import { BannerForm } from "@/components/admin/banner-form"

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const banner = await getBannerById(id)

  if (!banner) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Editar banner</h1>
        <p className="text-sm text-muted-foreground">{banner.title}</p>
      </div>

      <BannerForm banner={banner} />
    </div>
  )
}
