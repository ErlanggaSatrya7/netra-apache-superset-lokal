import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Hanya ambil data yang sudah disetujui
    const summary = await prisma.transaction.aggregate({
      where: { is_approved: true },
      _sum: {
        total_sales: true,
        operating_profit: true,
        unit_sold: true,
      },
      _count: {
        id_transaction: true,
      },
    });

    return NextResponse.json({
      totalSales: summary._sum.total_sales || 0,
      totalProfit: summary._sum.operating_profit || 0,
      unitsSold: summary._sum.unit_sold || 0,
      totalTransactions: summary._count.id_transaction || 0,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
