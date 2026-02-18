"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  ShieldCheck,
  FileUp,
  History,
  LogOut,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Ambil role hanya di Client side
    const userRole = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_role="))
      ?.split("=")[1];
    setRole(userRole || "STAFF");
    setMounted(true);
  }, []);

  // Cegah render apapun sebelum mounted untuk menghindari Hydration Error
  if (!mounted) return <div className="w-[300px] bg-[#0f172a]" />;

  const menu =
    role === "ADMIN"
      ? [
          { name: "War Room", path: "/admin", icon: LayoutDashboard },
          { name: "Inbound Audit", path: "/admin/approval", icon: ShieldCheck },
          { name: "Central Vault", path: "/admin/warehouse", icon: Database },
        ]
      : [
          { name: "Analytics", path: "/staff", icon: LayoutDashboard },
          { name: "Ingestion", path: "/staff/upload", icon: FileUp },
          { name: "History", path: "/staff/history", icon: History },
        ];

  const handleLogout = () => {
    document.cookie = "user_role=; Max-Age=0; path=/;";
    document.cookie = "user_email=; Max-Age=0; path=/;";
    window.location.href = "/login";
  };

  return (
    <div className="h-full flex flex-col p-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 px-4 mb-12">
        <Zap className="text-primary fill-primary" size={28} />
        {isOpen && (
          <span className="text-xl font-black italic tracking-tighter text-white uppercase">
            Vortex
            <span className="text-primary font-sans lowercase">.netra</span>
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-2">
        {menu.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group",
                isActive
                  ? "bg-primary text-black font-black shadow-lg shadow-primary/20"
                  : "text-slate-500 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon
                size={20}
                className={cn(
                  isActive ? "text-black" : "group-hover:text-primary"
                )}
              />
              {isOpen && (
                <span className="text-[10px] uppercase tracking-[0.2em] font-black">
                  {item.name}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-4 px-4 py-4 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all mt-auto border border-transparent hover:border-rose-500/20"
      >
        <LogOut size={20} />
        {isOpen && (
          <span className="text-[10px] uppercase tracking-[0.2em] font-black italic">
            Terminate_Session
          </span>
        )}
      </button>
    </div>
  );
}
