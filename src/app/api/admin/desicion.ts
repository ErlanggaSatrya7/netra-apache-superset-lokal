import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { batchId, decision, adminReason } = await req.json();

    // Start Transaction: Approve All or Reject All
    const result = await prisma.$transaction(async (tx) => {
      if (decision === "APPROVE") {
        // 1. Commit Transactions
        await tx.transaction.updateMany({
          where: { id_upload: batchId },
          data: { is_approved: true },
        });

        // 2. Update Header
        return await tx.upload_history.update({
          where: { id_upload: batchId },
          data: {
            status: "APPROVED",
            note: adminReason || "Batch Verified & Committed.",
          },
        });
      }

      if (decision === "REJECT") {
        // Jika Reject, kita biarkan di database (history) tapi tidak dipublish
        return await tx.upload_history.update({
          where: { id_upload: batchId },
          data: {
            status: "REJECTED",
            note: adminReason || "Protocol Violation Detected.",
          },
        });
      }
    });

    return NextResponse.json({ success: true, payload: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
