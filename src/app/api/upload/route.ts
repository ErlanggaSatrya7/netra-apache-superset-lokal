// versi 2

import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data } = body;

    // Validasi data yang masuk
    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { message: "Data tidak valid atau kosong" },
        { status: 400 }
      );
    }

    /**
     * Menggunakan $transaction agar proses simpan data lebih cepat dan aman.
     * Jika ada satu baris data yang error, seluruh proses akan dibatalkan (rollback).
     */
    await prisma.$transaction(
      data.map((row: any) => {
        // --- LOGIKA CLEANING DATA ---
        // Membulatkan angka berantakan (contoh: 59221727.999999993) menjadi angka bulat
        const cleanProfit = Math.round(Number(row["Operating Profit"] || 0));
        const cleanSales = Math.round(Number(row["Total Sales"] || 0));

        // Memastikan format tanggal benar
        const cleanDate = row["Invoice Date"]
          ? new Date(row["Invoice Date"])
          : new Date();

        return prisma.transaction.create({
          data: {
            /** * CATATAN: Pastikan ID (1) ini sudah ada di tabel Master (Retailer, Product, dsb)
             * di DBeaver kamu agar tidak terjadi error foreign key.
             */
            id_retailer: 1,
            id_product: 1,
            id_method: 1,
            id_city: 1,
            invoice_date: cleanDate,
            price_per_unit: Number(row["Price per Unit"] || 0),
            unit_sold: Number(row["Units Sold"] || 0),
            total_sales: cleanSales,
            operating_profit: cleanProfit,
            operating_margin: Number(row["Operating Margin"] || 0),
          },
        });
      })
    );

    return NextResponse.json({
      message: "Data Adidas Berhasil Dibersihkan & Disimpan ke Laragon!",
    });
  } catch (error: any) {
    console.error("Error Detail saat Upload:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan: " + error.message },
      { status: 500 }
    );
  } finally {
    // Memutuskan koneksi prisma setelah selesai untuk menghemat resource
    await prisma.$disconnect();
  }
}

// versi 1

// import { NextResponse } from "next/server";
// import { PrismaClient } from "@/generated/prisma";

// const prisma = new PrismaClient();

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { data } = body;

//     if (!data || !Array.isArray(data)) {
//       return NextResponse.json(
//         { message: "Data tidak valid" },
//         { status: 400 }
//       );
//     }

//     // Menggunakan Transaction agar jika satu baris error, semua dibatalkan (aman)
//     await prisma.$transaction(
//       data.map((row: any) => {
//         // CLEANING: Membulatkan angka .999999993 menjadi angka bulat
//         const cleanProfit = Math.round(Number(row["Operating Profit"] || 0));
//         const cleanSales = Math.round(Number(row["Total Sales"] || 0));

//         return prisma.transaction.create({
//           data: {
//             // Pastikan ID ini (1) sudah ada di tabel Master kamu di DBeaver
//             id_retailer: 1,
//             id_product: 1,
//             id_method: 1,
//             id_city: 1,
//             invoice_date: row["Invoice Date"]
//               ? new Date(row["Invoice Date"])
//               : new Date(),
//             price_per_unit: Number(row["Price per Unit"] || 0),
//             unit_sold: Number(row["Units Sold"] || 0),
//             total_sales: cleanSales,
//             operating_profit: cleanProfit,
//             operating_margin: Number(row["Operating Margin"] || 0),
//           },
//         });
//       })
//     );

//     return NextResponse.json({
//       message: "Data Adidas Berhasil Dibersihkan & Disimpan!",
//     });
//   } catch (error: any) {
//     console.error("Error Detail:", error);
//     return NextResponse.json(
//       { message: "Gagal: " + error.message },
//       { status: 500 }
//     );
//   }
// }
