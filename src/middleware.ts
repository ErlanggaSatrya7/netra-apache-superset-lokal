import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ambil token simulasi dari cookie
  const session = request.cookies.get("vortex_session");

  // 1. Jika buka root "/", arahkan ke login
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Proteksi area dashboard jika tidak ada session
  if (
    (pathname.startsWith("/admin") || pathname.startsWith("/staff")) &&
    !session
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Jika sudah login, dilarang balik ke login
  if (pathname.startsWith("/login") && session) {
    const role = request.cookies.get("user_role")?.value;
    return NextResponse.redirect(
      new URL(role === "admin" ? "/admin" : "/staff", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/staff/:path*", "/login"],
};
