import Link from "next/link"
import { Search, User, Heart, LogOut, LayoutDashboard, Package } from "lucide-react"
import { Logo } from "@/components/shared/logo"
import { CategoryNav } from "@/components/storefront/category-nav"
import { MobileNav } from "@/components/storefront/mobile-nav"
import { CartButton } from "@/components/storefront/cart-button"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getOptionalUser } from "@/lib/auth-guards"
import { signOut } from "@/lib/auth"

export async function Header() {
  const user = await getOptionalUser()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <MobileNav />
          <Logo />
        </div>

        <CategoryNav />

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex" asChild aria-label="Buscar">
            <Link href="/busca">
              <Search className="size-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex" asChild aria-label="Favoritos">
            <Link href="/favoritos">
              <Heart className="size-5" />
            </Link>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Minha conta">
                  <User className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate">{user.name ?? user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/minha-conta">
                    <User className="size-4" /> Minha conta
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/minha-conta/pedidos">
                    <Package className="size-4" /> Meus pedidos
                  </Link>
                </DropdownMenuItem>
                {user.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <LayoutDashboard className="size-4" /> Painel administrativo
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <form
                  action={async () => {
                    "use server"
                    await signOut({ redirectTo: "/" })
                  }}
                >
                  <DropdownMenuItem asChild>
                    <button type="submit" className="w-full">
                      <LogOut className="size-4" /> Sair
                    </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" asChild aria-label="Entrar">
              <Link href="/entrar">
                <User className="size-5" />
              </Link>
            </Button>
          )}

          <CartButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
