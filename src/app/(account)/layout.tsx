import type { ReactNode } from "react"
import { requireUser } from "@/lib/auth-guards"
import { Header } from "@/components/storefront/header"
import { AccountSidebar } from "@/components/account/account-sidebar"

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const user = await requireUser()

  return (
    <div className="flex min-h-screen flex-col bg-beige">
      <Header />
      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <AccountSidebar name={user.name ?? "Cliente"} email={user.email ?? ""} />
        <main className="min-w-0 space-y-8">{children}</main>
      </div>
    </div>
  )
}
