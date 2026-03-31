import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = "bigfive.strutura.ai";
const PLATFORM_HOSTS = new Set([ROOT_DOMAIN, "localhost:3000", "localhost"]);

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const hostname = host.split(":")[0];
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    const subdomain = hostname.replace(`.${ROOT_DOMAIN}`, "");
    const url = req.nextUrl.clone();
    url.pathname = `/s/${subdomain}${pathname}`;
    return NextResponse.rewrite(url);
  }

  if (PLATFORM_HOSTS.has(hostname)) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = `/d/${hostname}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
