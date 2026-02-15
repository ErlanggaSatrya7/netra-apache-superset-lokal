"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Cell,
} from "recharts";
import {
  Loader2,
  Award,
  Search,
  ListOrdered,
  Globe,
  ShoppingBag,
  Database,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export default function ShadcnChartTab() {
  const [rawData, setRawData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/admin/charts")
      .then((res) => res.json())
      .then((json) => {
        setRawData(Array.isArray(json) ? json : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const analytics = useMemo(() => {
    if (!rawData.length) return null;
    const filtered = rawData.filter((item) =>
      (item.product?.product || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    const cMap: any = {},
      pMap: any = {},
      regMap: any = {};
    filtered.forEach((item) => {
      const sales = Number(item.total_sales || 0);
      const c = item.city?.city || "Unknown City";
      const p = item.product?.product || "Other Product";

      // LOGIKA ANTI-FAIL: Mencari State di berbagai tingkat relasi
      const reg = item.city?.state?.state || "Unknown Region";

      cMap[c] = (cMap[c] || 0) + sales;
      pMap[p] = (pMap[p] || 0) + sales;
      regMap[reg] = (regMap[reg] || 0) + sales;
    });

    const sort = (obj: any) =>
      Object.entries(obj)
        .map(([name, sales]) => ({ name, sales: Number(sales) }))
        .sort((a, b) => b.sales - a.sales);
    return { cities: sort(cMap), products: sort(pMap), regions: sort(regMap) };
  }, [rawData, searchTerm]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3">
            <Award className="text-blue-500" />
            <h1 className="text-xl font-black italic uppercase">
              Vortex <span className="text-blue-500">Core-BI</span>
            </h1>
          </div>
          <input
            className="w-full md:w-96 bg-slate-950 border border-slate-800 rounded-full py-2 px-6 text-xs outline-none focus:ring-1 ring-blue-500 font-bold"
            placeholder="Search data..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* CITY RANKING */}
          <Card className="lg:col-span-5 bg-slate-900/40 border-slate-800 h-[650px] flex flex-col overflow-hidden">
            <CardHeader className="border-b border-slate-800 bg-slate-900/10">
              <CardTitle className="text-xs font-black uppercase text-blue-500 flex items-center gap-2">
                <ListOrdered size={16} /> Revenue by City
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full p-6">
                <div className="space-y-6">
                  {analytics?.cities.map((city, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-[11px] font-bold italic uppercase">
                        <span>
                          {idx + 1}. {city.name}
                        </span>
                        <span className="text-blue-400">
                          Rp {city.sales.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: `${
                              (city.sales / analytics.cities[0].sales) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* REGIONAL & PRODUCT */}
          <div className="lg:col-span-7 space-y-6 flex flex-col h-[650px]">
            <Card className="flex-1 bg-slate-900/40 border-slate-800 overflow-hidden flex flex-col">
              <CardHeader className="py-3 border-b border-slate-800">
                <CardTitle className="text-xs font-black uppercase text-emerald-500 flex items-center gap-2">
                  <Globe size={16} /> Regional Matrix
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.regions} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#64748b"
                      fontSize={10}
                      width={100}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e293b",
                      }}
                    />
                    <Bar
                      dataKey="sales"
                      fill="#10b981"
                      radius={[0, 4, 4, 0]}
                      barSize={25}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="flex-1 bg-slate-900/40 border-slate-800 overflow-hidden flex flex-col">
              <CardHeader className="py-3 border-b border-slate-800">
                <CardTitle className="text-xs font-black uppercase text-fuchsia-500 flex items-center gap-2">
                  <ShoppingBag size={16} /> Product Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={analytics?.products}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1e293b"
                      vertical={false}
                      opacity={0.3}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      fontSize={9}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis stroke="#64748b" fontSize={9} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e293b",
                      }}
                    />
                    <Bar dataKey="sales" radius={[4, 4, 0, 0]} barSize={35}>
                      {analytics?.products.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
