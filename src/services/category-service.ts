import { prisma } from "@/lib/prisma"

export function listCategories() {
  return prisma.category.findMany({ orderBy: { position: "asc" } })
}

export function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } })
}

export function createCategory(data: {
  name: string
  slug: string
  description?: string
  imageUrl?: string
  position?: number
}) {
  return prisma.category.create({ data })
}

export function updateCategory(
  id: string,
  data: Partial<{
    name: string
    slug: string
    description: string
    imageUrl: string
    position: number
  }>
) {
  return prisma.category.update({ where: { id }, data })
}

export function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } })
}

export function getCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } })
}
