import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.users.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Cek apakah user ada
    if (!user) {
      return NextResponse.json(
        { message: "Email atau Password salah!" },
        { status: 401 }
      );
    }

    // BANDINGKAN TEKS LANGSUNG (Tanpa Bcrypt)
    const isMatch = password === user.password;

    if (!isMatch) {
      return NextResponse.json(
        { message: "Email atau Password salah!" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Sukses",
      user: { id: user.id, email: user.email },
    });
  } catch (error: any) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
