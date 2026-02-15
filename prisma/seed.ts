const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting Neural Seed: DataVortex Core...");

  // 1. MASTER USERS (Email & Pass sesuai request Angga)
  await prisma.users.upsert({
    where: { email: "admin@netra.com" },
    update: {},
    create: {
      email: "admin@netra.com",
      password: "admin123",
      role: "ADMIN",
    },
  });

  await prisma.users.upsert({
    where: { email: "staff@netra.com" },
    update: {},
    create: {
      email: "staff@netra.com",
      password: "staff123",
      role: "STAFF",
    },
  });

  // 2. MASTER DATA ADIDAS
  const sumut = await prisma.state.upsert({
    where: { state: "Sumatera Utara" },
    update: {},
    create: { state: "Sumatera Utara", region: "Sumatera" },
  });

  await prisma.city.upsert({
    where: { city: "Medan" },
    update: {},
    create: { city: "Medan", id_state: sumut.id_state },
  });

  await prisma.retailer.upsert({
    where: { retailer_name: "Ramayana" },
    update: {},
    create: { retailer_name: "Ramayana" },
  });

  await prisma.product.upsert({
    where: { product: "Men's Street Footwear" },
    update: {},
    create: { product: "Men's Street Footwear" },
  });

  await prisma.method.upsert({
    where: { method: "In-Store" },
    update: {},
    create: { method: "In-Store" },
  });

  console.log("✅ Seed Complete. Master Node Online.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
