"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ArrowLeft,
  XCircle,
  Database,
  Loader2,
  Radio,
  AlertTriangle,
  Zap,
  MessageSquare,
  Send,
  User,
  Hash,
  Activity,
  Maximize2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminApprovalDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [batch, setBatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [adminReply, setAdminReply] = useState("");
  const [showFullAudit, setShowFullAudit] = useState(false);

  const fetchDetail = async (isInitial = false) => {
    try {
      // Force fresh data dengan timestamp
      const res = await fetch(`/api/admin/approval/${id}?t=${Date.now()}`);
      const result = await res.json();
      if (res.ok) {
        setBatch(result);
        if (isInitial && result.admin_response)
          setAdminReply(result.admin_response);
      }
    } catch (err) {
      toast.error("VAULT_SYNC_FAILED");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail(true);
  }, [id]);

  const handleAction = async (status: "APPROVED" | "REJECTED") => {
    if (status === "REJECTED" && !adminReply.trim())
      return toast.error("REQUIRED: Alasan penolakan wajib diisi!");

    setProcessing(true);
    const toastId = toast.loading(`Executing_${status}_Protocol...`);
    try {
      const res = await fetch(`/api/admin/approval`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_upload: Number(id),
          status: status,
          admin_comment: adminReply, // Memastikan comment terkirim
        }),
      });

      if (!res.ok) throw new Error();

      toast.success(`SYSTEM_SYNCHRONIZED: ${status}`, { id: toastId });
      setTimeout(() => {
        router.push("/admin/approval");
        router.refresh();
      }, 1200);
    } catch (err) {
      toast.error("PROTOCOL_FAILURE", { id: toastId });
    } finally {
      setProcessing(false);
    }
  };

  const formatIDR = (val: any) => {
    const num = Number(val);
    return isNaN(num) ? "0" : num.toLocaleString("id-ID");
  };

  if (loading)
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center text-primary gap-4">
        <Loader2 className="animate-spin" size={48} />
        <span className="font-black tracking-[0.5em] text-[10px] uppercase animate-pulse">
          Decrypting_Payload...
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans pt-24 lg:pt-10 p-4 lg:p-10 italic text-left leading-none selection:bg-primary/30">
      {/* STYLE: THICK YELLOW SCROLLBAR */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 14px;
          height: 14px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
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

      <div className="max-w-[1800px] mx-auto space-y-12">
        {/* HEADER BAR */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-white/10 pb-12 leading-none">
          <div className="flex items-center gap-8 leading-none">
            <button
              onClick={() => router.back()}
              className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-primary hover:text-black transition-all active:scale-90 border-none outline-none shadow-2xl"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="space-y-3 leading-none">
              <h1 className="text-5xl lg:text-7xl font-black italic text-white uppercase tracking-tighter leading-none">
                Audit_<span className="text-primary">Console</span>
              </h1>
              <div className="flex items-center gap-4 text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">
                <Hash size={12} className="text-primary" /> TX_ID: #TX-{id}{" "}
                <div className="w-1 h-1 bg-slate-800 rounded-full" />{" "}
                <Activity size={12} className="text-primary" /> STATUS:{" "}
                {batch?.status}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowFullAudit(true)}
            className="flex items-center gap-4 bg-white/5 text-primary px-8 py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-widest hover:bg-primary hover:text-black transition-all border border-white/10 outline-none leading-none shadow-2xl"
          >
            <Maximize2 size={18} /> Deep_Audit_Mode
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start leading-none text-left">
          {/* LEFT: DATA TABLE PREVIEW */}
          <div className="xl:col-span-8 space-y-8 leading-none">
            <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-[3rem] flex items-center gap-6 leading-none">
              <AlertTriangle className="text-amber-500 shrink-0" size={32} />
              <p className="text-[11px] font-black uppercase text-amber-200/70 tracking-widest leading-relaxed">
                Review 13-node manifest carefully. Approval will sync data to
                Global Warehouse.
              </p>
            </div>

            <div className="bg-[#0b1120]/60 border border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl backdrop-blur-md leading-none">
              <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center leading-none">
                <h2 className="flex items-center gap-4 text-white font-black uppercase tracking-widest text-xs italic leading-none">
                  <Database size={18} className="text-primary" /> Manifest:{" "}
                  {batch?.file_name}
                </h2>
                <div className="px-5 py-2 bg-primary/10 text-primary text-[10px] font-black rounded-full border border-primary/20 leading-none">
                  {batch?.transactions?.length} NODES
                </div>
              </div>
              <div className="max-h-[600px] overflow-auto custom-scrollbar leading-none">
                <table className="w-full text-[9px] text-left border-separate border-spacing-0 min-w-[1200px] leading-none">
                  <thead className="sticky top-0 z-20 bg-[#0b1120]">
                    <tr className="text-slate-500 font-black uppercase italic tracking-widest h-16 bg-white/5 leading-none">
                      <th className="px-8 border-b border-white/10">Date</th>
                      <th className="px-8 border-b border-white/10">
                        Retailer
                      </th>
                      <th className="px-8 border-b border-white/10 text-primary">
                        Revenue
                      </th>
                      <th className="px-8 border-b border-white/10 text-emerald-400">
                        Profit
                      </th>
                      <th className="px-8 border-b border-white/10 text-center">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 leading-none">
                    {batch?.transactions
                      ?.slice(0, 15)
                      .map((t: any, i: number) => (
                        <tr
                          key={i}
                          className="hover:bg-primary/[0.04] h-14 whitespace-nowrap leading-none uppercase group"
                        >
                          <td className="px-8 text-slate-500">
                            {new Date(t.invoice_date).toLocaleDateString()}
                          </td>
                          <td className="px-8 font-black text-white">
                            {t.retailer?.retailer_name || "N/A"}
                          </td>
                          <td className="px-8 font-mono font-black text-primary italic">
                            Rp {Number(t.total_sales).toLocaleString()}
                          </td>
                          <td className="px-8 font-mono text-emerald-500 italic">
                            Rp {Number(t.operating_profit).toLocaleString()}
                          </td>
                          <td className="px-8 text-[8px] font-black text-primary text-center tracking-tighter">
                            {t.record_status}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT: NEURAL THREAD & ACTIONS */}
          <div className="xl:col-span-4 space-y-8 leading-none">
            <div className="bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 rounded-[3.5rem] p-10 shadow-2xl backdrop-blur-md flex flex-col gap-10 leading-none">
              <div className="flex items-center gap-4 text-primary font-black uppercase text-[11px] tracking-widest italic border-b border-white/5 pb-8 leading-none">
                <MessageSquare size={18} /> Neural_Review_Thread
              </div>

              <div className="flex flex-col gap-12 leading-none text-left">
                {/* Staff Remark */}
                <div className="flex flex-col gap-4 leading-none">
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none italic">
                    <User size={12} className="text-primary" />{" "}
                    Staff_Transmission
                  </div>
                  <div className="bg-white/5 p-8 rounded-[2.5rem] rounded-tl-none border border-white/5 shadow-inner">
                    <p className="text-[14px] text-slate-300 italic font-medium leading-relaxed break-words whitespace-pre-wrap">
                      "{batch?.staff_comment || "No system remark provided."}"
                    </p>
                  </div>
                </div>

                {/* Admin Feedback Box */}
                <div className="flex flex-col gap-4 leading-none pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-widest leading-none italic">
                    <ShieldCheck size={14} /> Admin_Report_Center
                  </div>
                  <textarea
                    value={adminReply}
                    onChange={(e) => setAdminReply(e.target.value)}
                    placeholder="Type final sync feedback..."
                    className="w-full bg-black/40 border border-white/10 rounded-[2.5rem] p-8 text-[12px] font-bold min-h-[250px] outline-none focus:border-primary transition-all text-slate-200 italic resize-none leading-relaxed border-none uppercase tracking-tighter shadow-inner"
                  />
                </div>

                {/* ACTION BUTTONS (UNDER COMMENT) */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    disabled={processing}
                    onClick={() => handleAction("REJECTED")}
                    className="py-6 bg-rose-500/10 text-rose-500 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-rose-500 hover:text-white transition-all border-none outline-none leading-none active:scale-95"
                  >
                    Reject_Nodes
                  </button>
                  <button
                    disabled={processing}
                    onClick={() => handleAction("APPROVED")}
                    className="py-6 bg-primary text-black rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 border-none outline-none leading-none active:scale-95"
                  >
                    Approve_Sync
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL: FULLSCREEN DEEP AUDIT (13 COLUMNS) --- */}
      {showFullAudit && (
        <div className="fixed inset-0 z-[200] bg-[#020617]/98 backdrop-blur-3xl flex flex-col p-4 lg:p-10 animate-in fade-in zoom-in-95 duration-500 leading-none overflow-hidden">
          <div className="flex justify-between items-center mb-10 bg-white/5 p-10 rounded-[3.5rem] border border-white/10 shadow-2xl leading-none">
            <div className="space-y-3 leading-none text-left">
              <h2 className="text-4xl lg:text-6xl font-black italic text-white uppercase tracking-tighter leading-none">
                Deep_<span className="text-primary">Audit</span>
              </h2>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] mt-3 italic flex items-center gap-3 leading-none">
                <Radio size={12} className="text-primary animate-pulse" />{" "}
                FULL_MANIFEST_EXPOSURE: {batch?.transactions?.length} NODES
              </p>
            </div>
            <button
              onClick={() => setShowFullAudit(false)}
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
                  <th className="px-8 text-center text-primary">Sales</th>
                  <th className="px-8 text-center text-emerald-400">Profit</th>
                  <th className="px-8 text-center">Margin</th>
                  <th className="px-8 text-center italic">Method</th>
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
                    className="h-16 hover:bg-primary/[0.08] transition-all whitespace-nowrap text-center leading-none group"
                  >
                    <td className="px-8 text-left font-black text-white sticky left-0 bg-[#0c1222]/95 backdrop-blur-md border-r border-white/20 shadow-2xl">
                      {t.retailer?.retailer_name || "N/A"}
                    </td>
                    <td className="px-8 text-slate-400 font-mono italic">
                      {new Date(t.invoice_date).toLocaleDateString()}
                    </td>
                    <td className="px-8 text-slate-200">
                      {t.product?.product || "N/A"}
                    </td>
                    <td className="px-8 font-mono">
                      Rp {formatIDR(t.price_per_unit)}
                    </td>
                    <td className="px-8 text-white">{t.unit_sold}</td>
                    <td className="px-8 font-black text-primary italic">
                      Rp {formatIDR(t.total_sales)}
                    </td>
                    <td className="px-8 font-black text-emerald-400">
                      Rp {formatIDR(t.operating_profit)}
                    </td>
                    <td className="px-8 text-slate-500">
                      {(Number(t.operating_margin) * 100).toFixed(0)}%
                    </td>
                    <td className="px-8 text-slate-600 font-black italic text-[9px]">
                      {t.method?.method || "N/A"}
                    </td>
                    <td className="px-8 text-slate-500">
                      {t.city?.city || "N/A"}
                    </td>
                    <td className="px-8 text-slate-600">
                      {t.city?.state?.state || "N/A"}
                    </td>
                    <td className="px-8 text-primary font-black italic">
                      {t.city?.state?.region || "N/A"}
                    </td>
                    <td className="px-8 text-primary font-black italic text-[8px] uppercase">
                      {t.record_status}
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
