//  versi 2
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, DollarSign, Package, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  const cards = [
    {
      label: "Total Profit (Cleaned)",
      value: stats?.totalProfit,
      icon: TrendingUp,
      color: "text-emerald-400",
    },
    {
      label: "Total Revenue",
      value: stats?.totalSales,
      icon: DollarSign,
      color: "text-blue-400",
    },
    {
      label: "Units Sold",
      value: stats?.totalUnits,
      icon: Package,
      color: "text-amber-400",
    },
    {
      label: "Transactions",
      value: stats?.totalTransactions,
      icon: BarChart3,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#020617] min-h-screen text-white">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">
          Director Dashboard
        </h1>
        <p className="text-slate-400 font-medium">
          Laporan Real-time Penjualan Adidas Indonesia
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <Card
            key={i}
            className="bg-slate-900/50 border-slate-800 backdrop-blur-xl"
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-950 flex items-center justify-center border border-slate-800">
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {card.label}
                </p>
                <p className="text-xl font-black">
                  {typeof card.value === "number"
                    ? card.value.toLocaleString("id-ID")
                    : "Loading..."}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-900/50 border-slate-800 p-8 text-center">
        <p className="text-slate-500 italic">
          Visualisasi grafik Apache Superset akan muncul di sini setelah
          integrasi selesai.
        </p>
      </Card>
    </div>
  );
}

// versi 1

// "use client";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { BarChart3, Lock } from "lucide-react";

// export default function AdminDashboard() {
//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
//           Executive Analytics
//         </h1>
//         <p className="text-slate-400 font-medium">
//           PT Netra Vidya Analitika - Adidas Indonesia
//         </p>
//       </div>

//       {/* Placeholder Box Apache Superset */}
//       <Card className="bg-slate-900/40 border-2 border-dashed border-slate-800 backdrop-blur-md overflow-hidden min-h-[650px] flex flex-col">
//         <CardHeader className="bg-slate-950/50 border-b border-slate-800">
//           <div className="flex items-center gap-3">
//             <BarChart3 className="text-blue-500 h-6 w-6" />
//             <div>
//               <CardTitle className="text-white">
//                 Apache Superset Integration
//               </CardTitle>
//               <CardDescription>
//                 Visualisasi data global akan ditampilkan di sini
//               </CardDescription>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-10">
//           <div className="h-20 w-20 rounded-full bg-slate-800 flex items-center justify-center mb-6 animate-pulse">
//             <Lock className="h-10 w-10 text-slate-600" />
//           </div>
//           <h2 className="text-2xl font-bold text-slate-400 mb-2 underline decoration-blue-500 decoration-4 underline-offset-8">
//             RESERVED FOR APACHE SUPERSET
//           </h2>
//           <p className="text-slate-500 max-w-sm">
//             Halaman ini sedang disiapkan untuk koneksi database dan Iframe
//             Apache Superset. Modul visualisasi otomatis akan aktif setelah
//             sinkronisasi database selesai.
//           </p>
//           <div className="mt-10 grid grid-cols-3 gap-4 w-full max-w-lg">
//             {[1, 2, 3].map((i) => (
//               <div
//                 key={i}
//                 className="h-24 bg-slate-800/20 rounded-xl border border-slate-800/50 border-dashed"
//               />
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
