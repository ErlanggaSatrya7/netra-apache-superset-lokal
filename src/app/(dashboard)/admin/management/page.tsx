"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Database,
  Trash2,
  Download,
  Search,
  Filter,
  RefreshCcw,
  FileText,
  ShieldCheck,
  HardDrive,
  LayoutGrid,
  List,
  Calendar,
  ArrowUpDown,
  ChevronRight,
  MoreHorizontal,
  History,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Package,
  Zap,
  CloudDownload,
  Terminal as TerminalIcon,
  Eye,
  Layers,
  FileSpreadsheet,
  Activity,
  Globe,
  Monitor,
} from "lucide-react"; // FIX: Import Eye & ChevronRight here
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Types & Interfaces ---
interface WarehouseRecord {
  id_transaction: number;
  id_upload: number;
  retailer: { retailer_name: string };
  city: { city: string };
  product: { product: string };
  unit_sold: number;
  total_sales: number;
  operating_profit: number;
  invoice_date: string;
}

interface BatchLog {
  id_upload: number;
  file_name: string;
  system_name: string;
  status: string;
  total_rows: number;
  upload_date: string;
  uploaded_by: string;
}

export default function AdidasWarehouseTerminal() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [inventory, setInventory] = useState<WarehouseRecord[]>([]);
  const [batches, setBatches] = useState<BatchLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // --- Neural Sync Protocol ---
  const syncWarehouse = useCallback(async () => {
    setIsLoading(true);
    try {
      const [resWarehouse, resHistory] = await Promise.all([
        fetch("/api/shared").then((res) => res.json()),
        fetch("/api/admin").then((res) => res.json()),
      ]);

      setInventory(Array.isArray(resWarehouse) ? resWarehouse : []);
      setBatches(
        Array.isArray(resHistory)
          ? resHistory.filter((b: any) => b.status === "APPROVED")
          : []
      );

      toast.success("NETRA_WAREHOUSE_SYNC_OK", {
        description: `Stream established: ${
          resWarehouse.length || 0
        } active nodes detected.`,
      });
    } catch (err) {
      toast.error("PROTOCOL_ERROR", {
        description: "Failed to establish database handshake.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncWarehouse();
  }, [syncWarehouse]);

  // --- Analytical Logic ---
  const filteredInventory = useMemo(() => {
    let result = [...inventory];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.retailer?.retailer_name.toLowerCase().includes(q) ||
          item.product?.product.toLowerCase().includes(q) ||
          item.city?.city.toLowerCase().includes(q)
      );
    }
    return result;
  }, [inventory, searchQuery]);

  const handlePurgeBatch = async (id: number) => {
    if (!confirm("CRITICAL: Permanent deletion protocol. Are you sure?"))
      return;
    const load = toast.loading("Executing purge...");
    try {
      const res = await fetch(`/api/admin?id_upload=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setBatches((prev) => prev.filter((b) => b.id_upload !== id));
      toast.success("Batch Purged", { id: load });
    } catch (err) {
      toast.error("Purge Failed", { id: load });
    }
  };

  return (
    <div className="flex flex-col space-y-10 min-h-screen animate-in fade-in duration-1000">
      {/* HEADER WAR ROOM */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <TerminalIcon className="text-primary w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic">
              Netra Master Node v2.0
            </span>
          </div>
          <h1 className="text-7xl font-black italic tracking-tighter text-white uppercase leading-none">
            Adidas{" "}
            <span className="text-primary font-sans lowercase tracking-normal">
              Warehouse
            </span>
          </h1>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.5em] italic">
            Proprietary Ingestion Buffer & Global Master Inventory
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button
            onClick={syncWarehouse}
            disabled={isLoading}
            variant="outline"
            className="h-16 px-8 bg-[#0f172a] border-white/10 rounded-2xl"
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <RefreshCcw size={18} className="mr-2 text-primary" />
            )}
            <span className="text-[10px] font-black uppercase italic">
              Sync Hub
            </span>
          </Button>
          <Button className="h-16 px-10 bg-primary hover:bg-blue-600 text-white rounded-2xl shadow-2xl shadow-primary/20 transition-all">
            <CloudDownload size={20} className="mr-3" />
            <span className="text-[10px] font-black uppercase italic">
              Export Global BI
            </span>
          </Button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Synced Batches",
            val: batches.length,
            sub: "Verified",
            icon: Layers,
            color: "text-blue-400",
          },
          {
            label: "Total Entities",
            val: inventory.length.toLocaleString(),
            sub: "Master Records",
            icon: Database,
            color: "text-emerald-400",
          },
          {
            label: "Memory Usage",
            val: "1.2 GB",
            sub: "Cloud Buffer",
            icon: Zap,
            color: "text-amber-400",
          },
          {
            label: "Security Status",
            val: "Encrypted",
            sub: "AES-256",
            icon: ShieldCheck,
            color: "text-primary",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="bg-[#0f172a] border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden group hover:border-primary/40 transition-all"
          >
            <CardContent className="p-8 relative">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">
                    {stat.label}
                  </p>
                  <p
                    className={cn(
                      "text-3xl font-black italic tracking-tighter",
                      stat.color
                    )}
                  >
                    {stat.val}
                  </p>
                  <p className="text-[8px] font-bold text-slate-600 uppercase italic">
                    Protocols: {stat.sub}
                  </p>
                </div>
                <div className="p-3 bg-black/40 rounded-2xl border border-white/5 group-hover:scale-110 transition-transform">
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MAIN TERMINAL INTERFACE */}
      <Tabs
        defaultValue="inventory"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-[#0f172a]/50 p-4 rounded-[2.5rem] border border-white/5">
          <TabsList className="bg-[#020617] border border-white/5 p-1.5 h-14 rounded-2xl w-full md:w-[450px]">
            <TabsTrigger
              value="inventory"
              className="flex-1 rounded-xl data-[state=active]:bg-primary font-black uppercase italic text-[10px]"
            >
              <List size={14} className="mr-2" /> Global Inventory
            </TabsTrigger>
            <TabsTrigger
              value="batches"
              className="flex-1 rounded-xl data-[state=active]:bg-primary font-black uppercase italic text-[10px]"
            >
              <HardDrive size={14} className="mr-2" /> Batch Control
            </TabsTrigger>
          </TabsList>

          <div className="relative group w-full md:w-80 px-2">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search master data..."
              className="h-12 bg-[#020617] border-white/5 rounded-xl pl-12 text-xs text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="inventory" className="outline-none">
          <div className="bg-[#0f172a] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent">
              <div className="min-w-[1500px]">
                <Table>
                  <TableHeader className="bg-[#020617]/80 sticky top-0 z-30 border-b border-white/5 backdrop-blur-xl">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="px-10 py-10 text-[10px] font-black uppercase text-slate-500 italic">
                        Record_ID
                      </TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-slate-500 italic">
                        Retailer
                      </TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-slate-500 italic">
                        Entity_Class
                      </TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-slate-500 italic">
                        Geo_Node
                      </TableHead>
                      <TableHead className="text-right text-[10px] font-black uppercase text-slate-500 italic">
                        Units
                      </TableHead>
                      <TableHead className="text-right text-[10px] font-black uppercase text-slate-500 italic px-10 text-emerald-400">
                        Net_Sales
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-60 text-center text-slate-700 font-black italic uppercase tracking-widest"
                        >
                          Awaiting master node ingestion...
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInventory.map((item, i) => (
                        <TableRow
                          key={i}
                          className="border-white/5 hover:bg-white/[0.02] group transition-colors"
                        >
                          <TableCell className="px-10 py-6 text-[10px] font-mono text-slate-600">
                            ADI_VX_{item.id_upload}_{i}
                          </TableCell>
                          <TableCell className="text-[11px] font-bold text-slate-300 uppercase">
                            {item.retailer?.retailer_name}
                          </TableCell>
                          <TableCell>
                            <span className="px-3 py-1 bg-[#020617] text-white text-[9px] font-black uppercase italic rounded-full border border-white/5">
                              {item.product?.product}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs text-slate-500 uppercase italic">
                            {item.city?.city}
                          </TableCell>
                          <TableCell className="text-right font-mono text-blue-400 text-xs font-black">
                            {item.unit_sold?.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-mono text-emerald-400 font-black text-xs px-10">
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
        </TabsContent>

        <TabsContent value="batches" className="outline-none space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {batches.map((batch) => (
              <Card
                key={batch.id_upload}
                className="bg-[#0f172a] border-white/5 shadow-2xl rounded-[3rem] overflow-hidden group hover:border-primary/40 transition-all"
              >
                <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                  <div className="p-4 bg-primary/10 rounded-2xl text-primary border border-primary/20">
                    <FileText size={24} />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePurgeBatch(batch.id_upload)}
                    className="text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors"
                  >
                    <Trash2 size={20} />
                  </Button>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-8">
                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic truncate tracking-tighter leading-none group-hover:text-primary transition-colors">
                      {batch.file_name}
                    </h3>
                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-3">
                      SYS_ID: {batch.system_name}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase text-slate-700">
                        Rows Ingested
                      </p>
                      <p className="text-sm font-mono text-slate-200 font-black">
                        {batch.total_rows?.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[8px] font-black uppercase text-slate-700">
                        Deploy Date
                      </p>
                      <p className="text-[10px] font-bold text-slate-400">
                        {new Date(batch.upload_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full bg-white/5 h-12 rounded-2xl text-[9px] font-black uppercase italic text-slate-400 hover:text-white group-hover:bg-primary transition-all"
                  >
                    <Eye size={14} className="mr-2" /> Audit Dataset Stream
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
