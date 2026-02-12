// versi 2

import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma"; // Gunakan folder sesuai log generate kamu

const prisma = new PrismaClient();

// WAJIB menggunakan huruf kapital semua: POST
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Cari user berdasarkan email
    const user = await prisma.users.findUnique({
      where: { email: email },
    });

    // 2. Validasi Akun & Password
    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: "Email atau Password salah!" },
        { status: 401 }
      );
    }

    // 3. Logika Role (Admin/Staff)
    const role = email.toLowerCase().includes("admin") ? "admin" : "staff";

    return NextResponse.json({
      message: "Login Berhasil",
      role: role,
      email: user.email,
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Gagal terhubung ke database: " + error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// versi 1
// // import { PrismaClient } from "@/generated/prisma";
// import { PrismaClient } from "@prisma/client";
// // ^ pastikan ini mengarah ke folder tempat 'npx prisma generate' kamu bersarang
// const prisma = new PrismaClient();
