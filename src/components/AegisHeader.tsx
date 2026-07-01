import React from "react";
import { Shield, Cpu, Database, LogOut, User } from "lucide-react";
import AegisLogo from "./AegisLogo";

interface JavaStatus {
  hasJava: boolean;
  hasJavac: boolean;
  javaVersion: string;
  javacVersion: string;
  environment: string;
}

interface AegisHeaderProps {
  javaStatus: JavaStatus | null;
  notification: { type: "success" | "error" | "info"; text: string } | null;
  onCloseNotification: () => void;
  currentUser: { id: string; username: string; name: string; role: string; department?: string } | null;
  onLogout: () => void;
}

export default function AegisHeader({ 
  javaStatus, 
  notification, 
  onCloseNotification,
  currentUser,
  onLogout
}: AegisHeaderProps) {
  
  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case "admin": return "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50";
      case "employee": return "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50";
      default: return "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50";
    }
  };

  return (
    <>
      {/* Upper Status Header */}
      <header id="aegis-header" className="border-b border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-sm relative overflow-hidden transition-colors">
        {/* Abstract background ambient aura for a polished corporative touch */}
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-12 bg-purple-500/5 blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-1.5 bg-blue-50/50 dark:bg-zinc-900 border border-blue-100 dark:border-zinc-800 rounded-xl shadow-sm">
            <AegisLogo className="w-9 h-9" glow={true} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100 font-mono">
                AEGIS COMMAND DECK
              </h1>
              <span className="text-[10px] font-bold tracking-widest font-mono uppercase text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/30">
                Visitor Core v3.5
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Secure Industrial Node & Cognitive Vetting Control Console</p>
          </div>
        </div>

        {/* Diagnostic Bar & Session Tracker */}
        <div className="flex flex-wrap items-center gap-3.5 text-xs font-mono relative z-10 lg:justify-end">
          
          {/* Active User Session Details */}
          {currentUser && (
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-900/60 p-2 rounded-xl border border-slate-250 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">
              <div className="p-1 bg-white dark:bg-zinc-950 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hidden sm:block">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="text-[11px] leading-tight pr-2 border-r border-slate-250 dark:border-zinc-850">
                <div className="font-bold text-slate-800 dark:text-zinc-100">{currentUser.name}</div>
                <div className="text-[9px] text-slate-400 dark:text-zinc-500 font-medium uppercase">{currentUser.department || "SECURITY DEPT"}</div>
              </div>
              
              <div className="flex items-center gap-1.5 pl-1">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border uppercase tracking-wider ${getRoleBadgeColor(currentUser.role)}`}>
                  {currentUser.role}
                </span>
                <button
                  onClick={onLogout}
                  className="p-1 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 text-slate-400 rounded-lg transition-colors cursor-pointer"
                  title="Lock Mainframe Session & Exit"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-900/40 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400">
            <div className="flex items-center gap-1.5 px-1 sm:border-r border-slate-250 dark:border-zinc-850">
              <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-slate-400 dark:text-zinc-500 hidden sm:inline">JDK Engine:</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">{javaStatus?.hasJavac ? "Online" : "None"}</span>
            </div>
            <div className="flex items-center gap-1.5 px-1 sm:border-r border-slate-250 dark:border-zinc-850">
              <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-slate-400 dark:text-zinc-500 hidden sm:inline">Database:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Synced</span>
            </div>
            <div className="hidden md:flex items-center gap-1 text-slate-400 dark:text-zinc-500 px-1 text-[11px]">
              <span>System Clock:</span>
              <span className="text-slate-700 dark:text-zinc-200 font-bold">2026-06-30 UTC</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Alert Notification Banner */}
      {notification && (
        <div id="aegis-notification" className={`px-6 py-2.5 text-xs font-mono flex items-center justify-between border-b transition-colors ${
          notification.type === "success" 
            ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-400" 
            : notification.type === "error"
            ? "bg-red-50 dark:bg-red-950/20 border-red-250 dark:border-red-900/40 text-red-800 dark:text-red-400"
            : "bg-blue-50 dark:bg-blue-950/20 border-blue-250 dark:border-blue-900/40 text-blue-800 dark:text-blue-400"
        }`}>
          <div className="flex items-center gap-2">
            <span className="animate-pulse text-blue-500">●</span>
            <span>[NOTIFICATION] {notification.text}</span>
          </div>
          <button onClick={onCloseNotification} className="hover:text-slate-900 dark:hover:text-zinc-100 transition-colors cursor-pointer font-bold">✕</button>
        </div>
      )}
    </>
  );
}
