import { prisma } from "@/lib/prisma"

export function listShippingRules() {
  return prisma.shippingRule.findMany({ orderBy: { priceCents: "asc" } })
}

export function listActiveShippingRules() {
  return prisma.shippingRule.findMany({
    where: { isActive: true },
    orderBy: { priceCents: "asc" },
  })
}

export async function quoteShipping(state: string) {
  const byState = await prisma.shippingRule.findFirst({
    where: { isActive: true, state },
  })
  if (byState) return byState

  return prisma.shippingRule.findFirst({
    where: { isActive: true, state: null },
  })
}

export function createShippingRule(data: {
  name: string
  state?: string | null
  zipPrefix?: string | null
  priceCents: number
  estimatedDaysMin: number
  estimatedDaysMax: number
  isActive?: boolean
}) {
  return prisma.shippingRule.create({ data })
}

export function updateShippingRule(
  id: string,
  data: Partial<Parameters<typeof createShippingRule>[0]>
) {
  return prisma.shippingRule.update({ where: { id }, data })
}

export function deleteShippingRule(id: string) {
  return prisma.shippingRule.delete({ where: { id } })
}
