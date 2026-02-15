import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id_upload = parseInt(params.id);
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 50;
  const skip = (page - 1) * limit;

  try {
    const data = await prisma.transaction.findMany({
      where: { id_upload },
      include: {
        product: true,
        city: { include: { state: true } },
        retailer: true,
      },
      take: limit,
      skip: skip,
      orderBy: { id_transaction: "asc" },
    });

    const total = await prisma.transaction.count({ where: { id_upload } });

    return NextResponse.json({
      transactions: data,
      totalRows: total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mengambil detail data" },
      { status: 500 }
    );
  }
}
