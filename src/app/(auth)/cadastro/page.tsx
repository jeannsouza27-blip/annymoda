import { RegisterForm } from "@/components/auth/register-form"

export default function CadastroPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-3xl text-foreground">Criar conta</h1>
        <p className="text-sm text-muted-foreground">
          Cadastre-se para acompanhar seus pedidos, salvar favoritos e agilizar suas próximas compras.
        </p>
      </div>
      <RegisterForm />
    </div>
  )
}
