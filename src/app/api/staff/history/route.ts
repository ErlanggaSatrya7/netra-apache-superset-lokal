// versi baru

import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Ambil data transaksi mentah
    const transactions = await prisma.transaction.findMany({
      orderBy: { id_transaction: "desc" },
      include: { product: true },
    });

    // Logika Grouping: Mengelompokkan transaksi yang di-upload di waktu yang hampir bersamaan
    // Kita anggap transaksi dengan selisih waktu < 5 detik adalah dari file yang sama
    const groups: any[] = [];
    transactions.forEach((tx) => {
      const txTime = new Date(tx.invoice_date || new Date()).getTime();

      // Cari group yang waktunya berdekatan (toleransi 5 detik)
      const existingGroup = groups.find(
        (g) => Math.abs(g.rawTime - txTime) < 5000
      );

      if (existingGroup) {
        existingGroup.count += 1;
      } else {
        groups.push({
          id: tx.id_transaction,
          // Penamaan otomatis sistem sesuai keinginanmu
          display_name: `ADIDAS-BATCH-${tx.id_transaction}`,
          product_sample: tx.product?.product || "Adidas Gear",
          rawTime: txTime,
          date: tx.invoice_date,
          is_approved: tx.is_approved,
          count: 1,
        });
      }
    });

    return NextResponse.json(groups.slice(0, 10)); // Tampilkan 10 file terakhir
  } catch (error) {
    return NextResponse.json([]);
  }
}

// // versi baru

// import { NextResponse } from "next/server";
// import { PrismaClient } from "@/generated/prisma";

// const prisma = new PrismaClient();

// export async function GET() {
//   try {
//     const history = await prisma.transaction.findMany({
//       take: 20,
//       orderBy: { id_transaction: "desc" },
//       include: { product: true },
//     });

//     const mappedHistory = history.map((item) => ({
//       ...item,
//       // Penamaan otomatis sistem: [Nama Produk]-[ID]
//       file_name_display: `${item.product?.product || "ADIDAS-BATCH"}-${
//         item.id_transaction
//       }`,
//       // Jam & Tanggal Sekarang (Real-time)
//       display_date: new Date().toISOString(),
//     }));

//     return NextResponse.json(mappedHistory);
//   } catch (error) {
//     return NextResponse.json([], { status: 500 });
//   }
// }

// import { NextResponse } from "next/server";
// import { PrismaClient } from "@/generated/prisma";

// const prisma = new PrismaClient();

// export async function GET() {
//   try {
//     // Mengambil transaksi terbaru yang masuk
//     const history = await prisma.transaction.findMany({
//       take: 20,
//       orderBy: { id_transaction: "desc" },
//       include: { product: true },
//     });

//     // Kita tambahkan "Upload Date" buatan (current date) jika kolom created_at tidak ada
//     const mappedHistory = history.map((item) => ({
//       ...item,
//       display_date: new Date().toISOString(), // Jam & Tanggal Sekarang
//     }));

//     return NextResponse.json(mappedHistory);
//   } catch (error) {
//     return NextResponse.json([], { status: 500 });
//   }
// }

// import { NextResponse } from "next/server";
// import { PrismaClient } from "@/generated/prisma";

// const prisma = new PrismaClient();

// export async function GET() {
//   try {
//     // Mengambil data transaksi terbaru untuk riwayat
//     const history = await prisma.transaction.findMany({
//       take: 10,
//       orderBy: { id_transaction: "desc" },
//       include: {
//         product: true,
//         retailer: true,
//       },
//     });

//     return NextResponse.json(history || []);
//   } catch (error: any) {
//     return NextResponse.json({ message: error.message }, { status: 500 });
//   }
// }
