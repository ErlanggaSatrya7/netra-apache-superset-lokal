import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [global, products, methods, monthly, retailers, regions] =
      await Promise.all([
        prisma.transaction.aggregate({
          _sum: { total_sales: true, operating_profit: true, unit_sold: true },
          _avg: { operating_margin: true },
        }),
        prisma.transaction.groupBy({
          by: ["id_product"],
          _sum: { total_sales: true, unit_sold: true },
          orderBy: { _sum: { total_sales: "desc" } },
          take: 10,
        }),
        prisma.transaction.groupBy({
          by: ["id_method"],
          _sum: { total_sales: true },
        }),
        prisma.transaction.groupBy({
          by: ["invoice_date"],
          _sum: { total_sales: true },
          orderBy: { invoice_date: "asc" },
        }),
        prisma.retailer.findMany({
          include: { transaction: { select: { total_sales: true } } },
          take: 10,
        }),
        prisma.state.findMany({ include: { city: true } }),
      ]);

    const [pDetail, mDetail] = await Promise.all([
      prisma.product.findMany(),
      prisma.method.findMany(),
    ]);

    return NextResponse.json({
      global,
      products: products.map((p) => ({
        ...p,
        product: pDetail.find((pd) => pd.id_product === p.id_product),
      })),
      methods: methods.map((m) => ({
        ...m,
        method: mDetail.find((md) => md.id_method === m.id_method),
      })),
      monthly,
      retailers,
      regions,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
