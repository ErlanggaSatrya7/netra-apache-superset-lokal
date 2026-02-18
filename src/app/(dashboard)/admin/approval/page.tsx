"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Clock,
  ArrowRight,
  Loader2,
  Zap,
  Database,
  Hash,
  Radio,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ApprovalList() {
  const router = useRouter();
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/approval");
      if (!res.ok) {
        setBatches([]);
        return;
      }
      const rawText = await res.text();
      if (!rawText) {
        setBatches([]);
        return;
      }

      const data = JSON.parse(rawText);
      const sorted = Array.isArray(data)
        ? data
            .filter((item: any) => item.status === "PENDING")
            .sort(
              (a: any, b: any) =>
                new Date(a.upload_date).getTime() -
                new Date(b.upload_date).getTime()
            )
        : [];
      setBatches(sorted);
    } catch (err) {
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  if (!mounted || loading)
    return (
      <div className="h-full flex flex-col items-center justify-center text-[#00f2ff] gap-6">
        <div className="relative">
          <Loader2 className="animate-spin" size={64} strokeWidth={1} />
          <Zap
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse"
            size={20}
          />
        </div>
        <span className="font-black italic uppercase tracking-[0.5em] text-[10px]">
          SYNCING_APPROVAL_QUEUE...
        </span>
      </div>
    );

  return (
    <div className="p-6 lg:p-12 space-y-16 animate-in fade-in duration-700">
      {/* HEADER HUD: Consistent with Dashboard */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 border-b border-white/5 pb-12">
        <div className="text-left space-y-3 leading-none">
          <div className="flex items-center gap-3 leading-none">
            <ShieldCheck size={14} className="text-[#00f2ff] animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] leading-none">
              Registry_Authority // Protocol_V91
            </span>
          </div>
          <h1 className="text-6xl lg:text-8xl font-black italic uppercase text-white tracking-tighter leading-none">
            INBOUND_<span className="text-[#00f2ff]">QUEUE</span>
          </h1>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none flex items-center gap-2">
            <Radio size={12} className="text-[#00f2ff] animate-pulse" />{" "}
            Pending_Verification: {batches.length} Batches_Detected
          </p>
        </div>

        <div className="flex gap-8 bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl leading-none">
          <div className="text-left leading-none">
            <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest leading-none mb-2">
              Priority_Status
            </p>
            <h3 className="text-2xl font-black italic text-[#facc15] leading-none">
              URGENT_AUDIT
            </h3>
          </div>
        </div>
      </header>

      {/* QUEUE GRID */}
      {batches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {batches.map((b, i) => (
            <div
              key={i}
              className="bg-[#0b0f15] border border-white/5 p-10 rounded-[3rem] relative group hover:border-[#00f2ff]/30 transition-all flex flex-col h-[480px] leading-none overflow-hidden shadow-2xl"
            >
              {/* WATERMARK */}
              <div className="absolute -top-6 -right-4 opacity-[0.03] group-hover:opacity-10 transition-opacity pointer-events-none">
                <span className="text-[140px] font-black italic text-white leading-none">
                  0{i + 1}
                </span>
              </div>

              <div className="flex justify-between items-start mb-10 relative z-10 leading-none">
                <div className="p-4 bg-[#00f2ff]/10 rounded-2xl text-[#00f2ff] border border-[#00f2ff]/20">
                  <Clock size={24} />
                </div>
                <span className="px-4 py-1.5 bg-amber-500/10 text-amber-500 text-[8px] font-black rounded-full uppercase border border-amber-500/20 italic tracking-widest">
                  WAITING_REVIEW
                </span>
              </div>

              <div className="flex-1 mb-8 relative z-10 text-left leading-none">
                <h3 className="text-lg font-black text-white uppercase italic tracking-tighter leading-tight line-clamp-2">
                  {b.file_name}
                </h3>
              </div>

              <div className="space-y-4 border-t border-white/5 pt-8 mb-8 relative z-10 text-left leading-none">
                <div className="flex justify-between items-center leading-none">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none flex items-center gap-2">
                    <Hash size={12} className="text-[#00f2ff]" /> TX_KEY
                  </span>
                  <span className="text-white font-mono italic text-xs leading-none">
                    #TX-{b.id_upload}
                  </span>
                </div>
                <div className="flex justify-between items-center leading-none">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none flex items-center gap-2">
                    <Database size={12} className="text-[#00f2ff]" /> PAYLOAD
                  </span>
                  <span className="text-white italic text-xs leading-none">
                    {b.total_rows} Nodes
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push(`/admin/approval/${b.id_upload}`)}
                className="w-full py-5 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#00f2ff] hover:text-black transition-all flex items-center justify-center gap-3 group/btn active:scale-95 leading-none"
              >
                Audit_Payload{" "}
                <ArrowRight
                  size={14}
                  className="group-hover/btn:translate-x-1 transition-transform"
                />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 bg-white/[0.01] border border-white/5 rounded-[4rem]">
          <ShieldCheck size={80} className="text-emerald-500 mb-8 opacity-20" />
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
            Queue_Empty
          </h3>
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.5em] mt-4">
            All_Systems_Verified
          </p>
        </div>
      )}
    </div>
  );
}
