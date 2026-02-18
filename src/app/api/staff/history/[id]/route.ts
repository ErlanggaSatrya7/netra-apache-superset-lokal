import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const batch = await prisma.upload_history.findUnique({
      where: { id_upload: Number(id) },
      include: {
        transactions: {
          include: {
            retailer: true,
            product: true,
            method: true,
            city: {
              include: {
                state: true, // INI KUNCINYA agar Region & State muncul
              },
            },
          },
        },
      },
    });

    if (!batch)
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    return NextResponse.json(batch);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
