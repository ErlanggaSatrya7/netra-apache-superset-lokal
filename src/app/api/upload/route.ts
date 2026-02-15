import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// Fungsi pembantu untuk merapikan teks (Contoh: "kuta" -> "Kuta")
const formatTitle = (str: string) =>
  str
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());

export async function POST(req: Request) {
  try {
    const { data, fileName } = await req.json();

    if (!data || !Array.isArray(data)) {
      throw new Error("Format data tidak valid.");
    }

    const result = await prisma.$transaction(
      async (tx) => {
        let count = 0;

        // 1. Pastikan minimal ada 1 data State default
        const defaultState = await tx.state.upsert({
          where: { id_state: 1 },
          update: {},
          create: { id_state: 1, state: "Unknown State" },
        });

        // 2. Loop Data untuk insert ke Transaction
        for (const item of data) {
          // Normalisasi nama agar tidak duplikat karena beda huruf besar/kecil
          const pName = formatTitle(
            String(item.product || item.Product || "General Product")
          );
          const rName = String(
            item.retailer || item.Retailer || "Adidas Official"
          ).trim();
          const mName = formatTitle(
            String(item.method || item["Sales Method"] || "Online")
          );
          const cName = formatTitle(
            String(item.city || item.City || "Jakarta")
          );

          // Upsert master data secara paralel
          const [prod, ret, meth, ct] = await Promise.all([
            tx.product.upsert({
              where: { product: pName },
              update: {},
              create: { product: pName },
            }),
            tx.retailer.upsert({
              where: { retailer_name: rName },
              update: {},
              create: { retailer_name: rName },
            }),
            tx.method.upsert({
              where: { method: mName },
              update: {},
              create: { method: mName },
            }),
            tx.city.upsert({
              where: { city: cName },
              update: {},
              create: { city: cName, id_state: defaultState.id_state },
            }),
          ]);

          // Fungsi pembersih angka (menghapus $, %, dan koma)
          const cleanDecimal = (val: any) => {
            if (val === undefined || val === null || val === "") return null;
            const cleaned = String(val).replace(/[^0-9.-]/g, "");
            return cleaned ? new Prisma.Decimal(cleaned) : null;
          };

          await tx.transaction.create({
            data: {
              id_retailer: ret.id_retailer,
              id_product: prod.id_product,
              id_method: meth.id_method,
              id_city: ct.id_city,
              invoice_date: item.invoice_date
                ? new Date((Number(item.invoice_date) - 25569) * 86400 * 1000)
                : new Date(),
              price_per_unit: cleanDecimal(
                item.price_per_unit || item["Price per Unit"]
              ),
              unit_sold: parseInt(item.units_sold || item["Units Sold"] || "0"),
              total_sales: cleanDecimal(
                item.total_sales || item["Total Sales"]
              ),
              operating_profit: cleanDecimal(
                item.operating_profit || item["Operating Profit"]
              ),
              operating_margin: cleanDecimal(
                item.operating_margin || item["Operating Margin"]
              ),
              is_approved: false,
            },
          });
          count++;
        }

        // 3. Catat Riwayat
        const version = (await tx.upload_history.count()) + 1;
        await tx.upload_history.create({
          data: {
            file_name: fileName || `Data_Vortex_Batch_${version}`,
            system_name: `data_adidas_v${version}.xlsx`,
            total_rows: count,
            status: "MENUNGGU ADMIN (PENDING)",
          },
        });

        return count;
      },
      {
        timeout: 150000, // Menambah timeout karena data 5.100 cukup besar
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );

    return NextResponse.json({ message: `Sukses! ${result} data mendarat.` });
  } catch (error: any) {
    console.error("VORTEX UPLOAD ERROR:", error.message);
    return NextResponse.json(
      { message: `Gagal: ${error.message}` },
      { status: 500 }
    );
  }
}
