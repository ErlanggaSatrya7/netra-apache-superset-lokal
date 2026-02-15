"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileCheck,
  Database,
  History,
  LogOut,
  UploadCloud,
  ChevronRight,
  ShieldCheck,
  Activity,
  Cpu,
  Monitor,
  Box,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SidebarResponsive({
  role,
  onLogout,
}: {
  role: "admin" | "staff";
  onLogout: () => void;
}) {
  const pathname = usePathname();

  const menus =
    role === "admin"
      ? [
          { name: "Analytics", path: "/admin", icon: LayoutDashboard },
          { name: "Audit Port", path: "/admin/approval", icon: FileCheck },
          { name: "Warehouse", path: "/admin/management", icon: Database },
          { name: "Logs", path: "/admin/history", icon: History },
        ]
      : [
          { name: "Terminal", path: "/staff", icon: Monitor },
          { name: "Ingest", path: "/staff/upload", icon: UploadCloud },
          { name: "Archive", path: "/staff/history", icon: History },
        ];

  return (
    <aside className="fixed left-0 top-0 z-[100] h-screen w-72 border-r border-white/5 bg-[#020617]/80 backdrop-blur-xl md:block hidden shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
      <div className="flex flex-col h-full p-8">
        {/* BRANDING */}
        <div className="mb-12 p-6 bg-white/5 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
          <div className="flex items-center gap-4 relative z-10">
            <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-transform group-hover:scale-110">
              <ShieldCheck className="text-white w-7 h-7" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">
                DataVortex
              </span>
              <span className="text-[9px] font-bold text-primary uppercase tracking-[0.3em] mt-2 italic opacity-80">
                Netra Intel
              </span>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-2">
          <p className="text-[9px] font-black uppercase text-slate-600 tracking-[0.4em] mb-6 ml-4">
            Access_Protocol
          </p>
          {menus.map((item) => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase italic transition-all group",
                  active
                    ? "bg-primary text-white shadow-[0_15px_30px_rgba(59,130,246,0.25)] border border-white/10"
                    : "text-slate-500 hover:text-slate-100 hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-4">
                  <item.icon
                    size={18}
                    className={cn(
                      active
                        ? "text-white"
                        : "text-primary/60 group-hover:text-primary"
                    )}
                  />
                  {item.name}
                </div>
                <ChevronRight
                  size={14}
                  className={cn(
                    "transition-all",
                    active
                      ? "opacity-100"
                      : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* TERMINATE */}
        <button
          onClick={onLogout}
          className="mt-auto flex items-center justify-center gap-3 px-6 py-5 rounded-2xl text-[10px] font-black uppercase italic text-rose-500 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20 group"
        >
          <LogOut
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />{" "}
          Disconnect_Session
        </button>
      </div>
    </aside>
  );
}
