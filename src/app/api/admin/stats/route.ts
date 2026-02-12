import { NextResponse } from "next/server";
// import { PrismaClient } from "@/generated/prisma";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Menghitung total transaksi, profit, dan sales dari database adidas
    const totalTransactions = await prisma.transaction.count();
    const aggregateData = await prisma.transaction.aggregate({
      _sum: {
        operating_profit: true,
        total_sales: true,
        unit_sold: true,
      },
    });

    return NextResponse.json({
      totalTransactions,
      totalProfit: aggregateData._sum.operating_profit || 0,
      totalSales: aggregateData._sum.total_sales || 0,
      totalUnits: aggregateData._sum.unit_sold || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}
