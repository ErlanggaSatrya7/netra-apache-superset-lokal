"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error ke konsol untuk debugging dev
    console.error(error);
  }, [error]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full"></div>
        <AlertTriangle
          size={80}
          className="text-red-500 relative animate-pulse"
        />
      </div>

      <h1 className="text-3xl font-black italic tracking-tighter mb-2">
        VORTEX <span className="text-red-500">CRITICAL ERROR</span>
      </h1>

      <p className="text-slate-400 mb-8 max-w-md text-sm uppercase tracking-widest leading-relaxed">
        Sistem mendeteksi anomali pada pemrosesan data. Akses database atau
        parsing file terganggu.
      </p>

      <div className="flex gap-4">
        <Button
          onClick={() => (window.location.href = "/")}
          variant="outline"
          className="border-slate-800 text-slate-400 hover:bg-slate-900 rounded-xl px-6"
        >
          Back to Dashboard
        </Button>
        <Button
          onClick={() => reset()}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-lg shadow-blue-600/20"
        >
          <RefreshCcw size={16} className="mr-2" /> Re-Initialize
        </Button>
      </div>

      <p className="mt-12 text-[10px] text-slate-700 font-mono tracking-tighter">
        ERROR_DIGEST: {error.digest || "VX-UNKNOWN-ERR"}
      </p>
    </div>
  );
}
