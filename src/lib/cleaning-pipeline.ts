/**
 * TITAN ADIDAS CLEANING ENGINE v32.0
 * Purpose: High-speed sanitization for 13-Column Matrix
 */
export const vortexCleaningEngine = (rawData: any[]) => {
  return rawData.map((row: any) => {
    // 1. Mapping Column Names based on Excel Headers
    return {
      retailer: String(row["Retailer"] || "UNKNOWN"),
      retailerId: String(row["Retailer ID"] || ""),
      invoiceDate: row["Invoice Date"]
        ? new Date(row["Invoice Date"]).toISOString()
        : null,
      region: String(row["Region"] || "N/A"),
      state: String(row["State"] || "N/A"),
      city: String(row["City"] || "N/A"),
      product: String(row["Product"] || "N/A"),
      pricePerUnit: parseFloat(row["Price per Unit"]) || 0,
      unitsSold: parseInt(row["Units Sold"]) || 0,
      totalSales: parseFloat(row["Total Sales"]) || 0,
      operatingProfit: parseFloat(row["Operating Profit"]) || 0,
      operatingMargin: parseFloat(row["Operating Margin"]) || 0,
      salesMethod: String(row["Sales Method"] || "N/A"),
    };
  });
};
