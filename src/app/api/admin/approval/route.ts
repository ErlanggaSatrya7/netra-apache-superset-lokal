import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pendingTransactions = await prisma.transaction.findMany({
      where: { is_approved: false },
      orderBy: { invoice_date: "desc" },
    });

    // Mengembalikan array kosong jika tidak ada data, bukan null
    return NextResponse.json(pendingTransactions || []);
  } catch (error: any) {
    console.error("API Error:", error.message);
    return NextResponse.json([], { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
