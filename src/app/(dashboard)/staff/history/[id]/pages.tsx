"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function StaffDetailPreview({
  params,
}: {
  params: { id: string };
}) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Kita gunakan API Shared Preview yang kita buat tadi
    fetch(`/api/shared/preview?id_upload=${params.id}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-blue-500" />
      </div>
    );

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="text-slate-400"
      >
        <ArrowLeft size={16} className="mr-2" /> Kembali ke History
      </Button>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-slate-800/50">
            <TableRow className="border-slate-800">
              <TableHead className="text-slate-400">Product</TableHead>
              <TableHead className="text-slate-400">Retailer</TableHead>
              <TableHead className="text-slate-400 text-right">
                Units Sold
              </TableHead>
              <TableHead className="text-slate-400 text-right">
                Total Sales
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow key={idx} className="border-slate-800 text-slate-300">
                <TableCell>{item.product?.product}</TableCell>
                <TableCell>{item.retailer?.retailer_name}</TableCell>
                <TableCell className="text-right">{item.unit_sold}</TableCell>
                <TableCell className="text-right">
                  Rp {Number(item.total_sales).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
