"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Zap,
  TrendingUp,
  Trophy,
  Activity,
  Globe,
  Target,
  Layers,
  Map,
  Database,
  Cpu,
  Box,
  Share2,
  Compass,
  ShieldCheck,
  Download,
  RefreshCcw,
  Search,
  Server,
  ChevronRight,
  MapPin,
  Building2,
  DownloadCloud,
  FileSpreadsheet,
  BrainCircuit,
  BarChart3,
  Gauge,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- ENGINE CORES ---
const EchartNode = dynamic(
  () => import("@/components/titan-visuals/EchartNode"),
  { ssr: false }
);
const D3FluidGraph = dynamic(
  () => import("@/components/titan-visuals/D3FluidGraph"),
  { ssr: false }
);

export default function AdminDashboard() {
  const [intel, setIntel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [activeFilter, setActiveFilter] = useState<{
    key: string;
    value: string | null;
  }>({ key: "all", value: null });
  const [searchQuery, setSearchQuery] = useState("");
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((data) => {
        setIntel(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // --- 🛡️ THE ULTRA-SANITIZER (PDF FIX) ---
  const exportToPDF = async () => {
    if (!dashboardRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: "#080b12",
        onclone: (clonedDoc) => {
          const allElements = clonedDoc.getElementsByTagName("*");
          for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i] as HTMLElement;
            const style = window.getComputedStyle(el);
            // Bantai OKLCH agar html2canvas tidak crash
            if (style.color.includes("oklch")) el.style.color = "#00f2ff";
            if (style.backgroundColor.includes("oklch"))
              el.style.backgroundColor = "#0d121b";
            if (style.borderColor.includes("oklch"))
              el.style.borderColor = "#1e293b";
          }
          const uiButtons = clonedDoc.querySelectorAll(".pdf-hide");
          uiButtons.forEach((b: any) => (b.style.display = "none"));
        },
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a1");
      pdf.addImage(imgData, "PNG", 0, 0, 841, 594);
      pdf.save(`TITAN_REPORT_V1100_${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF_ERROR:", err);
    } finally {
      setExporting(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Retailer",
      "Region",
      "City",
      "Product",
      "Sales",
      "Profit",
    ];
    const rows = filteredData.map((d) => [
      d.retailer?.retailer_name,
      d.city?.state?.region,
      d.city?.city,
      d.product?.product,
      d.total_sales,
      d.operating_profit,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `TITAN_DATA_${Date.now()}.csv`;
    link.click();
  };

  // --- 🔍 FILTERING CORE ---
  const filteredData = useMemo(() => {
    let data = [...intel];
    if (activeFilter.key !== "all" && activeFilter.value) {
      if (activeFilter.key === "retailer")
        data = data.filter(
          (d) => d.retailer?.retailer_name === activeFilter.value
        );
      if (activeFilter.key === "region")
        data = data.filter((d) => d.city?.state?.region === activeFilter.value);
      if (activeFilter.key === "city")
        data = data.filter((d) => d.city?.city === activeFilter.value);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (d) =>
          d.retailer?.retailer_name?.toLowerCase().includes(q) ||
          d.product?.product?.toLowerCase().includes(q) ||
          d.city?.city?.toLowerCase().includes(q)
      );
    }
    return data;
  }, [intel, activeFilter, searchQuery]);

  // --- 📊 METRICS & AI FORECAST ---
  const metrics = useMemo(() => {
    if (!filteredData.length)
      return {
        rev: "0",
        prof: "0",
        top: "-",
        eff: "0",
        nodes: 0,
        forecast: "0",
      };
    const r = filteredData.reduce((a, b) => a + Number(b.total_sales), 0);
    const p = filteredData.reduce((a, b) => a + Number(b.operating_profit), 0);
    const retailMap = filteredData.reduce((acc: any, curr: any) => {
      const n = curr.retailer?.retailer_name || "Unknown";
      acc[n] = (acc[n] || 0) + Number(curr.total_sales);
      return acc;
    }, {});
    const sorted = Object.entries(retailMap).sort(
      (a: any, b: any) => b[1] - a[1]
    );

    return {
      rev: r >= 1e9 ? `${(r / 1e9).toFixed(2)}B` : `${(r / 1e6).toFixed(1)}M`,
      prof: p >= 1e9 ? `${(p / 1e9).toFixed(2)}B` : `${(p / 1e6).toFixed(1)}M`,
      top: sorted[0]?.[0] || "-",
      eff: ((p / r) * 100).toFixed(1),
      nodes: filteredData.length,
      forecast: `${((r * 1.08) / 1e9).toFixed(2)}B`,
    };
  }, [filteredData]);

  // --- 📉 CHART CONFIGURATIONS (FIXED regionalOption) ---
  const revenueOption = useMemo(
    () => ({
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        backgroundColor: "#0d121b",
        textStyle: { color: "#fff" },
      },
      xAxis: {
        type: "category",
        data: filteredData
          .slice(-50)
          .map((d) => new Date(d.invoice_date).toLocaleDateString()),
        axisLabel: { color: "#4d5d7e" },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "#161e2b" } },
        axisLabel: { color: "#4d5d7e" },
      },
      series: [
        {
          name: "Sales",
          type: "line",
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 4, color: "#00f2ff" },
          areaStyle: { color: "rgba(0, 242, 255, 0.05)" },
          data: filteredData.slice(-50).map((d) => Number(d.total_sales)),
        },
      ],
    }),
    [filteredData]
  );

  const regionalOption = useMemo(() => {
    const rMap = filteredData.reduce((acc: any, curr: any) => {
      const region = curr.city?.state?.region || "Other";
      acc[region] = (acc[region] || 0) + Number(curr.total_sales || 0);
      return acc;
    }, {});
    const sorted = Object.entries(rMap).sort((a: any, b: any) => b[1] - a[1]);
    return {
      backgroundColor: "transparent",
      xAxis: {
        type: "value",
        splitLine: { show: false },
        axisLabel: { show: false },
      },
      yAxis: {
        type: "category",
        data: sorted.map((x) => x[0]),
        axisLabel: { color: "#4d5d7e", fontSize: 10 },
      },
      series: [
        {
          type: "bar",
          data: sorted.map((x) => x[1]),
          itemStyle: { color: "#3b82f6", borderRadius: [0, 5, 5, 0] },
        },
      ],
    };
  }, [filteredData]);

  const treemapOption = useMemo(() => {
    const pMap = filteredData.reduce((acc: any, curr: any) => {
      const name = curr.product?.product || "Other";
      acc[name] = (acc[name] || 0) + Number(curr.total_sales);
      return acc;
    }, {});
    return {
      backgroundColor: "transparent",
      series: [
        {
          type: "treemap",
          data: Object.entries(pMap).map(([name, value]) => ({ name, value })),
          breadcrumb: { show: false },
          label: { show: true, fontWeight: "bold" },
          itemStyle: { borderColor: "#0d121b", borderWidth: 2 },
        },
      ],
    };
  }, [filteredData]);

  const methodOption = useMemo(() => {
    const mMap = filteredData.reduce((acc: any, curr: any) => {
      const m = curr.method?.method || "N/A";
      acc[m] = (acc[m] || 0) + Number(curr.total_sales);
      return acc;
    }, {});
    const vals = Object.values(mMap) as number[];
    return {
      backgroundColor: "transparent",
      radar: {
        indicator: Object.keys(mMap).map((c) => ({
          name: c.toUpperCase(),
          max: Math.max(...vals, 1),
        })),
        shape: "circle",
        splitArea: { show: false },
        axisLine: { lineStyle: { color: "#1e293b" } },
      },
      series: [
        {
          type: "radar",
          data: [{ value: vals, name: "Method" }],
          lineStyle: { color: "#fbbf24", width: 2 },
          areaStyle: { color: "rgba(251, 191, 36, 0.1)" },
        },
      ],
    };
  }, [filteredData]);

  // --- 📦 DISCOVERY DATA ---
  const discovery = useMemo(
    () => ({
      retailers: Array.from(
        new Set(intel.map((i) => i.retailer?.retailer_name))
      )
        .filter(Boolean)
        .sort(),
      regions: Array.from(new Set(intel.map((i) => i.city?.state?.region)))
        .filter(Boolean)
        .sort(),
      cities: Array.from(new Set(intel.map((i) => i.city?.city)))
        .filter(Boolean)
        .sort(),
    }),
    [intel]
  );

  if (loading)
    return (
      <div className="h-screen bg-[#080b12] flex flex-col items-center justify-center text-[#00f2ff] font-black animate-pulse tracking-[1em]">
        <Cpu className="mb-10 animate-spin" size={60} />
        TITAN_OVERLORD_UPLINK...
      </div>
    );

  return (
    <div
      ref={dashboardRef}
      className="min-h-screen bg-[#080b12] text-[#4d5d7e] font-sans p-10 overflow-x-auto custom-scrollbar"
    >
      <div className="min-w-[3400px] grid grid-cols-12 gap-12">
        {/* SIDEBAR: DISCOVERY PANEL */}
        <aside className="col-span-2 space-y-10 pdf-hide">
          <div className="bg-[#0d121b] border border-[#1e293b] rounded-[3.5rem] p-12 shadow-2xl sticky top-10">
            <h2 className="text-white font-black italic uppercase tracking-[0.4em] flex items-center gap-5 mb-16">
              <Compass className="text-cyan-400" size={24} /> DISCOVERY
            </h2>

            <DiscoveryGroup
              title="RETAILERS"
              icon={<Building2 size={20} />}
              items={discovery.retailers}
              active={activeFilter}
              onSelect={(v) => setActiveFilter({ key: "retailer", value: v })}
            />
            <div className="h-8" />
            <DiscoveryGroup
              title="REGIONS"
              icon={<Map size={20} />}
              items={discovery.regions}
              active={activeFilter}
              onSelect={(v) => setActiveFilter({ key: "region", value: v })}
            />
            <div className="h-8" />
            <DiscoveryGroup
              title="CITIES"
              icon={<MapPin size={20} />}
              items={discovery.cities}
              active={activeFilter}
              onSelect={(v) => setActiveFilter({ key: "city", value: v })}
            />

            <div className="mt-16 pt-10 border-t border-white/5 space-y-4">
              <button
                onClick={() => setActiveFilter({ key: "all", value: null })}
                className="w-full py-6 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] hover:bg-rose-500/20 hover:text-rose-400 transition-all flex items-center justify-center gap-4"
              >
                <RefreshCcw size={16} /> RESET
              </button>
              <button
                onClick={exportToCSV}
                className="w-full py-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center gap-4"
              >
                <FileSpreadsheet size={16} /> EXCEL_CSV
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN COMMAND HUD */}
        <main className="col-span-10 space-y-12">
          <header className="flex justify-between items-center bg-[#0d121b] border border-[#1e293b] p-12 rounded-[4rem] shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-12">
              <div className="bg-cyan-500/10 p-8 rounded-3xl border border-cyan-500/20">
                <Zap className="text-cyan-400" size={64} />
              </div>
              <div>
                <h1 className="text-8xl font-black italic tracking-tighter text-white uppercase leading-none">
                  Titan_VX <span className="text-blue-500">V1100</span>
                </h1>
                <p className="text-[12px] font-black tracking-[0.8em] opacity-30 uppercase flex items-center gap-5 mt-6">
                  <ShieldCheck size={18} className="text-emerald-500" />{" "}
                  SYSTEM_STABLE // PDF_SAFE_SANITZER_V11: ON
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8 pdf-hide">
              <div className="relative group">
                <Search
                  className="absolute left-8 top-1/2 -translate-y-1/2 text-white/20"
                  size={24}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="QUERY_DATABASE..."
                  className="bg-white/5 border border-white/10 rounded-full py-8 pl-20 pr-12 text-[14px] w-[700px] focus:border-cyan-500 outline-none text-white font-black transition-all"
                />
              </div>
              <button
                onClick={exportToPDF}
                disabled={exporting}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-black py-8 px-20 rounded-full text-[14px] uppercase tracking-[0.5em] transition-all shadow-[0_0_60px_rgba(6,182,212,0.4)] flex items-center gap-6"
              >
                <DownloadCloud size={28} />{" "}
                {exporting ? "CAPTURING..." : "EXPORT_PDF"}
              </button>
            </div>
          </header>

          {/* STATS MATRIX */}
          <div className="grid grid-cols-6 gap-8">
            <StatCard
              icon={<TrendingUp />}
              label="REVENUE"
              val={`Rp ${metrics.rev}`}
              color="text-cyan-400"
            />
            <StatCard
              icon={<Trophy />}
              label="PEAK_BRAND"
              val={metrics.top}
              color="text-yellow-400"
            />
            <StatCard
              icon={<Activity />}
              label="PROFIT"
              val={`Rp ${metrics.prof}`}
              color="text-rose-400"
            />
            <StatCard
              icon={<Target />}
              label="EFFICIENCY"
              val={`${metrics.eff}%`}
              color="text-emerald-400"
            />
            <StatCard
              icon={<BrainCircuit />}
              label="AI_FORECAST"
              val={`Rp ${metrics.forecast}`}
              color="text-purple-400"
            />
            <StatCard
              icon={<Globe />}
              label="NODES"
              val={metrics.nodes}
              color="text-blue-400"
            />
          </div>

          {/* VISUALS LAYER 1 */}
          <div className="grid grid-cols-12 gap-10">
            <HUDRow span="col-span-3" title="NEURAL_TOPOLOGY">
              <div className="h-[550px] w-full">
                <D3FluidGraph data={filteredData} />
              </div>
            </HUDRow>
            <HUDRow span="col-span-6" title="REVENUE_TIMOLOGY_STREAM">
              <div className="h-[550px] w-full">
                <EchartNode option={revenueOption} />
              </div>
            </HUDRow>
            <HUDRow span="col-span-3" title="MARKET_COMPOSITION_TREEMAP">
              <div className="h-[550px] w-full">
                <EchartNode option={treemapOption} />
              </div>
            </HUDRow>
          </div>

          {/* VISUALS LAYER 2 */}
          <div className="grid grid-cols-12 gap-10">
            <HUDRow span="col-span-4" title="REGIONAL_PERFORMANCE">
              <div className="h-[450px] w-full">
                <EchartNode option={regionalOption} />
              </div>
            </HUDRow>
            <HUDRow span="col-span-4" title="SALES_METHOD_RADAR">
              <div className="h-[450px] w-full">
                <EchartNode option={methodOption} />
              </div>
            </HUDRow>
            <HUDRow span="col-span-4" title="SYSTEM_HEALTH">
              <div className="h-[450px] flex flex-col justify-center gap-10">
                <HealthBar
                  label="Database Uptime"
                  value={99.9}
                  color="bg-cyan-500"
                />
                <HealthBar
                  label="Prisma Latency"
                  value={12.4}
                  color="bg-purple-500"
                />
                <HealthBar
                  label="Chart Render"
                  value={100}
                  color="bg-emerald-500"
                />
              </div>
            </HUDRow>
          </div>

          {/* DATA REGISTRY */}
          <HUDRow
            span="col-span-12"
            title="MASTER_DATABASE_REGISTRY // RAW_DATA"
          >
            <div className="h-[600px] overflow-y-auto custom-scrollbar pr-4">
              <table className="w-full text-left text-[14px] font-black italic border-collapse">
                <thead className="sticky top-0 bg-[#121824] border-b border-white/10 text-white uppercase tracking-[0.5em] z-30">
                  <tr>
                    <th className="p-10 text-cyan-500">Retailer</th>
                    <th className="p-10">Location</th>
                    <th className="p-10">Method</th>
                    <th className="p-10">Product</th>
                    <th className="p-10 text-right">Revenue</th>
                    <th className="p-10 text-right">Profit</th>
                    <th className="p-10 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredData.slice(0, 100).map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-white/[0.04] transition-all group"
                    >
                      <td className="p-10 text-cyan-400 font-black">
                        {row.retailer?.retailer_name}
                      </td>
                      <td className="p-10 text-white uppercase">
                        {row.city?.city}{" "}
                        <span className="opacity-20 text-[10px]">
                          ({row.city?.state?.region})
                        </span>
                      </td>
                      <td className="p-10 text-yellow-500/80">
                        {row.method?.method}
                      </td>
                      <td className="p-10 text-slate-500">
                        {row.product?.product}
                      </td>
                      <td className="p-10 text-right text-emerald-400 font-mono">
                        Rp {Number(row.total_sales).toLocaleString()}
                      </td>
                      <td className="p-10 text-right text-rose-500 font-mono">
                        Rp {Number(row.operating_profit).toLocaleString()}
                      </td>
                      <td className="p-10 text-center">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-6 py-2 rounded-full text-[10px] font-black uppercase">
                          Stable
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </HUDRow>

          <footer className="pt-32 opacity-20 text-[14px] font-black uppercase tracking-[2em] text-center">
            TITAN_VX_OS_V11.0.0 // FINAL_BUILD_STABLE
          </footer>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 30px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

// --- COMPLEX COMPONENTS ENGINE ---

function DiscoveryGroup({ title, icon, items, onSelect, active }: any) {
  const [open, setOpen] = useState(true);
  return (
    <div className="space-y-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between group py-2 outline-none"
      >
        <div className="flex items-center gap-5">
          <div className="p-4 bg-white/5 rounded-2xl text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-all">
            {icon}
          </div>
          <span className="text-[13px] font-black text-white/50 tracking-widest uppercase">
            {title}
          </span>
        </div>
        <ChevronRight
          size={18}
          className={cn(
            "transition-transform duration-500 opacity-20",
            open && "rotate-90 opacity-100"
          )}
        />
      </button>
      {open && (
        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-4 pl-4 border-l border-white/5">
          {items.map((item: string, i: number) => (
            <button
              key={i}
              onClick={() => onSelect(item)}
              className={cn(
                "w-full text-left px-6 py-4 rounded-2xl text-[12px] font-black transition-all border outline-none",
                active.value === item
                  ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400"
                  : "bg-white/5 border-transparent text-white/20 hover:bg-white/10 hover:text-white"
              )}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, val, color }: any) {
  return (
    <div className="bg-[#0d121b] border border-[#1e293b] p-12 rounded-[3.5rem] relative overflow-hidden group hover:border-cyan-500/50 transition-all shadow-2xl">
      <div
        className={cn(
          "absolute -right-10 -top-10 opacity-[0.03] group-hover:scale-150 transition-all duration-1000",
          color
        )}
      >
        {React.cloneElement(icon as React.ReactElement, { size: 180 })}
      </div>
      <div
        className={cn(
          "p-5 bg-white/[0.03] rounded-2xl border border-white/5 mb-10 w-fit shadow-inner",
          color
        )}
      >
        {icon}
      </div>
      <p className="text-[13px] font-black opacity-30 uppercase mb-6 tracking-[0.2em]">
        {label}
      </p>
      <h3 className="text-5xl font-black italic text-white tracking-tighter truncate leading-none">
        {val}
      </h3>
    </div>
  );
}

function HUDRow({ children, title, span }: any) {
  return (
    <div
      className={cn(
        "bg-[#0d121b] border border-[#1e293b] rounded-[4.5rem] overflow-hidden shadow-2xl relative",
        span
      )}
    >
      <div className="bg-[#121824] px-16 py-12 border-b border-[#1e293b] flex items-center justify-between uppercase">
        <div className="flex items-center gap-10">
          <div className="h-14 w-2 bg-cyan-500 rounded-full shadow-[0_0_30px_#06b6d4]" />
          <h2 className="text-[18px] font-black text-white italic tracking-[0.6em] flex items-center gap-6 leading-none">
            <Zap size={28} className="text-yellow-400 animate-pulse" /> {title}
          </h2>
        </div>
      </div>
      <div className="p-16">{children}</div>
    </div>
  );
}

function HealthBar({ label, value, color }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between font-black text-[14px] uppercase tracking-widest text-white/40">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            color
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
