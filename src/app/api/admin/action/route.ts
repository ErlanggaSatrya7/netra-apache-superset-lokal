import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id_upload, action, note } = await req.json();

    if (action === "APPROVE") {
      await prisma.$transaction([
        // 1. Update status history
        prisma.upload_history.update({
          where: { id_upload },
          data: { status: "APPROVED" },
        }),
        // 2. Set semua transaksi di file ini menjadi Approved
        prisma.transaction.updateMany({
          where: { id_upload },
          data: { is_approved: true },
        }),
      ]);
      return NextResponse.json({ message: "Data Approved & Published!" });
    }

    if (action === "REJECT") {
      await prisma.upload_history.update({
        where: { id_upload },
        data: { status: "REJECTED", note: note },
      });
      return NextResponse.json({ message: "Data Rejected with note." });
    }
  } catch (error) {
    return NextResponse.json({ message: "Operation failed" }, { status: 500 });
  }
}
