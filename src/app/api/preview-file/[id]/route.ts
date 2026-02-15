import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 1. Cari informasi file di tabel upload_history
    const fileRecord = await prisma.upload_history.findUnique({
      where: { id_upload: parseInt(id) },
    });

    if (!fileRecord) {
      return NextResponse.json(
        { error: "File record tidak ditemukan" },
        { status: 404 }
      );
    }

    // 2. Tentukan lokasi file (Pastikan file ada di folder public/uploads atau folder tujuan staff)
    const filePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      fileRecord.system_name
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "File fisik tidak ditemukan di server" },
        { status: 404 }
      );
    }

    // 3. Baca isi Excel menggunakan XLSX
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData: any[] = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName]
    );

    // 4. Kirim 10 baris pertama saja untuk preview
    const previewData = sheetData.slice(0, 10).map((row) => ({
      retailer: row.Retailer || row.retailer || "N/A",
      product: row.Product || row.product || "N/A",
      total_sales: parseFloat(row["Total Sales"] || row.total_sales || 0),
    }));

    return NextResponse.json({
      file_name: fileRecord.file_name,
      rows: previewData,
      total_rows: fileRecord.total_rows,
    });
  } catch (error) {
    console.error("Preview Error:", error);
    return NextResponse.json(
      { error: "Gagal membaca isi file Excel" },
      { status: 500 }
    );
  }
}
