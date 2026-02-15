import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Ambil data transaksi yang sudah APPROVED saja
    const data = await prisma.transaction.findMany({
      where: { is_approved: true },
      include: {
        retailer: true,
        product: true,
        city: true,
      },
    });

    // 2. Jika data kosong, kirim struktur default agar frontend tidak map undefined
    if (!data || data.length === 0) {
      return NextResponse.json({
        stats: { revenue: 0, units: 0, records: 0, avgProfit: 0, growth: 0 },
        citySales: [],
        productSales: [],
        temporalTrend: [],
      });
    }

    // 3. Complex Aggregation Logic (Manual Grouping untuk performa)
    const cityMap: Record<string, number> = {};
    const productMap: Record<string, number> = {};
    const trendMap: Record<string, number> = {};

    let totalRevenue = 0;
    let totalUnits = 0;

    data.forEach((item) => {
      const rev = Number(item.total_sales || 0);
      const unit = item.unit_sold || 0;
      totalRevenue += rev;
      totalUnits += unit;

      // Group by City
      const cityName = item.city?.city || "Unknown";
      cityMap[cityName] = (cityMap[cityName] || 0) + rev;

      // Group by Product
      const prodName = item.product?.product || "Unknown";
      productMap[prodName] = (productMap[productMap[prodName]] || 0) + rev;

      // Group by Month
      const month = item.invoice_date
        ? new Date(item.invoice_date).toLocaleString("default", {
            month: "short",
          })
        : "N/A";
      trendMap[month] = (trendMap[month] || 0) + rev;
    });

    return NextResponse.json({
      stats: {
        revenue: totalRevenue,
        units: totalUnits,
        records: data.length,
        avgProfit: totalRevenue / (data.length || 1),
        growth: 12.5, // Simulated growth logic
      },
      citySales: Object.entries(cityMap).map(([name, total]) => ({
        name,
        total,
      })),
      productSales: Object.entries(productMap).map(([name, sales]) => ({
        name,
        sales,
      })),
      temporalTrend: Object.entries(trendMap).map(([name, total]) => ({
        name,
        total,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}
