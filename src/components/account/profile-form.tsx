"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { updateProfileAction } from "@/actions/profile-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const profileSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo."),
  phone: z.string().optional(),
})

type ProfileValues = z.infer<typeof profileSchema>

export function ProfileForm({ name, email, phone }: { name: string; email: string; phone: string }) {
  const [isPending, startTransition] = useTransition()
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name, phone },
  })

  function onSubmit(values: ProfileValues) {
    startTransition(async () => {
      const result = await updateProfileAction(values)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success("Seus dados foram atualizados.")
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-2">
          <Label htmlFor="account-email">E-mail</Label>
          <Input id="account-email" type="email" value={email} disabled readOnly />
          <p className="text-sm text-muted-foreground">
            O e-mail é o seu identificador de login e não pode ser alterado.
          </p>
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(11) 99999-9999" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="bg-gold-500 text-gold-foreground hover:bg-gold-400"
        >
          {isPending ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </Form>
  )
}
