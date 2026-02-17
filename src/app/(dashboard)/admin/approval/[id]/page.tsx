"use client";

import React, { useEffect, useState, use } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Table as TableIcon,
  Loader2,
  Zap,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * TITAN DEEP AUDIT TERMINAL v32.6
 * Feature: 13-Column Dataset with Risk Detection (Conditional Coloring)
 */
export default function DeepAuditInspection({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adminMessage, setAdminMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetch(`/api/shared/neural-sync?id_upload=${id}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  }, [id]);

  const executeDecision = async (status: "APPROVED" | "REJECTED") => {
    setIsProcessing(true);
    const loader = toast.loading(`Committing_${status}_Protocol...`);
    try {
      const res = await fetch("/api/admin/decision", {
        method: "POST",
        body: JSON.stringify({ batchId: id, decision: status, adminMessage }),
      });
      if (res.ok) {
        toast.success(`Batch_Security_Status:_${status}`, { id: loader });
        window.location.href = "/admin/approval";
      }
    } catch (e) {
      toast.error("HANDSHAKE_FAILURE");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-6 bg-[#020617]">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[1em] text-slate-500 animate-pulse italic">
          Decrypting_Batch_{id}...
        </p>
      </div>
    );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-40">
      {/* AUDIT HEADER */}
      <div className="flex items-center gap-6 border-b border-white/5 pb-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="rounded-2xl w-14 h-14 bg-white/5 border-white/5 hover:bg-primary transition-all"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter leading-none">
            Stream{" "}
            <span className="text-primary font-sans lowercase">Audit</span>
          </h1>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-1">
            Inspection_Node_Verified
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* DATA GRID SECTION */}
        <div className="xl:col-span-9">
          <Card className="bg-[#0f172a]/60 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="p-8 bg-black/20 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <TableIcon className="text-primary" size={18} />
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  Full_Matrix_13_Columns
                </span>
              </div>
              <span className="text-[10px] font-black text-primary bg-primary/10 px-4 py-1 rounded-full border border-primary/20 italic">
                Source: {data?.file_name}
              </span>
            </div>

            <div className="overflow-auto max-h-[700px] scrollbar-thin scrollbar-thumb-primary">
              <Table>
                <TableHeader className="bg-[#020617] sticky top-0 z-20 h-16">
                  <TableRow className="border-white/5 uppercase italic font-black text-[9px] text-slate-500">
                    <TableHead className="px-8">Retailer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Product_Entity</TableHead>
                    <TableHead className="text-emerald-500 text-right">
                      Gross_Sales
                    </TableHead>
                    <TableHead className="text-right">Op_Profit</TableHead>
                    <TableHead className="text-center">Margin</TableHead>
                    <TableHead className="text-center">Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.transactions?.map((row: any, i: number) => {
                    // INISIATIF: PANDANGAN ANOMALI (Profit < 1 Juta Rupiah)
                    const isRisk = Number(row.operating_profit) < 1000000;
                    return (
                      <TableRow
                        key={i}
                        className={cn(
                          "border-white/5 transition-all h-20",
                          isRisk
                            ? "bg-rose-500/[0.04] hover:bg-rose-500/[0.08]"
                            : "hover:bg-white/[0.02]"
                        )}
                      >
                        <TableCell className="px-8">
                          <p className="font-black text-white text-xs uppercase">
                            {row.retailer?.retailer_name}
                          </p>
                          <p className="text-[9px] font-mono text-slate-600">
                            ID: {row.retailer?.retailer_id}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-white font-bold text-[11px]">
                            {row.city?.city}
                          </p>
                          <p className="text-[9px] text-slate-600">
                            {row.city?.state?.region}
                          </p>
                        </TableCell>
                        <TableCell>
                          <span className="px-3 py-1 bg-black/40 rounded-full border border-white/5 text-slate-400 font-bold uppercase text-[9px]">
                            {row.product?.product}
                          </span>
                        </TableCell>
                        <TableCell className="text-emerald-400 font-black italic tracking-tighter text-right text-sm">
                          ${Number(row.total_sales).toLocaleString()}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-right font-mono font-bold",
                            isRisk ? "text-rose-500" : "text-blue-400"
                          )}
                        >
                          ${Number(row.operating_profit).toLocaleString()}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-center font-bold",
                            isRisk ? "text-rose-500" : "text-amber-500"
                          )}
                        >
                          {(Number(row.operating_margin) * 100).toFixed(0)}%
                        </TableCell>
                        <TableCell className="text-center italic uppercase text-[8px] tracking-widest text-slate-500">
                          {row.method?.method}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* DECISION HUD */}
        <div className="xl:col-span-3">
          <Card className="bg-[#0f172a]/90 border border-white/5 rounded-[3rem] p-8 shadow-2xl sticky top-32 overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] rotate-12">
              <Zap size={120} />
            </div>
            <h3 className="text-xl font-black italic text-white uppercase tracking-widest mb-6 leading-tight relative z-10">
              Decision Hub
            </h3>

            <div className="space-y-6 relative z-10">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-primary" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Audit_Log
                  </span>
                </div>
                <textarea
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  placeholder="State reason for authorization or denial..."
                  className="w-full h-48 bg-black/40 border border-white/5 rounded-2xl p-6 text-xs text-slate-300 outline-none focus:ring-1 ring-primary/40 transition-all resize-none font-medium"
                />
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => executeDecision("APPROVED")}
                  disabled={isProcessing}
                  className="h-20 bg-primary hover:bg-blue-600 text-white rounded-[1.5rem] font-black uppercase italic text-xs shadow-xl transition-all hover:scale-[1.02]"
                >
                  <CheckCircle2 size={18} className="mr-3" /> Authorize_Batch
                </Button>
                <Button
                  onClick={() => executeDecision("REJECTED")}
                  disabled={isProcessing}
                  variant="ghost"
                  className="h-16 bg-rose-600/5 hover:bg-rose-600 text-rose-500 hover:text-white rounded-[1.5rem] font-black uppercase italic text-xs transition-all border border-rose-600/20"
                >
                  <XCircle size={18} className="mr-3" /> Deny_Inbound
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
