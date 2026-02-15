import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { ids, action } = await req.json();

    if (action === "APPROVE") {
      await prisma.transaction.updateMany({
        where: { id_transaction: { in: ids } },
        data: { is_approved: true },
      });
      return NextResponse.json({ message: "Data Berhasil Disetujui!" });
    }

    if (action === "REJECT") {
      // Jika direject, kita hapus datanya agar staff bisa upload ulang yang benar
      await prisma.transaction.deleteMany({
        where: { id_transaction: { in: ids } },
      });
      return NextResponse.json({ message: "Data Berhasil Ditolak & Dihapus!" });
    }

    return NextResponse.json(
      { message: "Aksi tidak dikenal" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
