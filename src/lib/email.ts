import "server-only"
import { Resend } from "resend"

type SendEmailInput = {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM ?? "Anny Moda Executiva <naoresponda@annymodaexecutiva.com.br>"

  if (!apiKey) {
    console.log("--- [dev] E-mail não enviado (RESEND_API_KEY ausente) ---")
    console.log("Para:", to)
    console.log("Assunto:", subject)
    console.log(html)
    console.log("-----------------------------------------------------------")
    return { simulated: true }
  }

  const resend = new Resend(apiKey)
  await resend.emails.send({ from, to, subject, html })
  return { simulated: false }
}

export function passwordResetEmailHtml(resetUrl: string) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color:#171412;">Redefinir senha</h2>
      <p>Recebemos uma solicitação para redefinir a senha da sua conta na Anny Moda Executiva.</p>
      <p><a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#B8935A;color:#171412;text-decoration:none;border-radius:4px;">Redefinir minha senha</a></p>
      <p>Se você não solicitou isso, pode ignorar este e-mail com segurança. O link expira em 1 hora.</p>
    </div>
  `
}
