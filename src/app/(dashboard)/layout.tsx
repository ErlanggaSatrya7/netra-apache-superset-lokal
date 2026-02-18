"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/shared/Sidebar";
import MobileHeader from "@/components/shared/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Fix Hydration: Memastikan Client sudah siap sebelum merender logic dinamis
  useEffect(() => {
    setMounted(true);
  }, []);

  // Selama server merender atau client belum mounted, render skeleton minimal yang stabil
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#020617] flex">
        <div className="flex-1" />
      </div>
    );
  }

  const sidebarWidth = isMobile
    ? "w-0"
    : isSidebarOpen
    ? "w-[300px]"
    : "w-[100px]";
  const contentPadding = isMobile
    ? "pl-0"
    : isSidebarOpen
    ? "pl-[300px]"
    : "pl-[100px]";

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans overflow-x-hidden selection:bg-primary/30">
      {/* SIDEBAR NODE - FIXED POSITION */}
      {!isMobile && (
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 bg-[#0f172a]/50 backdrop-blur-3xl border-r border-white/5 transition-all duration-500 ease-in-out shrink-0 overflow-hidden",
            sidebarWidth
          )}
        >
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        </aside>
      )}

      {/* MAIN VIEWPORT */}
      <main
        className={cn(
          "flex-1 flex flex-col min-w-0 relative transition-all duration-500 ease-in-out",
          contentPadding
        )}
      >
        {isMobile && <MobileHeader />}

        <div
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-12 transition-all duration-500",
            "max-w-[1600px] mx-auto w-full",
            isMobile ? "pt-24" : "pt-6"
          )}
        >
          {children}
        </div>

        {/* BACKGROUND GLOW */}
        <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      </main>
    </div>
  );
}
