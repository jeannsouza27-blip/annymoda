import { LoginForm } from "@/components/auth/login-form"

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const { callbackUrl } = await searchParams

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-3xl text-foreground">Entrar</h1>
        <p className="text-sm text-muted-foreground">
          Acesse sua conta para acompanhar pedidos, favoritos e endereços.
        </p>
      </div>
      <LoginForm callbackUrl={callbackUrl} />
    </div>
  )
}
