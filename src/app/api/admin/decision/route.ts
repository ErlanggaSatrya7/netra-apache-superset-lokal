import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { batchId, decision, adminMessage } = await req.json();

    if (!batchId || !decision) {
      return NextResponse.json({ error: "MISSING_PAYLOAD" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Upload History Status
      const history = await tx.upload_history.update({
        where: { id_upload: parseInt(batchId) },
        data: {
          status: decision,
          admin_response: adminMessage,
        },
      });

      // 2. ATOMIC UPDATE: Sync Transactions
      // Inisiatif: Pastikan is_approved di sync agar dashboard terupdate real-time
      if (decision === "APPROVED") {
        await tx.transaction.updateMany({
          where: { id_upload: parseInt(batchId) },
          data: { is_approved: true },
        });
      } else {
        // Jika ditolak, kita biarkan false (tidak masuk dashboard)
        await tx.transaction.updateMany({
          where: { id_upload: parseInt(batchId) },
          data: { is_approved: false },
        });
      }

      return history;
    });

    return NextResponse.json({ success: true, batch: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
