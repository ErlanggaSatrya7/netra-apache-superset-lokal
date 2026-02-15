"use client";

import { User } from "lucide-react";

export function UserNav({ email, role }: { email: string; role: string }) {
  return (
    <header className="h-20 border-b border-white/5 bg-background/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Spacer agar title di Mobile tidak mepet kiri (tertutup hamburger) */}
      <div className="md:hidden w-12" />

      <div className="hidden md:block">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
          System Status: Online
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs font-black text-white italic leading-none">
            {email}
          </p>
          <p className="text-[9px] font-bold text-primary uppercase mt-1 tracking-wider">
            {role} ACCOUNT
          </p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <User size={18} />
        </div>
      </div>
    </header>
  );
}
