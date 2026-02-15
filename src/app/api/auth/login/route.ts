import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Cari user berdasarkan email
    const user = await prisma.users.findUnique({
      where: { email },
    });

    // 2. Cek password (Bandingkan teks langsung)
    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 }
      );
    }

    // 3. Jika benar, kirim data user & role
    return NextResponse.json({
      message: "Login Berhasil",
      user: {
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
