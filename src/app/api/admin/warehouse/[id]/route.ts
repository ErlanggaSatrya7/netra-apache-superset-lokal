import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Ambil ID dari params dan paksa jadi Angka (Int) sesuai Schema Prisma
    const id_upload = parseInt(params.id);

    if (isNaN(id_upload)) {
      return NextResponse.json({ error: "INVALID_ID_FORMAT" }, { status: 400 });
    }

    /**
     * ATOMIC PURGE ENGINE
     * Walaupun di schema ada onDelete: Cascade, kita bantai manual urutannya
     * di dalam transaksi biar PostgreSQL gak bisa komplain soal Database Lock.
     */
    const purgeOperation = await prisma.$transaction(async (tx) => {
      // Step A: Bantai semua transaksi yang nyangkut di batch upload ini
      const deletedTransactions = await tx.transaction.deleteMany({
        where: { id_upload: id_upload },
      });

      // Step B: Bantai record bapaknya (Upload History)
      const deletedHistory = await tx.upload_history.delete({
        where: { id_upload: id_upload },
      });

      return { deletedTransactions, deletedHistory };
    });

    console.log(
      `PURGE_SUCCESS: Bantai ${purgeOperation.deletedTransactions.count} baris.`
    );

    return NextResponse.json({
      success: true,
      message: "VAULT_PURGED_SUCCESSFULLY",
      count: purgeOperation.deletedTransactions.count,
    });
  } catch (error: any) {
    console.error("PURGE_CRITICAL_FAILURE:", error);

    // Handle error spesifik Prisma P2003 (Foreign key constraint fails)
    if (error.code === "P2003") {
      return NextResponse.json(
        {
          error: "DATABASE_LOCK_ERROR",
          details:
            "Relasi database menghalangi penghapusan. Cek cascade settings.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "SERVER_ERROR", details: error.message },
      { status: 500 }
    );
  }
}
