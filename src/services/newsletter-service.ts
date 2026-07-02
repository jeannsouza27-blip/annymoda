import { prisma } from "@/lib/prisma"

export async function subscribeEmail(email: string, source?: string) {
  return prisma.newsletterSubscriber.upsert({
    where: { email },
    update: {},
    create: { email, source },
  })
}

export function listSubscribers() {
  return prisma.newsletterSubscriber.findMany({ orderBy: { subscribedAt: "desc" } })
}
