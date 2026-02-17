"use client";

import React from "react";
import { Menu, Cpu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  onOpenSidebar: () => void;
}

export default function MobileHeader({ onOpenSidebar }: MobileHeaderProps) {
  return (
    <header className="lg:hidden h-20 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-[60]">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          <Cpu className="text-white" size={20} />
        </div>
        <h1 className="text-xl font-black italic tracking-tighter text-white uppercase">
          Titan<span className="text-primary not-italic">VX</span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full items-center gap-2">
          <Zap size={10} className="text-emerald-500 animate-pulse" />
          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">
            Live_Link
          </span>
        </div>
        <Button
          variant="ghost"
          onClick={onOpenSidebar}
          className="h-12 w-12 rounded-xl bg-white/5 border border-white/5 text-primary"
        >
          <Menu size={24} />
        </Button>
      </div>
    </header>
  );
}
