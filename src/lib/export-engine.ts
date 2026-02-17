import * as XLSX from "xlsx";

/**
 * TITAN PROFESSIONAL EXPORT ENGINE
 * Purpose: Convert Neural Matrix to Hard-Copy Reports
 */
export const exportTitanReport = (data: any[], fileName: string) => {
  if (!data || data.length === 0) return;

  // Flattening data agar 13 kolom terbaca rapi di Excel
  const flattenedData = data.map((row) => ({
    Retailer: row.retailer?.retailer_name || "N/A",
    "Retailer ID": row.retailer?.retailer_id || "N/A",
    "Invoice Date": row.invoice_date
      ? new Date(row.invoice_date).toLocaleDateString()
      : "N/A",
    Region: row.city?.state?.region || "N/A",
    State: row.city?.state?.state || "N/A",
    City: row.city?.city || "N/A",
    Product: row.product?.product || "N/A",
    "Price per Unit": Number(row.price_per_unit) || 0,
    "Units Sold": Number(row.unit_sold) || 0,
    "Total Sales": Number(row.total_sales) || 0,
    "Operating Profit": Number(row.operating_profit) || 0,
    "Operating Margin": `${(Number(row.operating_margin) * 100).toFixed(0)}%`,
    "Sales Method": row.method?.method || "N/A",
  }));

  const worksheet = XLSX.utils.json_to_sheet(flattenedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ADIDAS_REPORT");

  // Generate Buffer and Download
  XLSX.writeFile(workbook, `${fileName}_${new Date().getTime()}.xlsx`);
};
