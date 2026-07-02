import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { saveUploadedFile } from "@/lib/upload"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 })
  }

  try {
    const result = await saveUploadedFile(file)
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao enviar imagem."
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
