import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await req.json();
    const id = parseInt(params.id);

    if (action === "acc") {
      // Update status jadi TRUE agar muncul di Dashboard Direktur
      await prisma.transaction.update({
        where: { id_transaction: id },
        data: { is_approved: true },
      });
      return NextResponse.json({ message: "Data Approved" });
    } else {
      // Jika ditolak, kita hapus datanya dari antrean
      await prisma.transaction.delete({
        where: { id_transaction: id },
      });
      return NextResponse.json({ message: "Data Rejected & Deleted" });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
