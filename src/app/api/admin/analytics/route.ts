import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { record_status: "STABLE" }, // Hanya ambil data stabil
      include: {
        retailer: true, // Tarik nama unik (Amazon, dll)
        product: true, // Tarik nama produk
        method: true, // Tarik 3 jenis method (In-store, Online, dll)
        city: {
          include: { state: true }, // Tarik Region & State
        },
      },
      orderBy: { invoice_date: "asc" },
    });
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: "DB_UPLINK_ERROR" }, { status: 500 });
  }
}
