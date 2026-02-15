import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Ambil performa tiap retailer hanya dari data yang sudah disetujui
    const retailers = await prisma.retailer.findMany({
      include: {
        transaction: {
          where: { is_approved: true }, // FILTER KRUSIAL!
          select: {
            total_sales: true,
          },
        },
      },
    });

    // Mapping untuk kebutuhan chart/tabel
    const result = retailers
      .map((r) => ({
        name: r.retailer_name,
        totalSales: r.transaction.reduce(
          (acc, curr) => acc + Number(curr.total_sales || 0),
          0
        ),
        count: r.transaction.length,
      }))
      .filter((r) => r.count > 0); // Hanya tampilkan yang punya data approved

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json([], { status: 500 });
  }
}
