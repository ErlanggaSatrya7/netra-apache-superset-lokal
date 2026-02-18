import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [
      global,
      products,
      methods,
      regions,
      retailers,
      monthly,
      transactions,
    ] = await prisma.$transaction([
      prisma.transaction.aggregate({
        where: { is_approved: true },
        _sum: { total_sales: true, operating_profit: true, unit_sold: true },
        _avg: { operating_margin: true },
        _count: { id_transaction: true },
      }),
      prisma.transaction.groupBy({
        by: ["id_product"],
        where: { is_approved: true },
        _sum: { total_sales: true, operating_profit: true, unit_sold: true },
      }),
      prisma.transaction.groupBy({
        by: ["id_method"],
        where: { is_approved: true },
        _sum: { total_sales: true },
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
      prisma.retailer.findMany({
        include: {
          transaction: {
            where: { is_approved: true },
            select: { total_sales: true },
          },
        },
        take: 10,
      }),
      prisma.transaction.groupBy({
        by: ["invoice_date"],
        where: { is_approved: true },
        _sum: { total_sales: true },
      }),
      prisma.transaction.findMany({
        where: { is_approved: true },
        include: { retailer: true, product: true, city: true },
        take: 20,
        orderBy: { id_transaction: "desc" },
      }),
    ]);

    return NextResponse.json({
      global,
      products,
      methods,
      regions,
      retailers,
      monthly,
      recent: transactions,
    });
  } catch (e) {
    return NextResponse.json({ error: "OMEGA_SYNC_FAILED" }, { status: 500 });
  }
}
