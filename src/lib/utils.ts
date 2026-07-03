import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Estoque total de um produto: soma das variações (cor/tamanho) quando existirem, senão o campo `stock` simples. */
export function totalStock(product: { stock: number; variants: { stock: number }[] }) {
  return product.variants.length > 0
    ? product.variants.reduce((sum, v) => sum + v.stock, 0)
    : product.stock
}
