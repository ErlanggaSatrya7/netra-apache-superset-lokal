"use client";

import React from "react";
import {
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  AlertTriangle,
  Activity,
  Database,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNeuralSync } from "@/hooks/use-neural-sync";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

/**
 * TITAN AUDIT QUEUE v32.3
 * Initiative: Pre-Audit Intelligence Metrics
 */
export default function AdminAuditQueue() {
  const { intel, loading } = useNeuralSync();
  const router = useRouter();

  // Filter hanya yang PENDING
  const pendingQueue =
    intel?.allHistory?.filter((h: any) => h.status === "PENDING") || [];

  if (loading)
    return (
      <div className="h-[60vh] flex items-center justify-center font-black tracking-[1em] text-slate-800 animate-pulse italic">
        SCANNING_INBOUND_STREAMS...
      </div>
    );

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-40 animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary">
            <Shield size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Security_Inbound_Scan
            </span>
          </div>
          <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter leading-none">
            Inbound{" "}
            <span className="text-primary font-sans lowercase italic tracking-normal">
              Queue
            </span>
          </h1>
        </div>
      </div>

      {pendingQueue.length === 0 ? (
        <div className="py-32 border-2 border-dashed border-white/5 rounded-[3rem] text-center bg-black/20">
          <CheckCircle2
            size={48}
            className="mx-auto text-emerald-500/20 mb-6"
          />
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            Global Scan Clear // No Pending Nodes
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pendingQueue.map((batch: any, i: number) => (
            <Card
              key={i}
              onClick={() => router.push(`/admin/approval/${batch.id_upload}`)}
              className="bg-[#0f172a]/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-1 overflow-hidden hover:border-primary/40 transition-all group cursor-pointer"
            >
              <div className="flex flex-col lg:flex-row items-center">
                {/* ID INDICATOR */}
                <div className="w-full lg:w-32 h-full flex items-center justify-center bg-black/40 p-8 border-r border-white/5">
                  <span className="text-2xl font-black italic text-primary">
                    #{batch.id_upload}
                  </span>
                </div>

                {/* MAIN INFO */}
                <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 text-slate-500 mb-2">
                      <Clock size={12} className="text-primary" />
                      <span className="text-[9px] font-bold uppercase">
                        {new Date(batch.upload_date).toLocaleString()}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter truncate">
                      {batch.file_name}
                    </h2>
                    <p className="text-[10px] font-mono text-slate-600 uppercase mt-1">
                      Node: {batch.uploaded_by || "STAFF_NODE"}
                    </p>
                  </div>

                  {/* MICRO ANALYTICS (INISIATIF) */}
                  <div className="flex items-center gap-10">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                        Payload
                      </p>
                      <p className="text-lg font-black text-white italic">
                        {batch.total_rows?.toLocaleString()}{" "}
                        <span className="text-[9px] text-primary not-italic">
                          NODES
                        </span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                        Integrity
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[90%]" />
                        </div>
                        <span className="text-[10px] font-black text-primary">
                          90%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="px-8 py-3 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-primary group-hover:text-white transition-all flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Inspect_Node
                      </span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
