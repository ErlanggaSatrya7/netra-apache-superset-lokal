"use client";

import React, { useState } from "react";
import { User, Shield, Terminal, LogOut, Loader2, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPortal() {
  const [isExiting, setIsExiting] = useState(false);

  const handleLogout = async () => {
    setIsExiting(true);
    await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ action: "logout" }),
    });
    window.location.href = "/login";
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 pb-40 animate-in fade-in duration-700">
      <div className="border-b border-white/5 pb-8">
        <h1 className="text-6xl font-black italic text-white uppercase tracking-tighter leading-none">
          System{" "}
          <span className="text-primary font-sans lowercase tracking-normal">
            Config
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="bg-[#0f172a]/60 border-white/5 rounded-[3rem] p-12 flex flex-col items-center shadow-2xl h-fit">
          <div className="w-40 h-40 rounded-[2.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center mb-10 relative">
            <Shield size={64} className="text-primary" />
            <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-3xl animate-pulse" />
          </div>
          <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-2">
            Master_Titan
          </h2>

          {/* HYDRATION FIX: Use div instead of p to house animation div */}
          <div className="flex items-center gap-3 px-6 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">
              Root_Access_Active
            </span>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-10">
          <Card className="bg-[#0f172a]/60 border-white/5 rounded-[4rem] p-16 shadow-2xl">
            <div className="flex items-center gap-5 mb-12 border-b border-white/5 pb-8">
              <Terminal size={30} className="text-primary" />
              <h3 className="text-2xl font-black italic text-white uppercase tracking-widest">
                Neural Link
              </h3>
            </div>
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">
                  Identity_Authorized
                </label>
                <input
                  type="text"
                  value="admin@netra.com"
                  disabled
                  className="w-full h-20 bg-black/40 border border-white/5 rounded-[1.5rem] px-8 text-sm text-slate-500 opacity-60 font-mono"
                />
              </div>
              <Button className="w-full h-24 bg-primary hover:bg-blue-600 text-white rounded-[2.5rem] font-black uppercase italic tracking-[0.2em] text-xs shadow-2xl transition-all">
                Save_Node_State
              </Button>
            </div>
          </Card>

          <Button
            disabled={isExiting}
            onClick={handleLogout}
            variant="ghost"
            className="w-full h-24 bg-rose-600/5 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-600/20 rounded-[2.5rem] font-black uppercase italic tracking-[0.3em] text-xs transition-all shadow-xl group"
          >
            {isExiting ? (
              <Loader2 className="animate-spin mr-5" />
            ) : (
              <LogOut
                size={24}
                className="mr-5 group-hover:-translate-x-2 transition-transform"
              />
            )}
            Terminate_All_Sessions
          </Button>
        </div>
      </div>
    </div>
  );
}
