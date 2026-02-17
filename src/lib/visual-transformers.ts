/**
 * TITAN VISUAL TRANSFORMER v32.8
 * Purpose: Advanced Business Intelligence Mapping
 */
export function aggregateBusinessStats(transactions: any[]) {
  const productMap: Record<
    string,
    {
      sales: number;
      profit: number;
      units: number;
      marginSum: number;
      count: number;
    }
  > = {};
  const methodMap: Record<string, number> = {};

  transactions.forEach((tx) => {
    const pName = tx.product?.product || "Unknown";
    const mName = tx.method?.method || "Unknown";
    const sales = Number(tx.total_sales || 0);
    const profit = Number(tx.operating_profit || 0);
    const units = Number(tx.unit_sold || 0);
    const margin = Number(tx.operating_margin || 0);

    // Group by Product with Efficiency Metrics
    if (!productMap[pName]) {
      productMap[pName] = {
        sales: 0,
        profit: 0,
        units: 0,
        marginSum: 0,
        count: 0,
      };
    }
    productMap[pName].sales += sales;
    productMap[pName].profit += profit;
    productMap[pName].units += units;
    productMap[pName].marginSum += margin;
    productMap[pName].count += 1;

    // Group by Method
    if (!methodMap[mName]) methodMap[mName] = 0;
    methodMap[mName] += sales;
  });

  return {
    products: Object.keys(productMap).map((name) => ({
      name,
      sales: productMap[name].sales,
      profit: productMap[name].profit,
      units: productMap[name].units,
      avgMargin: (productMap[name].marginSum / productMap[name].count) * 100,
    })),
    methods: Object.keys(methodMap).map((name) => ({
      name,
      value: methodMap[name],
    })),
  };
}
