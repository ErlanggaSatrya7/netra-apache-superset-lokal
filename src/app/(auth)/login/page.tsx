"use client";

import React, { useState, useEffect } from "react";
import {
  Cpu,
  Lock,
  Mail,
  Loader2,
  Zap,
  ShieldCheck,
  Fingerprint,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CyberPortalLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ action: "logout" }),
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("IDENTITY_REQUIRED");
    setIsLoading(true);
    const toastId = toast.loading("Verifying_Neural_Signature...");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("ACCESS_GRANTED", { id: toastId });
        window.location.href = data.redirect;
      } else {
        toast.error(data.error || "CREDENTIALS_MISMATCH", { id: toastId });
        setIsLoading(false);
      }
    } catch (err) {
      toast.error("SYSTEM_OFFLINE", { id: toastId });
      setIsLoading(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans italic selection:bg-primary/30">
      {/* --- CYBER DECORATION --- */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse" />

      <Card className="w-full max-w-[400px] bg-[#0b1120]/60 backdrop-blur-3xl border-white/5 p-8 lg:p-10 rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border-t-white/10 shadow-primary/5">
        {/* NEURAL SCAN EFFECT LINE */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/20 shadow-[0_0_15px_rgba(253,224,71,0.5)] animate-[scan_3s_linear_infinite] z-20" />

        <div className="flex flex-col items-center mb-10 relative z-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(253,224,71,0.2)] group-hover:scale-110 transition-transform duration-500">
            <Fingerprint size={32} className="text-black" />
          </div>

          <div className="text-center space-y-1">
            <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter leading-none">
              TITAN_<span className="text-primary">VX</span>
            </h1>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.6em] italic leading-none flex items-center justify-center gap-2">
              <Zap size={10} className="text-primary animate-pulse" />{" "}
              Secure_Neural_Interface
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          {/* EMAIL NODE */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 italic leading-none">
              Identity_Payload
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors"
                size={16}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="USER@TITANVX.NET"
                className="w-full h-14 bg-black/40 border border-white/5 rounded-xl pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-800 tracking-wider"
                required
              />
            </div>
          </div>

          {/* PASSWORD NODE */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 italic leading-none">
              Neural_Key
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors"
                size={16}
              />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-14 bg-black/40 border border-white/5 rounded-xl pl-12 pr-12 text-xs font-bold text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-800"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-16 bg-primary hover:bg-white text-black rounded-2xl font-black uppercase italic tracking-[0.2em] text-[11px] shadow-xl shadow-primary/10 transition-all active:scale-95 flex items-center justify-center gap-3 overflow-hidden group"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <span className="relative z-10">Establish_Link</span>
                <Zap
                  size={14}
                  fill="currentColor"
                  className="group-hover:animate-bounce"
                />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3">
            <ShieldCheck size={14} className="text-primary" />
            <span className="text-[7px] font-black text-white uppercase tracking-[0.5em] italic">
              Titan_Security_Protocol_V3.2
            </span>
          </div>
        </div>
      </Card>

      {/* CUSTOM SCAN ANIMATION */}
      <style jsx global>{`
        @keyframes scan {
          0% {
            top: 0;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
