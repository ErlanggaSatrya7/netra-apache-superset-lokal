"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UploadCloud,
  Database,
  UserCheck,
  Settings,
  LogOut,
  Zap,
  BarChart3,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminArea = pathname.startsWith("/admin");
  const settingsHref = isAdminArea ? "/admin/settings" : "/staff/settings";

  const staffMenus = [
    { name: "My Dashboard", href: "/staff", icon: LayoutDashboard },
    { name: "Upload Adidas", href: "/staff/upload", icon: UploadCloud },
    { name: "History Upload", href: "/staff/history", icon: Database },
  ];

  const adminMenus = [
    { name: "Executive Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Approval Queue", href: "/admin/approval", icon: UserCheck },
    { name: "Staff Management", href: "/admin/management", icon: Users },
  ];

  const activeMenus = isAdminArea ? adminMenus : staffMenus;

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      {/* SIDEBAR - Menggunakan bg-slate-950 solid agar tidak tembus */}
      <aside className="w-72 border-r border-slate-800 bg-slate-950 fixed h-full z-[100] flex flex-col shadow-2xl">
        <div className="p-8 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Zap className="text-white fill-white h-6 w-6" />
          </div>
          <span className="text-xl font-black text-white italic tracking-tighter">
            DATAVORTEX
          </span>
        </div>

        <div className="px-6 mb-6">
          <div
            className={cn(
              "text-[10px] font-black uppercase tracking-[3px] px-3 py-1.5 rounded-lg border w-fit",
              isAdminArea
                ? "text-red-400 border-red-500/20 bg-red-500/10"
                : "text-blue-400 border-blue-500/20 bg-blue-500/10"
            )}
          >
            {isAdminArea ? "Director Mode" : "Staff Mode"}
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {activeMenus.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                pathname === item.href
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  pathname === item.href
                    ? "text-white"
                    : "group-hover:text-blue-400"
                )}
              />
              <span className="font-bold text-sm tracking-tight">
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-900 bg-slate-950/50 space-y-1">
          <Link
            href={settingsHref}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
              pathname === settingsHref
                ? "bg-slate-900 text-white"
                : "text-slate-400 hover:bg-slate-900"
            )}
          >
            <Settings className="h-5 w-5" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT - Margin left harus sama dengan lebar sidebar (w-72 = ml-72) */}
      <main className="flex-1 ml-72 min-h-screen relative z-10">
        <div className="p-10 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

// // versi baru

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   LayoutDashboard,
//   UploadCloud,
//   Database,
//   UserCheck,
//   Settings,
//   LogOut,
//   Zap,
//   BarChart3,
//   Users,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const isAdminArea = pathname.startsWith("/admin");
//   const settingsHref = isAdminArea ? "/admin/settings" : "/staff/settings";

//   const staffMenus = [
//     { name: "My Dashboard", href: "/staff", icon: LayoutDashboard },
//     { name: "Upload Adidas", href: "/staff/upload", icon: UploadCloud },
//     { name: "History Upload", href: "/staff/history", icon: Database },
//   ];

//   const adminMenus = [
//     { name: "Executive Dashboard", href: "/admin", icon: BarChart3 },
//     { name: "Approval Queue", href: "/admin/approval", icon: UserCheck },
//     { name: "Staff Management", href: "/admin/management", icon: Users },
//   ];

//   const activeMenus = isAdminArea ? adminMenus : staffMenus;

//   return (
//     <div className="flex min-h-screen bg-[#020617] text-slate-200">
//       {/* SIDEBAR - Menggunakan bg-slate-950 solid agar tidak tembus */}
//       <aside className="w-72 border-r border-slate-800 bg-slate-950 fixed h-full z-[100] flex flex-col shadow-2xl">
//         <div className="p-8 flex items-center gap-3">
//           <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
//             <Zap className="text-white fill-white h-6 w-6" />
//           </div>
//           <span className="text-xl font-black text-white italic tracking-tighter">
//             DATAVORTEX
//           </span>
//         </div>

//         <div className="px-6 mb-6">
//           <div
//             className={cn(
//               "text-[10px] font-black uppercase tracking-[3px] px-3 py-1.5 rounded-lg border w-fit",
//               isAdminArea
//                 ? "text-red-400 border-red-500/20 bg-red-500/10"
//                 : "text-blue-400 border-blue-500/20 bg-blue-500/10"
//             )}
//           >
//             {isAdminArea ? "Director Mode" : "Staff Mode"}
//           </div>
//         </div>

//         <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
//           {activeMenus.map((item) => (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={cn(
//                 "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
//                 pathname === item.href
//                   ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
//                   : "text-slate-400 hover:bg-slate-900 hover:text-white"
//               )}
//             >
//               <item.icon
//                 className={cn(
//                   "h-5 w-5",
//                   pathname === item.href
//                     ? "text-white"
//                     : "group-hover:text-blue-400"
//                 )}
//               />
//               <span className="font-bold text-sm tracking-tight">
//                 {item.name}
//               </span>
//             </Link>
//           ))}
//         </nav>

