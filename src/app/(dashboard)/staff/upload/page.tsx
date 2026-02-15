"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import {
  CloudUpload,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Send,
  Zap,
  Loader2,
  Info,
  Eye,
  Database,
  ChevronRight,
  ShieldCheck,
  Activity,
  Layers,
  X,
  Binary,
  Cpu,
  FileText,
  Search,
  Table as TableIcon,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const REQUIRED_HEADERS = [
  "Retailer",
  "Invoice Date",
  "Region",
  "City",
  "Product",
  "Units Sold",
  "Total Sales",
];

type Step =
  | "IDLE"
  | "SCANNING"
  | "DECRYPTING"
  | "AUDITING"
  | "PREVIEW"
  | "PUSHING"
  | "SUCCESS";

export default function AdidasIngestEngine() {
  const [step, setStep] = useState<Step>("IDLE");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dataStream, setDataStream] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [syncProgress, setSyncProgress] = useState(0);

  // --- Neural Parser ---
  const handleIngestion = useCallback(async (file: File) => {
    setStep("SCANNING");
    setFileName(file.name);
    setAuditLogs([]);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setStep("DECRYPTING");
        const result = e.target?.result;
        const workbook = XLSX.read(result, { type: "binary", cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          defval: "",
        });

        if (json.length === 0) throw new Error("Dataset rejected: Node empty.");

        await new Promise((r) => setTimeout(r, 1200));

        // --- Audit Logic ---
        setStep("AUDITING");
        const headers = Object.keys(json[0] as object);
        const missing = REQUIRED_HEADERS.filter((h) => !headers.includes(h));

        if (missing.length > 0) {
          setAuditLogs([`SCHEMA_MISMATCH: Missing [${missing.join(", ")}]`]);
          setStep("IDLE");
          return toast.error("VALIDATION_FAILED");
        }

        setDataStream(json);
        setStep("PREVIEW");
        toast.success("AUDIT_PASSED", {
          description: `${json.length} nodes ready for deployment.`,
        });
      } catch (err: any) {
        setStep("IDLE");
        toast.error("INGESTION_CRITICAL_FAILURE");
      }
    };
    reader.readAsBinaryString(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => handleIngestion(files[0]),
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    multiple: false,
    disabled: step !== "IDLE",
  });

  const triggerDeployment = async () => {
    setStep("PUSHING");
    const interval = setInterval(() => {
      setSyncProgress((p) => (p < 95 ? p + 2 : p));
    }, 100);

    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, data: dataStream }),
      });

      if (!res.ok) throw new Error();

      clearInterval(interval);
      setSyncProgress(100);
      await new Promise((r) => setTimeout(r, 1000));
      setStep("SUCCESS");
    } catch (err) {
      setStep("PREVIEW");
      toast.error("DEPLOYMENT_ABORTED");
    }
  };

  return (
    <div className="flex flex-col space-y-12 pb-32">
      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
              <Activity className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">
                Ingestion_Mode Active
              </span>
            </div>
          </div>
          <h1 className="text-[5rem] font-black italic tracking-tighter text-white uppercase leading-[0.8] mb-4">
            Adidas{" "}
            <span className="text-primary font-sans lowercase tracking-normal">
              Ingest
            </span>
          </h1>
          <p className="text-[12px] text-slate-500 font-bold uppercase tracking-[0.5em] italic">
            Netra Global Analytical Node | Adidas AG Portfolio
          </p>
        </div>

        {/* Stepper Logic */}
        <div className="flex items-center gap-4 bg-[#0f172a] p-5 rounded-[2rem] border border-white/5 shadow-2xl relative z-10">
          {[
            {
              id: "S1",
              label: "Scan",
              active: ["SCANNING", "DECRYPTING", "AUDITING"].includes(step),
            },
            { id: "S2", label: "Verify", active: step === "PREVIEW" },
            { id: "S3", label: "Push", active: step === "PUSHING" },
            { id: "S4", label: "Synced", active: step === "SUCCESS" },
          ].map((s, idx) => (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 border italic font-black text-xs",
                    s.active
                      ? "bg-primary border-primary text-white scale-110 shadow-primary/40"
                      : "bg-white/5 border-white/5 text-slate-700"
                  )}
                >
                  {idx + 1}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest hidden lg:block",
                    s.active ? "text-white" : "text-slate-700"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {idx < 3 && <ChevronRight className="w-4 h-4 text-slate-800" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* LEFT: DROPZONE (4 Cols) */}
        <div className="xl:col-span-4 space-y-8">
          <div
            {...getRootProps()}
            className={cn(
              "group relative h-[500px] border-2 border-dashed rounded-[3.5rem] transition-all duration-700 flex flex-col items-center justify-center p-12 text-center cursor-pointer overflow-hidden",
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-white/5 bg-[#0f172a] hover:bg-[#0f172a]/70 hover:border-white/10",
              step !== "IDLE" &&
                "opacity-60 cursor-not-allowed pointer-events-none"
            )}
          >
            {step === "IDLE" ? (
              <div className="relative z-10 space-y-10">
                <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] border border-primary/20 flex items-center justify-center mx-auto group-hover:rotate-[15deg] transition-all duration-500 shadow-2xl">
                  <CloudUpload size={48} className="text-primary" />
                </div>
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                    Initialize_Stream
                  </h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                    Establish handshake by dropping Adidas Excel Dataset.
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative z-10 w-full space-y-10">
                <div className="w-20 h-20 bg-[#020617] rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl border border-white/5">
                  {step === "SUCCESS" ? (
                    <ShieldCheck className="text-emerald-500 w-10 h-10" />
                  ) : (
                    <Loader2 className="text-primary w-10 h-10 animate-spin" />
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-black text-white uppercase italic truncate px-10">
                    {fileName}
                  </p>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] animate-pulse italic">
                    {step}...
                  </p>
                </div>
                {step === "PUSHING" && (
                  <div className="px-12 space-y-4">
                    <Progress
                      value={syncProgress}
                      className="h-1 bg-[#020617]"
                    />
                    <p className="text-[9px] font-mono text-primary font-black italic">
                      {syncProgress.toFixed(0)}% DATAPACK_PUSHED
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {auditLogs.length > 0 && (
            <Card className="bg-rose-600/5 border-rose-600/20 rounded-[3rem] p-10">
              <div className="flex items-center gap-4 text-rose-500 mb-8">
                <AlertTriangle size={32} />
                <h4 className="text-xl font-black uppercase italic tracking-tighter">
                  Integrity_Error
                </h4>
              </div>
              <ul className="space-y-4">
                {auditLogs.map((err, i) => (
                  <li
                    key={i}
                    className="text-[11px] text-rose-400/90 font-bold uppercase tracking-widest italic flex gap-4"
                  >
                    <span className="text-rose-600 font-black">X</span> {err}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => {
                  setStep("IDLE");
                  setAuditLogs([]);
                }}
                className="w-full mt-10 h-14 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-2xl text-[10px] font-black uppercase italic transition-all border border-rose-600/20"
              >
                Protocol_Retry
              </Button>
            </Card>
          )}
        </div>

        {/* RIGHT: PREVIEW (8 Cols) */}
        <div className="xl:col-span-8 space-y-8">
          <Card className="bg-[#0f172a] border-white/5 shadow-2xl rounded-[4rem] h-[750px] overflow-hidden flex flex-col relative">
            <CardHeader className="p-12 border-b border-white/5 bg-[#020617]/50 flex flex-col md:flex-row md:items-center justify-between gap-8 z-10">
              <div className="space-y-3">
                <CardTitle className="text-3xl font-black italic uppercase text-white tracking-tighter">
                  Neural_Buffer
                </CardTitle>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] italic">
                  Records Detected: {dataStream.length.toLocaleString()} nodes
                </p>
              </div>

              {step === "PREVIEW" && (
                <div className="flex gap-4">
                  <Button
                    onClick={() => setStep("IDLE")}
                    variant="ghost"
                    className="h-16 px-10 text-rose-500 hover:bg-rose-500/10 rounded-3xl text-[11px] font-black uppercase italic transition-all border border-transparent hover:border-rose-500/20"
                  >
                    <X size={20} className="mr-3" /> Abort_Protocol
                  </Button>
                  <Button
                    onClick={triggerDeployment}
                    className="h-16 px-14 bg-primary hover:bg-blue-600 text-white rounded-3xl text-[11px] font-black uppercase italic shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-all transform hover:scale-105"
                  >
                    <Send size={20} className="mr-4" /> Push_To_Audit
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden relative">
              {dataStream.length > 0 ? (
                <div className="h-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent">
                  <Table>
                    <TableHeader className="bg-[#020617] sticky top-0 z-30 shadow-2xl">
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="px-12 py-8 text-[11px] font-black uppercase text-slate-500 italic tracking-widest">
                          Retailer
                        </TableHead>
                        <TableHead className="text-[11px] font-black uppercase text-slate-500 italic tracking-widest text-center">
                          Node
                        </TableHead>
                        <TableHead className="text-[11px] font-black uppercase text-slate-500 italic tracking-widest">
                          Entity
                        </TableHead>
                        <TableHead className="text-right text-[11px] font-black uppercase text-slate-500 italic tracking-widest px-12">
                          Net_Sales
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dataStream.slice(0, 100).map((row, i) => (
                        <TableRow
                          key={i}
                          className="border-white/5 hover:bg-white/[0.03] group transition-all duration-300"
                        >
                          <TableCell className="px-12 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-9 h-9 bg-[#020617] rounded-xl flex items-center justify-center text-[11px] font-black italic text-slate-500 border border-white/5">
                                {String(row["Retailer"]).charAt(0)}
                              </div>
                              <span className="text-xs font-black italic text-slate-300 uppercase tracking-tight">
                                {row["Retailer"]}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-[11px] text-slate-500 uppercase font-black italic text-center">
                            {row["City"]}
                          </TableCell>
                          <TableCell>
                            <span className="px-3 py-1 bg-black/40 text-white text-[10px] font-black uppercase italic rounded-xl border border-white/5">
                              {row["Product"]}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-mono text-emerald-400 font-black text-sm px-12">
                            ${Number(row["Total Sales"]).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-20 space-y-10 animate-in fade-in duration-1000">
                  <div className="w-40 h-40 bg-[#020617] rounded-[3.5rem] border border-white/5 flex items-center justify-center shadow-inner group">
                    <Layers
                      size={80}
                      className="text-slate-800 group-hover:text-primary transition-colors duration-700"
                    />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-3xl font-black uppercase italic text-slate-600 tracking-tighter leading-none">
                      Ingestion_Hub Standby
                    </h4>
                    <p className="text-xs text-slate-700 font-black uppercase tracking-[0.5em] max-w-sm mx-auto italic">
                      Awaiting master datastream handshake...
                    </p>
                  </div>
                </div>
              )}

              {/* Success Final Protocol View */}
              {step === "SUCCESS" && (
                <div className="absolute inset-0 bg-[#020617]/98 backdrop-blur-2xl z-[100] flex flex-col items-center justify-center text-center p-20 animate-in zoom-in-95 duration-1000">
                  <div className="w-32 h-32 bg-emerald-500/10 rounded-[3rem] border border-emerald-500/20 flex items-center justify-center mb-12 shadow-[0_0_80px_rgba(16,185,129,0.3)] animate-pulse">
                    <ShieldCheck size={64} className="text-emerald-500" />
                  </div>
                  <h2 className="text-[6rem] font-black italic uppercase text-white tracking-tighter leading-none mb-8 animate-in slide-in-from-bottom-10 duration-700">
                    Dataset_Deployed
                  </h2>
                  <p className="text-sm text-slate-400 uppercase font-bold tracking-[0.3em] mb-16 max-w-2xl leading-[2.5]">
                    The Adidas datastream has been{" "}
                    <span className="text-white italic underline">
                      fully encrypted
                    </span>{" "}
                    and routed to the{" "}
                    <span className="text-primary italic">Audit Terminal</span>.
                  </p>
                  <Button
                    onClick={() => setStep("IDLE")}
                    className="h-20 px-16 bg-white text-black hover:bg-slate-200 rounded-[2.5rem] text-xs font-black uppercase italic shadow-2xl transition-all flex items-center gap-6"
                  >
                    <RefreshCw size={24} /> Initialize_New_Ingestion
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
