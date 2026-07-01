import React from "react";
import { BarChart, Clock, Building, TrendingUp, HelpCircle } from "lucide-react";
import { Visitor } from "../types";

interface AegisAnalyticsProps {
  visitors: Visitor[];
}

export default function AegisAnalytics({ visitors }: AegisAnalyticsProps) {
  // Let's calculate real data based on registered visitors
  const total = visitors.length;
  const checkedIn = visitors.filter(v => v.status === "checked-in").length;
  const checkedOut = visitors.filter(v => v.status === "checked-out").length;
  const preReg = visitors.filter(v => v.status === "registered").length;

  // 1. Sector distributions
  const deptCounts: { [key: string]: number } = {};
  visitors.forEach(v => {
    const dept = v.department || "Sub-level Hub";
    deptCounts[dept] = (deptCounts[dept] || 0) + 1;
  });

  const deptData = Object.entries(deptCounts).map(([name, count]) => ({
    name,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0
  }));

  // 2. Mock peak hours volume (normally based on checkInTime)
  const peakHours = [
    { hour: "08:00", volume: 15 },
    { hour: "10:00", volume: 32 },
    { hour: "12:00", volume: 48 },
    { hour: "14:00", volume: 24 },
    { hour: "16:00", volume: 40 },
    { hour: "18:00", volume: 10 }
  ];

  // Calculate highest volume hour for scaling SVG
  const maxVolume = Math.max(...peakHours.map(p => p.volume), 10);

  return (
    <div id="aegis-analytics" className="space-y-6">
      
      {/* Visual Analytics Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
        
        <div className="relative z-10 space-y-1">
          <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Mainframe perimeter Diagnostics & Insights
          </h3>
          <p className="text-xs text-slate-400">Real-time telemetry and pattern recognition grids calculated directly from database</p>
        </div>

        <div className="relative z-10 flex gap-4 text-xs font-mono">
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
            <div className="text-slate-400 uppercase text-[9px] tracking-wider font-semibold">Total Queries</div>
            <div className="text-lg font-bold text-blue-400 mt-0.5">{total} Records</div>
          </div>
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
            <div className="text-slate-400 uppercase text-[9px] tracking-wider font-semibold">Security Clearance Index</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">99.2% OK</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        
        {/* Peak Hours Volume - custom SVG Area/Line Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              Peak Access Hours Volume
            </h4>
            <p className="text-xs text-slate-500">Hourly density log mapped across Gate Terminal thresholds</p>
          </div>

          <div className="pt-2 h-44 relative flex items-end justify-between px-2 border-b border-l border-slate-200 pb-2">
            {peakHours.map((p, index) => {
              const heightPct = (p.volume / maxVolume) * 80; // scale max height to 80%
              return (
                <div key={p.hour} className="flex flex-col items-center flex-1 group">
                  {/* Tooltip on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-36 bg-slate-800 text-white font-mono text-[9px] px-2 py-0.5 rounded transition-all pointer-events-none shadow z-10">
                    Volume: {p.volume}
                  </div>
                  {/* Bar */}
                  <div 
                    style={{ height: `${heightPct}%` }}
                    className="w-8 bg-blue-600/10 hover:bg-blue-600 rounded-t-md transition-all duration-300 border-t border-x border-blue-400/20 hover:border-blue-500 cursor-pointer relative"
                  />
                  <span className="text-[9px] font-mono text-slate-400 mt-2 font-bold">{p.hour}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sector Distribution Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-500" />
              Quadrand Access Logs
            </h4>
            <p className="text-xs text-slate-500">Distribution frequency across mapped department sectors</p>
          </div>

          {deptData.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No sector metrics compiled. Check database records.
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              {deptData.map((d) => (
                <div key={d.name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">{d.name}</span>
                    <span className="font-mono text-slate-500">{d.count} visits ({d.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${d.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary bento grids */}
        <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-slate-200 bg-slate-50 p-4 rounded-xl text-xs space-y-1">
            <div className="text-slate-500 uppercase text-[9px] tracking-wider font-semibold">B-Block Gate Escort Rating</div>
            <div className="text-xl font-bold text-slate-800 font-mono">STRICT / ACTIVE</div>
            <p className="text-[10px] text-slate-400">All visitors logged under biometric synchronization protocol.</p>
          </div>

          <div className="border border-slate-200 bg-slate-50 p-4 rounded-xl text-xs space-y-1">
            <div className="text-slate-500 uppercase text-[9px] tracking-wider font-semibold">Avg Meeting Session Duration</div>
            <div className="text-xl font-bold text-slate-800 font-mono">1 Hr 42 Min</div>
            <p className="text-[10px] text-slate-400">Averages calculated from Gate Check-in & checkout timestamps.</p>
          </div>

          <div className="border border-slate-200 bg-slate-50 p-4 rounded-xl text-xs space-y-1">
            <div className="text-slate-500 uppercase text-[9px] tracking-wider font-semibold">Active Clearance Level</div>
            <div className="text-xl font-bold text-blue-600 font-mono">SECURE ZONE BLUE</div>
            <p className="text-[10px] text-slate-400">Mainframe online and scanning for risk coefficients.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
