import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id_upload = searchParams.get("id_upload");

  try {
    if (id_upload) {
      const batch = await prisma.upload_history.findUnique({
        where: { id_upload: parseInt(id_upload) },
        include: {
          transactions: {
            include: {
              retailer: true,
              product: true,
              city: { include: { state: true } },
              method: true,
            },
          },
        },
      });
      return NextResponse.json(batch);
    }

    const [
      allHistory,
      rawTransactions,
      productStats,
      regionalStats,
      methodStats,
    ] = await prisma.$transaction([
      prisma.upload_history.findMany({ orderBy: { upload_date: "desc" } }),
      prisma.transaction.findMany({
        where: { is_approved: true },
        include: {
          retailer: true,
          product: true,
          city: { include: { state: true } },
          method: true,
        },
      }),
      // INISIATIF: Top 5 Products by Sales
      prisma.transaction.groupBy({
        by: ["id_product"],
        _sum: { total_sales: true, operating_profit: true },
        orderBy: { _sum: { total_sales: "desc" } },
        take: 5,
      }),
      prisma.state.findMany({
        include: {
          city: {
            include: {
              transaction: {
                where: { is_approved: true },
                select: { total_sales: true },
              },
            },
          },
        },
      }),
      // INISIATIF: Sales Method Share (Online vs Offline)
      prisma.method.findMany({
        include: {
          transaction: {
            where: { is_approved: true },
            select: { total_sales: true },
          },
        },
      }),
    ]);

    // Format Data untuk ECharts Donut (Method Share)
    const methodShare = methodStats.map((m) => ({
      name: m.method,
      value: m.transaction.reduce(
        (acc, curr) => acc + Number(curr.total_sales),
        0
      ),
    }));

    return NextResponse.json({
      allHistory,
      rawTransactions,
      stats: {
        totalSales: rawTransactions.reduce(
          (acc, curr) => acc + Number(curr.total_sales || 0),
          0
        ),
        totalProfit: rawTransactions.reduce(
          (acc, curr) => acc + Number(curr.operating_profit || 0),
          0
        ),
        records: rawTransactions.length,
      },
      hierarchy: {
        name: "ADIDAS_VORTEX",
        children: regionalStats.map((s) => ({
          name: s.region,
          children: [
            {
              name: s.state,
              children: s.city.map((c) => ({
                name: c.city,
                value: c.transaction.reduce(
                  (acc, curr) => acc + Number(curr.total_sales),
                  0
                ),
              })),
            },
          ],
        })),
      },
      productPerformance: productStats,
      methodShare, // Data baru untuk donut chart
    });
  } catch (error) {
    return NextResponse.json({ error: "NEURAL_SYNC_FAILED" }, { status: 500 });
  }
}
