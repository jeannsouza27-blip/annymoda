import { BannerForm } from "@/components/admin/banner-form"

export default function NewBannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Novo banner</h1>
        <p className="text-sm text-muted-foreground">Cadastre um novo banner promocional.</p>
      </div>

      <BannerForm />
    </div>
  )
}
