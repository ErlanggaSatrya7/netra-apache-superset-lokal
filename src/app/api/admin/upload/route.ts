import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { data } = await req.json();
    if (!data)
      return NextResponse.json({ message: "Data kosong" }, { status: 400 });

    for (const row of data) {
      const cityName = String(row.City || row.city || "").trim();
      const stateName = String(row.State || row.state || "").trim();

      if (!cityName || !stateName) continue;

      // 1. Cari atau Buat State (Manual karena tidak ada @unique)
      let stateObj = await prisma.state.findFirst({
        where: { state: stateName },
      });
      if (!stateObj) {
        stateObj = await prisma.state.create({ data: { state: stateName } });
      }

      // 2. Upsert City (City punya @unique di skema kamu)
      const cityObj = await prisma.city.upsert({
        where: { city: cityName },
        update: { id_state: stateObj.id_state },
        create: { city: cityName, id_state: stateObj.id_state },
      });

      // 3. Upsert Produk & Retailer
      const productObj = await prisma.product.upsert({
        where: { product: String(row.Product || "").trim() },
        update: {},
        create: { product: String(row.Product || "").trim() },
      });

      const retailerObj = await prisma.retailer.upsert({
        where: { retailer_name: String(row.Retailer || "").trim() },
        update: {},
        create: { retailer_name: String(row.Retailer || "").trim() },
      });

      const methodObj = await prisma.method.upsert({
        where: {
          method: String(
            row["Sales Method"] || row.method || "Standard"
          ).trim(),
        },
        update: {},
        create: {
          method: String(
            row["Sales Method"] || row.method || "Standard"
          ).trim(),
        },
      });

      // 4. Simpan Transaksi
      await prisma.transaction.create({
        data: {
          id_retailer: retailerObj.id_retailer,
          id_product: productObj.id_product,
          id_method: methodObj.id_method,
          id_city: cityObj.id_city,
          total_sales: parseFloat(row["Total Sales"] || 0),
          operating_profit: parseFloat(row["Operating Profit"] || 0),
          unit_sold: parseInt(row["Units Sold"] || 0),
          invoice_date: new Date(),
          is_approved: true,
        },
      });
    }
    return NextResponse.json({ message: "Berhasil" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
