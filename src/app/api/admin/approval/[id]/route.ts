import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const batchId = Number(resolvedParams.id);

    if (isNaN(batchId))
      return NextResponse.json({ error: "INVALID_ID" }, { status: 400 });

    const batch = await prisma.upload_history.findUnique({
      where: { id_upload: batchId },
      include: {
        transactions: {
          include: {
            retailer: true,
            product: true,
            method: true,
            city: {
              include: { state: true },
            },
          },
          orderBy: { id_transaction: "asc" },
        },
      },
    });

    if (!batch)
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

    // Pastikan mengembalikan data utuh agar JSON tidak "Unexpected End"
    return NextResponse.json(batch);
  } catch (error) {
    console.error("API_DETAIL_ERROR:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}
