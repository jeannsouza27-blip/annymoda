"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Mail } from "lucide-react"
import { requestPasswordReset } from "@/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido."),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  function onSubmit(values: ForgotPasswordValues) {
    startTransition(async () => {
      const result = await requestPasswordReset(values.email)
      setMessage(result.message)
    })
  }

  if (message) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-gold-500/15 text-gold-600 dark:text-gold-400">
          <Mail className="size-6" />
        </div>
        <p className="text-sm text-muted-foreground">{message}</p>
        <Button variant="outline" asChild className="w-full">
          <Link href="/entrar">Voltar para o login</Link>
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-gold-500 text-gold-foreground hover:bg-gold-400"
        >
          {isPending ? "Enviando..." : "Enviar link de redefinição"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Lembrou sua senha?{" "}
          <Link href="/entrar" className="font-medium text-foreground underline-offset-4 hover:text-gold-600 hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </Form>
  )
}
