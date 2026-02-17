import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Di sini nanti tambahkan session user (email/id)
    // Untuk sekarang kita tarik semua data history upload
    const data = await prisma.upload_history.findMany({
      orderBy: { upload_date: "desc" },
      take: 20,
    });

    return NextResponse.json({ success: true, payload: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
