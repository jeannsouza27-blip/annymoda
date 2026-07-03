"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth-guards"
import { slugify } from "@/lib/slugify"
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/services/product-service"

const imageSchema = z.object({
  url: z.string().min(1),
  altText: z.string().optional(),
  isPrimary: z.boolean().optional(),
  position: z.number().optional(),
})

const variantSchema = z.object({
  color: z.string().trim().optional(),
  size: z.string().trim().optional(),
  stock: z.number().int().min(0),
})

const productSchema = z.object({
  name: z.string().min(2, "Informe o nome do produto."),
  description: z.string().min(10, "Descreva o produto."),
  priceCents: z.number().int().positive("Informe um preço válido."),
  compareAtPriceCents: z.number().int().positive().nullable().optional(),
  sku: z.string().optional(),
  stock: z.number().int().min(0),
  categoryId: z.string().min(1, "Selecione uma categoria."),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  installmentsMax: z.number().int().min(1).max(12).optional(),
  images: z.array(imageSchema).min(1, "Adicione ao menos uma imagem."),
  variants: z.array(variantSchema).optional(),
})

const updateProductSchema = productSchema.partial()

export async function createProductAction(input: unknown) {
  await requireAdmin()
  const parsed = productSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  const slug = `${slugify(parsed.data.name)}-${Date.now().toString(36)}`

  const product = await createProduct({ ...parsed.data, slug })
  revalidatePath("/admin/produtos")
  revalidatePath("/")
  return { success: true as const, product }
}

export async function updateProductAction(id: string, input: unknown) {
  await requireAdmin()
  const parsed = updateProductSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  const product = await updateProduct(id, parsed.data)
  revalidatePath("/admin/produtos")
  revalidatePath(`/produto/${product.slug}`)
  revalidatePath("/")
  return { success: true as const, product }
}

export async function deleteProductAction(id: string) {
  await requireAdmin()
  await deleteProduct(id)
  revalidatePath("/admin/produtos")
  revalidatePath("/")
  return { success: true as const }
}
