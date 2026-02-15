import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  // Jika tidak ada session, paksa login
  if (!role) {
    redirect("/login");
  }

  // Jika ada session, lempar ke dashboard yang sesuai
  if (role === "ADMIN") {
    redirect("/admin");
  } else {
    redirect("/staff");
  }
}
