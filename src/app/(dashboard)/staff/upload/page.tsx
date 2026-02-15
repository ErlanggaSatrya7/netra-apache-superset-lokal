"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Loader2,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Table as TableIcon,
  X,
  Send,
} from "lucide-react";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(wb.Sheets[wsname]);

      // Ambil 5 baris pertama saja untuk preview agar tidak berat
      setPreviewData(data.slice(0, 5));
    };
    reader.readAsBinaryString(file);
  };

  const processUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(wb.Sheets[wsname]);

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data,
            fileName: selectedFile.name,
          }),
        });

        const result = await res.json();

        if (res.ok) {
          toast({
            title: "VORTEX SYNC SUCCESS",
            description: result.message || "Data mendarat di database.",
          });
          router.push("/staff");
          router.refresh();
        } else {
          throw new Error(result.message);
        }
      } catch (err: any) {
        alert("Gagal mengunggah data: " + err.message);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
          <Upload className="text-blue-500 h-10 w-10" /> Data Ingestion
        </h1>
        <p className="text-slate-500 font-medium italic">
          Hubungkan dataset eksternal ke dalam inti sistem Netra Vidya
          Analitika.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Dropzone */}
        <Card className="lg:col-span-1 bg-slate-900/60 border-slate-800 border-2 backdrop-blur-xl h-fit">
          <CardContent className="pt-10 flex flex-col items-center">
            <div className="h-20 w-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-6 border border-blue-500/20">
              <FileSpreadsheet className="h-10 w-10 text-blue-500" />
            </div>

            <label
              className={`w-full cursor-pointer ${
                uploading ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <div className="bg-slate-950 border-2 border-dashed border-slate-800 hover:border-blue-500/50 p-8 rounded-2xl flex flex-col items-center gap-4 transition-all">
                <span className="text-slate-400 font-bold text-center text-sm uppercase tracking-widest">
                  {selectedFile
                    ? selectedFile.name
                    : "Klik untuk pilih file Adidas"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx, .xls"
                  onChange={handleFileSelection}
                />
              </div>
            </label>

            {selectedFile && (
              <Button
                onClick={processUpload}
                disabled={uploading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-black h-14 rounded-xl uppercase italic tracking-widest"
              >
                {uploading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <Send className="mr-2" />
                )}
                Luncurkan Data
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Kolom Kanan: Preview Data */}
        <Card className="lg:col-span-2 bg-slate-950/80 border-slate-800 border-2 overflow-hidden">
          <CardHeader className="border-b border-slate-800 bg-slate-900/40">
            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
              <TableIcon size={16} /> Data Preview (5 Baris Pertama)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {previewData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900">
                      {Object.keys(previewData[0]).map((key) => (
                        <th
                          key={key}
                          className="p-4 text-[10px] font-black uppercase text-slate-500 border-b border-slate-800 tracking-wider"
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
                        className="border-b border-slate-900 hover:bg-blue-500/5 transition-colors"
                      >
                        {Object.values(row).map((val: any, j) => (
                          <td
                            key={j}
                            className="p-4 text-xs font-mono text-slate-300"
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-32 flex flex-col items-center justify-center text-slate-700">
                <TableIcon size={48} className="mb-4 opacity-20" />
                <p className="font-black italic uppercase tracking-widest text-xs opacity-40">
                  Belum ada data untuk ditampilkan
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
