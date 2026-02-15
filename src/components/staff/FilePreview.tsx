"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PreviewProps {
  data: any[];
}

export default function FilePreview({ data }: PreviewProps) {
  if (data.length === 0) return null;

  // Ambil 5 baris pertama saja untuk preview
  const previewRows = data.slice(0, 5);
  const headers = Object.keys(data[0]);

  return (
    <div className="vortex-glass overflow-hidden border-slate-800">
      <div className="bg-slate-900/50 p-3 border-b border-slate-800 flex justify-between items-center">
        <span className="text-[10px] font-black text-primary uppercase tracking-widest">
          Data Spreadsheet Preview (Top 5 Rows)
        </span>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-slate-800 hover:bg-transparent">
            {headers.map((header) => (
              <TableHead
                key={header}
                className="text-[10px] font-bold uppercase text-slate-500"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {previewRows.map((row, i) => (
            <TableRow key={i} className="border-slate-800">
              {headers.map((header) => (
                <TableCell key={header} className="text-xs text-slate-300">
                  {row[header]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
