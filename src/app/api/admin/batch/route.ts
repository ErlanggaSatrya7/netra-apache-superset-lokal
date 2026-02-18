import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "MISSING_ID" }, { status: 400 });

  try {
    // Karena Prisma schema kita pakai onDelete: Cascade,
    // hapus upload_history akan otomatis hapus semua transaksi terkait.
    await prisma.upload_history.delete({
      where: { id_upload: parseInt(id) },
    });

    return NextResponse.json({ success: true, message: "PURGE_COMPLETE" });
  } catch (error) {
    return NextResponse.json({ error: "DATABASE_ERROR" }, { status: 500 });
  }
}
