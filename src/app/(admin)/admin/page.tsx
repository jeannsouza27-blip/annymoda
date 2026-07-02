import Link from "next/link"
import { Package, ShoppingCart, Users, Wallet, AlertTriangle } from "lucide-react"
import {
  getDashboardStats,
  getOrdersByStatus,
  getRevenueOverTime,
  listLowStockProducts,
} from "@/services/dashboard-service"
import { StatsCard } from "@/components/admin/stats-card"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { OrdersStatusChart } from "@/components/admin/orders-status-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/format"

export default async function AdminDashboardPage() {
  const [stats, ordersByStatus, revenueOverTime, lowStockProducts] = await Promise.all([
    getDashboardStats(),
    getOrdersByStatus(),
    getRevenueOverTime(30),
    listLowStockProducts(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral da loja Anny Moda Executiva.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatsCard label="Produtos ativos" value={stats.productCount.toString()} icon={Package} />
        <StatsCard label="Pedidos" value={stats.orderCount.toString()} icon={ShoppingCart} />
        <StatsCard label="Clientes" value={stats.customerCount.toString()} icon={Users} />
        <StatsCard label="Receita" value={formatCurrency(stats.revenueCents)} icon={Wallet} />
        <StatsCard
          label="Estoque baixo"
          value={stats.lowStockCount.toString()}
          icon={AlertTriangle}
          variant={stats.lowStockCount > 0 ? "warning" : "default"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <RevenueChart data={revenueOverTime} />
        <OrdersStatusChart data={ordersByStatus} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Produtos com estoque baixo</CardTitle>
        </CardHeader>
        <CardContent>
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum produto com estoque baixo.</p>
          ) : (
            <ul className="divide-y divide-border">
              {lowStockProducts.map((product) => (
                <li key={product.id} className="flex items-center justify-between gap-3 py-2.5">
                  <Link
                    href={`/admin/produtos/${product.id}`}
                    className="text-sm font-medium text-foreground hover:text-gold-600"
                  >
                    {product.name}
                  </Link>
                  <Badge variant={product.stock === 0 ? "destructive" : "secondary"}>
                    {product.stock} em estoque
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
