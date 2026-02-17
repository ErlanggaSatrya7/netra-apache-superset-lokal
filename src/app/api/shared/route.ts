import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id_upload = searchParams.get("id_upload");

    // 1. DETAIL PROTOCOL (Untuk Approval/Preview Detail)
    if (id_upload) {
      const data = await prisma.transaction.findMany({
        where: { id_upload: parseInt(id_upload) },
        include: {
          retailer: true,
          product: true,
          method: true,
          city: { include: { state: true } }, // Join City ke State
        },
      });
      return NextResponse.json(data);
    }

    // 2. DASHBOARD PROTOCOL (Aggregation SEMUA Data Approved)
    const cities = await prisma.city.findMany({
      include: {
        state: true,
        transaction: { where: { is_approved: true } },
      },
    });

    const citySales = cities
      .map((c) => ({
        name: c.city,
        region: c.state?.region || "Global",
        total: c.transaction.reduce(
          (acc, curr) => acc + Number(curr.total_sales || 0),
          0
        ),
      }))
      .filter((c) => c.total > 0);

    const products = await prisma.product.findMany({
      include: { transaction: { where: { is_approved: true } } },
    });

    const productSales = products.map((p) => ({
      name: p.product,
      sales: p.transaction.reduce(
        (acc, curr) => acc + Number(curr.total_sales || 0),
        0
      ),
    }));

    return NextResponse.json({
      citySales,
      productSales,
      stats: {
        revenue: citySales.reduce((a, b) => a + b.total, 0),
        records: citySales.length,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "NEURAL_LINK_FAILED" }, { status: 500 });
  }
}
