import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export default function EsqueciMinhaSenhaPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-3xl text-foreground">Esqueceu sua senha?</h1>
        <p className="text-sm text-muted-foreground">
          Informe seu e-mail e enviaremos um link para você criar uma nova senha.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  )
}
