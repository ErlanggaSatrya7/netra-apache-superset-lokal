import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Simpan data ke database dengan status default 'false' (Pending)
    const newTransaction = await prisma.transaction.create({
      data: {
        retailer: body.retailer, // Contoh: "Ramayana"
        region: body.region, // Contoh: "Sumatera"
        city: body.city, // Contoh: "Medan"
        product: body.product, // Contoh: "Men's Streetwear"
        total_sales: parseFloat(body.total_sales),
        is_approved: false, // WAJIB FALSE agar tidak langsung ke Dashboard
      },
    });

    return NextResponse.json({
      message: "Data berhasil dikirim ke Admin!",
      data: newTransaction,
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal upload data" }, { status: 500 });
  }
}
