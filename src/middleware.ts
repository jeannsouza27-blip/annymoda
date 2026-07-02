import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export default auth((req) => {
  const { pathname, search } = req.nextUrl
  const user = req.auth?.user

  if (pathname.startsWith("/admin")) {
    if (!user) {
      const callbackUrl = encodeURIComponent(pathname + search)
      return NextResponse.redirect(new URL(`/entrar?callbackUrl=${callbackUrl}`, req.url))
    }
    if (user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  if (pathname.startsWith("/minha-conta") || pathname.startsWith("/favoritos") || pathname.startsWith("/enderecos")) {
    if (!user) {
      const callbackUrl = encodeURIComponent(pathname + search)
      return NextResponse.redirect(new URL(`/entrar?callbackUrl=${callbackUrl}`, req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/minha-conta/:path*", "/favoritos/:path*", "/enderecos/:path*"],
}
