"use client"

import { useTransition } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { loginAction } from "@/actions/auth-actions"
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

const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Informe sua senha."),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [isPending, startTransition] = useTransition()
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  function onSubmit(values: LoginValues) {
    startTransition(async () => {
      const result = await loginAction(values, callbackUrl)
      if (result && !result.success) {
        toast.error(result.error)
      }
    })
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Senha</FormLabel>
                <Link
                  href="/esqueci-minha-senha"
                  className="text-xs text-muted-foreground underline-offset-4 hover:text-gold-600 hover:underline"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
              <FormControl>
                <Input type="password" autoComplete="current-password" placeholder="••••••••" {...field} />
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
          {isPending ? "Entrando..." : "Entrar"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="font-medium text-foreground underline-offset-4 hover:text-gold-600 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </form>
    </Form>
  )
}
