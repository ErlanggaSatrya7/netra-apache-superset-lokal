"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<{ role: string } | null>(null);

  useEffect(() => {
    const role = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="))
      ?.split("=")[1];

    if (!role) {
      router.push("/login");
    } else {
      setUser({ role });
    }
  }, [router]);

  return { user };
}
