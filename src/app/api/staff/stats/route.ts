import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Menghitung data real dari database
    const total = await prisma.transaction.count();
    const pending = await prisma.transaction.count({
      where: { is_approved: false },
    });

    return NextResponse.json({
      totalTransaksi: total,
      menungguAcc: pending,
      disetujui: 0,
      ditolak: 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}
