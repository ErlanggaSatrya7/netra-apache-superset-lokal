import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const { id_transaction, unit_sold, price_per_unit } = await req.json();

    // Hitung ulang Total Sales & Profit secara otomatis di server
    const total_sales = Number(unit_sold) * Number(price_per_unit);

    // Asumsi Operating Margin tetap, kita hitung profit baru
    const updatedTransaction = await prisma.transaction.update({
      where: { id_transaction: Number(id_transaction) },
      data: {
        unit_sold: Number(unit_sold),
        price_per_unit: Number(price_per_unit),
        total_sales: total_sales,
        // Update profit juga jika diperlukan
        operating_profit: total_sales * 0.3, // Contoh margin 30%
      },
    });

    return NextResponse.json({
      message: "Data updated successfully",
      updatedTransaction,
    });
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
