"use client";

import React, { useMemo } from "react";
import EchartNode from "@/components/titan-visuals/EchartNode";
import D3FluidGraph from "@/components/titan-visuals/D3FluidGraph";
import { useNeuralSync } from "@/hooks/use-neural-sync";
import { transformToHierarchy } from "@/lib/d3-utils";
import { Card } from "@/components/ui/card";
import { TrendingUp, Globe, Activity, LayoutGrid, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminWarRoom() {
  const { intel, loading } = useNeuralSync();

  // Memproses data mentah menjadi hirarki untuk D3
  const d3Data = useMemo(() => {
    if (!intel?.rawTransactions) return null;
    return transformToHierarchy(intel.rawTransactions);
  }, [intel]);

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#020617] space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[1em] text-white italic">
          Finalizing_War_Room...
        </p>
      </div>
    );

  return (
    <div className="space-y-10 pb-40 animate-in fade-in duration-1000">
      {/* STATS NODES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            label: "Total Revenue",
            val: `$${(intel?.stats?.totalSales || 0).toLocaleString()}`,
            icon: TrendingUp,
            color: "text-emerald-400",
          },
          {
            label: "Operating Profit",
            val: `$${(intel?.stats?.totalProfit || 0).toLocaleString()}`,
            icon: Activity,
            color: "text-blue-400",
          },
          {
            label: "Master Records",
            val: (intel?.stats?.records || 0).toLocaleString(),
            icon: LayoutGrid,
            color: "text-primary",
          },
        ].map((s, i) => (
          <Card
            key={i}
            className="bg-[#0f172a]/90 border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl"
          >
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
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
              className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.03]"
              size={100}
            />
          </Card>
        ))}
      </div>

      {/* DUAL-ENGINE GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* D3 Circle Packing */}
        <Card className="xl:col-span-6 bg-[#0f172a]/60 border-white/5 rounded-[4rem] p-12 shadow-2xl relative">
          <h3 className="text-xl font-black text-white uppercase mb-10 flex items-center gap-3">
            <Globe size={18} className="text-primary" /> Regional Cluster Map
          </h3>
          <div className="h-[600px] w-full flex items-center justify-center bg-black/20 rounded-[3rem]">
            <D3FluidGraph data={d3Data} />
          </div>
        </Card>

        {/* ECharts Analysis */}
        <Card className="xl:col-span-6 bg-[#0f172a]/60 border-white/5 rounded-[4rem] p-12 shadow-2xl">
          <h3 className="text-xl font-black text-white uppercase mb-10 flex items-center gap-3">
            <Activity size={18} className="text-primary" /> Performance Matrix
          </h3>
          <div className="h-[600px] w-full">
            <EchartNode option={getComplexOption(intel)} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function getComplexOption(intel: any) {
  // Logic untuk mapping 13 kolom ke grafik
  return {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: { textStyle: { color: "#64748b" }, bottom: 0 },
    xAxis: {
      type: "category",
      data: ["Street", "Athletic", "Apparel"],
      axisLabel: { color: "#475569" },
    },
    yAxis: { type: "value", splitLine: { lineStyle: { color: "#1e293b" } } },
    series: [
      {
        name: "Sales",
        type: "bar",
        data: [120, 200, 150],
        itemStyle: { color: "#3b82f6" },
      },
      {
        name: "Profit",
        type: "line",
        data: [80, 150, 110],
        itemStyle: { color: "#10b981" },
      },
    ],
  };
}
