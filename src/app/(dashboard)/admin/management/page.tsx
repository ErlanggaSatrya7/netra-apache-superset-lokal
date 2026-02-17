"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Database,
  RefreshCw,
  Trash2,
  Layers,
  FileText,
  CheckCircle2,
  Wifi,
  Activity,
  Terminal,
  Eye,
  ShieldCheck,
  Box,
  MessageCircle,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function WarehouseTitan() {
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);

  const fetchSync = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/shared");
      const data = await res.json();
      setInventory(data.approvedData || []); // Data gabungan Vortex
      setBatches(data.datasets || []); // Data per batch file
    } catch (e) {
      toast.error("SYNC_ERROR");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSync();
  }, [fetchSync]);

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-10 pb-40 animate-in fade-in duration-1000">
      {/* COMMAND HEADER */}
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">
              Storage_Protocol_v16.5
            </span>
          </div>
          <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter leading-none">
            Netra <span className="text-primary font-sans">Warehouse</span>
          </h1>
        </div>
        <Button
          onClick={fetchSync}
          variant="outline"
          className="h-14 w-14 rounded-2xl bg-[#0f172a] border-white/5 group shadow-2xl"
        >
          <RefreshCw
            size={24}
            className={cn(
              "text-primary transition-all duration-700",
              loading && "animate-spin"
            )}
          />
        </Button>
      </div>

      <Tabs defaultValue="vortex_data" className="w-full">
        <TabsList className="bg-[#0f172a] border border-white/5 p-2 h-20 rounded-[2rem] mb-12 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
          <TabsTrigger
            value="vortex_data"
            className="rounded-[1.5rem] px-14 h-full font-black uppercase text-xs italic data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
          >
            <Database size={18} className="mr-3" /> Vortex Data Grid (Tab 1)
          </TabsTrigger>
          <TabsTrigger
            value="batch_master"
            className="rounded-[1.5rem] px-14 h-full font-black uppercase text-xs italic data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
          >
            <Layers size={18} className="mr-3" /> Batch Master (Tab 2)
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: GABUNGAN SEMUA DATASET (ULTRA CLEAN TABLE) */}
        <TabsContent
          value="vortex_data"
          className="animate-in slide-in-from-left-5 duration-500"
        >
          <Card className="bg-[#0f172a] border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="p-8 bg-white/5 border-b border-white/5 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest italic">
                Consolidated_Neural_Records
              </span>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold text-emerald-500 uppercase italic">
                  Integrity_Secure
                </span>
              </div>
            </div>
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent">
              <div className="min-w-[1500px]">
                <Table>
                  <TableHeader className="bg-[#020617]">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="px-10 py-8 text-[11px] font-black uppercase text-slate-500 italic">
                        Identity_Node
                      </TableHead>
                      <TableHead className="text-[11px] font-black uppercase text-slate-500 italic text-center">
                        Geo_Cluster
                      </TableHead>
                      <TableHead className="text-[11px] font-black uppercase text-slate-500 italic">
                        Entity_Class
                      </TableHead>
                      <TableHead className="text-right text-[11px] font-black uppercase text-slate-500 italic px-10">
                        Neural_Value
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map((row, i) => (
                      <TableRow
                        key={i}
                        className="border-white/5 hover:bg-white/[0.03] transition-all group duration-500"
                      >
                        <TableCell className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#020617] rounded-2xl flex items-center justify-center text-[10px] font-black text-primary border border-white/5 group-hover:bg-primary group-hover:text-white transition-all shadow-inner uppercase">
                              {row.retailer?.retailer_name.charAt(0)}
                            </div>
                            <span className="text-base font-black italic text-white uppercase tracking-tighter">
                              {row.retailer?.retailer_name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="px-4 py-1.5 bg-black/40 text-slate-400 text-[10px] font-black uppercase italic rounded-full border border-white/5">
                            {row.city?.city}, {row.city?.state?.region}
                          </span>
                        </TableCell>
                        <TableCell className="text-primary font-black italic text-xs uppercase">
                          {row.product?.product}
                        </TableCell>
                        <TableCell className="text-right px-10 font-mono text-emerald-400 font-black text-2xl italic group-hover:scale-110 transition-transform">
                          ${row.total_sales.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 2: DATASET PER BATCH (FULL CRUD PROTOCOL) */}
        <TabsContent
          value="batch_master"
          className="animate-in slide-in-from-right-5 duration-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {batches.map((b, i) => (
              <Card
                key={i}
                className="bg-[#0f172a] border-white/5 rounded-[2.5rem] p-8 hover:border-primary/40 transition-all group shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-primary/10 transition-colors shadow-inner">
                    <FileText size={24} className="text-primary" />
                  </div>
                  <div
                    className={cn(
                      "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-xl",
                      b.status === "APPROVED"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : b.status === "REJECTED"
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    )}
                  >
                    {b.status}
                  </div>
                </div>
                <div className="space-y-6 mb-12 relative z-10">
                  <h3 className="text-2xl font-black italic text-white uppercase truncate leading-none">
                    {b.file_name}
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-slate-500 font-bold uppercase text-[10px] italic leading-none">
                      <User size={14} className="text-primary" />{" "}
                      <span>{b.uploaded_by}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 font-bold uppercase text-[10px] italic leading-none">
                      <Calendar size={14} className="text-primary" />{" "}
                      <span>{new Date(b.upload_date).toLocaleString()}</span>
                    </div>
                  </div>
                  {/* Communication Display */}
                  <div className="p-5 bg-black/60 rounded-[1.5rem] border border-white/5 shadow-inner">
                    <p className="text-[9px] text-slate-500 font-black uppercase mb-2 flex items-center gap-2 tracking-widest">
                      <MessageCircle size={10} className="text-primary" />{" "}
                      Intelligence_Note:
                    </p>
                    <p className="text-[11px] text-slate-300 italic font-medium leading-relaxed">
                      "{b.note || "System generated protocol."}"
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 pt-6 border-t border-white/5 relative z-10">
                  <Button
                    variant="ghost"
                    className="flex-1 bg-white/5 hover:bg-primary h-14 text-[10px] font-black uppercase rounded-2xl transition-all shadow-xl"
                  >
                    <Eye size={18} className="mr-2" /> Inspect
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-14 h-14 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white border border-rose-600/10 rounded-2xl transition-all shadow-xl group"
                  >
                    <Trash2
                      size={20}
                      className="group-hover:rotate-12 transition-transform"
                    />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
