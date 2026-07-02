"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ClipboardList,
  Ticket,
  Truck,
  Image as ImageIcon,
  Users,
  Star,
  Store,
} from "lucide-react"
import { cn } from "@/lib/utils"

export const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: FolderTree },
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/admin/cupons", label: "Cupons", icon: Ticket },
  { href: "/admin/frete", label: "Frete", icon: Truck },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/avaliacoes", label: "Avaliações", icon: Star },
] as const

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AdminSidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-5">
        <span className="font-heading text-lg tracking-wide text-sidebar-foreground">
          Anny <span className="text-sidebar-primary">Admin</span>
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {ADMIN_NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        >
          <Store className="size-4 shrink-0" />
          Ver loja
        </Link>
      </div>
    </div>
  )
}

export function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-sidebar-border lg:block">
      <AdminSidebarNav />
    </aside>
  )
}
