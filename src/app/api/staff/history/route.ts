import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userEmail = "staff@netra.com"; // Idealnya ambil dari session/token asli

    // Ambil riwayat upload milik staff tersebut
    const uploads = await prisma.upload_history.findMany({
      where: { uploaded_by: userEmail },
      orderBy: { upload_date: "desc" },
    });

    return NextResponse.json(uploads);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
