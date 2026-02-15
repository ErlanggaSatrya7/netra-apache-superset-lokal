import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const history = await prisma.upload_history.findMany({
      orderBy: { upload_date: "desc" },
    });
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const { id_upload, action, note } = await req.json();
    await prisma.$transaction([
      prisma.upload_history.update({
        where: { id_upload: Number(id_upload) },
        data: { status: action, note: note || "" },
      }),
      prisma.transaction.updateMany({
        where: { id_upload: Number(id_upload) },
        data: { is_approved: action === "APPROVED" },
      }),
    ]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id_upload");
    await prisma.upload_history.delete({ where: { id_upload: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Purge Failed" }, { status: 500 });
  }
}
