import React from "react";
import { Visitor } from "../types";

interface AegisStatsProps {
  visitors: Visitor[];
}

export default function AegisStats({ visitors }: AegisStatsProps) {
  const activeCount = visitors.filter(v => v.status === "checked-in").length;
  const registeredCount = visitors.filter(v => v.status === "registered").length;
  const checkedOutCount = visitors.filter(v => v.status === "checked-out").length;
  const integrityIndex = visitors.length > 0 
    ? Math.round(100 - (visitors.reduce((acc, v) => acc + v.riskScore, 0) / visitors.length)) 
    : 100;

  return (
    <div id="aegis-stats-grid" className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-900 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-xl group-hover:bg-blue-500/10 dark:group-hover:bg-blue-400/10 transition-colors" />
        <div className="text-slate-500 dark:text-zinc-400 text-[10px] font-mono uppercase tracking-widest font-semibold">Active Visitors</div>
        <div className="text-3xl font-black font-mono text-blue-600 dark:text-blue-400 mt-1">
          {activeCount}
        </div>
        <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-1 font-medium">Inside security perimeter</div>
      </div>

      <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-900 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 dark:bg-amber-400/5 rounded-full blur-xl group-hover:bg-amber-500/10 dark:group-hover:bg-amber-400/10 transition-colors" />
        <div className="text-slate-500 dark:text-zinc-400 text-[10px] font-mono uppercase tracking-widest font-semibold">Pre-Registered</div>
        <div className="text-3xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1">
          {registeredCount}
        </div>
        <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-1 font-medium">Awaiting gate check-in</div>
      </div>

      <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-900 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-full blur-xl group-hover:bg-emerald-500/10 dark:group-hover:bg-emerald-400/10 transition-colors" />
        <div className="text-slate-500 dark:text-zinc-400 text-[10px] font-mono uppercase tracking-widest font-semibold">Checked Out</div>
        <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
          {checkedOutCount}
        </div>
        <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-1 font-medium">Session safely closed</div>
      </div>

      <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-900 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 dark:bg-purple-400/5 rounded-full blur-xl group-hover:bg-purple-500/10 dark:group-hover:bg-purple-400/10 transition-colors" />
        <div className="text-slate-500 dark:text-zinc-400 text-[10px] font-mono uppercase tracking-widest font-semibold">Integrity Index</div>
        <div className="text-3xl font-black font-mono text-purple-600 dark:text-purple-400 mt-1">
          {integrityIndex}%
        </div>
        <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-1 font-medium">Weighted perimeter safety</div>
      </div>
    </div>
  );
}
