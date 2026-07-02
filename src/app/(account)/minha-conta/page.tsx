import Link from "next/link"
import { Package, Heart, MapPin, UserCog, ArrowRight } from "lucide-react"
import { requireUser } from "@/lib/auth-guards"
import { listOrdersForUser } from "@/services/order-service"
import { listWishlistForUser } from "@/services/wishlist-service"
import { formatCurrency, formatDate } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderStatusBadge } from "@/components/account/order-status-badge"

export default async function MinhaContaPage() {
  const user = await requireUser()
  const [orders, wishlist] = await Promise.all([
    listOrdersForUser(user.id),
    listWishlistForUser(user.id),
  ])

  const latestOrder = orders[0]

  const quickLinks = [
    { href: "/minha-conta/pedidos", label: "Meus pedidos", icon: Package },
    { href: "/favoritos", label: "Favoritos", icon: Heart },
    { href: "/enderecos", label: "Endereços", icon: MapPin },
    { href: "/minha-conta/dados", label: "Meus dados", icon: UserCog },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl text-foreground">Olá, {user.name ?? "cliente"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bem-vinda à sua área da conta. Acompanhe seus pedidos, favoritos e dados por aqui.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-2xl font-heading text-foreground">{orders.length}</p>
            <p className="text-sm text-muted-foreground">
              {orders.length === 0
                ? "Você ainda não fez nenhum pedido."
                : "pedido(s) realizado(s) até agora."}
            </p>
            {latestOrder && (
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                <div>
                  <p className="font-medium text-foreground">{latestOrder.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(latestOrder.createdAt)} · {formatCurrency(latestOrder.totalCents)}
                  </p>
                </div>
                <OrderStatusBadge status={latestOrder.status} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Favoritos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-2xl font-heading text-foreground">{wishlist.length}</p>
            <p className="text-sm text-muted-foreground">
              {wishlist.length === 0
                ? "Nenhum produto salvo ainda."
                : "produto(s) salvos na sua lista de desejos."}
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 font-heading text-lg text-foreground">Acesso rápido</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center justify-between rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-colors hover:bg-muted/50"
            >
              <span className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                <link.icon className="size-4 text-gold-600 dark:text-gold-400" />
                {link.label}
              </span>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
