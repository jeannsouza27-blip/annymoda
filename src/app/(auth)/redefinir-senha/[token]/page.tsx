import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export default async function RedefinirSenhaPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-3xl text-foreground">Redefinir senha</h1>
        <p className="text-sm text-muted-foreground">Escolha uma nova senha para sua conta.</p>
      </div>
      <ResetPasswordForm token={token} />
    </div>
  )
}
