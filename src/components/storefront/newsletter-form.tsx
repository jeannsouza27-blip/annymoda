"use client"

import * as React from "react"
import { useTransition } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { subscribeNewsletter } from "@/actions/newsletter-actions"

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = React.useState("")
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    startTransition(async () => {
      const result = await subscribeNewsletter(email)
      if (result.success) {
        toast.success("Inscrição confirmada! Em breve você recebe nossas novidades.")
        setEmail("")
      } else {
        toast.error(result.error ?? "Não foi possível concluir a inscrição.")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          required
          placeholder="Seu melhor e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-white/20 bg-transparent text-current placeholder:text-current/50 focus-visible:ring-gold-500"
        />
        <Button
          type="submit"
          disabled={isPending}
          className="shrink-0 bg-gold-500 text-gold-foreground hover:bg-gold-400"
        >
          {isPending ? "Enviando..." : "Inscrever-se"}
        </Button>
      </div>
    </form>
  )
}
