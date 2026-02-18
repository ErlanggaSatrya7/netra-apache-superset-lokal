"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { History, Database, Search, Clock, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function StaffHistoryList() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/approval");
        if (!res.ok) throw new Error("FETCH_FAILED");
        const data = await res.json();
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error("SYNC_FAILED");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="h-screen bg-[#020617] flex items-center justify-center text-primary italic font-black">
        ACCESSING_VAULT...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-10 pt-24 leading-none italic">
      <div className="max-w-[1400px] mx-auto space-y-12">
        <h1 className="text-7xl font-black text-white uppercase tracking-tighter">
          History_<span className="text-primary">Logs</span>
        </h1>

        <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden">
          <table className="w-full text-left text-[11px] font-black uppercase tracking-widest leading-none">
            <thead className="bg-white/5 h-16 text-slate-500">
              <tr>
                <th className="px-10">TX_ID</th>
                <th className="px-10">Manifest</th>
                <th className="px-10 text-center">Nodes</th>
                <th className="px-10 text-center">Status</th>
                <th className="px-10 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr
                  key={i}
                  // --- FIX NAVIGASI DI SINI ---
                  onClick={() => router.push(`/staff/history/${h.id_upload}`)}
                  className="h-24 border-b border-white/5 hover:bg-primary/[0.05] cursor-pointer transition-all group"
                >
                  <td className="px-10 text-primary font-mono italic">
                    #TX-{h.id_upload}
                  </td>
                  <td className="px-10 text-white text-base">{h.file_name}</td>
                  <td className="px-10 text-center font-mono text-slate-500">
                    {h.total_rows}
                  </td>
                  <td className="px-10 text-center">
                    <span
                      className={`px-4 py-2 rounded-full border text-[9px] ${
                        h.status === "APPROVED"
                          ? "border-emerald-500 text-emerald-500 bg-emerald-500/10"
                          : h.status === "REJECTED"
                          ? "border-rose-500 text-rose-500 bg-rose-500/10"
                          : "border-amber-500 text-amber-500"
                      }`}
                    >
                      {h.status}
                    </span>
                  </td>
                  <td className="px-10 text-right">
                    <div className="p-3 bg-white/5 rounded-full inline-block group-hover:bg-primary group-hover:text-black transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
