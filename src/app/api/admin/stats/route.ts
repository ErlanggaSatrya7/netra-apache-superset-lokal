import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [revenue, transactions, pending] = await Promise.all([
      prisma.transaction.aggregate({
        where: { is_approved: true },
        _sum: { total_sales: true },
      }),
      prisma.transaction.count({ where: { is_approved: true } }),
      prisma.upload_history.count({ where: { status: "PENDING" } }),
    ]);

    return NextResponse.json({
      revenue: Number(revenue._sum.total_sales) || 0,
      transactions: transactions || 0,
      pending: pending || 0,
    });
  } catch (error) {
    return NextResponse.json({ revenue: 0, transactions: 0, pending: 0 });
  }
}
