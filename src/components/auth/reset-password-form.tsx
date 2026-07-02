"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { CheckCircle2 } from "lucide-react"
import { resetPassword } from "@/actions/auth-actions"
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

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    confirmPassword: z.string().min(1, "Confirme sua senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  })

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm({ token }: { token: string }) {
  const [isPending, startTransition] = useTransition()
  const [done, setDone] = useState(false)
  const [invalidToken, setInvalidToken] = useState(false)
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  function onSubmit(values: ResetPasswordValues) {
    startTransition(async () => {
      const result = await resetPassword({ token, password: values.password })
      if (!result.success) {
        toast.error(result.error)
        setInvalidToken(true)
        return
      }
      setDone(true)
    })
  }

  if (done) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-gold-500/15 text-gold-600 dark:text-gold-400">
          <CheckCircle2 className="size-6" />
        </div>
        <p className="text-sm text-muted-foreground">
          Sua senha foi redefinida com sucesso. Agora você já pode entrar com a nova senha.
        </p>
        <Button asChild className="w-full bg-gold-500 text-gold-foreground hover:bg-gold-400">
          <Link href="/entrar">Ir para o login</Link>
        </Button>
      </div>
    )
  }

  if (invalidToken) {
    return (
      <div className="space-y-6 text-center">
        <p className="text-sm text-muted-foreground">
          Este link é inválido ou expirou. Solicite um novo link de redefinição.
        </p>
        <Button variant="outline" asChild className="w-full">
          <Link href="/esqueci-minha-senha">Solicitar novo link</Link>
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova senha</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" placeholder="Mínimo de 6 caracteres" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar nova senha</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" placeholder="••••••••" {...field} />
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
          {isPending ? "Salvando..." : "Redefinir senha"}
        </Button>
      </form>
    </Form>
  )
}
