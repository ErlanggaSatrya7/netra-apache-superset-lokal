import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email") || "staff@netra.com";

  try {
    const stats = await prisma.upload_history.groupBy({
      by: ["status"],
      where: { uploaded_by: email },
      _count: { _all: true },
    });

    const formatted = {
      pending: stats.find((s) => s.status === "PENDING")?._count._all || 0,
      approved: stats.find((s) => s.status === "APPROVED")?._count._all || 0,
      rejected: stats.find((s) => s.status === "REJECTED")?._count._all || 0,
    };

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch staff analytics" },
      { status: 500 }
    );
  }
}
