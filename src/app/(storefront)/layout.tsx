import type { ReactNode } from "react"
import { Header } from "@/components/storefront/header"
import { PremiumFooter } from "@/components/storefront/premium-footer"
import { CartSheet } from "@/components/storefront/cart-sheet"
import { WhatsAppFloatButton } from "@/components/storefront/whatsapp-float-button"

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <PremiumFooter />
      <CartSheet />
      <WhatsAppFloatButton />
    </>
  )
}
