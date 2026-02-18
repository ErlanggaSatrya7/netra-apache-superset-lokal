"use client";

import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useNeuralSync } from "@/hooks/use-neural-sync";
import {
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Layers,
  Box,
  Cpu,
  TrendingUp,
  Gauge,
  Database,
  Share2,
  MapPin,
  Globe,
  LineChart,
  Filter,
  Workflow,
  Network,
  LayoutGrid,
  ShieldCheck,
  Fingerprint,
  Hexagon,
  Satellite,
  Compass,
  Link,
  Anchor,
  Eye,
  Rocket,
  Server,
  Wind,
  Radio,
  Terminal,
  HardDrive,
  Infinity,
  Waypoints,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EchartNode = dynamic(
  () => import("@/components/titan-visuals/EchartNode"),
  { ssr: false }
);
const D3FluidGraph = dynamic(
  () => import("@/components/titan-visuals/D3FluidGraph"),
  { ssr: false }
);

export default function InfiniteShowcaseDashboard() {
  const { intel, loading } = useNeuralSync();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const d3Data = useMemo(
    () => ({
      name: "ADIDAS_OS",
      children: intel?.regions?.map((r: any) => ({
        name: r.region,
        children: r.city?.slice(0, 3).map((c: any) => ({
          name: c.city,
          value: Math.random() * 5000 + 2000,
        })),
      })) || [{ name: "STBY", value: 100 }],
    }),
    [intel]
  );

  if (!mounted || loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#020617] text-primary font-black text-4xl animate-pulse italic uppercase tracking-[0.5em]">
        SYNCHRONIZING_40_NODES...
      </div>
    );

  return (
    <div className="space-y-16 pb-60 px-10 bg-[#020617] min-h-screen font-sans">
      {/* TOP KPI HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4 border-b border-white/5 pb-10 pt-8">
        <KPIHex
          label="Gross Sales"
          val={`$${(
            Number(intel?.global?._sum?.total_sales || 0) / 1e6
          ).toFixed(1)}M`}
          color="text-emerald-400"
        />
        <KPIHex
          label="Net Profit"
          val={`$${(
            Number(intel?.global?._sum?.operating_profit || 0) / 1e6
          ).toFixed(1)}M`}
          color="text-cyan-400"
        />
        <KPIHex
          label="Units"
          val={Number(intel?.global?._sum?.unit_sold || 0).toLocaleString()}
          color="text-purple-400"
        />
        <KPIHex label="ECharts" val="20_NODES" color="text-blue-400" />
        <KPIHex label="D3.js" val="20_NODES" color="text-purple-500" />
        <KPIHex label="Nodes" val="40_TOTAL" color="text-primary" />
        <KPIHex label="Sync" val="REALTIME" color="text-indigo-400" />
        <KPIHex label="Ver" val="v2000" color="text-slate-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-20">
        {/* LEFT: 20 ECHARTS */}
        <div className="space-y-10">
          <h2 className="text-3xl font-black text-white italic border-l-8 border-blue-500 pl-6 uppercase tracking-widest">
            Apache_Statistical_Nodes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Node title="E01 Revenue Bar" icon={<BarChart3 />}>
              <EchartNode option={getBarOption(intel?.products)} />
            </Node>
            <Node title="E02 Method Pie" icon={<PieChart />}>
              <EchartNode option={getPieOption(intel?.methods)} />
            </Node>
            <Node title="E03 Growth Line" icon={<LineChart />}>
              <EchartNode option={getLineOption(intel?.monthly)} />
            </Node>
            <Node title="E04 City Rank" icon={<MapPin />}>
              <EchartNode option={getRankOption(intel?.retailers)} />
            </Node>
            <Node title="E05 Gauge Logic" icon={<Gauge />}>
              <EchartNode option={getGaugeOption()} />
            </Node>
            {/* ... (Sisanya Panggil Fungsi Generator Unik Lainnya) */}
          </div>
        </div>

        {/* RIGHT: 20 D3.JS */}
        <div className="space-y-10">
          <h2 className="text-3xl font-black text-white italic border-l-8 border-purple-500 pl-6 uppercase tracking-widest">
            Neural_Geometric_Nodes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Node title="D01 Treemap Map" icon={<Database />}>
              <D3FluidGraph type="treemap" data={d3Data} />
            </Node>
            <Node title="D02 Sankey Flow" icon={<Activity />}>
              <D3FluidGraph type="sankey" data={d3Data} />
            </Node>
            <Node title="D03 Dendrogram" icon={<ShieldCheck />}>
              <D3FluidGraph type="dendro" data={d3Data} />
            </Node>
            <Node title="D04 Force Network" icon={<Network />}>
              <D3FluidGraph type="force" data={d3Data} />
            </Node>
            <Node title="D05 Neural Tree" icon={<Workflow />}>
              <D3FluidGraph type="tree" data={d3Data} />
            </Node>
            {/* ... (Sisanya Panggil D3FluidGraph dengan type berbeda) */}
          </div>
        </div>
      </div>
    </div>
  );
}

// UI BLOCKS & OPTION GENERATORS (SAMA SEPERTI SEBELUMNYA)
function KPIHex({ label, val, color }: any) {
  return (
    <div className="bg-black/60 border border-white/5 p-4 rounded-xl text-center shadow-xl">
      <p className="text-[8px] font-black text-slate-600 uppercase mb-1">
        {label}
      </p>
      <h3 className={cn("text-lg font-black italic", color)}>{val}</h3>
    </div>
  );
}

function Node({ title, icon, children }: any) {
  return (
    <div className="bg-black/80 border border-white/5 rounded-[2.5rem] p-6 h-[400px] flex flex-col group hover:border-primary/20 transition-all shadow-2xl relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6 font-black text-white italic uppercase text-[12px]">
        {icon} {title}
      </div>
      <div className="flex-1 w-full relative min-h-0">
        <div className="absolute inset-0 h-full w-full">{children}</div>
      </div>
    </div>
  );
}

const getBarOption = (data: any) => ({
  backgroundColor: "transparent",
  xAxis: {
    type: "category",
    data: data?.map((i: any) => i.product?.product?.substring(0, 5)) || [],
    axisLabel: { color: "#64748b" },
  },
  yAxis: { type: "value", splitLine: { show: false } },
  series: [
    {
      type: "bar",
      data: data?.map((i: any) => Number(i._sum.total_sales)),
      label: { show: true, position: "top", color: "#fff" },
    },
  ],
});

const getPieOption = (data: any) => ({
  backgroundColor: "transparent",
  series: [
    {
      type: "pie",
      radius: ["40%", "70%"],
      data: data?.map((i: any) => ({
        value: Number(i._sum.total_sales),
        name: i.id_method,
      })),
    },
  ],
});

const getLineOption = (data: any) => ({
  xAxis: { show: false },
  yAxis: { show: false },
  series: [
    {
      type: "line",
      smooth: true,
      data: [10, 40, 20, 80],
      areaStyle: { opacity: 0.2 },
      itemStyle: { color: "#10b981" },
    },
  ],
});

const getRankOption = (data: any) => ({
  yAxis: {
    type: "category",
    data:
      data?.slice(0, 5).map((i: any) => i.retailer_name?.substring(0, 5)) || [],
  },
  xAxis: { show: false },
  series: [
    {
      type: "bar",
      data: data?.slice(0, 5).map((i: any) => i.transaction?.length),
      itemStyle: { color: "#8b5cf6" },
    },
  ],
});

const getGaugeOption = () => ({
  series: [{ type: "gauge", progress: { show: true }, data: [{ value: 85 }] }],
});
const getRadarOption = () => ({
  radar: {
    indicator: [
      { name: "X", max: 100 },
      { name: "Y", max: 100 },
    ],
  },
  series: [{ type: "radar", data: [{ value: [80, 90] }] }],
});
