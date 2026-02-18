"use client";

import React, { useState, useEffect, use as useReact } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Database,
  ShieldCheck,
  MessageSquare,
  Loader2,
  Hash,
  Activity,
  Zap,
  Maximize2,
  X,
  Radio,
  User,
  MoveRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StaffHistoryDetail({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = useReact(params);
  const id = resolvedParams.id;

  const [batch, setBatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    // FIX: Jangan masukkan router ke sini. Cukup ID.
    if (!id || id === "undefined") return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/approval/${id}?t=${Date.now()}`);

        if (!res.ok) {
          if (res.status === 404) {
            toast.error("DATA_MANIFEST_NOT_FOUND");
            router.push("/staff/history");
            return;
          }
          throw new Error(`SERVER_ERROR_${res.status}`);
        }

        const data = await res.json();
        setBatch(data);
      } catch (error: any) {
        console.error("SYNC_ERROR:", error);
        toast.error("VAULT_DECRYPTION_FAILED");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    // KUNCI PERBAIKAN: Dependency array harus konstan (hanya id)
  }, [id]);

  const formatIDR = (val: any) => {
    const num = Number(val);
    return isNaN(num) ? "0" : num.toLocaleString("id-ID");
  };

  const renderValue = (val: any, key: string) => {
    if (!val) return "-";
    if (typeof val === "object") return val[key] || "-";
    return val;
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#020617] text-primary gap-4 leading-none">
        <Loader2 className="animate-spin" size={48} />
        <span className="font-black italic uppercase tracking-[0.5em] text-[10px]">
          Accessing_Neural_Vault...
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans italic pt-24 lg:pt-10 p-4 lg:p-10 text-left leading-none selection:bg-primary/30">
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 14px;
          height: 14px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          border: 3px solid #020617;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #facc15;
        }
      `}</style>

      <div className="max-w-full mx-auto space-y-12 leading-none">
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-white/10 pb-12 leading-none text-left text-white">
          <div className="flex items-center gap-8 leading-none">
            <button
              onClick={() => router.push("/staff/history")}
              className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-primary hover:text-black transition-all active:scale-90 shadow-2xl outline-none border-none"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="space-y-3 leading-none text-left">
              <h1 className="text-5xl lg:text-7xl font-black italic text-white uppercase tracking-tighter leading-none text-left">
                Audit_<span className="text-primary">Node</span>
              </h1>
              <div className="flex items-center gap-4 italic text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">
                <Hash size={12} className="text-primary" /> BATCH_ID: #{id}
                <div className="w-1 h-1 bg-slate-800 rounded-full" />
                <Activity size={12} className="text-primary" /> ENCRYPTION:
                STABLE
              </div>
            </div>
          </div>

          <div
            className={cn(
              "flex items-center gap-6 px-10 py-5 rounded-[2.5rem] border shadow-2xl backdrop-blur-xl w-full lg:w-auto leading-none transition-all duration-500",
              batch?.status === "APPROVED"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : batch?.status === "REJECTED"
                ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                : "border-amber-500/30 bg-amber-500/5 text-amber-400"
            )}
          >
            <ShieldCheck size={28} />
            <div className="flex flex-col uppercase italic leading-none text-left">
              <span className="text-[9px] font-black text-slate-500 mb-1 tracking-widest leading-none">
                Protocol_Result
              </span>
              <span className="text-lg font-black tracking-tighter leading-none">
                {batch?.status || "PENDING"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start leading-none">
          {/* LEFT: DATA TABLE PREVIEW */}
          <div className="xl:col-span-8 space-y-8 leading-none">
            <div className="bg-[#0b1120]/60 border border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl backdrop-blur-md leading-none text-left">
              <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center leading-none">
                <h2 className="flex items-center gap-4 text-white font-black uppercase tracking-widest text-xs italic leading-none text-left">
                  <Database size={18} className="text-primary" />{" "}
                  Manifest_Payload: {batch?.file_name}
                </h2>
                <button
                  onClick={() => setShowFull(true)}
                  className="group flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-full font-black uppercase text-[9px] tracking-widest hover:scale-105 transition-all outline-none border-none leading-none"
                >
                  Deep_Dive_Audit <Maximize2 size={12} />
                </button>
              </div>
              <div className="overflow-x-auto custom-scrollbar leading-none">
                <table className="w-full text-[10px] text-left border-separate border-spacing-0 min-w-[1200px] leading-none uppercase font-bold">
                  <thead>
                    <tr className="bg-white/5 text-slate-500 h-16 border-b border-white/10 italic tracking-widest leading-none">
                      <th className="px-8 sticky left-0 bg-[#0c1222] z-10 border-r border-white/10">
                        Retailer
                      </th>
                      <th className="px-8 text-center">Date</th>
                      <th className="px-8 text-center">Product</th>
                      <th className="px-8 text-center text-primary">Revenue</th>
                      <th className="px-8 text-center text-emerald-400">
                        Profit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 leading-none">
                    {batch?.transactions
                      ?.slice(0, 10)
                      .map((t: any, i: number) => (
                        <tr
                          key={i}
                          className="h-16 hover:bg-white/[0.04] transition-all group leading-none"
                        >
                          <td className="px-8 font-black text-white sticky left-0 bg-[#0c1222] group-hover:bg-[#151c2e] transition-colors border-r border-white/5 leading-none">
                            {renderValue(t.retailer, "retailer_name")}
                          </td>
                          <td className="px-8 text-center text-slate-500 font-mono italic leading-none">
                            {t.invoice_date
                              ? new Date(t.invoice_date).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="px-8 text-center text-slate-300 italic leading-none">
                            {renderValue(t.product, "product")}
                          </td>
                          <td className="px-8 text-center font-mono font-black text-primary italic leading-none">
                            Rp {formatIDR(t.total_sales)}
                          </td>
                          <td className="px-8 text-center font-mono text-emerald-500 italic leading-none">
                            Rp {formatIDR(t.operating_profit)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT: CHAT THREAD */}
          <div className="xl:col-span-4 space-y-8 leading-none">
            <div className="bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 rounded-[3.5rem] p-10 shadow-2xl backdrop-blur-md flex flex-col gap-10 leading-none min-h-[500px]">
              <div className="flex items-center gap-4 text-primary font-black uppercase text-[11px] tracking-widest italic border-b border-white/5 pb-8 leading-none">
                <MessageSquare size={18} /> Neural_Thread
              </div>

              <div className="flex flex-col gap-10 leading-none text-left">
                <div className="space-y-4 leading-none">
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                    <User size={12} className="text-primary" />{" "}
                    Staff_Transmission:
                  </div>
                  <div className="bg-white/5 p-8 rounded-[2.5rem] rounded-tl-none border border-white/5 shadow-inner leading-none">
                    <p className="text-[14px] text-slate-300 italic font-bold leading-relaxed break-words whitespace-pre-wrap">
                      "
                      {batch?.staff_comment ||
                        "No system remark provided by staff."}
                      "
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5 leading-none">
                  <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-widest italic leading-none">
                    <ShieldCheck size={14} /> Admin_Response:
                  </div>
                  <div className="bg-primary/5 p-8 rounded-[2.5rem] rounded-tl-none border border-primary/10 shadow-inner leading-none">
                    <p className="text-[14px] text-white italic font-black leading-relaxed break-words whitespace-pre-wrap uppercase">
                      {batch?.admin_response &&
                      batch.admin_response.trim() !== ""
                        ? `"${batch.admin_response}"`
                        : batch?.status === "PENDING"
                        ? "Neural synchronization in progress..."
                        : "Approved without remarks."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL FULL AUDIT */}
      {showFull && (
        <div className="fixed inset-0 z-[200] bg-[#020617]/98 backdrop-blur-3xl flex flex-col p-4 lg:p-10 animate-in fade-in duration-500 leading-none overflow-hidden">
          <div className="flex justify-between items-center mb-10 bg-white/5 p-10 rounded-[3.5rem] border border-white/10 text-left leading-none">
            <div className="space-y-3 leading-none text-left">
              <h2 className="text-4xl lg:text-7xl font-black italic text-white uppercase tracking-tighter leading-none text-left">
                Registry_<span className="text-primary">Audit</span>
              </h2>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] mt-3 italic flex items-center gap-3 leading-none text-left">
                <Radio size={12} className="text-primary animate-pulse" />{" "}
                FULL_MANIFEST_EXPOSURE: {batch?.transactions?.length || 0} NODES
              </p>
            </div>
            <button
              onClick={() => setShowFull(false)}
              className="p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-rose-500 hover:text-white transition-all outline-none border-none active:scale-90"
            >
              <X size={32} />
            </button>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar border border-white/10 rounded-[3.5rem] bg-black/40 leading-none">
            <table className="w-full text-[10px] text-left border-separate border-spacing-0 min-w-[2800px] leading-none uppercase font-bold">
              <thead className="sticky top-0 z-50">
                <tr className="bg-[#0c1222] text-slate-500 h-20 border-b border-white/10 tracking-widest italic leading-none">
                  <th className="px-8 sticky left-0 bg-[#0c1222] border-r border-white/20 text-primary text-center">
                    Retailer
                  </th>
                  <th className="px-8 text-center">Inv_Date</th>
                  <th className="px-8 text-center">Product</th>
                  <th className="px-8 text-center">Price</th>
                  <th className="px-8 text-center">Units</th>
                  <th className="px-8 text-center text-primary">Revenue</th>
                  <th className="px-8 text-center text-emerald-400">Profit</th>
                  <th className="px-8 text-center">Margin</th>
                  <th className="px-8 text-center">Method</th>
                  <th className="px-8 text-center">City</th>
                  <th className="px-8 text-center">State</th>
                  <th className="px-8 text-center text-primary italic">
                    Region
                  </th>
                  <th className="px-8 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {batch?.transactions?.map((t: any, i: number) => (
                  <tr
                    key={i}
                    className="h-16 hover:bg-primary/[0.08] transition-all whitespace-nowrap text-center leading-none"
                  >
                    <td className="px-8 text-left font-black text-white text-xs sticky left-0 bg-[#0c1222]/95 backdrop-blur-md border-r border-white/20 shadow-2xl leading-none italic">
                      {renderValue(t.retailer, "retailer_name")}
                    </td>
                    <td className="px-8 font-mono leading-none">
                      {t.invoice_date
                        ? new Date(t.invoice_date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-8 leading-none">
                      {renderValue(t.product, "product")}
                    </td>
                    <td className="px-8 font-mono leading-none">
                      Rp {formatIDR(t.price_per_unit)}
                    </td>
                    <td className="px-8 font-black text-white leading-none">
                      {t.unit_sold}
                    </td>
                    <td className="px-8 font-black text-primary italic leading-none">
                      Rp {formatIDR(t.total_sales)}
                    </td>
                    <td className="px-8 font-black text-emerald-400 leading-none">
                      Rp {formatIDR(t.operating_profit)}
                    </td>
                    <td className="px-8 font-black text-slate-500 leading-none">
                      {(Number(t.operating_margin) * 100).toFixed(0)}%
                    </td>
                    <td className="px-8 text-slate-600 font-black italic text-[9px] leading-none">
                      {renderValue(t.method, "method")}
                    </td>
                    <td className="px-8 text-slate-500 leading-none">
                      {renderValue(t.city, "city")}
                    </td>
                    <td className="px-8 text-slate-600 leading-none">
                      {t.city?.state?.state || "-"}
                    </td>
                    <td className="px-8 text-primary font-black italic leading-none">
                      {t.city?.state?.region || "-"}
                    </td>
                    <td className="px-8 text-primary font-black italic text-[8px] leading-none">
                      STABLE
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
