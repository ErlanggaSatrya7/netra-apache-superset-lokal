"use client";

import { useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { validateExcelHeaders } from "@/lib/validators";

export default function UploadZone() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const headers = XLSX.utils.sheet_to_json(firstSheet, {
          header: 1,
        })[0] as string[];

        const validation = validateExcelHeaders(headers);

        if (!validation.isValid) {
          toast.error(
            `Kolom tidak sesuai! Hilang: ${validation.missingColumns.join(
              ", "
            )}`
          );
          setFile(null);
          setIsValidated(false);
          return;
        }

        setFile(selectedFile);
        setIsValidated(true);
        toast.success("Struktur file valid. Siap diproses.");
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const uploadToBackend = async () => {
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Simulasi API call ke src/app/api/staff/route.ts
      const res = await fetch("/api/staff/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        toast.success("Data berhasil dikirim untuk review Admin.");
        setFile(null);
        setIsValidated(false);
      }
    } catch (err) {
      toast.error("Gagal mengirim data ke server.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-800 rounded-3xl cursor-pointer hover:bg-slate-900/50 transition-all group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <p className="mb-2 text-sm text-white font-bold italic uppercase tracking-tighter">
              Klik untuk unggah dataset
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Format: .xlsx (Sesuai Template Adidas)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept=".xlsx"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="vortex-glass p-6 border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <FileSpreadsheet size={32} />
              </div>
              <div>
                <p className="text-sm font-black text-white">{file.name}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-slate-500 hover:text-red-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-emerald-500">
            <CheckCircle2 size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Header Tervalidasi
            </span>
          </div>
        </div>
      )}

      <button
        disabled={!isValidated || isUploading}
        onClick={uploadToBackend}
        className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black italic uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-30 flex items-center justify-center"
      >
        {isUploading ? (
          <Loader2 className="animate-spin mr-2" />
        ) : (
          "Kirim ke Data Warehouse"
        )}
      </button>
    </div>
  );
}
