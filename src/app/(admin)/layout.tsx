import type { ReactNode } from "react"
import { requireAdmin } from "@/lib/auth-guards"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminTopbar } from "@/components/admin/admin-topbar"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin()

  return (
    <div className="min-h-dvh bg-background">
      <AdminSidebar />
      <div className="lg:pl-60">
        <AdminTopbar adminName={admin.name} />
        <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
