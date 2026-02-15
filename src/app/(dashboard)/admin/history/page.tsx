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

export default function AdminHistoryPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("/api/admin")
      .then((res) => res.json())
      .then((data) => setLogs(data));
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-black italic uppercase text-white">
        Global History
      </h1>
      <div className="vortex-glass">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log: any) => (
              <TableRow key={log.id_upload}>
                <TableCell className="text-white font-bold">
                  {log.file_name}
                </TableCell>
                <TableCell className="text-slate-400 italic text-xs">
                  {log.uploaded_by}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant="outline"
                    className={
                      log.status === "APPROVED"
                        ? "text-emerald-500"
                        : "text-red-500"
                    }
                  >
                    {log.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
