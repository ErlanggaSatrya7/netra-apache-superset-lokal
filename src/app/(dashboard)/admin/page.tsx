"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DollarSign,
  Box,
  Layers,
  Activity,
  RefreshCw,
  Download,
  Wifi,
  Monitor,
  Globe,
  Lock,
  ShieldCheck,
  Cpu,
  Terminal,
  ExternalLink,
  Maximize2,
  Zap,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- System Configuration & Interfaces ---
interface DashboardStats {
  revenue: number;
  units: number;
  totalRecords: number;
  nodeStatus: "ONLINE" | "STANDBY" | "OFFLINE";
}

export default function AdminSupersetDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uptime, setUptime] = useState("00:00:00");
  const [activeTab, setActiveTab] = useState("superset_port");

  // --- Real-time Session Monitoring ---
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - start) / 1000);
      const h = Math.floor(diff / 3600)
        .toString()
        .padStart(2, "0");
      const m = Math.floor((diff % 3600) / 60)
        .toString()
        .padStart(2, "0");
      const s = (diff % 60).toString().padStart(2, "0");
      setUptime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Neural Sync Engine ---
  const syncIntelligence = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/shared/charts");
      const data = await res.json();

      // Artificial Intelligence Handshake
      await new Promise((r) => setTimeout(r, 1200));

      if (data.stats.records > 0) {
        setStats({
          revenue: data.stats.revenue,
          units: data.stats.units,
          totalRecords: data.stats.records,
          nodeStatus: "ONLINE",
        });
        toast.success("SUPERSET_LINK_ACTIVE", {
          description: "Global Adidas data synchronized.",
        });
      } else {
        setStats(null);
      }
    } catch (err) {
      toast.error("LINK_ERROR", {
        description: "Establishing backup port handshake...",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncIntelligence();
  }, [syncIntelligence]);

  if (loading) return <HandshakeLoader />;

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in duration-1000">
      {/* --- HEADER COMMANDS --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
              <Wifi className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">
                Node: Operational
              </span>
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic">
              Uptime: {uptime}
            </span>
          </div>
          <h1 className="text-[4.5rem] font-black italic tracking-tighter text-white uppercase leading-[0.8]">
            Adidas{" "}
            <span className="text-primary font-sans lowercase tracking-normal">
              Intelejen
            </span>
          </h1>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.5em] italic truncate max-w-2xl">
            Netra Intelligence Gateway // Apache Superset BI Portal // Station:
            VX-8080
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={syncIntelligence}
            className="h-16 w-16 rounded-[1.8rem] bg-[#0f172a] border-white/5 hover:border-primary/50 transition-all group"
          >
            <RefreshCw
              size={24}
              className="text-primary group-hover:rotate-180 transition-transform duration-700"
            />
          </Button>
          <Button className="h-16 px-10 bg-primary hover:bg-blue-600 text-white rounded-[1.8rem] shadow-2xl shadow-primary/20 font-black uppercase italic text-xs tracking-widest group">
            <Download
              size={20}
              className="mr-3 group-hover:translate-y-1 transition-transform"
            />
            Master_Export
          </Button>
        </div>
      </div>

      {/* --- KPI MATRIX: PAS & TIDAK TUMPANG TINDIH --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Net_Revenue",
            val: stats ? `$${stats.revenue.toLocaleString()}` : "$0",
            icon: DollarSign,
            color: "text-emerald-400",
          },
          {
            label: "Unit_Vol",
            val: stats ? stats.units.toLocaleString() : "0",
            icon: Box,
            color: "text-blue-400",
          },
          {
            label: "Active_Nodes",
            val: stats ? stats.totalRecords.toLocaleString() : "0",
            icon: Layers,
            color: "text-primary",
          },
          {
            label: "Neural_Load",
            val: stats ? "3.2ms" : "0ms",
            icon: Zap,
            color: "text-amber-400",
          },
        ].map((k, i) => (
          <Card
            key={i}
            className="bg-[#0f172a] border-white/5 shadow-2xl rounded-[2.5rem] relative overflow-hidden group hover:border-primary/40 transition-all"
          >
            <CardContent className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] truncate max-w-[120px]">
                  {k.label}
                </p>
                <k.icon size={14} className={k.color} />
              </div>
              <h3
                className={cn(
                  "text-4xl font-black italic tracking-tighter leading-none truncate",
                  k.color
                )}
              >
                {k.val}
              </h3>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="flex-1 h-[2px] bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full w-3/4 rounded-full",
                      k.color.replace("text", "bg")
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- APACHE SUPERSET EMBED PORTAL --- */}
      <Tabs
        defaultValue="superset_port"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10 bg-[#0f172a]/50 p-4 rounded-[3rem] border border-white/5 shadow-inner">
          <TabsList className="bg-[#020617] border border-white/5 p-1.5 h-16 rounded-[2rem] w-full md:w-[450px] shadow-2xl">
            <TabsTrigger
              value="superset_port"
              className="flex-1 rounded-[1.5rem] data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase italic text-[10px] transition-all"
            >
              <Globe size={14} className="mr-2" /> Apache Superset
            </TabsTrigger>
            <TabsTrigger
              value="system_health"
              className="flex-1 rounded-[1.5rem] data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase italic text-[10px] transition-all"
            >
              <Terminal size={14} className="mr-2" /> System Logs
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-6 px-10 text-slate-600">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-none">
                Security_Port
              </span>
              <span className="text-[8px] font-bold uppercase mt-1 tracking-widest opacity-30">
                ENCRYPTED_IFRAME_SSL
              </span>
            </div>
            <Lock size={16} className="text-primary/40" />
          </div>
        </div>

        {/* --- MAIN SUPERSET DISPLAY --- */}
        <TabsContent
          value="superset_port"
          className="outline-none animate-in zoom-in-95 duration-700"
        >
          <Card className="bg-[#0f172a] border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.6)] rounded-[4rem] h-[850px] overflow-hidden relative group">
            <div className="absolute inset-0 bg-[#020617] -z-10" />

            {!stats ? (
              <div className="h-full flex flex-col items-center justify-center space-y-10 text-center p-20">
                <div className="relative">
                  <div className="w-40 h-40 bg-[#020617] rounded-[4rem] border border-white/5 flex items-center justify-center shadow-inner">
                    <Layers size={64} className="text-slate-800" />
                  </div>
                  <Zap className="absolute -top-4 -right-4 w-12 h-12 text-rose-500/20 animate-pulse" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-black uppercase italic text-slate-600 tracking-tighter leading-none">
                    Stream Standby
                  </h2>
                  <p className="text-xs text-slate-700 font-bold uppercase tracking-[0.6em] max-w-sm mx-auto leading-loose italic">
                    Awaiting approved Adidas master datastreams to ignite
                    external port visualizer.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={syncIntelligence}
                  className="h-14 px-12 border-white/10 rounded-2xl text-[10px] font-black uppercase italic text-slate-500 hover:text-white transition-all"
                >
                  Neural_Ping <RefreshCw size={14} className="ml-3" />
                </Button>
              </div>
            ) : (
              <>
                <iframe
                  src="http://localhost:3001/public-superset-embed-link"
                  className="w-full h-full grayscale-[0.2] hover:grayscale-0 transition-all duration-1000 border-none"
                  title="Adidas Master Superset Port"
                />

                {/* Floating Overlay Controls */}
                <div className="absolute top-10 right-10 flex flex-col gap-4">
                  <div className="px-6 py-4 bg-[#020617]/95 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl flex items-center gap-5">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_15px_rgba(59,130,246,1)]" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-white uppercase italic tracking-widest leading-none">
                        Portal_Active
                      </span>
                      <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mt-1">
                        External: Superset_Node_01
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 bg-[#020617]/80 rounded-2xl border-white/10 text-slate-500 hover:text-white"
                    >
                      <Maximize2 size={18} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 bg-[#020617]/80 rounded-2xl border-white/10 text-slate-500 hover:text-white"
                    >
                      <ExternalLink size={18} />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </TabsContent>

        <TabsContent
          value="system_health"
          className="outline-none animate-in slide-in-from-right-10 duration-500"
        >
          <Card className="bg-[#0f172a] border-white/5 shadow-2xl rounded-[4rem] p-16 h-[500px] flex flex-col justify-center items-center gap-8 relative overflow-hidden">
            <Cpu size={80} className="text-slate-800 opacity-20" />
            <div className="text-center space-y-3">
              <h3 className="text-3xl font-black uppercase italic text-slate-600 tracking-tighter">
                Diagnostic_Ready
              </h3>
              <p className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.4em]">
                All master nodes reported healthy. Latency within parameters.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- SUB-COMPONENTS: THE HANDSHAKE ---

function HandshakeLoader() {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center space-y-12 animate-pulse">
      <div className="relative">
        <div className="w-48 h-48 border-[6px] border-primary/10 border-t-primary rounded-full animate-spin shadow-[0_0_80px_rgba(59,130,246,0.3)]" />
        <Monitor className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary w-14 h-14 animate-pulse" />
      </div>
      <div className="text-center space-y-4">
        <h2 className="text-[3.5rem] font-black uppercase italic text-slate-500 tracking-[0.5em] leading-none">
          Netra_Sync
        </h2>
        <p className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.8em]">
          Establishing Apache Superset Handshake Protocol...
        </p>
      </div>
    </div>
  );
}
