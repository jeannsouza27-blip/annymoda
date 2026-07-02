import type { Metadata } from "next"
import { CartPageContent } from "@/components/storefront/cart-page-content"

export const metadata: Metadata = {
  title: "Sua sacola",
}

export default function CarrinhoPage() {
  return <CartPageContent />
}
