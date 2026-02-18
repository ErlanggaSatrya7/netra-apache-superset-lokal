"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  FileSpreadsheet,
  Trash2,
  Loader2,
  ArrowRight,
  Menu,
  Zap,
  LayoutDashboard,
  ShieldCheck,
  Clock,
  Calendar,
  LogOut,
  Radio,
  AlertTriangle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DataWarehouse() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const mode = activeTab === 1 ? "raw" : "datasets";
      // Pastikan API membalas dengan status APPROVED
      const res = await fetch(
        `/api/admin/warehouse?mode=${mode}&status=APPROVED`
      );
      const result = await res.json();

      if (!res.ok) throw new Error("FETCH_FAILED");

      // Logic Filter yang lebih kuat
      const secureData = Array.isArray(result) ? result : [];
      setData(secureData);
    } catch (error) {
      console.error(error);
      toast.error("VAULT_ACCESS_ERROR: CONNECTION_INTERRUPTED");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, [activeTab]);

  const formatIDR = (val: any) => {
    const num = Number(val);
    return isNaN(num) ? "0" : num.toLocaleString("id-ID");
  };

  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans italic pt-24 lg:pt-10 p-4 lg:p-10 overflow-x-hidden text-left leading-none">
      {/* MOBILE NAV (Tetap sama gahar) */}
      <div className="lg:hidden fixed top-0 left-0 w-full z-[100] p-4 bg-[#020617]/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2.5 text-primary bg-white/10 rounded-xl border border-white/20 outline-none transition-all border-none">
              <Menu size={22} />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-[#020617] border-r border-white/10 text-slate-300 p-0 focus-visible:outline-none flex flex-col h-full leading-none"
          >
            <div className="p-8 border-b border-white/5 flex items-center gap-3">
              <Zap className="text-primary" fill="currentColor" size={24} />
              <span className="font-black italic text-2xl uppercase text-white tracking-tighter">
                Titan_<span className="text-primary">VX</span>
              </span>
            </div>
            <nav className="p-4 space-y-2 font-black uppercase italic text-[10px] tracking-widest text-left flex-1 leading-none text-slate-500">
              <button
                onClick={() => router.push("/admin")}
                className="flex items-center gap-4 w-full p-5 rounded-2xl hover:bg-white/5 transition-all border-none"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push("/admin/approval")}
                className="flex items-center gap-4 w-full p-5 rounded-2xl hover:bg-white/5 transition-all border-none"
              >
                Approval_Center
              </button>
              <button
                onClick={() => router.push("/admin/warehouse")}
                className="flex items-center gap-4 w-full p-5 rounded-2xl bg-primary text-black font-black transition-all border-none shadow-lg"
              >
                Warehouse_Root
              </button>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="font-black uppercase italic text-white text-lg tracking-tighter leading-none">
          Titan<span className="text-primary">VX</span>
        </div>
      </div>

      <div className="max-w-full mx-auto space-y-12">
        <div className="space-y-4 border-b border-white/10 pb-12 text-left">
          <h1 className="text-5xl lg:text-8xl font-black italic uppercase text-white tracking-tighter leading-none">
            Vault_<span className="text-primary">Warehouse</span>
          </h1>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none flex items-center gap-2">
            <Radio size={12} className="text-emerald-500 animate-pulse" />{" "}
            Global_Finalized_Registry
          </p>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex bg-black/60 p-1.5 rounded-[1.5rem] border border-white/10 shadow-2xl w-full lg:w-fit backdrop-blur-md">
          <button
            onClick={() => setActiveTab(1)}
            className={cn(
              "flex-1 lg:flex-none px-8 py-3.5 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap italic tracking-widest leading-none border-none outline-none",
              activeTab === 1
                ? "bg-white/10 text-white shadow-inner"
                : "text-slate-600 hover:text-slate-400"
            )}
          >
            Tab_1: Secure_Raw_Rows
          </button>
          <button
            onClick={() => setActiveTab(2)}
            className={cn(
              "flex-1 lg:flex-none px-8 py-3.5 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap italic tracking-widest leading-none border-none outline-none",
              activeTab === 2
                ? "bg-primary text-black shadow-lg shadow-primary/20"
                : "text-slate-600 hover:text-slate-400"
            )}
          >
            Tab_2: Approved_Datasets
          </button>
        </div>

        {loading ? (
          <div className="h-60 flex items-center justify-center text-primary">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : (
          <>
            {/* --- TAB 1: SECURE RAW VIEW (FIXED OBJECT RENDER ERROR) --- */}
            {activeTab === 1 && (
              <div className="animate-in fade-in duration-500">
                {data.length > 0 ? (
                  <div className="bg-[#0b1120]/60 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-md">
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-[10px] text-left border-separate border-spacing-0 min-w-[2000px]">
                        <thead>
                          <tr className="bg-white/5 text-slate-500 font-black uppercase h-16 border-b border-white/10 italic tracking-widest leading-none">
                            <th className="px-6 sticky left-0 bg-[#0c1222] border-r border-white/10 z-20 text-primary">
                              Retailer
                            </th>
                            <th className="px-6">Inv_Date</th>
                            <th className="px-6">Region</th>
                            <th className="px-6">State</th>
                            <th className="px-6">City</th>
                            <th className="px-6">Product</th>
                            <th className="px-6 text-primary">Price</th>
                            <th className="px-6 text-center">Units</th>
                            <th className="px-6 text-primary">Total_Sales</th>
                            <th className="px-6 text-emerald-400">Profit</th>
                            <th className="px-6 text-center">Margin</th>
                            <th className="px-6">Method</th>
                            <th className="px-6">TX_ID</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 leading-none">
                          {data.map((t, i) => (
                            <tr
                              key={i}
                              className="hover:bg-primary/[0.04] h-14 whitespace-nowrap transition-all uppercase group leading-none"
                            >
                              {/* FIX: Ambil .retailer_name, bukan object t.retailer */}
                              <td className="px-6 font-black text-white sticky left-0 bg-[#0c1222] border-r border-white/5 z-10 group-hover:bg-[#151c2e] leading-none">
                                {typeof t.retailer === "object"
                                  ? t.retailer?.retailer_name
                                  : t.retailer || "-"}
                              </td>
                              <td className="px-6 text-slate-400">
                                {new Date(t.invoice_date).toLocaleDateString()}
                              </td>
                              <td className="px-6 text-primary font-black italic">
                                {t.city?.state?.region || t.region || "-"}
                              </td>
                              <td className="px-6 text-slate-500">
                                {t.city?.state?.state || t.state || "-"}
                              </td>
                              <td className="px-6 text-slate-500">
                                {t.city?.city || t.city || "-"}
                              </td>
                              {/* FIX: Ambil .product, bukan object t.product */}
                              <td className="px-6 font-bold text-slate-300 italic">
                                {typeof t.product === "object"
                                  ? t.product?.product
                                  : t.product || "-"}
                              </td>
                              <td className="px-6 font-mono font-bold">
                                Rp {formatIDR(t.price_per_unit || t.price)}
                              </td>
                              <td className="px-6 text-center font-black text-white">
                                {t.unit_sold || t.units}
                              </td>
                              <td className="px-6 font-mono font-black text-primary italic">
                                Rp {formatIDR(t.total_sales || t.sales)}
                              </td>
                              <td className="px-6 font-mono text-emerald-500 italic">
                                Rp {formatIDR(t.operating_profit || t.profit)}
                              </td>
                              <td className="px-6 text-center font-black italic">
                                {(
                                  Number(t.operating_margin || t.margin) * 100
                                ).toFixed(0)}
                                %
                              </td>
                              {/* FIX: Ambil .method, bukan object t.method */}
                              <td className="px-6 text-slate-500 font-black italic">
                                {typeof t.method === "object"
                                  ? t.method?.method
                                  : t.method || "-"}
                              </td>
                              <td className="px-6 text-slate-700 font-mono text-[8px]">
                                #TX-{t.id_upload}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <EmptyWarehouseState
                    title="Vault_Raw_Empty"
                    desc="Dataset raw belum tersedia. Pastikan sinkronisasi data dari Approval Center telah selesai."
                    btnLabel="Go_To_Approval"
                    onClick={() => router.push("/admin/approval")}
                  />
                )}
              </div>
            )}

            {/* --- TAB 2: DATASET NODES (GRID VIEW) --- */}
            {activeTab === 2 && (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                {data.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {data.map((ds, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 p-10 rounded-[3rem] relative group hover:border-primary/40 transition-all shadow-2xl overflow-hidden backdrop-blur-md text-left flex flex-col min-h-[450px]"
                      >
                        <div className="absolute -top-4 -right-2 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                          <span className="text-[100px] font-black italic text-white tracking-tighter">
                            {i < 9 ? `0${i + 1}` : i + 1}
                          </span>
                        </div>
                        <div className="flex justify-between items-start mb-8 leading-none relative z-10">
                          <div className="p-4 bg-emerald-500/10 rounded-[1.5rem] text-emerald-400 border border-emerald-500/20 shadow-lg">
                            <FileSpreadsheet size={28} />
                          </div>
                        </div>
                        <h3 className="text-lg font-black text-white uppercase italic break-words mb-8 tracking-tighter leading-tight relative z-10 flex-1 pr-6">
                          {ds.file_name}
                        </h3>
                        <div className="space-y-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-t border-white/5 pt-8 relative z-10 leading-none">
                          <div className="flex justify-between items-center">
                            <span>
                              <Clock
                                size={12}
                                className="inline mr-2 text-primary"
                              />{" "}
                              Sync_Time:
                            </span>
                            <span className="text-white font-mono">
                              {new Date(ds.upload_date).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>
                              <Database
                                size={12}
                                className="inline mr-2 text-primary"
                              />{" "}
                              Nodes:
                            </span>
                            <span className="text-primary italic font-black">
                              {ds._count?.transactions || 0} Rows
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            router.push(`/admin/warehouse/${ds.id_upload}`)
                          }
                          className="w-full mt-10 py-6 bg-white/5 text-slate-300 rounded-[1.5rem] text-[10px] font-black uppercase hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-4 border border-white/5 outline-none relative z-10 leading-none"
                        >
                          Audit_Nodes <ArrowRight size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyWarehouseState
                    title="Registry_Empty"
                    desc="Belum ada dataset yang disetujui untuk ditampilkan."
                    btnLabel="Approval_Queue"
                    onClick={() => router.push("/admin/approval")}
                    icon={<AlertTriangle size={48} />}
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyWarehouseState({ title, desc, btnLabel, onClick, icon }: any) {
  return (
    <div className="flex flex-col items-center justify-center py-32 border border-white/5 rounded-[4rem] bg-white/[0.01] backdrop-blur-sm text-center px-6 leading-none">
      <div className="p-8 bg-amber-500/10 rounded-full text-amber-500 mb-10 border border-amber-500/20 animate-pulse">
        {icon || <Database size={48} />}
      </div>
      <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">
        {title}
      </h3>
      <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em] mb-10 italic max-w-md leading-relaxed">
        {desc}
      </p>
      <button
        onClick={onClick}
        className="flex items-center gap-4 px-10 py-5 bg-primary text-black rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all border-none outline-none"
      >
        {btnLabel} <ArrowRight size={16} />
      </button>
    </div>
  );
}
