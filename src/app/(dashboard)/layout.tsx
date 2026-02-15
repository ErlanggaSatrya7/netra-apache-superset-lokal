"use client";

import React, { useState, useEffect } from "react";
import SidebarResponsive from "@/components/shared/SidebarResponsive";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Activity, Terminal, Cpu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isStaff = pathname.startsWith("/staff");
  const role = isStaff ? "staff" : "admin";

  const handleLogout = () => {
    document.cookie =
      "vortex_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie =
      "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    toast.success("SYSTEM_TERMINATED", {
      description: "Netra Node connection closed.",
    });
    router.push("/login");
    router.refresh();
  };

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-100 antialiased overflow-x-hidden">
      {/* SIDEBAR: Fixed position, width w-72 (18rem) */}
      <SidebarResponsive role={role} onLogout={handleLogout} />

      {/* MAIN CONTENT AREA: 
          - Desktop: pl-72 (Memberi ruang untuk sidebar)
          - Mobile: pl-0 (Sidebar biasanya menjadi menu hamburger/hidden)
      */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-72 transition-all duration-300">
        <main className="flex-1 p-4 md:p-10 lg:p-12 max-w-[1600px] mx-auto w-full relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>

        {/* Footer System Status - Pas di bawah content */}
        <footer className="p-6 border-t border-white/5 bg-[#020617]/50 backdrop-blur-md">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase italic text-slate-600 tracking-widest">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
                Node_Active
              </span>
              <span className="opacity-40">|</span>
              <span>Encrypted_Link: AES_256</span>
            </div>
            <p>© 2024 Netra Intelligence Hub - Adidas Portfolio v2.0</p>
          </div>
        </footer>
      </div>

      {/* Decorative Blur Backgrounds - Tetap di belakang */}
      <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[150px] -z-0 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-1/2 h-1/2 bg-emerald-500/5 rounded-full blur-[150px] -z-0 pointer-events-none" />
    </div>
  );
}
