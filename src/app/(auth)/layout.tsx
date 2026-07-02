import type { ReactNode } from "react"
import { Logo } from "@/components/shared/logo"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-beige px-4 py-16">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="w-full max-w-md rounded-xl bg-card p-8 shadow-sm ring-1 ring-foreground/10 sm:p-10">
        {children}
      </div>
    </div>
  )
}
