"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Upload,
  Loader2,
  Zap,
  MessageSquare,
  Eye,
  Menu,
  LayoutDashboard,
  History,
  Database,
  X,
  FileSpreadsheet,
  ArrowUpCircle,
  LogOut,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function StaffUploadPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [fileData, setFileData] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [mounted, setMounted] = useState(false);
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: string;
  } | null>(null);

  // Mencegah Hydration Error
  useEffect(() => {
    setMounted(true);
  }, []);

  const processExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "csv", "xls"].includes(ext || "")) {
      toast.error("Format ditolak! Gunakan .xlsx atau .csv");
      return;
    }
    setFileInfo({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
    });
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      setFileData(data);
      setPreviewData(data.slice(0, 5));
    };
    reader.readAsBinaryString(file);
  };

  const handleUplink = async () => {
    if (!fileData.length) return;
    setIsUploading(true);
    try {
      const res = await fetch("/api/staff/ingestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactions: fileData,
          metadata: { fileName: fileInfo?.name, staff_comment: note },
        }),
      });
      if (res.ok) {
        toast.success("UPLINK_ESTABLISHED");
        router.push("/staff/history");
      }
    } catch (e) {
      toast.error("Koneksi Gagal");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => router.push("/login");

  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans italic pt-24 lg:pt-10 p-4 lg:p-10 overflow-x-hidden text-left">
      {/* MOBILE NAV (FIXED 404 & LOGOUT) */}
      <div className="lg:hidden fixed top-0 left-0 w-full z-[100] p-4 bg-[#020617]/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between leading-none">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2.5 text-primary bg-white/10 rounded-xl border border-white/20 active:scale-95 transition-all outline-none">
              <Menu size={22} />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-[#020617] border-r border-white/10 text-slate-300 p-0 focus-visible:outline-none flex flex-col h-full leading-none"
          >
            <div className="sr-only">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>TitanVX Navigation</SheetDescription>
            </div>
            <div className="p-8 border-b border-white/5 flex items-center gap-3">
              <Zap className="text-primary" fill="currentColor" size={24} />
              <span className="font-black italic text-2xl uppercase text-white tracking-tighter">
                Titan_<span className="text-primary">VX</span>
              </span>
            </div>
            <nav className="p-4 space-y-2 font-black uppercase italic text-[10px] tracking-widest text-left flex-1 leading-none">
              <button
                onClick={() => router.push("/staff")}
                className="flex items-center gap-4 w-full p-5 rounded-2xl hover:bg-white/5 text-slate-500 transition-all border-none outline-none leading-none"
              >
                <LayoutDashboard size={18} /> Dashboard
              </button>
              <button
                onClick={() => router.push("/staff/upload")}
                className="flex items-center gap-4 w-full p-5 rounded-2xl bg-primary text-black font-black transition-all border-none outline-none leading-none shadow-lg shadow-primary/20"
              >
                <Upload size={18} /> Upload_Data
              </button>
              <button
                onClick={() => router.push("/staff/history")}
                className="flex items-center gap-4 w-full p-5 rounded-2xl hover:bg-white/5 text-slate-500 transition-all border-none outline-none leading-none"
              >
                <History size={18} /> History_Logs
              </button>
            </nav>
            <div className="p-6 border-t border-white/5">
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 w-full p-5 rounded-2xl bg-rose-500/10 text-rose-500 font-black uppercase italic text-[10px] tracking-widest hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 leading-none"
              >
                <LogOut size={18} /> Terminate_Session
              </button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="font-black uppercase italic text-white text-lg pr-2 leading-none tracking-tighter">
          Titan<span className="text-primary">VX</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto space-y-12">
        {/* HEADER SECTION */}
        <div className="space-y-2 border-b border-white/10 pb-10">
          <h1 className="text-5xl lg:text-8xl font-black italic uppercase text-white tracking-tighter leading-none">
            Data_<span className="text-primary">Ingestion</span>
          </h1>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">
            Protocol_Neural_Stream_V3.0
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* CONTROL PANEL (LEFT) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 p-10 rounded-[3rem] shadow-2xl space-y-8 backdrop-blur-md">
              {/* UPLOAD ZONE */}
              <div className="relative border-2 border-dashed border-white/10 rounded-[2.5rem] bg-black/40 p-12 text-center hover:border-primary/40 transition-all group overflow-hidden">
                <input
                  type="file"
                  accept=".xlsx, .csv"
                  onChange={processExcel}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="relative z-0 flex flex-col items-center gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-primary group-hover:text-black transition-all">
                    <FileSpreadsheet size={32} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black uppercase tracking-widest text-white italic">
                      {fileInfo ? fileInfo.name : "Inject_Payload_Protocol"}
                    </p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                      {fileInfo ? fileInfo.size : "Ready_for_Transmission"}
                    </p>
                  </div>
                </div>
              </div>

              {/* COMMENT AREA */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-primary flex items-center gap-2 italic tracking-widest leading-none">
                  <MessageSquare size={14} /> Transmission_Remark
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Input commit message..."
                  className="w-full bg-black/60 border border-white/10 rounded-[1.5rem] p-6 text-xs font-bold h-32 outline-none focus:border-primary transition-all uppercase tracking-tighter text-slate-300 italic"
                />
              </div>

              {/* ACTION BUTTON */}
              <button
                disabled={!fileInfo || isUploading}
                onClick={handleUplink}
                className="w-full py-6 bg-primary text-black rounded-[1.5rem] font-black uppercase text-[12px] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 leading-none"
              >
                {isUploading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ArrowUpCircle size={20} />
                )}
                Initialize_Transmission
              </button>
            </div>
          </div>

          {/* STREAM PREVIEW (RIGHT) */}
          <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-[3rem] p-8 lg:p-12 shadow-2xl overflow-hidden backdrop-blur-md relative">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
              <h2 className="text-xs font-black uppercase text-white flex items-center gap-3 italic tracking-widest leading-none">
                <Database className="text-primary" size={18} /> Payload_Preview
              </h2>
              {fileData.length > 0 && (
                <span className="text-[9px] font-black uppercase text-primary bg-primary/10 px-3 py-1 rounded-lg">
                  {fileData.length} Nodes Detected
                </span>
              )}
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              {previewData.length > 0 ? (
                <table className="w-full text-[10px] text-left border-separate border-spacing-0">
                  <thead className="bg-white/5 h-14">
                    <tr className="text-slate-500 font-black uppercase italic tracking-tighter">
                      {Object.keys(previewData[0]).map((key) => (
                        <th
                          key={key}
                          className="px-6 border-b border-white/10 whitespace-nowrap first:rounded-tl-2xl last:rounded-tr-2xl"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, i) => (
                      <tr
                        key={i}
                        className="bg-white/[0.02] hover:bg-primary/[0.05] transition-all h-16 group"
                      >
                        {Object.values(row).map((val: any, idx) => (
                          <td
                            key={idx}
                            className="px-6 whitespace-nowrap font-bold uppercase tracking-tighter text-slate-400 border-b border-white/5 group-last:border-none"
                          >
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="h-80 flex flex-col items-center justify-center opacity-10 space-y-6">
                  <Database size={64} className="animate-pulse" />
                  <p className="text-[12px] font-black uppercase tracking-[0.5em] italic">
                    Awaiting_Transmission_Data
                  </p>
                </div>
              )}
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          </div>
        </div>

        {/* FOOTER NODES */}
        <div className="flex flex-col items-center gap-4 opacity-50 pb-10">
          <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] italic leading-none">
            <Zap size={14} className="text-primary" /> Data_Ingestion_Engine_V.3
          </div>
        </div>
      </div>
    </div>
  );
}
