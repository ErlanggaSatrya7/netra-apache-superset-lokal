import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findFirst({
      where: { email, password }, // Sesuai request: tanpa hash untuk demo
    });

    if (!user) {
      return NextResponse.json(
        { message: "Kredensial salah" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Login Berhasil",
      user: {
        email: user.email,
        role: user.role, // ADMIN atau STAFF
      },
    });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
