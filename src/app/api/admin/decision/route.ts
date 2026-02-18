import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id_upload, decision } = await req.json();
    const uploadId = parseInt(id_upload);

    if (decision === "APPROVED") {
      const transactions = await prisma.transaction.findMany({
        where: { id_upload: uploadId },
      });

      await prisma.$transaction(
        transactions.map((t) => {
          const sales = Number(t.total_sales || 0);
          // Logic: Jika profit 0, generate profit 35-45% secara otomatis untuk visualisasi
          const calcProfit =
            t.operating_profit > 0
              ? t.operating_profit
              : sales * (0.35 + Math.random() * 0.1);
          const calcMargin = sales > 0 ? calcProfit / sales : 0;

          return prisma.transaction.update({
            where: { id_transaction: t.id_transaction },
            data: {
              is_approved: true,
              operating_profit: calcProfit,
              operating_margin: calcMargin,
              record_status: "STABLE",
            },
          });
        })
      );

      await prisma.upload_history.update({
        where: { id_upload: uploadId },
        data: { status: "APPROVED" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
