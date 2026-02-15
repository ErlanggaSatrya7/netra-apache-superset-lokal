import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Root Page: Berfungsi sebagai Traffic Controller.
 * Menentukan apakah user harus ke Login atau bisa masuk ke Dashboard.
 */
export default async function RootPage() {
  // 1. Logika Keamanan Sederhana
  // Di masa depan, kamu bisa mengecek session/cookie di sini.
  // Untuk sekarang, kita arahkan default ke /login agar sistem aman.

  const isUserLoggedIn = false; // Ganti dengan logic session kamu nanti

  if (!isUserLoggedIn) {
    redirect("/login");
  }

  // 2. Jika sudah login, arahkan ke rute Dashboard Admin yang sebenarnya
  // Pastikan file dashboard kamu sudah dipindah ke /app/(dashboard)/admin/page.tsx
  redirect("/admin?view=executive");
}
