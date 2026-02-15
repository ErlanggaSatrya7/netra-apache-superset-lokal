"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  TableProperties,
  FileSearch,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const searchParams = useSearchParams();
  const activeView = searchParams.get("view") || "executive";

  const menuItems = [
    { id: "executive", label: "Executive Analytics", icon: LayoutDashboard },
    { id: "verification", label: "Approve Data Center", icon: FileSearch },
    { id: "archive", label: "Global Data Archive", icon: TableProperties },
  ];

  return (
    <div className="w-72 bg-[#020617] border-r border-slate-900 h-screen flex flex-col p-6 sticky top-0 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-blue-600 p-2 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)]">
          <div className="text-white font-black italic text-sm">DV</div>
        </div>
        <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">
          DATAVORTEX
        </h2>
      </div>

      <div className="mb-8 px-2">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg py-1 px-3 inline-block">
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">
            Director Mode
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={`/admin?view=${item.id}`}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[11px] italic transition-all uppercase tracking-tight",
              activeView === item.id
                ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                : "text-slate-500 hover:text-white hover:bg-slate-900"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="pt-6 border-t border-slate-900">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 text-xs font-bold italic uppercase transition-colors">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );
}
