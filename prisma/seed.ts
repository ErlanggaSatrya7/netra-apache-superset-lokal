import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * TITAN MASTER SEEDING PROTOCOL v31.0
 * Target: Dataset Adidas Indonesia Integration
 */
async function main() {
  console.log("⚡ INITIALIZING_NEURAL_SEEDING...");

  // 1. IDENTITY ACCESS MANAGEMENT (IAM)
  // Sesuai mandat: admin@netra.com & staff@netra.com
  const adminNode = await prisma.users.upsert({
    where: { email: "admin@netra.com" },
    update: {},
    create: {
      email: "admin@netra.com",
      password: "admin123", // In production, this must be hashed
      role: "ADMIN",
    },
  });

  const staffNode = await prisma.users.upsert({
    where: { email: "staff@netra.com" },
    update: {},
    create: {
      email: "staff@netra.com",
      password: "staff123",
      role: "STAFF",
    },
  });

  console.log("✅ IDENTITY_NODES_LOCKED");

  // 2. GEOLOCATION MASTER NODES (Dataset Adidas Indonesia Mapping)
  // Kita petakan Region dan State agar D3.js Circle Packing tidak pecah
  const geoData = [
    { region: "Sumatera", state: "Sumatera Utara", cities: ["Medan"] },
    { region: "Sumatera", state: "Sumatera Selatan", cities: ["Palembang"] },
    { region: "Sumatera", state: "Aceh", cities: ["Banda Aceh"] },
    { region: "Jawa", state: "DKI Jakarta", cities: ["Jakarta"] },
    { region: "Jawa", state: "Jawa Barat", cities: ["Bandung"] },
    { region: "Jawa", state: "Jawa Tengah", cities: ["Semarang"] },
    { region: "Jawa", state: "Jawa Timur", cities: ["Surabaya"] },
    { region: "Bali/Nusa", state: "Bali", cities: ["Denpasar"] },
    { region: "Kalimantan", state: "Kalimantan Timur", cities: ["Samarinda"] },
    { region: "Sulawesi", state: "Sulawesi Selatan", cities: ["Makassar"] },
  ];

  for (const group of geoData) {
    const stateNode = await prisma.state.upsert({
      where: { state: group.state },
      update: {},
      create: {
        state: group.state,
        region: group.region,
      },
    });

    for (const cityName of group.cities) {
      await prisma.city.upsert({
        where: { city: cityName },
        update: {},
        create: {
          city: cityName,
          id_state: stateNode.id_state,
        },
      });
    }
  }

  // 3. PRODUCT ENTITY NODES (Adidas Core Category)
  const productCategories = [
    "Men's Street Footwear",
    "Men's Athletic Footwear",
    "Women's Street Footwear",
    "Women's Athletic Footwear",
    "Men's Apparel",
    "Women's Apparel",
  ];

  for (const prod of productCategories) {
    await prisma.product.upsert({
      where: { product: prod },
      update: {},
      create: { product: prod },
    });
  }

  // 4. SALES METHOD NODES
  const methods = [
    "Offline (Toko Fisik)",
    "Online",
    "Factory Outlet / Warehouse",
  ];
  for (const m of methods) {
    await prisma.method.upsert({
      where: { method: m },
      update: {},
      create: { method: m },
    });
  }

  console.log("🚀 NEURAL_SYSTEM_READY_FOR_INGESTION");
}

main()
  .catch((e) => {
    console.error("❌ SEEDING_CRITICAL_FAILURE:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
