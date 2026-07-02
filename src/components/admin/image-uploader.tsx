"use client"

import * as React from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Loader2, Star, Trash2, UploadCloud, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type UploadedImage = {
  url: string
  altText?: string
  isPrimary?: boolean
  position?: number
}

interface ImageUploaderProps {
  value: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  multiple?: boolean
  label?: string
}

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  const res = await fetch("/api/upload", { method: "POST", body: formData })
  const data = (await res.json()) as { url?: string; error?: string }
  if (!res.ok || !data.url) {
    throw new Error(data.error ?? "Falha ao enviar imagem.")
  }
  return data.url
}

function normalizePositions(images: UploadedImage[]): UploadedImage[] {
  return images.map((img, index) => ({ ...img, position: index }))
}

export function ImageUploader({ value, onChange, multiple = true, label }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFiles = React.useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return
      const files = multiple ? Array.from(fileList) : [fileList[0]]

      setIsUploading(true)
      try {
        const uploaded: UploadedImage[] = []
        for (const file of files) {
          const url = await uploadFile(file)
          uploaded.push({ url, altText: "", isPrimary: false })
        }

        const base = multiple ? value : []
        const merged = normalizePositions([...base, ...uploaded]).map((img, index) => ({
          ...img,
          isPrimary: index === 0,
        }))
        onChange(merged)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Falha ao enviar imagem.")
      } finally {
        setIsUploading(false)
      }
    },
    [multiple, onChange, value]
  )

  function removeAt(index: number) {
    const next = value.filter((_, i) => i !== index)
    const normalized = normalizePositions(next)
    if (normalized.length > 0 && !normalized.some((img) => img.isPrimary)) {
      normalized[0].isPrimary = true
    }
    onChange(normalized)
  }

  function setPrimary(index: number) {
    onChange(value.map((img, i) => ({ ...img, isPrimary: i === index })))
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= value.length) return
    const next = [...value]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(normalizePositions(next))
  }

  function setAltText(index: number, altText: string) {
    onChange(value.map((img, i) => (i === index ? { ...img, altText } : img)))
  }

  return (
    <div className="space-y-3">
      {label && <p className="text-sm font-medium">{label}</p>}

      {(multiple || value.length === 0) && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            void handleFiles(e.dataTransfer.files)
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input px-4 py-8 text-center transition-colors",
            isDragging && "border-gold-500 bg-gold-50/50 dark:bg-gold-900/10"
          )}
        >
          {isUploading ? (
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          ) : (
            <UploadCloud className="size-6 text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground">
            {isUploading
              ? "Enviando imagem..."
              : "Arraste uma imagem ou clique para selecionar"}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            onChange={(e) => {
              void handleFiles(e.target.files)
              e.target.value = ""
            }}
          />
        </div>
      )}

      {value.length > 0 && (
        <div className={cn("grid gap-3", multiple ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-1 sm:max-w-xs")}>
          {value.map((img, index) => (
            <div
              key={`${img.url}-${index}`}
              className="group relative flex flex-col gap-2 rounded-lg border border-border p-2"
            >
              <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                <Image src={img.url} alt={img.altText || "Imagem"} fill sizes="200px" className="object-cover" />
                {multiple && img.isPrimary && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-medium text-gold-foreground">
                    Principal
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-1">
                {multiple ? (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      title="Mover para a esquerda"
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                    >
                      <ArrowLeft />
                    </Button>
                    <Button
                      type="button"
                      variant={img.isPrimary ? "secondary" : "ghost"}
                      size="icon-xs"
                      title="Definir como principal"
                      onClick={() => setPrimary(index)}
                    >
                      <Star className={cn(img.isPrimary && "fill-gold-500 text-gold-500")} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      title="Mover para a direita"
                      disabled={index === value.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      <ArrowRight />
                    </Button>
                  </>
                ) : (
                  <span />
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  title="Remover imagem"
                  onClick={() => removeAt(index)}
                >
                  <Trash2 className="text-destructive" />
                </Button>
              </div>

              <input
                value={img.altText ?? ""}
                onChange={(e) => setAltText(index, e.target.value)}
                placeholder="Texto alternativo"
                className="h-7 rounded-md border border-input bg-transparent px-2 text-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
