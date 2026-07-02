import type { Metadata } from "next"
import { CheckoutForm } from "@/components/storefront/checkout-form"

export const metadata: Metadata = {
  title: "Finalizar compra",
}

export default function CheckoutPage() {
  return <CheckoutForm />
}
