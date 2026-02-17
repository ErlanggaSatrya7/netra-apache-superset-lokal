import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, password } = body;
    const cookieStore = await cookies();

    // LOGOUT
    if (action === "logout") {
      cookieStore.set("vortex_session", "", {
        expires: new Date(0),
        path: "/",
      });
      cookieStore.set("user_role", "", { expires: new Date(0), path: "/" });
      return NextResponse.json({ success: true });
    }

    // LOGIN
    // Gunakan email.trim().toLowerCase() agar tidak typo karena huruf besar
    const user = await prisma.users.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "CREDENTIAL_MISMATCH" },
        { status: 401 }
      );
    }

    const rolePath = user.role?.toUpperCase() === "ADMIN" ? "/admin" : "/staff";

    // Set Cookies
    cookieStore.set("vortex_session", "active", { path: "/" });
    cookieStore.set("user_role", user.role?.toLowerCase() || "staff", {
      path: "/",
    });

    return NextResponse.json({
      success: true,
      redirect: rolePath,
    });
  } catch (error: any) {
    console.error("AUTH_ERROR:", error);
    return NextResponse.json({ error: "DATABASE_TIMEOUT" }, { status: 500 });
  }
}
