import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Handle Logout Action
    if (body.action === "logout") {
      const response = NextResponse.json({ success: true });
      response.cookies.delete("user_role");
      response.cookies.delete("user_email");
      return response;
    }

    const { email, password } = body;
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "CREDENTIALS_INVALID" },
        { status: 401 }
      );
    }

    // Tentukan target halaman
    const targetPath = user.role === "ADMIN" ? "/admin" : "/staff";

    const response = NextResponse.json({
      success: true,
      role: user.role,
      redirect: targetPath, // Kirim ini ke frontend
    });

    // Pasang Cookie biar Middleware ngenalin
    response.cookies.set("user_role", user.role || "STAFF", {
      path: "/",
      httpOnly: false,
    });
    response.cookies.set("user_email", user.email || "", {
      path: "/",
      httpOnly: false,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "DATABASE_CONNECTION_FAIL" },
      { status: 500 }
    );
  }
}
