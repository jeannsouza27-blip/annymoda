import { LayoutGrid, Package, Heart, MapPin, UserCog, LogOut } from "lucide-react"
import { AccountNavLink } from "@/components/account/account-nav-link"
import { signOut } from "@/lib/auth"

const navItems = [
  { href: "/minha-conta", label: "Visão geral", icon: LayoutGrid, exact: true },
  { href: "/minha-conta/pedidos", label: "Meus pedidos", icon: Package },
  { href: "/favoritos", label: "Favoritos", icon: Heart },
  { href: "/enderecos", label: "Endereços", icon: MapPin },
  { href: "/minha-conta/dados", label: "Meus dados", icon: UserCog },
]

export function AccountSidebar({ name, email }: { name: string; email: string }) {
  return (
    <aside className="h-fit rounded-xl bg-card p-4 ring-1 ring-foreground/10 lg:sticky lg:top-24">
      <div className="mb-4 border-b border-border px-1 pb-4">
        <p className="truncate font-heading text-base text-foreground">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{email}</p>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <AccountNavLink key={item.href} {...item} />
        ))}
      </nav>

      <form
        action={async () => {
          "use server"
          await signOut({ redirectTo: "/" })
        }}
        className="mt-2 border-t border-border pt-2"
      >
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4" />
          Sair
        </button>
      </form>
    </aside>
  )
}
