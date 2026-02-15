// src/app/api/admin/pending-files/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.upload_history.findMany({
      where: {
        // Harus persis seperti di gambar database kamu
        status: "MENUNGGU ADMIN (PENDING)",
      },
      orderBy: { upload_date: "desc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Database Error" }, { status: 500 });
  }
}
