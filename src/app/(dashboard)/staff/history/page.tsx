"use client";

import React from "react";
import EchartNode from "@/components/titan-visuals/EchartNode";
import D3FluidGraph from "@/components/titan-visuals/D3FluidGraph";
import { Card } from "@/components/ui/card";
import { Activity, Zap, Layers, Network, Loader2 } from "lucide-react";
import { useNeuralSync } from "@/hooks/use-neural-sync";
import { cn } from "@/lib/utils"; // FIX: cn IMPORTED

export default function StaffPerformanceNode() {
  const { intel, loading } = useNeuralSync();

  if (loading)
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[1em] text-slate-500">
          Establishing_Neural_Sync...
        </p>
      </div>
    );

  return (
    <div className="space-y-12 pb-40 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            label: "My Uplinks",
            val: intel?.allHistory?.length || 0,
            color: "text-primary",
            icon: Activity,
          },
          {
            label: "Nodes Transmitted",
            val: intel?.stats?.records || 0,
            color: "text-emerald-400",
            icon: Layers,
          },
          {
            label: "Node State",
            val: "ACTIVE",
            color: "text-amber-400",
            icon: Zap,
          },
        ].map((k, i) => (
          <Card
            key={i}
            className="bg-[#0f172a]/90 border-white/5 rounded-[2.5rem] p-10 h-44 flex items-center relative overflow-hidden shadow-2xl"
          >
            <div className="relative z-10 min-w-0">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">
                {k.label}
              </p>
              <h3
                className={cn(
                  "text-4xl font-black italic tracking-tighter truncate",
                  k.color
                )}
              >
                {k.val}
              </h3>
            </div>
            <k.icon
              className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.03] text-white"
              size={100}
            />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 h-[700px]">
        <Card className="xl:col-span-5 bg-[#0f172a]/60 backdrop-blur-3xl border-white/5 rounded-[4rem] p-16 shadow-2xl flex flex-col items-center justify-center">
          <h3 className="text-2xl font-black italic uppercase text-white mb-10">
            Entity Density
          </h3>
          <D3FluidGraph data={intel?.hierarchy} />
        </Card>
        <Card className="xl:col-span-7 bg-[#0f172a]/60 backdrop-blur-3xl border-white/5 rounded-[4rem] p-16 shadow-2xl">
          <h3 className="text-2xl font-black italic uppercase text-white mb-10">
            Regional Performance
          </h3>
          <EchartNode option={getStaffOption(intel)} />
        </Card>
      </div>
    </div>
  );
}

function getStaffOption(intel: any) {
  const cities = intel?.citySales?.map((c: any) => c.name) || [];
  const vals = intel?.citySales?.map((c: any) => c.total) || [];
  return {
    backgroundColor: "transparent",
    xAxis: {
      type: "category",
      data: cities,
      axisLabel: { color: "#475569", fontSize: 10, rotate: 45 },
    },
    yAxis: { type: "value", splitLine: { lineStyle: { color: "#1e293b" } } },
    series: [
      {
        data: vals,
        type: "bar",
        itemStyle: { color: "#3b82f6", borderRadius: [4, 4, 0, 0] },
      },
    ],
  };
}
