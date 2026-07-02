import { requireUser } from "@/lib/auth-guards"
import { getUserById } from "@/services/user-service"
import { ProfileForm } from "@/components/account/profile-form"

export default async function DadosPage() {
  const sessionUser = await requireUser()
  const user = await getUserById(sessionUser.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-foreground">Meus dados</h1>
        <p className="mt-1 text-sm text-muted-foreground">Atualize suas informações pessoais.</p>
      </div>

      <ProfileForm
        name={user?.name ?? sessionUser.name ?? ""}
        email={user?.email ?? sessionUser.email ?? ""}
        phone={user?.phone ?? ""}
      />
    </div>
  )
}
