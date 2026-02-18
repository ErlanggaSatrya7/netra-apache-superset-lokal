import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const [
      global,
      p_sales,
      p_profit,
      p_units,
      m_share,
      r_share,
      city_perf,
      region_perf,
      monthly,
      recent,
      history,
      retailers,
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
        _sum: { total_sales: true },
      }),
      prisma.transaction.groupBy({
        by: ["id_product"],
        where: { is_approved: true },
        _sum: { operating_profit: true },
      }),
      prisma.transaction.groupBy({
        by: ["id_product"],
        where: { is_approved: true },
        _sum: { unit_sold: true },
      }),
      prisma.transaction.groupBy({
        by: ["id_method"],
        where: { is_approved: true },
        _sum: { total_sales: true },
      }),
      prisma.transaction.groupBy({
        by: ["id_retailer"],
        where: { is_approved: true },
        _sum: { total_sales: true },
      }),
      prisma.city.findMany({
        include: {
          transaction: {
            where: { is_approved: true },
            select: { total_sales: true },
          },
        },
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
      prisma.transaction.groupBy({
        by: ["invoice_date"],
        where: { is_approved: true },
        _sum: { total_sales: true },
      }),
      prisma.transaction.findMany({
        where: { is_approved: true },
        include: { retailer: true, product: true, city: true },
        take: 30,
        orderBy: { id_transaction: "desc" },
      }),
      prisma.upload_history.findMany({ orderBy: { upload_date: "desc" } }),
      prisma.retailer.findMany({
        include: {
          transaction: {
            where: { is_approved: true },
            select: { total_sales: true, operating_profit: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      global,
      p_sales,
      p_profit,
      p_units,
      m_share,
      r_share,
      city_perf,
      region_perf,
      monthly,
      recent,
      allHistory: history,
      retailers,
    });
  } catch (e) {
    return NextResponse.json({ error: "NEURAL_SYNC_FAILED" }, { status: 500 });
  }
}
