import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Masukkan Admin & Staff dengan password teks biasa
  const users = [
    { email: "admin@netra.com", password: "admin123" },
    { email: "staff@netra.com", password: "staff123" },
  ];

  for (const user of users) {
    await prisma.users.upsert({
      where: { email: user.email },
      update: { password: user.password },
      create: {
        email: user.email,
        password: user.password,
      },
    });
  }

  console.log("✅ SEED BERHASIL: Admin & Staff diisi password polos!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
