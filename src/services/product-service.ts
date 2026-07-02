import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

const productWithImages = {
  include: { images: { orderBy: { position: "asc" as const } }, category: true },
} satisfies Prisma.ProductDefaultArgs

export type ProductWithImages = Prisma.ProductGetPayload<typeof productWithImages>

export function listFeaturedProducts(take = 8) {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { createdAt: "desc" },
    take,
    ...productWithImages,
  })
}

export function listNewProducts(take = 8) {
  return prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take,
    ...productWithImages,
  })
}

export function listSaleProducts(take = 24) {
  return prisma.product.findMany({
    where: { isActive: true, compareAtPriceCents: { not: null } },
    orderBy: { createdAt: "desc" },
    take,
    ...productWithImages,
  })
}

export function listProductsByCategorySlug(categorySlug: string) {
  return prisma.product.findMany({
    where: { isActive: true, category: { slug: categorySlug } },
    orderBy: { createdAt: "desc" },
    ...productWithImages,
  })
}

export function searchProducts(query: string) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    ...productWithImages,
  })
}

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    ...productWithImages,
  })
}

export function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id }, ...productWithImages })
}

export function listRelatedProducts(categoryId: string, excludeProductId: string, take = 4) {
  return prisma.product.findMany({
    where: { isActive: true, categoryId, id: { not: excludeProductId } },
    orderBy: { createdAt: "desc" },
    take,
    ...productWithImages,
  })
}

export function listAllProductsForAdmin() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    ...productWithImages,
  })
}

export type CreateProductInput = {
  name: string
  slug: string
  description: string
  priceCents: number
  compareAtPriceCents?: number | null
  sku?: string
  stock: number
  categoryId: string
  isActive?: boolean
  isFeatured?: boolean
  installmentsMax?: number
  images: { url: string; altText?: string; isPrimary?: boolean; position?: number }[]
}

export function createProduct(data: CreateProductInput) {
  const { images, ...rest } = data
  return prisma.product.create({
    data: {
      ...rest,
      images: { create: images },
    },
    ...productWithImages,
  })
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<CreateProductInput, "images">> & {
    images?: CreateProductInput["images"]
  }
) {
  const { images, ...rest } = data

  if (images) {
    await prisma.productImage.deleteMany({ where: { productId: id } })
  }

  return prisma.product.update({
    where: { id },
    data: {
      ...rest,
      ...(images ? { images: { create: images } } : {}),
    },
    ...productWithImages,
  })
}

export function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } })
}

export function countLowStockProducts(threshold = 5) {
  return prisma.product.count({ where: { stock: { lt: threshold }, isActive: true } })
}

export function decrementStock(productId: string, quantity: number) {
  return prisma.product.update({
    where: { id: productId },
    data: { stock: { decrement: quantity } },
  })
}
