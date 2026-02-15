"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  ComposedChart,
  Line,
  Legend,
} from "recharts";
import {
  DollarSign,
  Package,
  Zap,
  Database,
  Activity,
  Globe,
  TrendingUp,
  RefreshCw,
  Download,
  ShieldCheck,
  Cpu,
  Monitor,
  ExternalLink,
  Box,
  Layers,
  PieChart as PieIcon,
  ArrowUpRight,
  Target,
  ZapOff,
  Wifi,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Types & Interfaces ---
interface AnalyticsStats {
  revenue: number;
  units: number;
  nodes: number;
  efficiency: number;
}

interface ChartData {
  name: string;
  val: number;
}

export default function AdminIntelligenceDashboard() {
  const [intel, setIntel] = useState<{
    stats: AnalyticsStats;
    trend: ChartData[];
    geo: ChartData[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("neural_engine");
  const [systemUptime, setSystemUptime] = useState("00:00:00");

  // --- Real-time Uptime Logic ---
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
      setSystemUptime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Neural Sync Engine ---
  const syncIntelligence = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/shared/charts");
      const data = await res.json();

      // Artificial Neural Handshake Delay
      await new Promise((r) => setTimeout(r, 1000));

      if (data.stats.records === 0) {
        setIntel(null);
      } else {
        setIntel({
          stats: {
            revenue: data.stats.revenue,
            units: data.stats.units,
            nodes: data.stats.records,
            efficiency: 94.2,
          },
          trend: data.temporalTrend,
          geo: data.citySales,
        });
      }
      toast.success("CORE_INGESTION_SUCCESS", {
        description: "Master nodes synchronized.",
      });
    } catch (err) {
      toast.error("NEURAL_SYNC_CRITICAL_FAILURE");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncIntelligence();
  }, [syncIntelligence]);

  if (loading) return <LoadingProtocol />;

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      {/* --- HEADER CONTROL CENTER --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
              <Wifi className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                Master Node: Online
              </span>
            </div>
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
              Uptime: {systemUptime}
            </span>
          </div>
          <h1 className="text-7xl font-black italic tracking-tighter text-white uppercase leading-none">
            Intelligence{" "}
            <span className="text-primary font-sans lowercase tracking-normal">
              Portal
            </span>
          </h1>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.6em] italic max-w-xl truncate">
            Netra Master DataVortex Engine // Global Adidas AG Analytics
            Protocol v2.0
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={syncIntelligence}
            className="h-16 w-16 rounded-[1.5rem] bg-[#0f172a] border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <RefreshCw size={24} className="text-primary" />
          </Button>
          <Button className="h-16 px-10 bg-primary hover:bg-blue-600 text-white rounded-[1.5rem] shadow-2xl shadow-primary/20 font-black uppercase italic text-xs tracking-widest group">
            <Download
              size={20}
              className="mr-3 group-hover:translate-y-1 transition-transform"
            />
            Extract_Master_Report
          </Button>
        </div>
      </div>

      {/* --- KPI ENGINE: PAS DAN TIDAK TUMPANG TINDIH --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Gross_Revenue",
            val: intel ? `$${intel.stats.revenue.toLocaleString()}` : "$0",
            icon: DollarSign,
            color: "text-emerald-400",
            sub: "Live_Ingestion",
          },
          {
            label: "Unit_Velocity",
            val: intel ? intel.stats.units.toLocaleString() : "0",
            icon: Box,
            color: "text-blue-400",
            sub: "Global_Movement",
          },
          {
            label: "Node_Entities",
            val: intel ? intel.stats.nodes.toLocaleString() : "0",
            icon: Layers,
            color: "text-primary",
            sub: "Active_Dataset",
          },
          {
            label: "Inflow_Efficiency",
            val: intel ? `${intel.stats.efficiency}%` : "0%",
            icon: Target,
            color: "text-amber-400",
            sub: "Neural_Stability",
          },
        ].map((k, i) => (
          <Card
            key={i}
            className="bg-[#0f172a] border-white/5 shadow-2xl rounded-[2.5rem] relative overflow-hidden group hover:border-primary/40 transition-all"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.07] transition-all group-hover:scale-125">
              <k.icon size={100} />
            </div>
            <CardContent className="p-8 space-y-6 relative z-10">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] truncate max-w-[150px]">
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
                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">
                  {k.sub}
                </span>
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

      {/* --- CORE VISUALIZATION ENGINE --- */}
      {!intel ? (
        <EmptyDatasetUI />
      ) : (
        <Tabs
          defaultValue="neural_engine"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10 bg-[#0f172a]/50 p-4 rounded-[3rem] border border-white/5">
            <TabsList className="bg-[#020617] border border-white/5 p-1.5 h-16 rounded-[2rem] w-full md:w-[500px] shadow-2xl">
              <TabsTrigger
                value="neural_engine"
                className="flex-1 rounded-[1.5rem] data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase italic text-[10px] transition-all"
              >
                <Cpu size={14} className="mr-2" /> Neural Engine (Internal)
              </TabsTrigger>
              <TabsTrigger
                value="apache_superset"
                className="flex-1 rounded-[1.5rem] data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase italic text-[10px] transition-all"
              >
                <Globe size={14} className="mr-2" /> Apache Port (External)
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-8 px-8">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-white italic uppercase tracking-widest">
                  System_Signature
                </span>
                <span className="text-[8px] font-bold text-slate-600 uppercase">
                  VX-ALPHA-992-SECURE
                </span>
              </div>
              <div className="h-10 w-[1px] bg-white/10" />
              <Activity className="text-primary w-6 h-6 animate-pulse" />
            </div>
          </div>

          {/* INTERNAL ENGINE: SHADCN CHARTS */}
          <TabsContent
            value="neural_engine"
            className="space-y-10 outline-none animate-in zoom-in-95 duration-500"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 bg-[#0f172a] border-none shadow-[0_50px_100px_rgba(0,0,0,0.4)] p-12 rounded-[4rem] h-[650px] relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="flex justify-between items-start mb-16 relative z-10">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter">
                      Gross Ingestion Velocity
                    </h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] italic flex items-center gap-2">
                      <TrendingUp size={12} className="text-primary" /> Temporal
                      revenue performance mapping
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="px-6 py-3 bg-black/40 rounded-2xl border border-white/5 text-[9px] font-black uppercase text-slate-400">
                      Metric: TOTAL_SALES
                    </div>
                  </div>
                </div>
                <div className="h-[400px] w-full relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={intel.trend}>
                      <defs>
                        <linearGradient
                          id="colorVX"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="6 6"
                        stroke="#ffffff03"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        stroke="#475569"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        dy={15}
                      />
                      <YAxis
                        stroke="#475569"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `$${v / 1000}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#020617",
                          border: "none",
                          borderRadius: "16px",
                          boxShadow: "0 20px 40px rgba(0,0,0,1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#3b82f6"
                        fill="url(#colorVX)"
                        strokeWidth={5}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <div className="space-y-8">
                <Card className="bg-[#0f172a] border-none shadow-2xl p-10 rounded-[4rem] h-[310px] flex flex-col items-center justify-center relative overflow-hidden group">
                  <h3 className="text-[11px] font-black italic uppercase text-slate-500 mb-8 tracking-[0.5em] z-10 leading-none">
                    Market_Dominance
                  </h3>
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    className="z-10"
                  >
                    <PieChart>
                      <Pie
                        data={intel.geo}
                        dataKey="total"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={12}
                        stroke="none"
                      >
                        {intel.geo.map((_, index) => (
                          <Cell
                            key={index}
                            fill={
                              ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][
                                index % 4
                              ]
                            }
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <Globe
                    size={24}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-4 text-slate-800"
                  />
                </Card>

                <Card className="bg-primary border-none shadow-[0_30px_80px_rgba(59,130,246,0.35)] p-12 rounded-[4rem] h-[302px] flex flex-col justify-between text-white relative overflow-hidden group">
                  <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000" />
                  <div className="flex justify-between items-start relative z-10">
                    <ShieldCheck size={36} className="text-white/40" />
                    <span className="text-[9px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full border border-white/10">
                      Master_Secure
                    </span>
                  </div>
                  <div className="space-y-1 relative z-10">
                    <p className="text-[10px] font-black uppercase italic opacity-60 tracking-widest">
                      Top Performing Hub
                    </p>
                    <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none truncate">
                      New York Node
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full bg-white/10 hover:bg-white/20 text-white rounded-2xl h-14 text-[10px] font-black uppercase italic mt-6 gap-4 group-hover:gap-8 transition-all border border-white/10 relative z-10 shadow-xl truncate"
                  >
                    Open Detailed Port <ExternalLink size={14} />
                  </Button>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* EXTERNAL ENGINE: APACHE SUPERSET */}
          <TabsContent
            value="apache_superset"
            className="outline-none animate-in slide-in-from-right-10 duration-700"
          >
            <Card className="bg-[#0f172a] border-white/5 shadow-2xl rounded-[4.5rem] h-[850px] overflow-hidden relative border-t border-white/10">
              <div className="absolute inset-0 bg-[#020617] -z-10" />
              <iframe
                src="http://localhost:3001/public/superset-dashboard-link"
                className="w-full h-full grayscale-[0.3] hover:grayscale-0 transition-all duration-1000"
                title="Apache Superset Port"
              />
              <div className="absolute top-10 right-10 flex gap-4">
                <div className="px-6 py-4 bg-[#020617]/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase italic tracking-widest leading-none">
                    Ext_Port_Active: Apache_Superset
                  </span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function LoadingProtocol() {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center space-y-10 animate-pulse">
      <div className="relative">
        <div className="w-40 h-40 border-[6px] border-primary/10 border-t-primary rounded-full animate-spin shadow-[0_0_60px_rgba(59,130,246,0.2)]" />
        <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary w-12 h-12" />
      </div>
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black uppercase italic text-slate-500 tracking-[0.5em] leading-none">
          Netra Intelligence
        </h2>
        <p className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.8em]">
          Establishing master datastream handshake...
        </p>
      </div>
    </div>
  );
}

function EmptyDatasetUI() {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-700">
      <div className="relative">
        <div className="w-48 h-48 bg-[#0f172a] rounded-[4rem] border border-white/5 flex items-center justify-center shadow-inner group">
          <Layers
            size={80}
            className="text-slate-800 group-hover:text-primary transition-colors duration-700"
          />
        </div>
        <ZapOff className="absolute -top-4 -right-4 w-12 h-12 text-rose-500/30" />
      </div>
      <div className="space-y-4">
        <h4 className="text-4xl font-black uppercase italic text-slate-600 tracking-tighter leading-none">
          Core Stream Offline
        </h4>
        <p className="text-xs text-slate-700 font-black uppercase tracking-[0.4em] max-w-md mx-auto leading-relaxed italic">
          Master hub connection idle. Ingest Adidas datasets via the Staff
          Terminal to ignite visual analytics.
        </p>
      </div>
      <Button
        variant="outline"
        className="h-14 px-10 border-white/5 bg-[#0f172a] rounded-2xl text-[10px] font-black uppercase italic tracking-widest text-slate-500 hover:text-white transition-all"
      >
        Trigger Neural Search <RefreshCw size={14} className="ml-3" />
      </Button>
    </div>
  );
}
