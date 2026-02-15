"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  User,
  Zap,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Terminal,
  Activity,
  Network,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdidasDatabaseLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [sysStatus, setSysStatus] = useState("AWAITING_IDENT");

  const handleSystemAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSysStatus("QUERYING_DATABASE");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok)
        throw new Error(result.details || "Database rejected connection.");

      setSysStatus("HANDSHAKE_OK");
      toast.success("ACCESS_GRANTED", {
        description: `Welcome back, ${result.user.name}.`,
      });

      // Redirect sesuai role dari Database
      router.push(result.redirect);
      router.refresh();
    } catch (err: any) {
      setSysStatus("ERROR_MISMATCH");
      toast.error("AUTH_FAILED", { description: err.message });
      setFormData((p) => ({ ...p, password: "" }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Cyberpunk Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-[#0f172a]/50 backdrop-blur-3xl rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden z-10">
        {/* Branding Info */}
        <div className="hidden lg:flex flex-col p-16 justify-between border-r border-white/5 bg-gradient-to-b from-primary/10 to-transparent">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                <ShieldCheck className="text-white" />
              </div>
              <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
                DataVortex
              </h1>
            </div>
            <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
              Adidas
              <br />
              <span className="text-primary">Intelligence</span>
              <br />
              Port.
            </h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed italic">
              Enterprise data bridge developed by{" "}
              <span className="text-white">Netra.ai</span> for Adidas Global
              sets.
            </p>
          </div>
          <div className="font-mono text-[9px] text-slate-600 uppercase tracking-tighter italic">
            &gt; STABLE_DATABASE_CONNECTION_ESTABLISHED
          </div>
        </div>

        {/* Login Form */}
        <div className="p-10 md:p-20 flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">
              Handshake_Protocol
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
              <Network size={12} className="text-primary" /> Database
              Authorization Required
            </p>
          </div>

          <form onSubmit={handleSystemAccess} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.3em] ml-4">
                  Credential_Ident
                </label>
                <Input
                  required
                  type="email"
                  placeholder="name@netra.com"
                  className="h-16 bg-[#020617] border-white/5 rounded-2xl pl-6 text-white outline-none focus:ring-1 ring-primary transition-all"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.3em] ml-4">
                  Neural_Key
                </label>
                <div className="relative">
                  <Input
                    required
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-16 bg-[#020617] border-white/5 rounded-2xl pl-6 pr-12 text-white outline-none focus:ring-1 ring-primary transition-all"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              disabled={isLoading}
              className="w-full h-16 bg-primary hover:bg-blue-600 text-white rounded-2xl font-black uppercase italic tracking-widest shadow-2xl shadow-primary/20"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Authorize Link"
              )}
            </Button>
          </form>

          {/* Real-time Status */}
          <div className="mt-12 p-4 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity size={14} className="text-primary animate-pulse" />
              <span className="text-[9px] font-black text-slate-500 uppercase italic">
                Status: {sysStatus}
              </span>
            </div>
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
