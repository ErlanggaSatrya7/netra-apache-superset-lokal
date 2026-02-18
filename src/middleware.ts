import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("user_role")?.value;

  // 1. BYPASS LOGIC: Jangan ganggu file statis dan API Auth
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") || // PENTING: Biar API Login gak kena block
    pathname.includes(".") // Bypass image, favicon, dll
  ) {
    return NextResponse.next();
  }

  // 2. REDIRECT LOGIC: Kalau udah login, jangan biarin ke halaman login lagi
  if (pathname === "/login" || pathname === "/") {
    if (role === "ADMIN")
      return NextResponse.redirect(new URL("/admin", request.url));
    if (role === "STAFF")
      return NextResponse.redirect(new URL("/staff", request.url));
    return NextResponse.next();
  }

  // 3. PROTECTION LOGIC: Cek akses berdasarkan folder
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/staff") && role !== "STAFF" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
