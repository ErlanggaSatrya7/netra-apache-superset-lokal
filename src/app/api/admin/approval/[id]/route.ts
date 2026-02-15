import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const details = await prisma.transaction.findMany({
      where: { id_upload: Number(id) },
      include: {
        retailer: true,
        product: true,
        city: true,
      },
      orderBy: { invoice_date: "asc" },
    });

    return NextResponse.json(details);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
