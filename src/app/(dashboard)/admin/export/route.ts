import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.transaction.findMany({
      where: { is_approved: true },
      include: {
        product: true,
        city: { include: { state: true } },
        retailer: true,
        method: true,
      },
      orderBy: { invoice_date: "desc" },
    });

    // Format data agar cantik saat jadi Excel
    const formattedData = data.map((item) => ({
      "Invoice Date": item.invoice_date,
      Retailer: item.retailer.retailer_name,
      Region: item.city.state.region,
      State: item.city.state.state,
      City: item.city.city,
      Product: item.product.product,
      "Price per Unit": Number(item.price_per_unit),
      "Units Sold": item.unit_sold,
      "Total Sales": Number(item.total_sales),
      "Operating Profit": Number(item.operating_profit),
      "Sales Method": item.method.method,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json({ message: "Export gagal" }, { status: 500 });
  }
}
