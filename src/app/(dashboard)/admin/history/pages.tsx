// versi 2

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Download, CheckCircle } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);

  const fetchHistory = async () => {
    const res = await fetch("/api/admin/history");
    const data = await res.json();
    setHistory(data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("PT Netra Vidya Analitika - Laporan Adidas", 14, 20);

    const tableData = history.map((item) => [
      new Date(item.invoice_date).toLocaleDateString("id-ID"),
      `Rp ${Number(item.total_sales).toLocaleString()}`,
      `Rp ${Number(item.operating_profit).toLocaleString()}`,
      "Verified",
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Tanggal", "Sales", "Profit", "Status"]],
      body: tableData,
      headStyles: { fillColor: [2, 6, 23] },
    });
    doc.save("Laporan_Adidas_Indonesia.pdf");
  };

  return (
    <div className="p-8 space-y-8 bg-[#020617] min-h-screen text-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic uppercase text-emerald-500">
            History
          </h1>
          <p className="text-slate-400">
            Arsip data yang telah disetujui Direktur.
          </p>
        </div>
        <Button
          onClick={exportPDF}
          className="bg-white text-black hover:bg-slate-200"
        >
          <Download className="mr-2 h-4 w-4" /> Export PDF
        </Button>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-950/50">
              <TableRow className="border-slate-800">
                <TableHead className="text-slate-500 font-bold uppercase text-[10px]">
                  Tanggal
                </TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-[10px]">
                  Sales
                </TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-[10px]">
                  Profit
                </TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-[10px]">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-10 text-slate-500"
                  >
                    Belum ada data terverifikasi.
                  </TableCell>
                </TableRow>
              ) : (
                history.map((item) => (
                  <TableRow
                    key={item.id_transaction}
                    className="border-slate-800"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-blue-500" />
                        {new Date(item.invoice_date).toLocaleDateString(
                          "id-ID"
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">
                      Rp {Number(item.total_sales).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-emerald-400 font-bold">
                      Rp {Number(item.operating_profit).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                        <CheckCircle className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// versi 1

// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Calendar as CalendarIcon, Download, CheckCircle } from "lucide-react";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// export default function HistoryPage() {
//   const [history, setHistory] = useState<any[]>([]);

//   const fetchHistory = async () => {
//     const res = await fetch("/api/admin/history");
//     const data = await res.json();
//     setHistory(data);
//   };

//   useEffect(() => { fetchHistory(); }, []);

//   const exportPDF = () => {
//     const doc = new jsPDF();
//     doc.text("PT Netra Vidya Analitika - Laporan Adidas", 14, 20);

//     const tableData = history.map(item => [
//       new Date(item.invoice_date).toLocaleDateString('id-ID'),
//       `Rp ${Number(item.total_sales).toLocaleString()}`,
//       `Rp ${Number(item.operating_profit).toLocaleString()}`,
//       "Verified"
//     ]);

//     autoTable(doc, {
//       startY: 30,
//       head: [['Tanggal', 'Sales', 'Profit', 'Status']],
//       body: tableData,
//       headStyles: { fillColor: [2, 6, 23] }
//     });
//     doc.save("Laporan_Adidas_Indonesia.pdf");
//   };

//   return (
//     <div className="p-8 space-y-8 bg-[#020617] min-h-screen text-white">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-black italic uppercase text-emerald-500">History</h1>
//           <p className="text-slate-400">Arsip data yang telah disetujui Direktur.</p>
//         </div>
//         <Button onClick={exportPDF} className="bg-white text-black hover:bg-slate-200">
//           <Download className="mr-2 h-4 w-4" /> Export PDF
//         </Button>
//       </div>

//       <Card className="bg-slate-900/50 border-slate-800">
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader className="bg-slate-950/50">
//               <TableRow className="border-slate-800">
//                 <TableHead className="text-slate-500 font-bold uppercase text-[10px]">Tanggal</TableHead>
//                 <TableHead className="text-slate-500 font-bold uppercase text-[10px]">Sales</TableHead>
//                 <TableHead className="text-slate-500 font-bold uppercase text-[10px]">Profit</TableHead>
//                 <TableHead className="text-slate-500 font-bold uppercase text-[10px]">Status</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {history.length === 0 ? (
//                  <TableRow><TableCell colSpan={4} className="text-center py-10 text-slate-500">Belum ada data terverifikasi.</TableCell></TableRow>
//               ) : (
//                 history.map((item) => (
//                   <TableRow key={item.id_transaction} className="border-slate-800">
//                     <TableCell><div className="flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-blue-500" />{new Date(item.invoice_date).toLocaleDateString('id-ID')}</div></TableCell>
//                     <TableCell className="font-bold">Rp {Number(item.total_sales).toLocaleString()}</TableCell>
//                     <TableCell className="text-emerald-400 font-bold">Rp {Number(item.operating_profit).toLocaleString()}</TableCell>
//                     <TableCell><Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"><CheckCircle className="h-3 w-3 mr-1" /> Verified</Badge></TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
