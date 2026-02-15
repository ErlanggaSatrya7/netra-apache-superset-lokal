"use client";

import React, { useState, useEffect } from "react";
import { Check, Zap, Loader2 } from "lucide-react";

export default function ApprovalPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data transaksi yang statusnya masih pending
  useEffect(() => {
    fetch("/api/admin/transactions?status=pending")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    await fetch(`/api/admin/transactions/${id}/approve`, { method: "POST" });
    setData((prev) => prev.filter((item: any) => item.id !== id));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#020617]">
        <Loader2 className="animate-spin text-blue-500 h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 bg-[#020617] min-h-screen text-white animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">
            Approve Data Center
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
            Dataset: Ramayana Medan
          </p>
        </div>
        <button className="flex gap-2 items-center bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all">
          <Zap size={14} /> Approve All Data
        </button>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-slate-950 text-slate-500 uppercase font-black italic border-b border-slate-800">
              <tr>
                <th className="p-6">Retailer</th>
                <th className="p-6">Product</th>
                <th className="p-6 text-right">Total Sales</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-300 font-mono italic">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-10 text-center text-slate-600 uppercase font-black tracking-widest"
                  >
                    No Pending Transactions
                  </td>
                </tr>
              ) : (
                data.map((item: any) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-800/50 hover:bg-blue-600/5 transition-all"
                  >
                    <td className="p-6 font-bold text-white uppercase">
                      {item.retailer}
                    </td>
                    <td className="p-6 text-blue-400">{item.product}</td>
                    <td className="p-6 text-right font-black text-emerald-500">
                      Rp {item.total_sales?.toLocaleString("id-ID")}
                    </td>
                    <td className="p-6 flex justify-end gap-2">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="p-2 bg-emerald-600/20 text-emerald-500 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
                      >
                        <Check size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
