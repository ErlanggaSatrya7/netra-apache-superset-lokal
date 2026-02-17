import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { fileName, payload, note } = await req.json();

    const result = await prisma.$transaction(
      async (tx) => {
        const history = await tx.upload_history.create({
          data: {
            file_name: fileName,
            system_name: `VX-${Date.now()}`,
            staff_comment: note,
            total_rows: payload.length,
            uploaded_by: "STAFF_ACTIVE",
          },
        });

        for (const row of payload) {
          const retailer = await tx.retailer.upsert({
            where: { retailer_name: String(row.Retailer) },
            update: { retailer_id: String(row["Retailer ID"]) },
            create: {
              retailer_name: String(row.Retailer),
              retailer_id: String(row["Retailer ID"]),
            },
          });

          const prod = await tx.product.upsert({
            where: { product: String(row.Product) },
            update: {},
            create: { product: String(row.Product) },
          });

          const stateNode = await tx.state.upsert({
            where: { state: String(row.State) },
            update: {},
            create: { state: String(row.State), region: String(row.Region) },
          });

          const cityNode = await tx.city.upsert({
            where: { city: String(row.City) },
            update: {},
            create: { city: String(row.City), id_state: stateNode.id_state },
          });

          const methodNode = await tx.method.upsert({
            where: { method: String(row["Sales Method"]) },
            update: {},
            create: { method: String(row["Sales Method"]) },
          });

          await tx.transaction.create({
            data: {
              id_retailer: retailer.id_retailer,
              id_product: prod.id_product,
              id_city: cityNode.id_city,
              id_method: methodNode.id_method,
              id_upload: history.id_upload,
              invoice_date: new Date(row["Invoice Date"]),
              price_per_unit: row["Price per Unit"],
              unit_sold: row["Units Sold"],
              total_sales: row["Total Sales"],
              operating_profit: row["Operating Profit"],
              operating_margin: row["Operating Margin"],
              is_approved: false,
            },
          });
        }
        return history;
      },
      { timeout: 60000 }
    );

    return NextResponse.json({ success: true, batch: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
