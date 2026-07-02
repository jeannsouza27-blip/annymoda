import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"
import { siteConfig } from "@/lib/constants"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/novidades",
    "/promocoes",
    "/sobre",
    "/contato",
    "/politica-de-privacidade",
    "/trocas-e-devolucoes",
    "/termos-de-uso",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.6,
  }))

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }).catch(() => []),
    prisma.product
      .findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      })
      .catch(() => []),
  ])

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteConfig.url}/categoria/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteConfig.url}/produto/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
