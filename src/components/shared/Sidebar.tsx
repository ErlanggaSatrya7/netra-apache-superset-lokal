"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Cpu,
  Loader2,
  LayoutDashboard,
  Shield,
  Database,
  Settings,
  BarChart3,
  FileUp,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const [isExiting, setIsExiting] = useState(false);

  const handleLogout = async () => {
    setIsExiting(true);
    const loader = toast.loading("Terminating Session...");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        body: JSON.stringify({ action: "logout" }),
      });

      if (res.ok) {
        toast.success("Identity_Cleared", { id: loader });
        // FORCE RELOAD ke login untuk memastikan cache browser bersih
        window.location.href = "/login";
      }
    } catch (e) {
      toast.error("EXIT_LINK_FAILURE", { id: loader });
    } finally {
      setIsExiting(false);
    }
  };

  const isAdmin = pathname.includes("/admin");
  const links = isAdmin
    ? [
        { label: "War Room", path: "/admin", icon: LayoutDashboard },
        { label: "Audit", path: "/admin/approval", icon: Shield },
        { label: "Vault", path: "/admin/warehouse", icon: Database },
        { label: "Config", path: "/admin/settings", icon: Settings },
      ]
    : [
        { label: "Stats", path: "/staff", icon: BarChart3 },
        { label: "Ingest", path: "/staff/upload", icon: FileUp },
        { label: "Feed", path: "/staff/history", icon: History },
        { label: "Profile", path: "/staff/settings", icon: Settings },
      ];

  return (
    <div className="flex flex-col h-full py-8">
      <div className="px-6 mb-12 flex items-center gap-4 shrink-0">
        <div className="min-w-[45px] h-[45px] rounded-xl bg-primary flex items-center justify-center shadow-lg">
          <Cpu size={24} className="text-white" />
        </div>
        {isOpen && (
          <h1 className="text-xl font-black italic text-white truncate uppercase tracking-tighter">
            Netra Titan
          </h1>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-2 overflow-y-auto scrollbar-none">
        {links.map((link) => (
          <button
            key={link.path}
            onClick={() => (window.location.href = link.path)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group",
              pathname === link.path
                ? "bg-primary/10 text-primary shadow-inner border border-primary/20"
                : "hover:bg-white/5 text-slate-500"
            )}
          >
            <link.icon size={isOpen ? 20 : 24} />
            {isOpen && (
              <span className="text-[11px] font-black uppercase italic tracking-widest truncate">
                {link.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="px-3 mt-8 pt-8 border-t border-white/5 shrink-0">
        <button
          onClick={handleLogout}
          disabled={isExiting}
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-lg"
        >
          {isExiting ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <LogOut size={20} />
          )}
          {isOpen && (
            <span className="text-[11px] font-black uppercase italic tracking-widest truncate ml-2">
              Terminate
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
