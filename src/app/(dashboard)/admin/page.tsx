"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  ExternalLink,
  ShieldAlert,
  TableProperties,
  FileSearch,
  LayoutDashboard,
} from "lucide-react";
import ApprovalTab from "@/components/admin/ApprovalTab";
import ShadcnChartTab from "@/components/admin/ShadcnChartTab";

export default function SuperAdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const resolvedParams = React.use(searchParams);
  const activeSidebar = resolvedParams.view || "executive";

  return (
    <div className="p-8 space-y-8 bg-[#020617] min-h-screen text-white animate-in fade-in duration-700">
      {/* HEADER DINAMIS */}
      <div className="flex items-center gap-3 border-b border-slate-900 pb-8">
        <div className="p-2 bg-blue-600/10 rounded-lg border border-blue-500/20">
          <ShieldAlert className="text-blue-500 h-6 w-6" />
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">
          {activeSidebar === "executive"
            ? "Executive Analytics"
            : activeSidebar === "verification"
            ? "Approve Data Center"
            : "Global Data Archive"}
        </h1>
      </div>

      <div className="animate-in slide-in-from-bottom-2 duration-500">
        {/* 1. EXECUTIVE ANALYTICS (TAB ANALYTICS) */}
        {activeSidebar === "executive" && (
          <Tabs defaultValue="superset" className="w-full space-y-6">
            <TabsList className="bg-slate-900/80 border border-slate-800 p-1 h-auto backdrop-blur-md">
              <TabsTrigger
                value="superset"
                className="flex gap-2 italic font-black px-6 py-2.5 uppercase text-[10px] text-white/70 hover:text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              >
                <ExternalLink size={14} /> Apache Superset
              </TabsTrigger>
              <TabsTrigger
                value="shadcn"
                className="flex gap-2 italic font-black px-6 py-2.5 uppercase text-[10px] text-white/70 hover:text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              >
                <BarChart3 size={14} /> Shadcn Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="superset"
              className="mt-0 h-[700px] rounded-[2rem] overflow-hidden border-2 border-slate-900 shadow-2xl"
            >
              <iframe
                src="http://localhost:8088/superset/dashboard/p/VortexAnalytics"
                className="w-full h-full border-none opacity-90"
                title="Superset"
              />
            </TabsContent>

            <TabsContent value="shadcn" className="mt-0">
              <ShadcnChartTab />
            </TabsContent>
          </Tabs>
        )}

        {/* 2. APPROVE DATA CENTER */}
        {activeSidebar === "verification" && (
          <div className="animate-in fade-in duration-500">
            <ApprovalTab />
          </div>
        )}

        {/* 3. GLOBAL DATA ARCHIVE */}
        {activeSidebar === "archive" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl backdrop-blur-md">
              <div>
                <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter">
                  Master Data Archive
                </h2>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1 italic">
                  PT Netra Vidya Analitika — Medan Dataset
                </p>
              </div>
              <button className="bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all shadow-lg shadow-emerald-500/10">
                Export Excel
              </button>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-950 text-slate-500 uppercase font-black italic tracking-widest border-b border-slate-800">
                    <tr>
                      <th className="p-6">Retailer</th>
                      <th className="p-6">Region</th>
                      <th className="p-6 text-right">Total Sales</th>
                      <th className="p-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300 font-mono">
                    {/* Baris data hasil approve Ramayana Medan */}
                    <tr className="border-b border-slate-800/50 hover:bg-blue-600/5 transition-all">
                      <td className="p-6 font-bold text-white">Ramayana</td>
                      <td className="p-6 text-slate-400">Sumatera / Medan</td>
                      <td className="p-6 text-right font-black text-emerald-500 italic">
                        Rp 1.010.000.000
                      </td>
                      <td className="p-6 text-right">
                        <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg text-[9px] font-black border border-emerald-500/20 uppercase">
                          MASTERED
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* FOOTER ARCHIVE */}
            <div className="flex justify-center pt-4 opacity-30">
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.5em]">
                Central Repository Archive PT Netra Vidya Analitika
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
