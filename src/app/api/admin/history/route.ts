import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Ambil data yang statusnya sudah final (APPROVED/REJECTED)
    const logs = await prisma.upload_history.findMany({
      where: {
        status: { in: ["APPROVED", "REJECTED"] },
      },
      orderBy: { upload_date: "desc" },
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed fetch history" },
      { status: 500 }
    );
  }
}
