"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function StaffHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/staff?email=staff@netra.com"); // Paksa ambil data terbaru
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black italic uppercase text-white tracking-tighter">
          Transmission <span className="text-primary">Logs</span>
        </h1>
        <button
          onClick={loadHistory}
          className="text-[10px] font-black uppercase text-primary border border-primary/20 px-4 py-2 rounded-lg hover:bg-primary/10 transition-all"
        >
          Refresh Logs
        </button>
      </div>

      <div className="vortex-glass overflow-hidden border-white/5 shadow-2xl">
        <Table>
          <TableHeader className="bg-slate-900/50">
            <TableRow className="border-white/5">
              <TableHead className="text-[10px] font-black uppercase py-5 px-6">
                Dataset Entity
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase">
                Status
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase text-right px-6">
                Timestamp
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-40 text-center animate-pulse text-slate-500 font-bold italic uppercase tracking-widest"
                >
                  Accessing Logs...
                </TableCell>
              </TableRow>
            ) : history.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-40 text-center text-slate-600 font-bold italic"
                >
                  No history detected.
                </TableCell>
              </TableRow>
            ) : (
              history.map((item: any) => (
                <TableRow
                  key={item.id_upload}
                  className="border-white/5 hover:bg-white/5 transition-all"
                >
                  <TableCell className="py-5 px-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-primary" />
                        <div>
                          <p className="text-sm font-black text-white italic uppercase tracking-tight">
                            {item.file_name}
                          </p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                            {item.system_name}
                          </p>
                        </div>
                      </div>

                      {/* REJECT FEEDBACK AREA */}
                      {item.status === "REJECTED" && (
                        <div className="mt-2 p-3 bg-red-600/10 border border-red-600/20 rounded-xl flex items-start gap-3">
                          <AlertCircle
                            size={14}
                            className="text-red-500 mt-0.5"
                          />
                          <div>
                            <p className="text-[9px] font-black uppercase text-red-500">
                              Admin Feedback:
                            </p>
                            <p className="text-[11px] text-slate-300 italic mt-1 leading-relaxed">
                              "
                              {item.note ||
                                "Header mismatch or incorrect values."}
                              "
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[9px] font-black uppercase px-3 py-1 border-white/5 ${
                        item.status === "APPROVED"
                          ? "text-emerald-500 bg-emerald-500/5"
                          : item.status === "REJECTED"
                          ? "text-red-500 bg-red-500/5"
                          : "text-amber-500 bg-amber-500/5"
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-6 text-[10px] font-mono text-slate-500">
                    {new Date(item.upload_date).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
