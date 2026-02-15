export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      take: 10,
      orderBy: { id_transaction: "desc" },
      include: { product: true },
    });

    // Melakukan grouping sederhana berdasarkan waktu/ID agar muncul sebagai BATCH
    const historyBatch = transactions.map((tx) => ({
      id: tx.id_transaction,
      display_name: `ADIDAS-BATCH-${tx.id_transaction}`,
      rawTime: tx.invoice_date || new Date(),
      is_approved: tx.is_approved,
      count: 10, // Dummy count baris per batch
    }));

    return NextResponse.json(historyBatch);
  } catch (error) {
    return NextResponse.json([]);
  }
}

// import { NextResponse } from "next/server";
// import { PrismaClient } from "@/generated/prisma"; // Sesuai output prisma kamu

// const prisma = new PrismaClient();

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const from = searchParams.get("from");
//     const to = searchParams.get("to");

//     // Filter berdasarkan rentang tanggal jika ada
//     let whereClause: any = { is_approved: true };
//     if (from && to) {
//       whereClause.invoice_date = {
//         gte: new Date(from),
//         lte: new Date(to),
//       };
//     }

//     const historyData = await prisma.transaction.findMany({
//       where: whereClause,
//       orderBy: { invoice_date: "desc" },
//     });

//     return NextResponse.json(historyData);
//   } catch (error: any) {
//     return NextResponse.json({ message: error.message }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }
