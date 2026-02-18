"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  FileSpreadsheet,
  Trash2,
  Loader2,
  ArrowRight,
  Zap,
  Radio,
  Clock,
  ShieldCheck,
  RefreshCcw,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DataWarehouse() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [purgingId, setPurgingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const mode = activeTab === 1 ? "raw" : "datasets";
      const res = await fetch(
        `/api/admin/warehouse?mode=${mode}&status=APPROVED`
      );
      const result = await res.json();

      if (!res.ok) throw new Error("VAULT_ACCESS_DENIED");

      // 🛡️ SECURITY LOCKDOWN: Double Filter di Frontend
      const secureData = Array.isArray(result)
        ? result.filter((item: any) => {
            if (activeTab === 1) {
              const status = item.upload_history?.status || item.status;
              return status === "APPROVED";
            }
            return item.status === "APPROVED";
          })
        : [];

      setData(secureData);
    } catch (error) {
      toast.error("VAULT_ERROR: DATA_LEAK_PREVENTED");
    } finally {
      setLoading(false);
    }
  };

  const handlePurge = async (id: string) => {
    if (!confirm("⚠️ WARNING: Musnahkan dataset ini selamanya dari Vault?"))
      return;
    setPurgingId(id);
    try {
      const res = await fetch(`/api/admin/warehouse/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("PURGE_FAILED");
      toast.success("DATASET_PURGED: Database Sterilized");
      fetchData();
    } catch (err: any) {
      toast.error("PURGE_DENIED: Cek API Delete Backend lu!");
    } finally {
      setPurgingId(null);
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans italic pt-24 lg:pt-10 p-4 lg:p-10 overflow-x-hidden leading-none text-left">
      <div className="max-w-full mx-auto space-y-8">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-white/10 pb-10 gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-black italic uppercase text-white tracking-tighter leading-none">
              Vault_<span className="text-primary">Warehouse</span>
            </h1>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] flex items-center gap-3 italic">
              <Radio size={12} className="text-emerald-500 animate-pulse" />
              AUTHORIZED_ONLY // STATUS: APPROVED_LOCKDOWN
            </p>
          </div>
          <button
            onClick={fetchData}
            className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:text-primary transition-all flex items-center gap-4"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">
              Sync_Registry
            </span>
          </button>
        </header>

        <div className="flex bg-black/60 p-2 rounded-[1.8rem] border border-white/10 w-fit backdrop-blur-md">
          <TabButton
            active={activeTab === 1}
            label="01_APPROVED_ROWS"
            onClick={() => setActiveTab(1)}
          />
          <TabButton
            active={activeTab === 2}
            label="02_APPROVED_DATASETS"
            onClick={() => setActiveTab(2)}
          />
        </div>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center text-primary gap-6">
            <Loader2 className="animate-spin" size={64} />
            <span className="text-[11px] font-black tracking-[0.6em] animate-pulse uppercase">
              Uplinking_Verified_Layers...
            </span>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {activeTab === 1 ? (
              /* TAB 1: DATA GABUNGAN (ALL DATASETS JOINED) */
              <div className="bg-[#0b1120]/60 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-[10px] text-left border-separate border-spacing-0 min-w-[2000px]">
                    <thead>
                      <tr className="bg-white/5 text-slate-500 font-black uppercase h-20 border-b border-white/10 italic tracking-widest leading-none">
                        <th className="px-8 sticky left-0 bg-[#0c1222] border-r border-white/10 z-30 text-primary">
                          Retailer_Node
                        </th>
                        <th className="px-8">Inv_Date</th>
                        <th className="px-8">Region</th>
                        <th className="px-8">Product</th>
                        <th className="px-8 text-primary">Revenue</th>
                        <th className="px-8 text-emerald-400">Profit</th>
                        <th className="px-8 text-center">Margin</th>
                        <th className="px-8">Source_Dataset</th>
                        <th className="px-8 text-right pr-12 text-slate-800 tracking-tighter">
                          UPLINK_ID
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {data.map((t, i) => (
                        <tr
                          key={i}
                          className="hover:bg-primary/[0.05] h-16 group transition-all uppercase whitespace-nowrap"
                        >
                          <td className="px-8 font-black text-white sticky left-0 bg-[#0c1222] border-r border-white/5 z-20 group-hover:bg-[#151c2e] leading-none">
                            {t.retailer?.retailer_name || t.retailer}
                          </td>
                          <td className="px-8 text-slate-500 font-mono">
                            {new Date(t.invoice_date).toLocaleDateString()}
                          </td>
                          <td className="px-8 text-primary font-black italic">
                            {t.city?.state?.region || t.region}
                          </td>
                          <td className="px-8 font-bold text-slate-300 italic opacity-80">
                            {t.product?.product || t.product}
                          </td>
                          <td className="px-8 font-mono font-black text-primary">
                            Rp {formatIDR(t.total_sales || t.sales)}
                          </td>
                          <td className="px-8 font-mono text-emerald-500">
                            Rp {formatIDR(t.operating_profit || t.profit)}
                          </td>
                          <td className="px-8 text-center font-black italic opacity-40">
                            {(
                              Number(t.operating_margin || t.margin) * 100
                            ).toFixed(0)}
                            %
                          </td>
                          <td className="px-8 text-slate-500 truncate max-w-[200px]">
                            {t.upload_history?.file_name || "N/A"}
                          </td>
                          <td className="px-8 text-right pr-12 text-slate-700 font-mono text-[9px]">
                            #{t.id_upload}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* TAB 2: DATASET CARDS */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {data.map((ds, i) => (
                  <div
                    key={i}
                    className="bg-white/[0.03] border border-white/10 p-8 rounded-[3rem] relative group hover:border-primary/40 transition-all shadow-2xl flex flex-col min-h-[400px] overflow-hidden backdrop-blur-md"
                  >
                    <button
                      onClick={() => handlePurge(ds.id_upload)}
                      disabled={purgingId === ds.id_upload}
                      className="absolute top-8 right-8 p-4 bg-rose-500/10 text-rose-500 rounded-2xl opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white transition-all z-20 border border-rose-500/10 shadow-xl"
                    >
                      {purgingId === ds.id_upload ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                    <div className="p-4 bg-emerald-500/10 rounded-[1.5rem] text-emerald-400 border border-emerald-500/20 w-fit mb-8 shadow-inner">
                      <FileSpreadsheet size={28} />
                    </div>
                    <h3 className="text-[13px] font-black text-white uppercase italic mb-5 tracking-tight leading-tight line-clamp-2 pr-10 min-h-[2.5rem] break-words">
                      {ds.file_name}
                    </h3>
                    <div className="space-y-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-t border-white/5 pt-8 mb-10 mt-auto">
                      <div className="flex justify-between items-center">
                        <span>
                          <Clock
                            size={12}
                            className="inline mr-2 text-primary"
                          />{" "}
                          Sync_Date:
                        </span>
                        <span className="text-white">
                          {new Date(ds.upload_date).toLocaleDateString()}
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
                          {ds._count?.transactions || 0} ROWS
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        router.push(`/admin/warehouse/${ds.id_upload}`)
                      }
                      className="w-full py-6 bg-white/5 text-slate-300 rounded-[2rem] text-[10px] font-black uppercase hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-4 border border-white/5"
                    >
                      Audit_Registry <ArrowRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

function TabButton({ active, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-12 py-4 rounded-[1.5rem] text-[10px] font-black uppercase transition-all italic tracking-[0.3em] border-none outline-none",
        active
          ? "bg-primary text-black shadow-lg shadow-primary/20"
          : "text-slate-600 hover:text-slate-300"
      )}
    >
      {label}
    </button>
  );
}
