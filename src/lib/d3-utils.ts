/**
 * TITAN NEURAL TRANSFORMER
 * Purpose: Convert Flat Adidas Data to D3 Hierarchy
 */
export function transformToHierarchy(data: any[]) {
  const root = { name: "ADIDAS_INDONESIA", children: [] as any[] };

  data.forEach((item) => {
    const regionName = item.city?.state?.region || "Unknown";
    const stateName = item.city?.state?.state || "Unknown";
    const cityName = item.city?.city || "Unknown";
    const productName = item.product?.product || "Unknown";
    const value = Number(item.total_sales || 0);

    // 1. Find or Create Region
    let region = root.children.find((r) => r.name === regionName);
    if (!region) {
      region = { name: regionName, children: [] };
      root.children.push(region);
    }

    // 2. Find or Create State
    let state = region.children.find((s: any) => s.name === stateName);
    if (!state) {
      state = { name: stateName, children: [] };
      region.children.push(state);
    }

    // 3. Find or Create City
    let city = state.children.find((c: any) => c.name === cityName);
    if (!city) {
      city = { name: cityName, children: [] };
      state.children.push(city);
    }

    // 4. Find or Create Product Node
    let product = city.children.find((p: any) => p.name === productName);
    if (!product) {
      city.children.push({ name: productName, value: value });
    } else {
      product.value += value;
    }
  });

  return root;
}
