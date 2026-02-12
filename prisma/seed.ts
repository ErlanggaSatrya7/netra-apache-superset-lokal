// versi 2

import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Memulai proses seeding...");

  // 1. Membuat atau Update user Admin
  await prisma.users.upsert({
    where: { email: "admin@netra.com" },
    update: {
      password: "admin123",
    },
    create: {
      email: "admin@netra.com",
      password: "admin123",
    },
  });

  // 2. Membuat atau Update user Staff
  await prisma.users.upsert({
    where: { email: "staff@netra.com" },
    update: {
      password: "staff123",
    },
    create: {
      email: "staff@netra.com",
      password: "staff123",
    },
  });

  console.log(
    "✅ Database Berhasil Diisi: Akun Admin (admin123) & Staff (staff123) siap!"
  );
}

main()
  .catch((e) => {
    console.error("Terjadi error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// ----

// versi 1

// import { PrismaClient } from "../src/generated/prisma";

// const prisma = new PrismaClient();

// async function main() {
//   // Membuat user Admin
//   await prisma.users.upsert({
//     where: { email: "admin@netra.com" },
//     update: { password: "admin123" }, // Update password jika email sudah ada
//     create: {
//       email: "admin@netra.com",
//       password: "admin123"
//     },
//   });

//   // Membuat user Staff
//   await prisma.users.upsert({
//     where: { email: "staff@netra.com" },
//     update: { password: "staff123" },
//     create: {
//       email: "staff@netra.com",
//       password: "staff123"
//     },
//   });

//   console.log("✅ Database Berhasil Diisi: Akun Admin & Staff siap!");
// }
