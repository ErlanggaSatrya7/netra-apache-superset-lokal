"use client";

import React, { useState } from "react";
import { FileUp, Loader2, Send, Trash2, LayoutGrid, Zap } from "lucide-react";
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
import * as XLSX from "xlsx";

export default function StaffIngestionTerminal() {
  const [data, setData] = useState<any[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [note, setNote] = useState("");
  const [file, setFile] = useState("");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f.name);
    setIsBusy(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target?.result, { type: "binary" });
      const raw = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      setTimeout(() => {
        setData(raw);
        setIsBusy(false);
        toast.success("13 Columns Loaded");
      }, 800);
    };
    reader.readAsBinaryString(f);
  };

  const transmit = async () => {
    setIsBusy(true);
    const res = await fetch("/api/staff/ingestion", {
      method: "POST",
      body: JSON.stringify({ fileName: file, payload: data, note }),
    });
    if (res.ok) {
      toast.success("Transmitted Successfully");
      setData([]);
      setFile("");
      setNote("");
    }
    setIsBusy(false);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in pb-40">
      {isBusy && (
        <div className="fixed inset-0 z-[100] bg-[#020617]/90 backdrop-blur-md flex flex-col items-center justify-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
          <p className="text-xs font-black uppercase tracking-[0.5em] text-white animate-pulse">
            Syncing_Neural_Data...
          </p>
        </div>
      )}

      <div className="border-b border-white/5 pb-8 flex justify-between items-end">
        <h1 className="text-6xl font-black italic text-white uppercase tracking-tighter leading-none">
          Neural{" "}
          <span className="text-primary font-sans lowercase italic">
            Ingest
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-9">
          {data.length === 0 ? (
            <label className="flex flex-col items-center justify-center w-full h-[450px] border-2 border-dashed border-white/10 rounded-[3rem] bg-[#0f172a]/40 hover:bg-primary/5 cursor-pointer transition-all group">
              <FileUp
                size={48}
                className="text-primary mb-4 group-hover:scale-110 transition-transform"
              />
              <p className="text-lg font-black italic text-white uppercase">
                Upload Adidas Dataset
              </p>
              <input
                type="file"
                className="hidden"
                onChange={handleUpload}
                accept=".xlsx,.csv"
              />
            </label>
          ) : (
            <Card className="bg-[#0f172a]/60 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="p-6 bg-black/20 flex justify-between border-b border-white/5">
                <span className="text-[10px] font-black uppercase text-slate-500 italic flex items-center gap-3">
                  <LayoutGrid size={14} /> 13_Column_Full_Buffer
                </span>
                <Button
                  variant="ghost"
                  onClick={() => setData([])}
                  className="text-rose-500 h-8 rounded-xl hover:bg-rose-500/10"
                >
                  Clear
                </Button>
              </div>
              <div className="overflow-auto max-h-[600px] scrollbar-thin scrollbar-thumb-primary">
                <Table>
                  <TableHeader className="bg-[#020617] sticky top-0 z-20 h-16">
                    <TableRow className="border-white/5 uppercase italic font-black text-[8px] text-slate-500">
                      <TableHead className="px-6">Retailer</TableHead>
                      <TableHead>Retailer_ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead className="text-emerald-500">Sales</TableHead>
                      <TableHead>Profit</TableHead>
                      <TableHead>Margin</TableHead>
                      <TableHead>Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row, i) => (
                      <TableRow
                        key={i}
                        className="border-white/5 hover:bg-white/[0.02] text-[10px] text-slate-400"
                      >
                        <TableCell className="px-6 font-bold text-white whitespace-nowrap">
                          {row.Retailer}
                        </TableCell>
                        <TableCell>{row["Retailer ID"]}</TableCell>
                        <TableCell>{row["Invoice Date"]}</TableCell>
                        <TableCell>{row.Region}</TableCell>
                        <TableCell>{row.State}</TableCell>
                        <TableCell>{row.City}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span className="bg-black/40 px-2 py-1 rounded border border-white/5">
                            {row.Product}
                          </span>
                        </TableCell>
                        <TableCell>${row["Price per Unit"]}</TableCell>
                        <TableCell>{row["Units Sold"]}</TableCell>
                        <TableCell className="text-emerald-400 font-bold">
                          ${row["Total Sales"]}
                        </TableCell>
                        <TableCell>${row["Operating Profit"]}</TableCell>
                        <TableCell>{row["Operating Margin"]}</TableCell>
                        <TableCell className="italic">
                          {row["Sales Method"]}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </div>

        <div className="xl:col-span-3">
          <Card className="bg-[#0f172a]/90 border border-white/5 rounded-[3rem] p-8 shadow-2xl sticky top-32">
            <h3 className="text-lg font-black italic text-white uppercase mb-6">
              Uplink Control
            </h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Transmission Notes..."
              className="w-full h-40 bg-black/40 border border-white/5 rounded-2xl p-4 text-xs text-slate-300 outline-none mb-8 resize-none font-medium"
            />
            <Button
              onClick={transmit}
              disabled={data.length === 0}
              className="w-full h-16 bg-primary hover:bg-blue-600 text-white rounded-[2rem] font-black uppercase italic text-xs shadow-xl"
            >
              Authorize_Stream <Send size={16} className="ml-3" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
