"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Pastikan shadcn badge terpasang
import { History, FileText, Calendar, Database } from "lucide-react";

export default function StaffHistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("/api/upload/history")
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }, []);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-3">
        <History className="text-blue-500 h-8 w-8" />
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
          Riwayat DataVortex
        </h1>
      </div>

      <div className="grid gap-4">
        {history.map((item: any) => (
          <Card
            key={item.id_upload}
            className="bg-slate-900/50 border-slate-800 hover:border-blue-500/50 transition-all"
          >
            <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-500/20">
                  <FileText className="text-blue-500 h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    {item.file_name}
                  </h3>
                  <p className="text-slate-500 text-sm font-mono">
                    {item.system_name}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-2 text-slate-400">
                  <Database className="h-4 w-4" />
                  <span className="text-sm font-bold">
                    {item.total_rows.toLocaleString()} Baris
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {new Date(item.upload_date).toLocaleString("id-ID")}
                  </span>
                </div>
                <Badge
                  className={
                    item.status.includes("DISETUJUI")
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  }
                >
                  {item.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {history.length === 0 && (
          <p className="text-slate-600 italic text-center py-20 uppercase tracking-widest font-black">
            Belum ada riwayat upload.
          </p>
        )}
      </div>
    </div>
  );
}
