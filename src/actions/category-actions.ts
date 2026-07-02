"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth-guards"
import { slugify } from "@/lib/slugify"
import { createCategory, deleteCategory, updateCategory } from "@/services/category-service"

const categorySchema = z.object({
  name: z.string().min(2, "Informe o nome da categoria."),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  position: z.number().int().optional(),
})

export async function createCategoryAction(input: unknown) {
  await requireAdmin()
  const parsed = categorySchema.safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  const category = await createCategory({ ...parsed.data, slug: slugify(parsed.data.name) })
  revalidatePath("/admin/categorias")
  revalidatePath("/")
  return { success: true as const, category }
}

export async function updateCategoryAction(id: string, input: unknown) {
  await requireAdmin()
  const parsed = categorySchema.partial().safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  const data = parsed.data.name
    ? { ...parsed.data, slug: slugify(parsed.data.name) }
    : parsed.data

  const category = await updateCategory(id, data)
  revalidatePath("/admin/categorias")
  revalidatePath("/")
  return { success: true as const, category }
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin()
  await deleteCategory(id)
  revalidatePath("/admin/categorias")
  revalidatePath("/")
  return { success: true as const }
}
