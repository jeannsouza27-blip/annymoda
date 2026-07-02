import "server-only"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import crypto from "node:crypto"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products")
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"]
const MAX_SIZE_BYTES = 5 * 1024 * 1024

export async function saveUploadedFile(file: File): Promise<{ url: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Formato de imagem não suportado. Use JPG, PNG, WEBP ou AVIF.")
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("Imagem muito grande. Tamanho máximo: 5MB.")
  }

  await mkdir(UPLOAD_DIR, { recursive: true })

  const extension = file.type.split("/")[1]
  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .toLowerCase()
    .slice(0, 40)
  const fileName = `${crypto.randomUUID()}-${safeName}.${extension}`
  const filePath = path.join(UPLOAD_DIR, fileName)

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(filePath, buffer)

  return { url: `/uploads/products/${fileName}` }
}
