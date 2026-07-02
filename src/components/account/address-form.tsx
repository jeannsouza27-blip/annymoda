"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import type { Address } from "@prisma/client"
import { createAddressAction, updateAddressAction } from "@/actions/address-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const brStates = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
]

const addressSchema = z.object({
  label: z.string().optional(),
  recipientName: z.string().min(2, "Informe o nome do destinatário."),
  phone: z.string().min(8, "Informe um telefone válido."),
  zipCode: z.string().min(8, "Informe um CEP válido."),
  street: z.string().min(2, "Informe o logradouro."),
  number: z.string().min(1, "Informe o número."),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Informe o bairro."),
  city: z.string().min(2, "Informe a cidade."),
  state: z.string().length(2, "Selecione o estado."),
  isDefault: z.boolean(),
})

type AddressFormValues = z.infer<typeof addressSchema>

export function AddressForm({
  address,
  onSuccess,
}: {
  address?: Address
  onSuccess?: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: address?.label ?? "",
      recipientName: address?.recipientName ?? "",
      phone: address?.phone ?? "",
      zipCode: address?.zipCode ?? "",
      street: address?.street ?? "",
      number: address?.number ?? "",
      complement: address?.complement ?? "",
      neighborhood: address?.neighborhood ?? "",
      city: address?.city ?? "",
      state: address?.state ?? "",
      isDefault: address?.isDefault ?? false,
    },
  })

  function onSubmit(values: AddressFormValues) {
    startTransition(async () => {
      const result = address
        ? await updateAddressAction(address.id, values)
        : await createAddressAction(values)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(address ? "Endereço atualizado." : "Endereço adicionado.")
      onSuccess?.()
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identificação (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ex.: Casa, Trabalho" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recipientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do destinatário</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-4">
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logradouro</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input className="w-24" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="complement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento (opcional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-[1fr_auto] gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UF</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brStates.map((uf) => (
                      <SelectItem key={uf} value={uf}>
                        {uf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border px-3 py-2.5">
              <FormLabel className="font-normal">Definir como endereço padrão</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-gold-500 text-gold-foreground hover:bg-gold-400"
        >
          {isPending ? "Salvando..." : address ? "Salvar alterações" : "Adicionar endereço"}
        </Button>
      </form>
    </Form>
  )
}
