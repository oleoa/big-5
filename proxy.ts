import { NextRequest, NextResponse } from "next/server";
import { getSlugByHost } from "@/lib/db/mentoras";

const ROOT_DOMAIN = "bigfive.strutura.ai";
const PLATFORM_HOSTS = new Set([ROOT_DOMAIN, "localhost:3000", "localhost"]);

export async function proxy(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const hostname = host.split(":")[0];
  const pathname = req.nextUrl.pathname;

  // Assets e API — passar directo
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Proteger rotas /admin (excepto login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = req.cookies.get("admin_session");
    if (session?.value !== process.env.ADMIN_SESSION_SECRET) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Rotas de plataforma — nunca reescrever para domínio custom
  if (pathname.startsWith("/admin") || pathname.startsWith("/painel")) {
    return NextResponse.next();
  }

  if (PLATFORM_HOSTS.has(hostname) || hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    return NextResponse.next();
  }

  // Domínio custom — resolver slug e reescrever para /[slug]/...
  const slug = await getSlugByHost(hostname);
  if (!slug) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = `/${slug}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.rewrite(url);
  response.headers.set("x-custom-domain", "1");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
