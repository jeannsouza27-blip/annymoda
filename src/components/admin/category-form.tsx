"use client"

import * as React from "react"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createCategoryAction, updateCategoryAction } from "@/actions/category-actions"
import type { Category } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { ImageUploader, type UploadedImage } from "@/components/admin/image-uploader"

const formSchema = z.object({
  name: z.string().min(2, "Informe o nome da categoria."),
  description: z.string().optional(),
  position: z.number().int().min(0),
})

type FormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
  category?: Category
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [images, setImages] = React.useState<UploadedImage[]>(
    category?.imageUrl ? [{ url: category.imageUrl, isPrimary: true }] : []
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
      position: category?.position ?? 0,
    },
  })

  function onSubmit(values: FormValues) {
    const payload = {
      name: values.name,
      description: values.description || undefined,
      imageUrl: images[0]?.url,
      position: values.position,
    }

    startTransition(async () => {
      const result = category
        ? await updateCategoryAction(category.id, payload)
        : await createCategoryAction(payload)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(category ? "Categoria atualizada." : "Categoria criada.")
      router.push("/admin/categorias")
      router.refresh()
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da categoria</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: Blazers" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Descreva a categoria..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem className="max-w-40">
                  <FormLabel>Posição de exibição</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2">
            <Label>Imagem da categoria</Label>
            <ImageUploader value={images} onChange={setImages} multiple={false} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/categorias")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar categoria"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
