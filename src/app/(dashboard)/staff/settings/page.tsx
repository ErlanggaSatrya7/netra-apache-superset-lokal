"use client";

import React, { useState } from "react";
import {
  User,
  Terminal,
  LogOut,
  Loader2,
  Shield,
  Settings as SettingsIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // FIX: Button IMPORTED
import { toast } from "sonner";

export default function StaffSettingsPortal() {
  const [isExiting, setIsExiting] = useState(false);

  const handleLogout = async () => {
    setIsExiting(true);
    try {
      await fetch("/api/auth", {
        method: "POST",
        body: JSON.stringify({ action: "logout" }),
      });
      window.location.href = "/login"; // FORCE HARD RESET
    } catch (e) {
      toast.error("Logout Error");
    } finally {
      setIsExiting(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 pb-40 animate-in fade-in duration-700">
      <div className="border-b border-white/5 pb-8 flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary mb-2">
            <User size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Identity_Config
            </span>
          </div>
          <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter leading-none">
            Node{" "}
            <span className="text-primary font-sans lowercase italic">
              Settings
            </span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-1 bg-[#0f172a]/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 flex flex-col items-center shadow-2xl h-fit">
          <div className="w-32 h-32 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-8">
            <Shield size={48} className="text-primary" />
          </div>
          <h2 className="text-2xl font-black italic text-white uppercase">
            Staff_Alpha
          </h2>
          {/* FIX ISSUE 3: Change <p> to <div> */}
          <div className="mt-4 text-[10px] text-emerald-400 font-black uppercase tracking-widest bg-emerald-400/5 px-4 py-1 rounded-full border border-emerald-400/20 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
            Live_Handshake_Active
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-[#0f172a]/60 backdrop-blur-3xl border-white/5 rounded-[4rem] p-12 shadow-2xl">
            <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
              <Terminal size={24} className="text-primary" />
              <h3 className="text-xl font-black italic text-white uppercase tracking-widest">
                Protocol Overrides
              </h3>
            </div>
            <div className="space-y-10">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Identity_Auth
                </label>
                <input
                  type="text"
                  value="staff@netra.com"
                  disabled
                  className="w-full h-14 bg-black/40 border border-white/5 rounded-2xl px-6 text-xs text-slate-500 opacity-50 font-mono"
                />
              </div>
              <Button className="w-full h-20 bg-primary hover:bg-blue-600 text-white rounded-[2rem] font-black uppercase italic tracking-widest text-xs shadow-2xl transition-all">
                Save_Node_State
              </Button>
            </div>
          </Card>
          <Button
            disabled={isExiting}
            onClick={handleLogout}
            variant="ghost"
            className="w-full h-20 bg-rose-600/5 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-600/20 rounded-[2.5rem] font-black uppercase italic tracking-widest text-xs transition-all"
          >
            {isExiting ? (
              <Loader2 className="animate-spin mr-4" />
            ) : (
              <LogOut size={20} className="mr-4" />
            )}
            Terminate Secure Session
          </Button>
        </div>
      </div>
    </div>
  );
}
