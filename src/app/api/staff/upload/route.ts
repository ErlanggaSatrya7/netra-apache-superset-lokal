import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { fileName, data, uploadedBy } = await req.json();

    // 1. Buat record di Upload_History
    const history = await prisma.upload_history.create({
      data: {
        file_name: fileName,
        system_name: `DS-${Date.now()}`,
        status: "PENDING",
        total_rows: data.length,
        uploaded_by: uploadedBy,
      },
    });

    // 2. Bulk Insert ke tabel Transaction (Gunakan transaction agar aman)
    // Note: Sesuaikan mapping field dengan kolom Excel Adidas kamu
    await prisma.transaction.createMany({
      data: data.map((item: any) => ({
        id_upload: history.id_upload,
        retailer_id: item.retailer_id, // Harusnya hasil lookup atau ID
        product_id: item.product_id,
        unit_sold: parseInt(item.units_sold),
        total_sales: parseFloat(item.total_sales),
        is_approved: false,
      })),
    });

    return NextResponse.json({
      message: "Data uploaded to queue",
      id: history.id_upload,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process dataset" },
      { status: 500 }
    );
  }
}
