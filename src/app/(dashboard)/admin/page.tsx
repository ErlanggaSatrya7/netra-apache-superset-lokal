"use client";

import React, { useMemo } from "react";
import EchartNode from "@/components/titan-visuals/EchartNode";
import D3FluidGraph from "@/components/titan-visuals/D3FluidGraph";
import { useNeuralSync } from "@/hooks/use-neural-sync";
import { transformToHierarchy } from "@/lib/d3-utils";
import { aggregateBusinessStats } from "@/lib/visual-transformers";
import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  Globe,
  Activity,
  LayoutGrid,
  Loader2,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminWarRoom() {
  const { intel, loading } = useNeuralSync();

  const d3Data = useMemo(
    () =>
      intel?.rawTransactions
        ? transformToHierarchy(intel.rawTransactions)
        : null,
    [intel]
  );

  const bizStats = useMemo(
    () =>
      intel?.rawTransactions
        ? aggregateBusinessStats(intel.rawTransactions)
        : null,
    [intel]
  );

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-6 bg-[#020617]">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[1em] text-slate-500 animate-pulse italic">
          Synchronizing_Intelligence...
        </p>
      </div>
    );

  return (
    <div className="space-y-10 pb-40 animate-in fade-in duration-1000">
      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            label: "Gross_Revenue",
            val: `$${(intel?.stats?.totalSales || 0).toLocaleString()}`,
            icon: TrendingUp,
            color: "text-emerald-400",
          },
          {
            label: "Net_Profit",
            val: `$${(intel?.stats?.totalProfit || 0).toLocaleString()}`,
            icon: Activity,
            color: "text-blue-400",
          },
          {
            label: "Total_Nodes",
            val: (intel?.stats?.records || 0).toLocaleString(),
            icon: LayoutGrid,
            color: "text-primary",
          },
        ].map((s, i) => (
          <Card
            key={i}
            className="bg-[#0f172a]/90 border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl group hover:border-primary/30 transition-all"
          >
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">
                {s.label}
              </p>
              <h3
                className={cn(
                  "text-4xl font-black italic tracking-tighter",
                  s.color
                )}
              >
                {s.val}
              </h3>
            </div>
            <s.icon
              className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"
              size={100}
            />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* D3.JS: Regional Circle Packing */}
        <Card className="xl:col-span-5 bg-[#0f172a]/60 border-white/5 rounded-[4rem] p-12 shadow-2xl">
          <div className="flex justify-between items-start mb-10">
            <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
              <Globe size={18} className="text-primary" /> Geospatial Cluster
            </h3>
          </div>
          <div className="h-[550px] w-full flex items-center justify-center bg-black/20 rounded-[3rem]">
            <D3FluidGraph data={d3Data} />
          </div>
        </Card>

        {/* ECharts: Product Efficiency Scatter-Bubble */}
        <Card className="xl:col-span-7 bg-[#0f172a]/60 border-white/5 rounded-[4rem] p-12 shadow-2xl">
          <h3 className="text-xl font-black text-white uppercase italic mb-10 flex items-center gap-3">
            <Target size={18} className="text-primary" /> Efficiency Matrix
            (Margin vs Sales)
          </h3>
          <div className="h-[550px] w-full">
            <EchartNode option={getScatterOption(bizStats)} />
          </div>
        </Card>
      </div>

      {/* Sales Method Donut */}
      <Card className="bg-[#0f172a]/60 border-white/5 rounded-[4rem] p-12 shadow-2xl">
        <h3 className="text-xl font-black text-white uppercase italic mb-10 flex items-center gap-3">
          <Activity size={18} className="text-primary" /> Distribution Analytics
        </h3>
        <div className="h-[400px]">
          <EchartNode option={getDonutOption(bizStats)} />
        </div>
      </Card>
    </div>
  );
}

function getScatterOption(stats: any) {
  // Scatter Plot: X=Sales, Y=Margin, Size=Units Sold
  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      backgroundColor: "#0f172a",
      borderColor: "#3b82f6",
      textStyle: { color: "#fff", fontSize: 10 },
      formatter: (params: any) =>
        `${
          params.data[3]
        }<br/>Sales: $${params.data[0].toLocaleString()}<br/>Margin: ${params.data[1].toFixed(
          1
        )}%`,
    },
    xAxis: {
      name: "Sales ($)",
      splitLine: { lineStyle: { color: "#1e293b" } },
      axisLabel: { color: "#64748b" },
    },
    yAxis: {
      name: "Margin (%)",
      splitLine: { lineStyle: { color: "#1e293b" } },
      axisLabel: { color: "#64748b" },
    },
    series: [
      {
        type: "scatter",
        symbolSize: (data: any) => Math.sqrt(data[2]) * 0.5,
        data: stats?.products.map((p: any) => [
          p.sales,
          p.avgMargin,
          p.units,
          p.name,
        ]),
        itemStyle: {
          color: "#3b82f6",
          opacity: 0.8,
          shadowBlur: 10,
          shadowColor: "rgba(59, 130, 246, 0.5)",
        },
      },
    ],
  };
}

function getDonutOption(stats: any) {
  return {
    backgroundColor: "transparent",
    series: [
      {
        type: "pie",
        radius: ["50%", "80%"],
        itemStyle: { borderRadius: 10, borderColor: "#0f172a", borderWidth: 2 },
        label: { show: true, color: "#94a3b8", fontSize: 10 },
        data: stats?.methods || [],
      },
    ],
  };
}
