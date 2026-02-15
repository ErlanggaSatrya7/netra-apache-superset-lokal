"use client";

import React, { useEffect, useState, use } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Info,
  Database,
  Layers,
  Search,
  Download,
  Terminal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DetailedReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/shared?id_upload=${id}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, [id]);

  const processAction = async (action: "APPROVED" | "REJECTED") => {
    const res = await fetch("/api/admin", {
      method: "POST",
      body: JSON.stringify({ id_upload: id, action }),
    });
    if (res.ok) {
      toast.success(`Protocol ${action} verified.`);
      router.push("/admin/approval");
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-48">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full bg-white/5 hover:bg-primary hover:text-white transition-all w-12 h-12"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              Batch{" "}
              <span className="text-primary tracking-normal font-sans lowercase">
                audit
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">
              Source_ID: ADI_BATCH_{id}
            </p>
          </div>
        </div>
        <div className="p-4 bg-[#0f172a] rounded-2xl border border-white/5 flex items-center gap-4">
          <Terminal size={16} className="text-primary" />
          <p className="text-[10px] font-mono text-slate-400">
            STATUS::AWAITING_MASTER_SIGNATURE
          </p>
        </div>
      </div>

      {/* TABLE WRAPPER - CRITICAL FOR SCROLL */}
      <div className="bg-[#0f172a] rounded-[3rem] overflow-hidden border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent">
          <div className="min-w-[1600px]">
            {" "}
            {/* Memaksa tabel lebar agar bisa di-scroll */}
            <Table>
              <TableHeader className="bg-[#020617] sticky top-0 z-20 shadow-2xl">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="px-12 py-10 text-[11px] font-black uppercase text-slate-500 italic tracking-[0.2em]">
                    Retailer_Node
                  </TableHead>
                  <TableHead className="text-[11px] font-black uppercase text-slate-500 italic tracking-[0.2em]">
                    Geolocation
                  </TableHead>
                  <TableHead className="text-[11px] font-black uppercase text-slate-500 italic tracking-[0.2em]">
                    Entity_Class
                  </TableHead>
                  <TableHead className="text-right text-[11px] font-black uppercase text-slate-500 italic tracking-[0.2em]">
                    Unit_Vol
                  </TableHead>
                  <TableHead className="text-right text-[11px] font-black uppercase text-slate-500 italic tracking-[0.2em] px-12 text-emerald-400">
                    Net_Ingest_Val
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-40 text-center animate-pulse text-slate-700 font-black italic tracking-[1em] uppercase"
                    >
                      Decrypting Adidas Stream...
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item, i) => (
                    <TableRow
                      key={i}
                      className="border-white/5 hover:bg-white/[0.03] group transition-all"
                    >
                      <TableCell className="px-12 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-[10px] font-black italic text-slate-500 group-hover:bg-primary group-hover:text-white transition-all">
                            {item.retailer?.retailer_name.charAt(0)}
                          </div>
                          <span className="text-xs font-bold text-slate-300 uppercase group-hover:text-white">
                            {item.retailer?.retailer_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 uppercase font-black italic tracking-widest">
                        {item.city?.city}
                      </TableCell>
                      <TableCell>
                        <span className="px-3 py-1 bg-black/40 text-white text-[10px] font-black uppercase italic rounded-full border border-white/5">
                          {item.product?.product}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-blue-400 text-xs font-black italic">
                        {item.unit_sold?.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono text-emerald-400 font-black text-xs px-12 italic">
                        ${item.total_sales?.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* FIXED ACTION PANEL */}
      <div className="fixed bottom-0 left-0 md:left-72 right-0 bg-[#020617]/95 backdrop-blur-2xl border-t border-white/5 p-10 z-50 shadow-[0_-30px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-primary w-5 h-5" />
              <h4 className="text-xs font-black uppercase italic text-primary tracking-widest leading-none">
                Netra Validator System
              </h4>
            </div>
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em] leading-relaxed">
              Sign the batch to authorize neural warehouse distribution.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto h-16">
            <Button
              onClick={() => processAction("REJECTED")}
              className="h-full px-10 bg-rose-600/5 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-600/20 font-black uppercase italic rounded-3xl transition-all shadow-xl group"
            >
              <XCircle
                size={18}
                className="mr-3 group-hover:scale-110 transition-transform"
              />{" "}
              Reject Protocol
            </Button>
            <Button
              onClick={() => processAction("APPROVED")}
              className="h-full px-16 bg-primary hover:bg-blue-600 text-white font-black uppercase italic rounded-3xl shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-all transform hover:scale-105 group relative overflow-hidden"
            >
              <CheckCircle
                size={18}
                className="mr-4 group-hover:scale-110 transition-transform"
              />{" "}
              Authorize_Deployment
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