//         <div className="p-4 border-t border-slate-900 bg-slate-950/50 space-y-1">
//           <Link
//             href={settingsHref}
//             className={cn(
//               "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
//               pathname === settingsHref
//                 ? "bg-slate-900 text-white"
//                 : "text-slate-400 hover:bg-slate-900"
//             )}
//           >
//             <Settings className="h-5 w-5" />
//             <span className="text-sm font-medium">Settings</span>
//           </Link>
//           <Link
//             href="/login"
//             className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-colors"
//           >
//             <LogOut className="h-5 w-5" />
//             <span className="text-sm font-medium">Sign Out</span>
//           </Link>
//         </div>
//       </aside>

//       {/* MAIN CONTENT - Margin left harus sama dengan lebar sidebar (w-72 = ml-72) */}
//       <main className="flex-1 ml-72 min-h-screen relative z-10">
//         <div className="p-10 max-w-7xl mx-auto">{children}</div>
//       </main>
//     </div>
//   );
// }

// // layout.tsx
// "use client";

// import {
//   SidebarProvider,
//   SidebarInset,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/ui/app-sidebar";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen w-full bg-[#0a0a0a]">
//         {/* Role dikirim secara dinamis dari sesi user */}
//         <AppSidebar role="admin" />
//         <SidebarInset className="bg-[#0a0a0a] text-white border-none">
//           <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-800 px-4">
//             <SidebarTrigger className="text-blue-500" />
//             <div className="h-4 w-[1px] bg-slate-800 mx-2" />
//             <span className="text-xs font-bold uppercase tracking-widest text-slate-500 italic">
//               DataVortex Engine v2.0
//             </span>
//           </header>
//           <div className="flex flex-1 flex-col gap-4 p-6">{children}</div>
//         </SidebarInset>
//       </div>
//     </SidebarProvider>
//   );
// }

// versi lama

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   LayoutDashboard,
//   UploadCloud,
//   Database,
//   UserCheck,
//   Settings,
//   LogOut,
//   Zap,
//   BarChart3,
//   Users,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const isAdminArea = pathname.startsWith("/admin");
//   const settingsHref = isAdminArea ? "/admin/settings" : "/staff/settings";

//   const staffMenus = [
//     { name: "My Dashboard", href: "/staff", icon: LayoutDashboard },
//     { name: "Upload Adidas", href: "/staff/upload", icon: UploadCloud },
//     { name: "History Upload", href: "/staff/history", icon: Database },
//   ];

//   const adminMenus = [
//     { name: "Executive Dashboard", href: "/admin", icon: BarChart3 },
//     { name: "Approval Queue", href: "/admin/approval", icon: UserCheck },
//     { name: "Staff Management", href: "/admin/management", icon: Users },
//   ];

//   const activeMenus = isAdminArea ? adminMenus : staffMenus;

//   return (
//     <div className="flex min-h-screen bg-[#020617] text-slate-200">
//       {/* SIDEBAR - Fixed & Solid Background */}
//       <aside className="w-72 border-r border-slate-800 bg-slate-950 fixed h-full z-[60] flex flex-col shadow-2xl">
//         <div className="p-8 flex items-center gap-3">
//           <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
//             <Zap className="text-white fill-white h-6 w-6" />
//           </div>
//           <span className="text-xl font-black text-white italic tracking-tighter">
//             DATAVORTEX
//           </span>
//         </div>

//         <div className="px-6 mb-6">
//           <div
//             className={cn(
//               "text-[10px] font-black uppercase tracking-[3px] px-3 py-1.5 rounded-lg border w-fit",
//               isAdminArea
//                 ? "text-red-400 border-red-500/20 bg-red-500/10"
//                 : "text-blue-400 border-blue-500/20 bg-blue-500/10"
//             )}
//           >
//             {isAdminArea ? "Director Mode" : "Staff Mode"}
//           </div>
//         </div>

//         <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
//           {activeMenus.map((item) => (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={cn(
//                 "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
//                 pathname === item.href
//                   ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
//                   : "text-slate-400 hover:bg-slate-900 hover:text-white"
//               )}
//             >
//               <item.icon
//                 className={cn(
//                   "h-5 w-5",
//                   pathname === item.href
//                     ? "text-white"
//                     : "group-hover:text-blue-400"
//                 )}
//               />
//               <span className="font-bold text-sm tracking-tight">
//                 {item.name}
//               </span>
//             </Link>
//           ))}
//         </nav>

//         <div className="p-4 border-t border-slate-900 bg-slate-950/50 space-y-1">
//           <Link
//             href={settingsHref}
//             className={cn(
//               "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
//               pathname === settingsHref
//                 ? "bg-slate-900 text-white"
//                 : "text-slate-400 hover:bg-slate-900"
//             )}
//           >
//             <Settings className="h-5 w-5" />
//             <span className="text-sm font-medium">Settings</span>
//           </Link>
//           <Link
//             href="/login"
//             className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-colors"
//           >
//             <LogOut className="h-5 w-5" />
//             <span className="text-sm font-medium">Sign Out</span>
//           </Link>
//         </div>
//       </aside>

//       {/* MAIN CONTENT - Added margin to prevent overlap */}
//       <main className="flex-1 ml-72 min-h-screen relative z-10">
//         <div className="p-10 max-w-7xl mx-auto">{children}</div>
//       </main>
//     </div>
//   );
// }
