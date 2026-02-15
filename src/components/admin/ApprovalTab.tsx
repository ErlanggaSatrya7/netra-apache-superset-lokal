"use client";

import { useState, useEffect } from "react";
import {
  Check,
  X,
  FileSpreadsheet,
  Loader2,
  RefreshCcw,
  Database,
} from "lucide-react";

interface UploadHistory {
  id_upload: number;
  file_name: string;
  system_name: string;
  total_rows: number;
  upload_date: string;
  status: string;
}

export default function ApprovalTab() {
  const [pendingFiles, setPendingFiles] = useState<UploadHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      // Memanggil API yang memfilter status "MENUNGGU ADMIN (PENDING)"
      const res = await fetch("/api/admin/pending-files");
      const json = await res.json();
      setPendingFiles(json);
    } catch (err) {
      console.error("Gagal memuat data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleApprove = async (idUpload: number) => {
    if (!confirm(`Konfirmasi Approval untuk ID: ${idUpload}?`)) return;

    try {
      const res = await fetch(`/api/admin/approve-file/${idUpload}`, {
        method: "POST",
      });

      if (res.ok) {
        alert("Data Berhasil Disetujui!");
        fetchFiles(); // Refresh agar daftar yang sudah di-approve hilang
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem.");
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <p className="text-slate-500 font-black italic uppercase text-[10px] tracking-widest">
          Scanning History...
        </p>
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* HEADER: APPROVE DATA CENTER */}
      <div className="flex justify-between items-center bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter italic">
            Approve <span className="text-blue-500">Data Center</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1 italic">
            Dataset: Adidas US Sales Data
          </p>
        </div>
        <button
          onClick={fetchFiles}
          className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition-all border border-slate-700"
        >
          <RefreshCcw size={16} />
        </button>
      </div>

      {/* TABEL DATA */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-slate-950 text-slate-500 uppercase font-black italic border-b border-slate-800">
            <tr>
              <th className="p-6">File Name</th>
              <th className="p-6">System Identity</th>
              <th className="p-6">Total Rows</th>
              <th className="p-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-slate-300 font-mono italic">
            {pendingFiles.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-20 text-center font-black uppercase text-slate-700 tracking-[0.5em]"
                >
                  No Pending Transactions
                </td>
              </tr>
            ) : (
              pendingFiles.map((file) => (
                <tr
                  key={file.id_upload}
                  className="border-b border-slate-800/50 hover:bg-blue-600/5 transition-all group"
                >
                  <td className="p-6 font-bold text-white uppercase group-hover:text-blue-400">
                    {file.file_name || "Unknown File"}
                  </td>
                  <td className="p-6 text-slate-500 flex items-center gap-2">
                    <FileSpreadsheet size={14} className="text-emerald-500" />
                    {file.system_name}
                  </td>
                  <td className="p-6 font-black text-blue-500">
                    {file.total_rows} Rows
                  </td>
                  <td className="p-6 flex justify-end gap-2">
                    <button
                      onClick={() => handleApprove(file.id_upload)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition-all font-black text-[9px] uppercase italic flex items-center gap-2"
                    >
                      <Check size={14} /> Approve Data
                    </button>
                    <button className="bg-red-600/20 text-red-500 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-all">
                      <X size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-2 opacity-20">
        <Database size={12} className="text-slate-500" />
        <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.6em]">
          Vortex Secure Sync
        </p>
      </div>
    </div>
  );
}
