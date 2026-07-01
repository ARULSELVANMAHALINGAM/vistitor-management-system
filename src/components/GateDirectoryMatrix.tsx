import React from "react";
import { Layers, Search, CheckCircle, LogOut, Trash2 } from "lucide-react";
import { Visitor } from "../types";

interface GateDirectoryMatrixProps {
  visitors: Visitor[];
  selectedVisitor: Visitor | null;
  onSelectVisitor: (v: Visitor) => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  onCheckIn: (id: string) => void;
  onCheckOut: (id: string) => void;
  onDeleteVisitor: (id: string) => void;
}

export default function GateDirectoryMatrix({
  visitors,
  selectedVisitor,
  onSelectVisitor,
  searchQuery,
  onSearchQueryChange,
  onCheckIn,
  onCheckOut,
  onDeleteVisitor
}: GateDirectoryMatrixProps) {

  const filteredVisitors = visitors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getClearanceLevelBadge = (level: string) => {
    switch (level) {
      case "top-secret":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-50 text-red-700 border border-red-200/60 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/40">Top Secret</span>;
      case "secret":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200/60 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/40">Secret</span>;
      case "restricted":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200/60 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/40">Restricted</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40">Unclassified</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "checked-in":
        return <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/35"><CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400 animate-pulse" /> Inside Perimeter</span>;
      case "checked-out":
        return <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded font-medium bg-slate-50 text-slate-600 border border-slate-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800"><LogOut className="w-3 h-3 text-slate-500 dark:text-zinc-500" /> Checked Out</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded font-medium bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/35"><Layers className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Registered</span>;
    }
  };

  return (
    <div id="gate-directory-matrix" className="bg-white dark:bg-zinc-950 rounded-xl border border-slate-200/80 dark:border-zinc-900 p-5 flex flex-col space-y-4 shadow-sm h-full transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Gate Directory Matrix
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">All registered active & historical records</p>
        </div>

        {/* Search Field */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ID, Name, or Company..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="bg-slate-50 dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white dark:focus:bg-zinc-950 w-full sm:w-56 font-mono transition-all"
          />
        </div>
      </div>

      {/* Visitor Table/List */}
      <div className="overflow-x-auto border border-slate-200/80 dark:border-zinc-900 rounded-lg bg-slate-50/50 dark:bg-zinc-950/40">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-zinc-900 bg-slate-100 dark:bg-zinc-900/50 text-slate-500 dark:text-zinc-400 font-mono uppercase tracking-wider text-[10px]">
              <th className="p-3">Visitor Info</th>
              <th className="p-3">Sector & Host</th>
              <th className="p-3">Status / Clearance</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-zinc-900">
            {filteredVisitors.length === 0 ? (
               <tr>
                 <td colSpan={4} className="p-8 text-center text-slate-400 dark:text-zinc-500 font-mono">
                   No compatible visitor logs found inside mainframe.
                 </td>
               </tr>
            ) : (
               filteredVisitors.map((v) => (
                <tr
                  key={v.id}
                  onClick={() => onSelectVisitor(v)}
                  className={`hover:bg-slate-100/50 dark:hover:bg-zinc-900/30 transition-colors cursor-pointer ${
                    selectedVisitor?.id === v.id ? "bg-blue-50/70 dark:bg-blue-950/20 border-l-2 border-l-blue-600 dark:border-l-blue-500" : ""
                  }`}
                >
                  <td className="p-3">
                    <div className="font-mono text-blue-600 dark:text-blue-400 font-bold">{v.id}</div>
                    <div className="font-semibold text-slate-800 dark:text-zinc-100 mt-0.5">{v.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-zinc-400">{v.company}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-slate-800 dark:text-zinc-200 font-medium">{v.department}</div>
                    <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono">Host: {v.hostName}</div>
                  </td>
                  <td className="p-3 space-y-1.5">
                    <div>{getStatusBadge(v.status)}</div>
                    <div>{getClearanceLevelBadge(v.clearanceLevel)}</div>
                  </td>
                  <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      {v.status === "registered" && (
                        <button
                          onClick={() => onCheckIn(v.id)}
                          title="Gate Check-In"
                          className="p-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white dark:bg-blue-950/40 dark:hover:bg-blue-600 dark:text-blue-400 dark:border dark:border-blue-900/40 rounded transition-all cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {v.status === "checked-in" && (
                        <button
                          onClick={() => onCheckOut(v.id)}
                          title="Gate Check-Out"
                          className="p-1.5 bg-amber-50 hover:bg-amber-600 text-amber-600 hover:text-white dark:bg-amber-950/40 dark:hover:bg-amber-600 dark:text-amber-400 dark:border dark:border-amber-900/40 rounded transition-all cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteVisitor(v.id)}
                        title="Purge File"
                        className="p-1.5 bg-slate-100 hover:bg-red-50 dark:bg-zinc-900 dark:hover:bg-red-950/40 text-slate-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 border border-slate-200 dark:border-zinc-800 hover:border-red-200 dark:hover:border-red-900/40 rounded transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
