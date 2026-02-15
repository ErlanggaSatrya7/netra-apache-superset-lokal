import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * API untuk menarik data transaksi per baris berdasarkan ID Upload.
 * Mendukung Pagination agar performa tetap ringan meski data berjumlah ribuan.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id_upload = parseInt(searchParams.get("id_upload") || "0");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 50; // Konsisten menampilkan 50 baris per halaman
    const skip = (page - 1) * limit;

    if (!id_upload) {
      return NextResponse.json(
        { message: "ID Upload tidak valid" },
        { status: 400 }
      );
    }

    // Menggunakan $transaction untuk menjalankan dua query secara paralel (lebih cepat)
    const [transactions, totalRows] = await prisma.$transaction([
      prisma.transaction.findMany({
        where: { id_upload },
        include: {
          product: true,
          retailer: true,
          city: {
            include: { state: true },
          },
          method: true,
        },
        orderBy: { id_transaction: "asc" },
        skip: skip,
        take: limit,
      }),
      prisma.transaction.count({
        where: { id_upload },
      }),
    ]);

    const totalPages = Math.ceil(totalRows / limit);

    return NextResponse.json({
      success: true,
      data: transactions,
      meta: {
        totalRows,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error: any) {
    console.error("Preview API Error:", error);
    return NextResponse.json(
      { message: "Gagal memuat data transaksi", error: error.message },
      { status: 500 }
    );
  }
}
