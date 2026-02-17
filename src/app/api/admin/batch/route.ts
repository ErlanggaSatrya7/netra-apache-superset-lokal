import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "MISSING_ID" }, { status: 400 });

  try {
    await prisma.upload_history.delete({
      where: { id_upload: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "DELETE_FAILED" }, { status: 500 });
  }
}
