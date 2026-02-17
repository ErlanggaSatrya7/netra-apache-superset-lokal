"use client";

import React, { useState } from "react";
import {
  Database,
  Layers,
  RefreshCw,
  Trash2,
  Eye,
  Download,
  HardDrive,
  Search,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNeuralSync } from "@/hooks/use-neural-sync";
import { exportTitanReport } from "@/lib/export-engine"; // Import Engine Baru
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function TitanWarehouse() {
  const { intel, loading, refresh } = useNeuralSync();
  const [searchTerm, setSearchTerm] = useState("");

  const allRows = intel?.rawTransactions || [];
  const batches = intel?.allHistory || [];

  // Inisiatif: Global Search Logic
  const filteredRows = allRows.filter(
    (r) =>
      r.retailer?.retailer_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      r.product?.product?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm("PURGE_PROTOCOL_CONFIRMATION: Erase this batch permanently?"))
      return;
    const loader = toast.loading("Executing_Purge...");
    try {
      const res = await fetch(`/api/admin/batch?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("BATCH_ELIMINATED", { id: loader });
        refresh();
      }
    } catch (e) {
      toast.error("SYSTEM_ERROR", { id: loader });
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-40 animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary">
            <HardDrive size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Central_Warehouse_Module
            </span>
          </div>
          <h1 className="text-6xl font-black italic text-white uppercase tracking-tighter">
            Central{" "}
            <span className="text-primary font-sans lowercase">Vault</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => exportTitanReport(filteredRows, "ADIDAS_MASTER")}
            className="h-14 px-8 rounded-2xl bg-emerald-600 text-white font-black uppercase italic text-xs shadow-xl flex items-center gap-3 hover:bg-emerald-500 transition-all"
          >
            <Download size={18} /> Export_Result
          </button>
        </div>
      </div>

      <Tabs defaultValue="master">
        <TabsList className="bg-black/40 border border-white/5 p-1 rounded-2xl mb-10 h-16 w-fit">
          <TabsTrigger
            value="master"
            className="px-10 h-full rounded-xl font-black uppercase italic text-[10px] data-[state=active]:bg-primary"
          >
            Vortex Master View
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="px-10 h-full rounded-xl font-black uppercase italic text-[10px] data-[state=active]:bg-primary"
          >
            Approved Archive
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: MASTER DATA INDEX */}
        <TabsContent value="master">
          <Card className="bg-[#0f172a]/60 border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl">
            <div className="p-10 bg-black/20 border-b border-white/5 flex justify-between items-center">
              <div className="relative w-96 group">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search master vault..."
                  className="w-full h-14 bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 text-xs text-white outline-none focus:ring-1 ring-primary transition-all"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <span className="text-[10px] font-black uppercase text-slate-500 italic">
                Nodes_Found: {filteredRows.length}
              </span>
            </div>
            <div className="overflow-auto max-h-[650px] scrollbar-thin scrollbar-thumb-primary">
              <Table>
                <TableHeader className="bg-[#020617] sticky top-0 z-20 h-20">
                  <TableRow className="border-white/5 italic font-black text-[9px] text-slate-500 uppercase">
                    <TableHead className="px-10">Retailer</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right text-emerald-500">
                      Sales
                    </TableHead>
                    <TableHead className="text-right">Profit</TableHead>
                    <TableHead className="text-center">Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.map((row: any, i: number) => (
                    <TableRow
                      key={i}
                      className="border-white/5 hover:bg-white/[0.02] text-[11px] text-slate-400 h-20"
                    >
                      <TableCell className="px-10 font-black text-white">
                        {row.retailer?.retailer_name}
                      </TableCell>
                      <TableCell>{row.city?.state?.region}</TableCell>
                      <TableCell>
                        <span className="px-3 py-1 bg-black/40 rounded-full border border-white/5 text-slate-300 font-bold uppercase text-[9px]">
                          {row.product?.product}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-emerald-400 font-black italic tracking-tighter text-sm">
                        ${Number(row.total_sales).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${Number(row.operating_profit).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        {(Number(row.operating_margin) * 100).toFixed(0)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 2: BATCH MANAGEMENT */}
        <TabsContent value="history">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {batches.map((batch: any, i: number) => (
              <Card
                key={i}
                className="bg-[#0f172a]/60 border-white/5 rounded-[3rem] p-10 group hover:border-primary/20 transition-all relative overflow-hidden shadow-2xl"
              >
                <div className="flex justify-between items-start mb-10">
                  <div className="p-5 bg-primary/10 rounded-3xl text-primary">
                    <Layers size={24} />
                  </div>
                  <div
                    className={cn(
                      "px-4 py-1.5 rounded-full text-[9px] font-black uppercase italic shadow-lg",
                      batch.status === "APPROVED"
                        ? "bg-emerald-500 text-black"
                        : "bg-amber-500 text-black"
                    )}
                  >
                    {batch.status}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white italic uppercase truncate mb-1">
                  {batch.file_name}
                </h3>
                <p className="text-[10px] font-mono text-slate-600 mb-8 uppercase tracking-widest">
                  {batch.system_name}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      (window.location.href = `/admin/approval/${batch.id_upload}`)
                    }
                    className="flex-1 h-14 bg-white/5 hover:bg-primary transition-all rounded-2xl text-[10px] font-black uppercase italic text-slate-400 hover:text-white flex items-center justify-center gap-2"
                  >
                    <Eye size={16} /> View_Details
                  </button>
                  <button
                    onClick={() => handleDelete(batch.id_upload)}
                    className="w-14 h-14 bg-rose-600/10 hover:bg-rose-600 transition-all rounded-2xl text-rose-500 hover:text-white flex items-center justify-center"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
