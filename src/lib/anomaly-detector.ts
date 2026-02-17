/**
 * TITAN ANOMALY DETECTOR
 * Purpose: Auto-scan dataset for business risks
 */
export function scanAnomalies(transactions: any[]) {
  const risks = transactions.filter((tx) => {
    const margin = Number(tx.operating_margin || 0);
    const profit = Number(tx.operating_profit || 0);
    // Kriteria Anomali: Profit Negatif atau Margin < 15%
    return profit < 0 || margin < 0.15;
  });

  return {
    riskCount: risks.length,
    riskTransactions: risks.slice(0, 10), // Ambil 10 sampel untuk UI
    severity:
      risks.length > 50 ? "CRITICAL" : risks.length > 0 ? "WARNING" : "CLEAR",
  };
}
