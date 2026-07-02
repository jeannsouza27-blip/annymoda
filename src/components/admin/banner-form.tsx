"use client"

import * as React from "react"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createBannerAction, updateBannerAction } from "@/actions/banner-actions"
import type { Banner } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  title: z.string().min(2, "Informe o título do banner."),
  subtitle: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  placement: z.enum(["HERO", "PROMO_STRIP", "CATEGORY_TOP"]),
  position: z.number().int().min(0),
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface BannerFormProps {
  banner?: Banner
}

const PLACEMENT_LABELS = {
  HERO: "Destaque principal (Hero)",
  PROMO_STRIP: "Faixa promocional",
  CATEGORY_TOP: "Topo de categoria",
}

export function BannerForm({ banner }: BannerFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [images, setImages] = React.useState<UploadedImage[]>(
    banner?.imageUrl ? [{ url: banner.imageUrl, isPrimary: true }] : []
  )
  const [imageError, setImageError] = React.useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: banner?.title ?? "",
      subtitle: banner?.subtitle ?? "",
      ctaLabel: banner?.ctaLabel ?? "",
      ctaHref: banner?.ctaHref ?? "",
      placement: banner?.placement ?? "HERO",
      position: banner?.position ?? 0,
      isActive: banner?.isActive ?? true,
    },
  })

  function onSubmit(values: FormValues) {
    if (images.length === 0) {
      setImageError("Envie uma imagem para o banner.")
      return
    }
    setImageError(null)

    const payload = {
      title: values.title,
      subtitle: values.subtitle || undefined,
      imageUrl: images[0].url,
      ctaLabel: values.ctaLabel || undefined,
      ctaHref: values.ctaHref || undefined,
      placement: values.placement,
      position: values.position,
      isActive: values.isActive,
    }

    startTransition(async () => {
      const result = banner
        ? await updateBannerAction(banner.id, payload)
        : await createBannerAction(payload)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(banner ? "Banner atualizado." : "Banner criado.")
      router.push("/admin/banners")
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: Nova coleção inverno" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtítulo (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: Peças exclusivas para o executivo moderno" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="ctaLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto do botão (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: Ver coleção" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ctaHref"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link do botão (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: /categoria/inverno" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="placement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posicionamento</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(PLACEMENT_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
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
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2.5">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!mt-0">Banner ativo</FormLabel>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2">
            <Label>Imagem do banner</Label>
            <ImageUploader value={images} onChange={setImages} multiple={false} />
            {imageError && <p className="text-sm text-destructive">{imageError}</p>}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/banners")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar banner"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
