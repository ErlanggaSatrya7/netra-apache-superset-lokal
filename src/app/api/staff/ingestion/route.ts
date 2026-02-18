import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { transactions, metadata } = await req.json();
    const system_name = `BATCH_${Date.now()}`;

    const result = await prisma.$transaction(async (tx) => {
      // 1. BUAT HISTORY (Simpan Staff Comment di sini)
      const history = await tx.upload_history.create({
        data: {
          file_name: metadata.fileName,
          system_name: system_name,
          total_rows: transactions.length,
          status: "PENDING",
          staff_comment: metadata.staff_comment || metadata.comment || "", // Cek kedua kemungkinan key
          uploaded_by: "STAFF_USER",
        },
      });

      // 2. MAPPING 13 KOLOM EXCEL KE DATABASE
      for (const row of transactions) {
        // Handle Relasi (Upsert agar tidak duplikat)
        const ret = await tx.retailer.upsert({
          where: { retailer_name: String(row["Retailer"]) },
          update: {},
          create: {
            retailer_name: String(row["Retailer"]),
            retailer_id: String(row["Retailer ID"]),
          },
        });

        const prod = await tx.product.upsert({
          where: { product: String(row["Product"]) },
          update: {},
          create: { product: String(row["Product"]) },
        });

        const meth = await tx.method.upsert({
          where: { method: String(row["Sales Method"]) },
          update: {},
          create: { method: String(row["Sales Method"]) },
        });

        const st = await tx.state.upsert({
          where: { state: String(row["State"]) },
          update: {},
          create: {
            state: String(row["State"]),
            region: String(row["Region"]),
          },
        });

        const ct = await tx.city.upsert({
          where: { city: String(row["City"]) },
          update: {},
          create: { city: String(row["City"]), id_state: st.id_state },
        });

        // 3. INSERT TRANSAKSI (Lengkap 13 Kolom)
        await tx.transaction.create({
          data: {
            id_upload: history.id_upload,
            id_retailer: ret.id_retailer,
            id_product: prod.id_product,
            id_method: meth.id_method,
            id_city: ct.id_city,
            // Perhatikan nama kolom di dalam [] harus persis dengan Header Excel
            invoice_date: row["Invoice Date"]
              ? new Date(row["Invoice Date"])
              : new Date(),
            price_per_unit: Number(row["Price per Unit"] || 0),
            unit_sold: Number(row["Units Sold"] || row["Units sold"] || 0),
            total_sales: Number(row["Total Sales"] || 0),
            operating_profit: Number(row["Operating Profit"] || 0),
            operating_margin: Number(row["Operating Margin"] || 0),
            record_status: "PENDING",
            is_approved: false,
          },
        });
      }
      return history;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("INGESTION_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
