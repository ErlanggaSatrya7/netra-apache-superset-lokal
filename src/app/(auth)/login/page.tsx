"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Lock, Mail, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function CyberPortalLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // NUCLEAR FIX: Bersihkan sisa sesi tiap kali masuk halaman login
  useEffect(() => {
    const clearSession = async () => {
      await fetch("/api/auth", {
        method: "POST",
        body: JSON.stringify({ action: "logout" }),
      });
    };
    clearSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("IDENTITY_REQUIRED");

    setIsLoading(true);
    try {
      // Pastikan email diproses huruf kecil total
      const res = await fetch("/api/auth", {
        method: "POST",
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("ACCESS_GRANTED");
        // GUNAKAN window.location agar refresh total memori browser
        window.location.href = data.redirect;
      } else {
        toast.error(data.error || "CREDENTIALS_MISMATCH");
        setIsLoading(false);
      }
    } catch (err) {
      toast.error("DATABASE_OFFLINE");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md bg-[#0f172a]/40 backdrop-blur-2xl border-white/5 p-10 rounded-[3rem] shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(59,130,246,0.5)]">
            <Cpu size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter leading-none">
            Netra{" "}
            <span className="text-primary font-sans lowercase">Titan</span>
          </h1>
          <div className="flex items-center gap-2 mt-3">
            <Zap size={10} className="text-primary animate-pulse" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">
              v32.2_Emergency_Patch
            </span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">
              Identity_Node
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600"
                size={18}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@netra.com"
                className="w-full h-16 bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 text-sm text-white outline-none focus:ring-1 ring-primary/40 transition-all"
                style={{ textTransform: "none" }}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">
              Security_Key
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600"
                size={18}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-16 bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 text-sm text-white outline-none focus:ring-1 ring-primary/40 transition-all"
                style={{ textTransform: "none" }}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-20 bg-primary hover:bg-blue-600 text-white rounded-[2rem] font-black uppercase italic tracking-widest text-xs shadow-2xl transition-all"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Authorize_Neural_Link"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
