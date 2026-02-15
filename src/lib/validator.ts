/**
 * Daftar kolom wajib sesuai template Adidas Sales.
 * Jika salah satu tidak ada, sistem akan menolak upload.
 */
export const ADIDAS_REQUIRED_COLUMNS = [
  "Retailer",
  "Retailer ID",
  "Invoice Date",
  "Region",
  "State",
  "City",
  "Product",
  "Price per Unit",
  "Units Sold",
  "Total Sales",
  "Operating Profit",
  "Operating Margin",
  "Sales Method",
];

export function validateExcelHeaders(headers: string[]) {
  // Bersihkan headers dari spasi tambahan dan pastikan case-sensitive aman
  const cleanHeaders = headers.map((h) => h.trim());

  // Cari kolom apa saja yang hilang
  const missingColumns = ADIDAS_REQUIRED_COLUMNS.filter(
    (col) => !cleanHeaders.includes(col)
  );

  return {
    isValid: missingColumns.length === 0,
    missingColumns: missingColumns,
  };
}

/**
 * Helper untuk validasi tipe data sederhana (Optional tapi disarankan)
 */
export function validateRowData(row: any) {
  if (isNaN(Number(row["Units Sold"]))) return "Units Sold harus angka";
  if (isNaN(Number(row["Total Sales"]))) return "Total Sales harus angka";
  return null;
}
