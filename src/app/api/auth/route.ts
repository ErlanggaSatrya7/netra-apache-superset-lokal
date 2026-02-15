import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // HANDSHAKE: Perhatikan panggilannya 'users' (sesuai schema.prisma kamu)
    const user = await prisma.users.findUnique({
      where: { email: email.trim() },
    });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "CREDENTIAL_MISMATCH" },
        { status: 401 }
      );
    }

    const rolePath = user.role?.toUpperCase() === "ADMIN" ? "/admin" : "/staff";

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, role: user.role },
      redirect: rolePath,
    });

    response.cookies.set("vortex_session", "active", { path: "/" });
    response.cookies.set("user_role", user.role?.toLowerCase() || "staff", {
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: "DATABASE_OFFLINE" }, { status: 500 });
  }
}
