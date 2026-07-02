import { cn } from "@/lib/utils"

/**
 * lucide-react no longer ships brand/logo icons (Instagram, Facebook, etc.),
 * so we render small inline SVGs that match the stroke style used across
 * the rest of the icon set (currentColor, 2px stroke, rounded caps).
 */
export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-5", className)}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-5", className)}
      aria-hidden="true"
    >
      <path d="M15 4h-2a4 4 0 0 0-4 4v3H7v4h2v6h4v-6h3l1-4h-4V8a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}
