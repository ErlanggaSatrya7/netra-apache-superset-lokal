import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const [global, allHistory, recent] = await prisma.$transaction([
      // Stats global hanya untuk data APPROVED
      prisma.transaction.aggregate({
        where: { is_approved: true },
        _sum: { total_sales: true, operating_profit: true, unit_sold: true },
        _count: { id_transaction: true },
      }),
      // Ambil SEMUA history upload (Pending, Approved, Rejected) untuk dashboard Staff
      prisma.upload_history.findMany({
        orderBy: { upload_date: "desc" },
        take: 20,
      }),
      // Ambil transaksi terakhir yang sedang PENDING atau baru approved
      prisma.transaction.findMany({
        take: 25,
        orderBy: { id_transaction: "desc" },
        include: { retailer: true, product: true },
      }),
    ]);

    return NextResponse.json({
      global,
      allHistory, // Dashboard staff ambil data dari sini
      recent,
    });
  } catch (e) {
    return NextResponse.json({ error: "SYNC_FAILURE" }, { status: 500 });
  }
}
