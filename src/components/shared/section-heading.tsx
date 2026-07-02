import { cn } from "@/lib/utils"

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: "center" | "left"
  className?: string
}) {
  return (
    <div
      className={cn(
        "max-w-2xl space-y-3",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold-600 dark:text-gold-400">
          {eyebrow}
        </p>
      )}
      <h2 className="font-heading text-3xl leading-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
