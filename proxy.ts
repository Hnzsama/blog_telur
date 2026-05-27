import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";

  // ── 1. www → non-www canonical redirect (301) ───────────────────────────
  // Skip localhost and tunnel dev environments to avoid loops
  const isDevEnv =
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("trycloudflare.com") ||
    host.includes(".ngrok");

  if (!isDevEnv && host.startsWith("www.")) {
    url.host = host.replace(/^www\./, "");
    return NextResponse.redirect(url, { status: 301 });
  }

  // ── 2. Auth guards ───────────────────────────────────────────────────────
  const sessionId = request.cookies.get("session_id")?.value;
  const { pathname } = request.nextUrl;

  // Protect dashboard routes — redirect to login if no session
  if (pathname.startsWith("/dashboard")) {
    if (!sessionId) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect already-logged-in users away from login/register pages
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (sessionId) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
