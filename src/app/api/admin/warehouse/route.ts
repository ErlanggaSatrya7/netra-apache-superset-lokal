import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode");
    const datasetId = searchParams.get("datasetId");

    // 1. DATASET DETAIL (WAREHOUSE [ID])
    if (datasetId) {
      const transactions = await prisma.transaction.findMany({
        where: { id_upload: Number(datasetId) },
        include: {
          retailer: true,
          product: true,
          method: true,
          city: { include: { state: true } },
        },
        orderBy: { id_transaction: "asc" },
      });
      return NextResponse.json(transactions || []);
    }

    // 2. TAB 2: DATASET ARCHIVE
    if (mode === "datasets") {
      const datasets = await prisma.upload_history.findMany({
        where: { status: "APPROVED" },
        include: { _count: { select: { transactions: true } } },
        orderBy: { upload_date: "desc" },
      });
      return NextResponse.json(datasets || []);
    }

    // 3. TAB 1: GLOBAL ROWS
    const transactions = await prisma.transaction.findMany({
      include: {
        retailer: true,
        product: true,
        method: true,
        city: { include: { state: true } },
      },
      orderBy: { id_transaction: "desc" },
      take: 100,
    });
    return NextResponse.json(transactions || []);
  } catch (e: any) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await prisma.upload_history.delete({ where: { id_upload: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
