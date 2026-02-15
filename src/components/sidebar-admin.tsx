"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileCheck,
  Users,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Pastikan shadcn utility ini ada

const adminMenus = [
  {
    title: "Executive Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/admin",
  },
  {
    title: "Approval Queue",
    icon: <FileCheck className="h-5 w-5" />,
    href: "/admin/approval",
  },
  {
    title: "Staff Management",
    icon: <Users className="h-5 w-5" />,
    href: "/admin/staff-management",
  },
];

export default function SidebarAdmin() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-[#020617] border-r border-slate-800 w-64 p-6 space-y-8">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-2">
        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
          <span className="text-white font-black italic">DV</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-black uppercase tracking-tighter text-xl">
            DataVortex
          </span>
          <span className="text-[10px] bg-rose-500/10 text-rose-500 font-black px-2 py-0.5 rounded-full w-fit uppercase tracking-widest border border-rose-500/20">
            Director Mode
          </span>
        </div>
      </div>

      {/* Navigation Menus */}
      <nav className="flex-1 space-y-2">
        {adminMenus.map((menu) => {
          const isActive = pathname === menu.href;
          return (
            <Link key={menu.href} href={menu.href}>
              <div
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl transition-all duration-300 group",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "transition-colors",
                      isActive
                        ? "text-white"
                        : "text-slate-500 group-hover:text-blue-400"
                    )}
                  >
                    {menu.icon}
                  </div>
                  <span className="font-bold text-sm tracking-tight">
                    {menu.title}
                  </span>
                </div>
                {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-slate-800 space-y-2">
        <Link href="/admin/settings">
          <div className="flex items-center gap-3 p-3 text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all group">
            <Settings className="h-5 w-5 group-hover:rotate-45 transition-transform" />
            <span className="font-bold text-sm">Settings</span>
          </div>
        </Link>
        <button className="w-full flex items-center gap-3 p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all group">
          <LogOut className="h-5 w-5" />
          <span className="font-bold text-sm text-left">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
