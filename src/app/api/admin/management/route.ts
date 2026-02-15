import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const uploads = await prisma.upload_history.findMany({
      orderBy: { upload_date: "desc" },
    });
    return NextResponse.json(uploads);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch warehouse data" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id") || "0");

  try {
    // Berkat onDelete: Cascade di schema.prisma,
    // Menghapus upload_history akan otomatis menghapus transaksi terkait.
    await prisma.upload_history.delete({
      where: { id_upload: id },
    });

    return NextResponse.json({ message: "Dataset purged successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Purge operation failed" },
      { status: 500 }
    );
  }
}
