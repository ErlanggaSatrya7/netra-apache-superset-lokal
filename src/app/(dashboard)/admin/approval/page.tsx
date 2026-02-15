"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileCheck,
  Search,
  Filter,
  AlertCircle,
  Clock,
  ChevronRight,
  Database,
  ShieldCheck,
  Activity,
  RefreshCw,
  Terminal,
  Eye,
  Trash2,
  Box,
  Info,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminApprovalTerminal() {
  const router = useRouter();
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const syncBatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/staff"); // Reusing staff GET for consistency
      const data = await res.json();
      // Hanya tampilkan yang PENDING di sini
      setBatches(
        Array.isArray(data) ? data.filter((b) => b.status === "PENDING") : []
      );
    } catch (err) {
      toast.error("Handshake failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncBatches();
  }, []);

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in duration-700">
      {/* HEADER: Pembatas Visual */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <ShieldCheck className="text-amber-500 w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic">
              Verification Queue
            </span>
          </div>
          <h1 className="text-7xl font-black italic tracking-tighter text-white uppercase leading-none">
            Audit{" "}
            <span className="text-primary font-sans lowercase tracking-normal">
              Port
            </span>
          </h1>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.5em] italic">
            Pending Handshakes: {batches.length} Batches Detected
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={syncBatches}
            variant="outline"
            className="h-16 px-8 bg-[#0f172a] border-white/10 rounded-2xl"
          >
            <RefreshCw
              className={cn(
                "w-5 h-5 mr-3 text-primary",
                loading && "animate-spin"
              )}
            />
            <span className="text-[10px] font-black uppercase italic tracking-widest">
              Resync Port
            </span>
          </Button>
        </div>
      </div>

      {/* SEARCH ENGINE */}
      <div className="relative group max-w-2xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Scan Batch system_name..."
          className="h-16 bg-[#0f172a]/50 border-white/5 rounded-2xl pl-16 pr-6 text-xs text-white placeholder:text-slate-800 outline-none focus:ring-1 ring-primary/50 transition-all font-bold italic tracking-widest"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* DATA GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-[#0f172a] rounded-[3rem] border border-white/5 animate-pulse"
            />
          ))
        ) : batches.length === 0 ? (
          <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-6 bg-[#0f172a]/30 rounded-[4rem] border border-dashed border-white/5">
            <div className="p-8 bg-[#020617] rounded-full shadow-inner">
              <Box size={48} className="text-slate-800" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black uppercase italic text-slate-600">
                No Pending Streams
              </h4>
              <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest max-w-xs">
                All neural datasets have been processed or archive is empty.
              </p>
            </div>
          </div>
        ) : (
          batches.map((batch) => (
            <Card
              key={batch.id_upload}
              className="bg-[#0f172a] border-white/5 shadow-2xl rounded-[3rem] overflow-hidden group hover:border-primary/40 transition-all duration-500"
            >
              <CardHeader className="p-10 pb-6 flex flex-row items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-black italic uppercase text-white tracking-tighter truncate max-w-[300px]">
                    {batch.file_name}
                  </CardTitle>
                  <CardDescription className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                    ID: {batch.system_name}
                  </CardDescription>
                </div>
                <div className="h-12 w-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
                  <Clock className="text-amber-500 w-6 h-6 animate-pulse" />
                </div>
              </CardHeader>
              <CardContent className="px-10 pb-10 space-y-8">
                <div className="grid grid-cols-2 gap-10 pt-6 border-t border-white/5">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">
                      Entities Detected
                    </p>
                    <p className="text-2xl font-black italic text-white leading-none">
                      {batch.total_rows.toLocaleString()} Rows
                    </p>
                  </div>
                  <div className="space-y-2 text-right">
                    <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">
                      Arrival Date
                    </p>
                    <p className="text-sm font-bold text-slate-400 leading-none">
                      {new Date(batch.upload_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() =>
                      router.push(`/admin/approval/${batch.id_upload}`)
                    }
                    className="flex-1 h-14 bg-primary hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase italic tracking-widest shadow-xl transition-all group/btn"
                  >
                    Inspect Stream{" "}
                    <ChevronRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-14 w-14 rounded-2xl bg-white/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <Trash2 size={20} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* SYSTEM CONSOLE FOOTER Overlay */}
      <div className="fixed bottom-10 right-10 hidden xl:block z-50">
        <div className="bg-[#020617]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 flex items-center gap-8 shadow-[0_40px_100px_rgba(0,0,0,1)] ring-1 ring-white/10">
          <div className="flex flex-col gap-1 pr-8 border-r border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-black uppercase text-white italic tracking-widest">
                Port_8080_Linked
              </p>
            </div>
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest leading-none">
              Netra Intelligence Gateway
            </p>
          </div>
          <div className="flex items-center gap-10 font-mono text-[10px] text-slate-500 tracking-tighter">
            <div className="flex flex-col">
              <span className="text-primary font-black uppercase mb-1">
                Status
              </span>
              SYNCING
            </div>
            <div className="flex flex-col">
              <span className="text-primary font-black uppercase mb-1">
                Load
              </span>
              0.02ms
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
