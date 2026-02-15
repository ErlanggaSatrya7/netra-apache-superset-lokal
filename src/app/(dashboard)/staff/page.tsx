"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Database,
  Zap,
  Activity,
  BarChart3,
  Layers,
  Monitor,
  Cpu,
  ShieldCheck,
  RefreshCcw,
  ArrowUpRight,
  TrendingUp,
  History,
  UserCheck,
  ChevronRight,
  Box,
  Terminal,
  Server,
  ArrowRight,
} from "lucide-react"; // FIX: Import ChevronRight here
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdidasStaffTerminal() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sysPulse, setSysPulse] = useState(98);

  const syncTerminal = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/staff");
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("CONNECTION_ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncTerminal();
  }, []);

  const stats = useMemo(
    () => ({
      pending: logs.filter((l) => l.status === "PENDING").length,
      approved: logs.filter((l) => l.status === "APPROVED").length,
      rejected: logs.filter((l) => l.status === "REJECTED").length,
      totalRows: logs.reduce((acc, curr) => acc + (curr.total_rows || 0), 0),
    }),
    [logs]
  );

  return (
    <div className="flex flex-col space-y-12 pb-24 animate-in fade-in duration-700">
      {/* HEADER TERMINAL */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12 relative">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
              <Activity className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">
                Ingestion Port Active
              </span>
            </div>
            <div className="px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-slate-500 font-bold text-[9px]">
              SIGNAL_STABLE: {sysPulse}%
            </div>
          </div>
          <h1 className="text-[5.5rem] font-black italic tracking-tighter text-white uppercase leading-[0.8] mb-4">
            Adidas{" "}
            <span className="text-primary font-sans lowercase tracking-normal">
              Terminal
            </span>
          </h1>
          <p className="text-[12px] text-slate-500 font-bold uppercase tracking-[0.5em] italic">
            Operator Node | Adidas Global Datastream v2.0
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={syncTerminal}
            variant="outline"
            className="h-16 w-16 rounded-2xl border-white/10 bg-[#0f172a] shadow-xl hover:bg-white/5 transition-all group"
          >
            <RefreshCcw
              className={cn(
                "w-6 h-6 text-primary transition-all group-hover:rotate-180",
                loading && "animate-spin"
              )}
            />
          </Button>
          <Button className="h-16 px-10 bg-primary hover:bg-blue-600 text-white rounded-2xl font-black uppercase italic text-xs tracking-widest group shadow-2xl shadow-primary/30">
            New Batch Sync{" "}
            <ChevronRight className="ml-3 group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>
      </div>

      {/* KPI STATUS HUB */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            label: "Awaiting Audit",
            val: stats.pending,
            icon: Clock,
            color: "text-amber-400",
            sub: "Neural Handshake",
          },
          {
            label: "Neural Published",
            val: stats.approved,
            icon: ShieldCheck,
            color: "text-emerald-400",
            sub: "Master Ingested",
          },
          {
            label: "Rejected Protocols",
            val: stats.rejected,
            icon: AlertCircle,
            color: "text-rose-500",
            sub: "Revision Node",
          },
          {
            label: "Total Inflow",
            val: stats.totalRows.toLocaleString(),
            icon: Layers,
            color: "text-primary",
            sub: "Record Units",
          },
        ].map((k, i) => (
          <Card
            key={i}
            className="bg-[#0f172a] border-white/5 shadow-2xl rounded-[3rem] overflow-hidden group hover:border-primary/50 transition-all relative"
          >
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 group-hover:scale-150 transition-all duration-1000">
              <k.icon size={120} />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-4">
                {k.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <h3
                className={cn(
                  "text-[4.5rem] font-black italic tracking-tighter leading-none",
                  k.color
                )}
              >
                {k.val}
              </h3>
              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic">
                  {k.sub}
                </p>
                <ArrowUpRight size={14} className={k.color} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DATA FLOW MONITOR */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <Card className="xl:col-span-1 bg-gradient-to-br from-[#0f172a] to-[#020617] border-white/5 shadow-2xl rounded-[3.5rem] p-12 space-y-12">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 bg-primary/10 rounded-[1.8rem] flex items-center justify-center border border-primary/20">
              <Database className="text-primary w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter">
                Core Status
              </h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase">
                Operational Master Node
              </p>
            </div>
          </div>
          <div className="space-y-8">
            {[
              { l: "Neural Stream", v: 100, c: "bg-emerald-500" },
              { l: "Data Buffer", v: 45, c: "bg-primary" },
              { l: "System Latency", v: 12, c: "bg-rose-500" },
            ].map((b, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase italic text-slate-400">
                  <span>{b.l}</span>
                  <span>{b.v}%</span>
                </div>
                <Progress value={b.v} className="h-1 bg-white/5" />
              </div>
            ))}
          </div>
          <div className="pt-10 border-t border-white/5 bg-black/30 p-8 rounded-[2rem] border border-dashed border-white/5 font-mono text-[10px] space-y-4">
            <div className="flex items-center gap-3 text-emerald-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />{" "}
              LINK_ESTABLISHED
            </div>
            <p className="text-slate-600 leading-relaxed uppercase italic">
              Establishing handshake with global adidas ingest ports...
              Protocol: VORTEX_SECURE_V2
            </p>
          </div>
        </Card>

        <Card className="xl:col-span-2 bg-[#0f172a] border-white/5 shadow-2xl rounded-[3.5rem] overflow-hidden border-l-4 border-l-primary flex flex-col">
          <CardHeader className="p-12 border-b border-white/5 bg-black/20 flex flex-row items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-black italic uppercase text-white tracking-tighter flex items-center gap-4">
                Ingestion Logs <History size={20} className="text-primary" />
              </CardTitle>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">
                Historical trace of neural data sync
              </p>
            </div>
            <Button
              variant="ghost"
              className="text-[10px] font-black uppercase text-slate-500 hover:text-white"
            >
              View Full Archive
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/40 text-[10px] font-black uppercase text-slate-500 italic tracking-[0.2em]">
                <tr>
                  <th className="px-12 py-8">Batch Protocol</th>
                  <th>Dataset Info</th>
                  <th className="text-center">Nodes</th>
                  <th className="px-12 text-right">Handshake</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[11px] font-bold uppercase text-slate-400">
                {logs.map((l, i) => (
                  <tr
                    key={i}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-12 py-8 font-mono text-slate-600 group-hover:text-primary transition-colors">
                      {l.system_name}
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-black italic text-white tracking-tight">
                          {l.file_name}
                        </span>
                        <span className="text-[9px] font-bold text-slate-700 tracking-widest italic">
                          {new Date(l.upload_date).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="text-center font-mono text-xs">
                      {l.total_rows.toLocaleString()} pts
                    </td>
                    <td className="px-12 text-right">
                      <span
                        className={cn(
                          "px-4 py-2 rounded-xl text-[9px] font-black italic tracking-tighter border",
                          l.status === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : l.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
                            : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        )}
                      >
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* FOOTER PERSISTENT OVERLAY */}
      <div className="fixed bottom-10 right-10 hidden xl:block z-50">
        <div className="bg-[#020617]/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 flex items-center gap-10 shadow-2xl ring-1 ring-white/10 group transition-all hover:scale-105">
          <div className="flex flex-col gap-2 pr-10 border-r border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)] animate-ping" />
              <p className="text-[12px] font-black uppercase text-white italic tracking-[0.2em] leading-none">
                System_Online
              </p>
            </div>
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic leading-none ml-7">
              Operator_Auth: ST_NODE_01
            </p>
          </div>
          <div className="flex items-center gap-10">
            {[
              { icon: Cpu, label: "Core_Load", val: "14%" },
              { icon: Server, label: "Port", val: "AES_256" },
            ].map((m, i) => (
              <div key={i} className="flex flex-col gap-2">
                <p className="text-[9px] font-black uppercase text-slate-700 tracking-widest flex items-center gap-2 italic">
                  <m.icon size={12} className="text-primary/60" /> {m.label}
                </p>
                <p className="text-xs font-mono text-slate-200 font-black italic">
                  {m.val}
                </p>
              </div>
            ))}
            <Activity
              size={32}
              className="text-primary/40 animate-pulse ml-4 group-hover:text-primary transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
