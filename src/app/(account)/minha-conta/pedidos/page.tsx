import Link from "next/link"
import { PackageSearch } from "lucide-react"
import { requireUser } from "@/lib/auth-guards"
import { listOrdersForUser } from "@/services/order-service"
import { OrderCard } from "@/components/account/order-card"
import { Button } from "@/components/ui/button"

export default async function PedidosPage() {
  const user = await requireUser()
  const orders = await listOrdersForUser(user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-foreground">Meus pedidos</h1>
        <p className="mt-1 text-sm text-muted-foreground">Acompanhe o histórico e o status de todos os seus pedidos.</p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl bg-card py-16 text-center ring-1 ring-foreground/10">
          <PackageSearch className="size-10 text-muted-foreground" />
          <div className="space-y-1">
            <p className="font-heading text-lg text-foreground">Você ainda não fez nenhum pedido</p>
            <p className="text-sm text-muted-foreground">Explore nossa coleção e encontre sua próxima peça favorita.</p>
          </div>
          <Button asChild className="bg-gold-500 text-gold-foreground hover:bg-gold-400">
            <Link href="/">Ir para a loja</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
