import { MessageCircle } from "lucide-react"
import { whatsappHref } from "@/lib/constants"

export function WhatsAppFloatButton() {
  return (
    <a
      href={whatsappHref("Olá! Gostaria de saber mais sobre a coleção Anny Moda Executiva.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
    >
      <MessageCircle className="size-7" fill="white" strokeWidth={0} />
    </a>
  )
}
