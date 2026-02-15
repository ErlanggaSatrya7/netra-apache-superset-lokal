import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id_upload = searchParams.get("id_upload");

    if (id_upload) {
      // Preview Mode (Audit)
      const details = await prisma.transaction.findMany({
        where: { id_upload: Number(id_upload) },
        include: { retailer: true, product: true, city: true },
      });
      return NextResponse.json(details);
    }

    // Warehouse Mode (Hanya data yang sudah di-Approve)
    const warehouse = await prisma.transaction.findMany({
      where: { is_approved: true },
      include: { retailer: true, product: true, city: true },
      orderBy: { invoice_date: "desc" },
    });

    return NextResponse.json(warehouse);
  } catch (error) {
    return NextResponse.json([]);
  }
}
