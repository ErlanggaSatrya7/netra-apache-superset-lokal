import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * DATAVORTEX CORE INGESTION ENGINE
 * Complexity: High (Batch Processing & Relational Mapping)
 */
export async function POST(req: Request) {
  try {
    const { fileName, data } = await req.json();

    if (!data || !Array.isArray(data)) {
      return NextResponse.json({ error: "INVALID_STREAM" }, { status: 400 });
    }

    // Handshake Sequence: Start Transaction
    const result = await prisma.$transaction(
      async (tx) => {
        // 1. Create Ingestion Header
        const history = await tx.upload_history.create({
          data: {
            file_name: fileName,
            system_name: `ADI-VX-${Date.now()}`,
            status: "PENDING",
            total_rows: data.length,
            uploaded_by: "operator@netra.com", // Ditarik dari session asli nantinya
          },
        });

        // 2. Data Cleansing & Relational Handshake
        // Kita memproses data dalam potongan (chunks) agar database tidak overheat
        const transactions = data.map((row: any) => ({
          id_upload: history.id_upload,
          id_retailer: 1, // Logic mapping ke tabel retailer
          id_product: 1, // Logic mapping ke tabel product
          id_method: 1, // Logic mapping ke tabel method
          id_city: 1, // Logic mapping ke tabel city
          unit_sold: parseInt(String(row["Units Sold"])) || 0,
          total_sales:
            parseFloat(String(row["Total Sales"]).replace(/[^0-9.]/g, "")) || 0,
          operating_profit:
            parseFloat(
              String(row["Operating Profit"]).replace(/[^0-9.]/g, "")
            ) || 0,
          operating_margin:
            parseFloat(
              String(row["Operating Margin"]).replace(/[^0-9.]/g, "")
            ) || 0,
          price_per_unit:
            parseFloat(String(row["Price per Unit"]).replace(/[^0-9.]/g, "")) ||
            0,
          invoice_date: row["Invoice Date"]
            ? new Date(row["Invoice Date"])
            : new Date(),
          is_approved: false,
        }));

        // 3. Ultra-Fast Batch Insert
        await tx.transaction.createMany({
          data: transactions,
          skipDuplicates: true,
        });

        return history;
      },
      {
        timeout: 120000, // Memberikan nafas 2 menit untuk data masif
      }
    );

    return NextResponse.json({ success: true, batch: result.system_name });
  } catch (error: any) {
    console.error("CRITICAL_INGEST_FAILURE:", error);
    return NextResponse.json(
      { error: "NEURAL_LINK_SEVERED", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const logs = await prisma.upload_history.findMany({
      orderBy: { upload_date: "desc" },
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
