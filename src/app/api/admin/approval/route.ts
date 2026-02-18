import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// --- FUNGSI GET: SUPAYA DATA MUNCUL DI LIST (FIX ERROR 405) ---
export async function GET(req: NextRequest) {
  try {
    // Kita ambil semua riwayat upload
    const data = await prisma.upload_history.findMany({
      include: {
        // Kita hitung jumlah transaksinya juga biar muncul di card
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: { upload_date: "desc" }, // Yang terbaru taruh atas
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET_APPROVAL_ERROR:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}

// --- FUNGSI PUT: UNTUK APPROVE/REJECT ---
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id_upload, status, admin_comment } = body;

    if (!id_upload || !status) {
      return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    }

    // 1. Update status batch di upload_history
    const updated = await prisma.upload_history.update({
      where: { id_upload: Number(id_upload) },
      data: {
        status: status,
        admin_response: admin_comment,
      },
    });

    // 2. Update semua transaksi di dalam batch tersebut
    const recordStatus = status === "APPROVED" ? "STABLE" : "REJECTED";
    await prisma.transaction.updateMany({
      where: { id_upload: Number(id_upload) },
      data: {
        record_status: recordStatus,
        is_approved: status === "APPROVED",
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "UPDATE_FAILED" }, { status: 500 });
  }
}
