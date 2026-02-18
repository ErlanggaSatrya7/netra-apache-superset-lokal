"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useNeuralSync } from "@/hooks/use-neural-sync";
import EchartNode from "@/components/titan-visuals/EchartNode";
import {
  Activity,
  Zap,
  LayoutDashboard,
  Upload,
  History,
  Menu,
  Maximize2,
  Cpu,
  ShieldCheck,
  Database,
  ArrowRight,
  Clock,
  LogOut,
  Radio,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function StaffTerminal() {
  const router = useRouter();
  const pathname = usePathname();
  const { intel, loading } = useNeuralSync();
  const [mounted, setMounted] = useState(false);
  const history = intel?.allHistory || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(
    () => ({
      total: history.length,
      rows: history.reduce((a: any, b: any) => a + (b.total_rows || 0), 0),
      pending: history.filter((h: any) => h.status === "PENDING").length,
      stable: history.filter((h: any) => h.status === "APPROVED").length,
    }),
    [history]
  );

  const velocityOption = useMemo(() => {
    if (!history || history.length === 0) return null;
    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        backgroundColor: "#020617",
        borderColor: "#fde047",
        textStyle: { color: "#fff", fontSize: 10, fontFamily: "monospace" },
      },
      grid: {
        left: "5%",
        right: "5%",
        bottom: "15%",
        top: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: history
          .slice(0, 7)
          .reverse()
          .map((h: any) => new Date(h.upload_date).toLocaleDateString()),
        axisLabel: {
          color: "#475569",
          fontSize: 9,
          fontWeight: "bold",
          rotate: 30,
        },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "#1e293b", type: "dashed" } },
        axisLabel: { color: "#475569", fontSize: 9 },
      },
      series: [
        {
          name: "Nodes",
          data: history
            .slice(0, 7)
            .reverse()
            .map((h: any) => h.total_rows),
          type: "line",
          smooth: true,
          symbolSize: 8,
          itemStyle: { color: "#fde047" },
          lineStyle: {
            width: 4,
            shadowBlur: 20,
            shadowColor: "rgba(253, 224, 71, 0.4)",
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(253, 224, 71, 0.1)" },
                { offset: 1, color: "transparent" },
              ],
            },
          },
        },
      ],
    };
  }, [history]);

  if (!mounted || loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#020617] text-primary animate-pulse font-black italic uppercase tracking-[0.5em]">
        SYNCING_TITANVX_CORE...
      </div>
    );

  const handleLogout = () => router.push("/login");

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans italic pt-24 lg:pt-10 p-4 lg:p-10 overflow-x-hidden text-left">
      {/* MOBILE NAV (FIXED 404 & LOGOUT) */}
      <div className="lg:hidden fixed top-0 left-0 w-full z-[100] p-4 bg-[#020617]/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2.5 text-primary bg-white/10 rounded-xl border border-white/20 active:scale-95 transition-all outline-none">
              <Menu size={22} />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-[#020617] border-r border-white/10 text-slate-300 p-0 focus-visible:outline-none flex flex-col h-full"
          >
            <div className="sr-only">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>TitanVX Intelligence Hub</SheetDescription>
            </div>
            <div className="p-8 border-b border-white/5 flex items-center gap-3">
              <Zap className="text-primary" fill="currentColor" size={24} />
              <span className="font-black italic text-2xl uppercase text-white tracking-tighter leading-none">
                Titan_<span className="text-primary">VX</span>
              </span>
            </div>
            <nav className="p-4 space-y-2 font-black uppercase italic text-[10px] tracking-widest text-left flex-1 leading-none">
              <button
                onClick={() => router.push("/staff")}
                className={cn(
                  "flex items-center gap-4 w-full p-5 rounded-2xl transition-all leading-none",
                  pathname === "/staff"
                    ? "bg-primary text-black shadow-lg shadow-primary/20"
                    : "text-slate-500 hover:bg-white/5"
                )}
              >
                <LayoutDashboard size={18} /> Dashboard
              </button>
              <button
                onClick={() => router.push("/staff/upload")}
                className="flex items-center gap-4 w-full p-5 rounded-2xl hover:bg-white/5 text-slate-500 transition-all leading-none"
              >
                <Upload size={18} /> Upload_Data
              </button>
              <button
                onClick={() => router.push("/staff/history")}
                className="flex items-center gap-4 w-full p-5 rounded-2xl hover:bg-white/5 text-slate-500 transition-all leading-none"
              >
                <History size={18} /> History_Logs
              </button>
            </nav>
            <div className="p-6 border-t border-white/5">
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 w-full p-5 rounded-2xl bg-rose-500/10 text-rose-500 font-black uppercase italic text-[10px] tracking-widest hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 leading-none"
              >
                <LogOut size={18} /> Terminate_Session
              </button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="font-black uppercase italic text-white text-lg leading-none">
          Titan<span className="text-primary">VX</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto space-y-12">
        {/* HEADER SECTION */}
        <div className="space-y-2 border-b border-white/10 pb-10 text-left">
          <h1 className="text-5xl lg:text-8xl font-black italic uppercase text-white tracking-tighter leading-none">
            Staff_<span className="text-primary">Console</span>
          </h1>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none flex items-center gap-2">
            <Radio size={12} className="text-primary animate-pulse" />{" "}
            Neural_Sync_Established: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* 1. STATUS NEXUS HUD */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
          <KPIBox label="Total Batch" val={stats.total} color="text-white" />
          <KPIBox
            label="Total Nodes"
            val={stats.rows.toLocaleString()}
            color="text-primary"
          />
          <KPIBox label="Pending" val={stats.pending} color="text-amber-500" />
          <KPIBox label="Stable" val={stats.stable} color="text-emerald-400" />
          <KPIBox label="Sync Rate" val="99.9%" color="text-indigo-400" />
          <KPIBox label="Engine" val="V.17" color="text-slate-500" />
          <KPIBox label="Access" val="STAFF" color="text-rose-400" />
          <KPIBox label="Status" val="LIVE" color="text-emerald-500" />
        </div>

        {/* 2. INDUSTRIAL GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* CHART NODE */}
          <div className="xl:col-span-8 bg-black/40 border border-white/5 rounded-[3rem] lg:rounded-[4rem] flex flex-col shadow-2xl overflow-hidden backdrop-blur-md min-h-[500px] lg:min-h-[650px] group transition-all">
            <div className="p-10 lg:p-14 pb-0 flex justify-between items-start text-left">
              <div className="flex gap-6 items-center">
                <div className="p-4 bg-primary/10 rounded-2xl text-primary border border-primary/20 shrink-0">
                  <Activity size={28} />
                </div>
                <div>
                  <h2 className="text-2xl lg:text-4xl font-black uppercase text-white tracking-[0.2em] italic leading-none">
                    Velocity
                  </h2>
                  <p className="text-[10px] font-bold text-slate-700 uppercase mt-2 tracking-[0.4em] leading-none italic">
                    Metric: Data_Ingestion_Flow
                  </p>
                </div>
              </div>
              <Maximize2 size={20} className="text-slate-800 hidden sm:block" />
            </div>

            <div className="flex-1 w-full p-6 lg:p-10 pt-0 relative overflow-hidden">
              {velocityOption ? (
                <EchartNode option={velocityOption} />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-800 font-black italic uppercase tracking-[0.5em] text-xs">
                  Waiting_For_Stream...
                </div>
              )}
            </div>
          </div>

          {/* RECENT LOGS NODE */}
          <div className="xl:col-span-4 bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 rounded-[3rem] lg:rounded-[4rem] p-10 lg:p-14 flex flex-col shadow-2xl relative overflow-hidden min-h-[550px] lg:min-h-[650px]">
            <div className="flex items-center gap-4 mb-10 border-l-4 border-primary pl-6 text-left">
              <h2 className="text-xl lg:text-2xl font-black uppercase text-white tracking-[0.2em] italic leading-none uppercase">
                Recent_Logs
              </h2>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto custom-scrollbar pr-2">
              {history.slice(0, 6).map((h: any, i: number) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/5 p-6 rounded-[2rem] group hover:bg-primary/10 transition-all cursor-pointer text-left shadow-inner"
                  onClick={() => router.push(`/staff/history/${h.id_upload}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1">
                      <p className="text-white font-black text-sm uppercase italic tracking-tighter leading-none truncate w-40">
                        {h.file_name}
                      </p>
                      <span className="text-[9px] font-mono text-slate-600">
                        #TX-{h.id_upload}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest leading-none",
                        h.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/5 shadow-inner"
                      )}
                    >
                      {h.status}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase italic tracking-widest text-slate-500">
                    <span className="flex items-center gap-2">
                      <Clock size={12} className="text-primary" />{" "}
                      {new Date(h.upload_date).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-white font-mono">
                      {h.total_rows} NODES
                    </span>
                  </div>
                </div>
              ))}
              <button
                onClick={() => router.push("/staff/history")}
                className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase italic text-slate-500 hover:text-primary hover:bg-primary/5 hover:border-primary transition-all flex items-center justify-center gap-3"
              >
                View_Full_Archives <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// KPI COMPONENT (UPGRADED CONTRAST)
function KPIBox({ label, val, color }: any) {
  return (
    <div className="bg-[#0b1120]/60 border border-white/10 p-6 lg:p-8 rounded-[2rem] text-center shadow-2xl group hover:border-primary/40 transition-all flex flex-col justify-center backdrop-blur-md">
      <p className="text-[9px] font-black text-slate-600 uppercase italic tracking-widest mb-3 leading-none">
        {label}
      </p>
      <h3
        className={cn(
          "text-xl lg:text-3xl font-black italic tracking-tighter leading-none whitespace-nowrap",
          color
        )}
      >
        {val}
      </h3>
    </div>
  );
}
