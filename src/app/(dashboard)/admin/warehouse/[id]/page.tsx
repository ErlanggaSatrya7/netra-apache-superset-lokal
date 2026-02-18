"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Database,
  Loader2,
  Hash,
  Activity,
  Maximize2,
  X,
  Radio,
  MoveRight,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function DatasetDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFullAudit, setShowFullAudit] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/warehouse?datasetId=${id}`)
      .then((res) => res.json())
      .then((result) => {
        setData(Array.isArray(result) ? result : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center text-primary gap-4">
        <Loader2 className="animate-spin" size={48} />
        <span className="font-black tracking-[0.5em] text-[10px] uppercase">
          Decrypting_Global_Vault...
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 lg:p-10 pt-24 lg:pt-10 italic leading-none selection:bg-primary/30">
      {/* --- STYLE INJECTION: THICK SCROLLBAR PROTOCOL --- */}
      <style jsx global>{`
        /* Ukuran Scrollbar Horizontal & Vertical */
        .custom-scrollbar::-webkit-scrollbar {
          width: 14px; /* Tebal vertical */
          height: 14px; /* Tebal horizontal */
        }
        /* Background Scrollbar */
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        /* Handle / Batang Scrollbar */
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          border: 3px solid #020617; /* Efek gap biar kelihatan melayang */
        }
        /* Hover Handle - Biar Gampang Keliatan */
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #facc15; /* Warna Primary Kuning */
        }
      `}</style>

      <div className="max-w-full mx-auto space-y-10 leading-none">
        {/* HEADER AREA */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-white/10 pb-10 leading-none text-left">
          <div className="space-y-6 leading-none">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[10px] font-black uppercase text-primary hover:gap-4 transition-all w-fit outline-none"
            >
              <ChevronLeft size={16} /> Back_To_Warehouse
            </button>

            <div className="space-y-4 leading-none">
              <h1 className="text-4xl lg:text-7xl font-black italic text-white uppercase tracking-tighter leading-none text-left">
                Vault_<span className="text-primary">Audit</span>
              </h1>
              <div className="flex items-center gap-6 text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none italic">
                <span className="flex items-center gap-2">
                  <Hash size={12} className="text-primary" /> BATCH: #{id}
                </span>
                <div className="w-1 h-1 bg-slate-800 rounded-full" />
                <span className="flex items-center gap-2 text-emerald-500">
                  <Activity size={12} /> STORAGE: STABLE
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowFullAudit(true)}
            className="group flex items-center gap-4 bg-primary text-black px-10 py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl border-none outline-none leading-none"
          >
            <Maximize2 size={18} /> Deep_Dive_Mode
          </button>
        </div>

        {data.length > 0 ? (
          <div className="bg-[#0b1120]/60 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-md leading-none">
            {/* Class 'custom-scrollbar' sekarang punya style tebal */}
            <div className="overflow-x-auto custom-scrollbar leading-none">
              <table className="w-full text-[10px] text-left border-separate border-spacing-0 min-w-[2200px] leading-none">
                <thead>
                  <tr className="bg-white/5 text-slate-500 font-black h-20 italic border-b border-white/10 uppercase tracking-widest leading-none">
                    <th className="px-8 sticky left-0 bg-[#0c1222] border-r border-white/10 z-20 text-primary">
                      Retailer
                    </th>
                    <th className="px-6">Inv_Date</th>
                    <th className="px-6">Region</th>
                    <th className="px-6">State</th>
                    <th className="px-6">City</th>
                    <th className="px-6">Product</th>
                    <th className="px-6 text-primary">Price</th>
                    <th className="px-6 text-center">Units</th>
                    <th className="px-6 text-primary">Revenue</th>
                    <th className="px-6 text-emerald-400">Profit</th>
                    <th className="px-6 text-center">Margin</th>
                    <th className="px-6">Method</th>
                    <th className="px-8 text-right">Node_Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 leading-none">
                  {data.slice(0, 15).map((t, i) => (
                    <tr
                      key={i}
                      className="hover:bg-primary/[0.04] h-14 whitespace-nowrap transition-all uppercase group leading-none"
                    >
                      <td className="px-8 font-black text-white sticky left-0 bg-[#0c1222] border-r border-white/5 z-10 group-hover:bg-[#151c2e] leading-none">
                        {renderValue(t.retailer, "retailer_name")}
                      </td>
                      <td className="px-6 text-slate-400">
                        {t.invoice_date
                          ? new Date(t.invoice_date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-6 text-primary font-black italic">
                        {t.city?.state?.region || t.region || "-"}
                      </td>
                      <td className="px-6 text-slate-500">
                        {t.city?.state?.state || t.state || "-"}
                      </td>
                      <td className="px-6 text-slate-500">
                        {renderValue(t.city, "city")}
                      </td>
                      <td className="px-6 font-bold text-slate-300 italic">
                        {renderValue(t.product, "product")}
                      </td>
                      <td className="px-6 font-mono font-bold leading-none">
                        Rp {formatIDR(t.price_per_unit || t.price)}
                      </td>
                      <td className="px-6 text-center font-black text-white leading-none">
                        {t.unit_sold || t.units}
                      </td>
                      <td className="px-6 font-mono font-black text-primary italic leading-none">
                        Rp {formatIDR(t.total_sales || t.sales)}
                      </td>
                      <td className="px-6 font-mono text-emerald-500 italic leading-none">
                        Rp {formatIDR(t.operating_profit || t.profit)}
                      </td>
                      <td className="px-6 text-center font-black leading-none">
                        {(Number(t.operating_margin || t.margin) * 100).toFixed(
                          0
                        )}
                        %
                      </td>
                      <td className="px-6 text-slate-500 font-black italic leading-none">
                        {renderValue(t.method, "method")}
                      </td>
                      <td className="px-8 text-right text-slate-700 font-mono text-[8px]">
                        #NODE-{t.id_transaction || i}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-10 border-t border-white/5 bg-white/[0.02] flex justify-center items-center gap-4">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">
                Previewing Stable Nodes. Use Deep Dive for full horizontal
                audit.
              </p>
              <MoveRight size={16} className="text-primary animate-bounce-x" />
            </div>
          </div>
        ) : (
          <div className="py-40 text-center border-2 border-dashed border-white/5 rounded-[4rem] bg-white/[0.01]">
            <Database size={64} className="text-slate-800 mb-6 mx-auto" />
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">
              Node_Payload_Empty
            </h3>
          </div>
        )}
      </div>

      {/* --- MODAL DEEP DIVE DENGAN SCROLLBAR TEBAL --- */}
      {showFullAudit && (
        <div className="fixed inset-0 z-[200] bg-[#020617]/98 backdrop-blur-3xl flex flex-col p-4 lg:p-10 animate-in fade-in zoom-in-95 duration-500 leading-none overflow-hidden">
          <div className="flex justify-between items-center mb-10 bg-white/5 p-10 rounded-[3.5rem] border border-white/10 shadow-2xl">
            <div className="space-y-3 leading-none text-left">
              <h2 className="text-4xl lg:text-6xl font-black italic text-white uppercase tracking-tighter leading-none text-left">
                Registry_<span className="text-primary">Deep_Dive</span>
              </h2>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] mt-3 italic flex items-center gap-3 leading-none">
                <Radio size={12} className="text-primary animate-pulse" />{" "}
                ANALYZING_MANIFEST: {data.length} NODES
              </p>
            </div>
            <button
              onClick={() => setShowFullAudit(false)}
              className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-rose-500 hover:text-white transition-all outline-none active:scale-90 border-none"
            >
              <X size={32} />
            </button>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar border border-white/10 rounded-[3.5rem] bg-black/40 leading-none">
            <table className="w-full text-[10px] text-left border-separate border-spacing-0 min-w-[2800px] leading-none">
              <thead className="sticky top-0 z-50">
                <tr className="bg-[#0c1222] text-slate-500 uppercase font-black tracking-widest italic h-20 border-b border-white/10 leading-none">
                  <th className="px-8 text-center text-primary sticky left-0 bg-[#0c1222] border-r border-white/20 shadow-2xl">
                    Retailer
                  </th>
                  <th className="px-8 text-center">Inv_Date</th>
                  <th className="px-8 text-center text-primary">Region</th>
                  <th className="px-8 text-center">State</th>
                  <th className="px-8 text-center">City</th>
                  <th className="px-8 text-center">Product</th>
                  <th className="px-8 text-center text-white">Price_Node</th>
                  <th className="px-8 text-center">Units_Sold</th>
                  <th className="px-8 text-center text-primary">
                    Gross_Revenue
                  </th>
                  <th className="px-8 text-center text-emerald-400">
                    Operating_Profit
                  </th>
                  <th className="px-8 text-center">Margin_Rate</th>
                  <th className="px-8 text-center italic">Method_Key</th>
                  <th className="px-8 text-center">Record_Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 leading-none uppercase">
                {data.map((t, i) => (
                  <tr
                    key={i}
                    className="h-16 hover:bg-primary/[0.08] transition-all whitespace-nowrap text-center leading-none group"
                  >
                    <td className="px-8 font-black text-white text-xs sticky left-0 bg-[#0c1222]/95 backdrop-blur-md border-r border-white/20 shadow-2xl">
                      {renderValue(t.retailer, "retailer_name")}
                    </td>
                    <td className="px-8 text-slate-400 font-mono italic">
                      {t.invoice_date
                        ? new Date(t.invoice_date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-8 text-primary font-black italic text-xs">
                      {t.city?.state?.region || t.region || "-"}
                    </td>
                    <td className="px-8 text-slate-500">
                      {t.city?.state?.state || t.state || "-"}
                    </td>
                    <td className="px-8 text-slate-500">
                      {renderValue(t.city, "city")}
                    </td>
                    <td className="px-8 font-bold text-slate-200 italic tracking-tighter text-xs">
                      {renderValue(t.product, "product")}
                    </td>
                    <td className="px-8 font-mono font-bold">
                      Rp {formatIDR(t.price_per_unit || t.price)}
                    </td>
                    <td className="px-8 font-black text-white">
                      {t.unit_sold || t.units}
                    </td>
                    <td className="px-8 font-black text-primary italic">
                      Rp {formatIDR(t.total_sales || t.sales)}
                    </td>
                    <td className="px-8 font-black text-emerald-400">
                      Rp {formatIDR(t.operating_profit || t.profit)}
                    </td>
                    <td className="px-8 font-black text-slate-400">
                      {(Number(t.operating_margin || t.margin) * 100).toFixed(
                        0
                      )}
                      %
                    </td>
                    <td className="px-8 text-slate-600 font-black italic text-[10px]">
                      {renderValue(t.method, "method")}
                    </td>
                    <td className="px-8 text-primary font-black italic">
                      STABLE_STORAGE
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
