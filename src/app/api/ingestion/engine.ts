import { prisma } from "@/lib/prisma";
import { vortexCleaningEngine } from "@/lib/cleaning-pipeline";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { fileName, rawData, userEmail, staffComment } = await req.json();

    // 1. NEURAL CLEANING PHASE (PYTHON SPEED)
    // vortexCleaningEngine akan bantai duplikat, null, dan format aneh dalam hitungan ms.
    const cleanedNodes = vortexCleaningEngine(rawData);

    // 2. ATOMIC BATCH INGESTION
    const result = await prisma.$transaction(
      async (tx) => {
        const batch = await tx.upload_history.create({
          data: {
            file_name: fileName,
            system_name: `TITAN-${Date.now()}`,
            status: "PENDING",
            total_rows: cleanedNodes.length,
            uploaded_by: userEmail,
            note: staffComment,
          },
        });

        // Proses looping master data (Upserting)
        for (const node of cleanedNodes) {
          const stateNode = await tx.state.upsert({
            where: { state: node.state },
            update: {},
            create: { state: node.state, region: node.region },
          });

          const cityNode = await tx.city.upsert({
            where: { city: node.city },
            update: { id_state: stateNode.id_state },
            create: { city: node.city, id_state: stateNode.id_state },
          });

          const retailerNode = await tx.retailer.upsert({
            where: { retailer_name: node.retailer },
            update: {},
            create: { retailer_name: node.retailer },
          });

          const productNode = await tx.product.upsert({
            where: { product: node.product },
            update: {},
            create: { product: node.product },
          });

          const methodNode = await tx.method.upsert({
            where: { method: node.salesMethod },
            update: {},
            create: { method: node.salesMethod },
          });

          // Simpan Transaksi (Holding Stage)
          await tx.transaction.create({
            data: {
              id_upload: batch.id_upload,
              id_retailer: retailerNode.id_retailer,
              id_product: productNode.id_product,
              id_method: methodNode.id_method,
              id_city: cityNode.id_city,
              unit_sold: node.unitsSold,
              total_sales: node.totalSales,
              operating_profit: node.operatingProfit,
              operating_margin: node.operatingMargin,
              price_per_unit: node.pricePerUnit,
              invoice_date: node.invoiceDate,
            },
          });
        }
        return batch;
      },
      { timeout: 600000 }
    );

    return NextResponse.json({ success: true, batchId: result.id_upload });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
