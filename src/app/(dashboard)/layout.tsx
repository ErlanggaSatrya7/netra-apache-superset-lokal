"use client";

import React, { useState } from "react";
import Sidebar from "@/components/shared/Sidebar";
import MobileHeader from "@/components/shared/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

/**
 * THE TITAN NEURAL FRAME v32.9
 * Responsive Layout Logic & Sidebar Synchronization
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Jika mobile, sidebar otomatis tertutup/hidden
  const sidebarWidth = isMobile
    ? "w-0"
    : isSidebarOpen
    ? "w-[300px]"
    : "w-[100px]";

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      {/* SIDEBAR NODE */}
      {!isMobile && (
        <aside
          className={cn(
            "relative z-50 bg-[#0f172a]/50 backdrop-blur-3xl border-r border-white/5 transition-all duration-500 ease-in-out shrink-0",
            sidebarWidth
          )}
        >
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        </aside>
      )}

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {isMobile && <MobileHeader />}

        <div
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-primary/20 p-6 lg:p-12 transition-all duration-500",
            // Memberi ruang agar konten tidak mepet ke pinggir
            "max-w-[1600px] mx-auto w-full"
          )}
        >
          {children}
        </div>

        {/* BACKGROUND GLOW DECORATION */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      </main>
    </div>
  );
}
