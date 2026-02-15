import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 1. Ambil data history untuk tahu kapan data ini diupload
    const history = await prisma.upload_history.findUnique({
      where: { id_upload: parseInt(id) },
    });

    if (!history)
      return NextResponse.json(
        { error: "History tidak ditemukan" },
        { status: 404 }
      );

    // 2. Update status history menjadi DISETUJUI
    await prisma.upload_history.update({
      where: { id_upload: parseInt(id) },
      data: { status: "DISETUJUI (APPROVED)" },
    });

    // 3. Update tabel transaction
    // Kita aktifkan semua data yang is_approved-nya masih false
    await prisma.transaction.updateMany({
      where: { is_approved: false },
      data: { is_approved: true },
    });

    return NextResponse.json({
      message: "Data Dashboard Berhasil Diaktifkan!",
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal Approve" }, { status: 500 });
  }
}
