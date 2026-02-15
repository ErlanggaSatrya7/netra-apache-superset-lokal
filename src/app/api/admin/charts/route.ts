import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.transaction.findMany({
      include: {
        city: {
          include: {
            state: true, // Mengambil relasi ke tabel state
          },
        },
        product: true,
        retailer: true,
        method: true,
      },
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
