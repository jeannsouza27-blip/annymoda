import { prisma } from "@/lib/prisma"

const PAID_STATUSES = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] as const

export async function getDashboardStats() {
  const [productCount, orderCount, customerCount, revenue, lowStockCount] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.aggregate({
      _sum: { totalCents: true },
      where: { status: { in: [...PAID_STATUSES] } },
    }),
    prisma.product.count({ where: { stock: { lt: 5 }, isActive: true } }),
  ])

  return {
    productCount,
    orderCount,
    customerCount,
    revenueCents: revenue._sum.totalCents ?? 0,
    lowStockCount,
  }
}

export async function getOrdersByStatus() {
  const grouped = await prisma.order.groupBy({
    by: ["status"],
    _count: { _all: true },
  })
  return grouped.map((g) => ({ status: g.status, count: g._count._all }))
}

export async function getRevenueOverTime(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: since }, status: { in: [...PAID_STATUSES] } },
    select: { createdAt: true, totalCents: true },
  })

  const byDay = new Map<string, number>()
  for (const order of orders) {
    const key = order.createdAt.toISOString().slice(0, 10)
    byDay.set(key, (byDay.get(key) ?? 0) + order.totalCents)
  }

  return Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, totalCents]) => ({ date, totalCents }))
}

export function listLowStockProducts(threshold = 5) {
  return prisma.product.findMany({
    where: { stock: { lt: threshold }, isActive: true },
    orderBy: { stock: "asc" },
    take: 10,
  })
}
