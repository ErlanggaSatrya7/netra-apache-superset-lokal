import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedAdminPw = await bcrypt.hash("admin123", 10);
  const hashedStaffPw = await bcrypt.hash("staff123", 10);

  await prisma.users.upsert({
    where: { email: "admin@netra.com" },
    update: {},
    create: {
      email: "admin@netra.com",
      password: hashedAdminPw,
    },
  });

  await prisma.users.upsert({
    where: { email: "staff@netra.com" },
    update: {},
    create: {
      email: "staff@netra.com",
      password: hashedStaffPw,
    },
  });

  console.log("✅ SEED SUCCESS: admin@netra.com | admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
