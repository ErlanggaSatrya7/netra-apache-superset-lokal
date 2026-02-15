import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Menghitung total dari database sesuai kolom dataset kamu
    const stats = await prisma.transaction.aggregate({
      where: { is_approved: true },
      _sum: {
        total_sales: true,
        unit_sold: true,
        operating_profit: true,
      },
    });

    // Menghitung jumlah produk unik (Active SKU)
    const products = await prisma.transaction.groupBy({
      by: ["product"],
    });

    return NextResponse.json({
      totalSales: stats._sum.total_sales || 0,
      profit: stats._sum.operating_profit || 0,
      units: stats._sum.unit_sold || 0,
      productCount: products.length,
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat data" }, { status: 500 });
  }
}
