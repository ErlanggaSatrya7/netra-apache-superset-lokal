import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode"); // "raw" atau "datasets"
  const status = searchParams.get("status") || "APPROVED";

  try {
    if (mode === "raw") {
      // BANTAI: Ambil SEMUA baris transaksi dari SEMUA dataset yang sudah APPROVED
      const transactions = await prisma.transaction.findMany({
        where: {
          upload_history: {
            status: status, // Hanya yang sudah di-approve admin
          },
        },
        include: {
          upload_history: true, // WAJIB: Supaya frontend bisa filter status
          retailer: true,
          product: true,
          city: { include: { state: true } },
          method: true,
        },
        orderBy: { invoice_date: "desc" },
      });
      return NextResponse.json(transactions);
    }

    if (mode === "datasets") {
      // Ambil ringkasan dataset (Batch Upload)
      const datasets = await prisma.upload_history.findMany({
        where: { status: status },
        include: {
          _count: { select: { transactions: true } },
        },
        orderBy: { upload_date: "desc" },
      });
      return NextResponse.json(datasets);
    }

    return NextResponse.json({ error: "INVALID_MODE" }, { status: 400 });
  } catch (error) {
    console.error("WAREHOUSE_FETCH_CRITICAL_ERROR:", error);
    return NextResponse.json(
      { error: "DATABASE_CONNECTION_FAILED" },
      { status: 500 }
    );
  }
}
