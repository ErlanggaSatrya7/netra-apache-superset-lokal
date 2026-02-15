"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function StaffDashboard() {
  const [data, setData] = useState({
    totalTransaksi: 0,
    menungguAcc: 0,
    disetujui: 0,
    ditolak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mengambil 1.800 data transaksi yang sudah masuk ke PostgreSQL
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/staff/stats");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Gagal mengambil statistik:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card Total Transaksi - Akan menampilkan 1.800 */}
        <StatCard
          label="Total Transaksi"
          value={data.totalTransaksi}
          icon={<FileText className="text-blue-500" />}
          loading={loading}
        />

        {/* Card Menunggu ACC */}
        <StatCard
          label="Menunggu ACC"
          value={data.menungguAcc}
          icon={<Clock className="text-amber-500" />}
          loading={loading}
        />

        <StatCard
          label="Disetujui"
          value={data.disetujui}
          icon={<CheckCircle2 className="text-emerald-500" />}
          loading={loading}
        />

        <StatCard
          label="Ditolak"
          value={data.ditolak}
          icon={<XCircle className="text-rose-500" />}
          loading={loading}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, loading }: any) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
            {label}
          </p>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          ) : (
            <h2 className="text-3xl font-black text-white italic tracking-tighter">
              {value.toLocaleString()}
            </h2>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
