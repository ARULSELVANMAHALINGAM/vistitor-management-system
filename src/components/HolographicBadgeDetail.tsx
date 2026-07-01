import React from "react";
import { User, Printer, Database, Sparkles, HelpCircle, RefreshCw, ChevronRight } from "lucide-react";
import { Visitor } from "../types";
import { QRCodeSVG } from "qrcode.react";

interface HolographicBadgeDetailProps {
  selectedVisitor: Visitor | null;
  aiQuery: string;
  setAiQuery: (v: string) => void;
  aiResponse: string;
  aiLoading: boolean;
  onAiQuerySubmit: (e: React.FormEvent) => void;
  onCheckIn?: (id: string) => void;
  onCheckOut?: (id: string) => void;
  onSignNDA?: (visitor: Visitor) => void;
}

export default function HolographicBadgeDetail({
  selectedVisitor,
  aiQuery,
  setAiQuery,
  aiResponse,
  aiLoading,
  onAiQuerySubmit,
  onCheckIn,
  onCheckOut,
  onSignNDA
}: HolographicBadgeDetailProps) {

  const getClearanceLevelBadge = (level: string) => {
    switch (level) {
      case "top-secret":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-800 border border-red-200">Top Secret</span>;
      case "secret":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-200">Secret</span>;
      case "restricted":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-800 border border-purple-200">Restricted</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">Unclassified</span>;
    }
  };

  return (
    <aside id="aegis-badge-detail-sidebar" className="w-full xl:w-96 border-t xl:border-t-0 xl:border-l border-slate-200 dark:border-zinc-900 bg-slate-100/50 dark:bg-zinc-950/10 p-6 flex flex-col space-y-6 overflow-y-auto shadow-sm relative">
      
      {/* Section 1: Holographic Badge Render Profile */}
      {selectedVisitor ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 dark:text-zinc-450 uppercase tracking-widest font-mono">Security Dossier</h3>
            <span className="text-[10px] font-mono text-slate-600 dark:text-zinc-400 bg-slate-200/65 dark:bg-zinc-900 px-2 py-0.5 rounded border border-slate-300/50 dark:border-zinc-800">
              ID: {selectedVisitor.id}
            </span>
          </div>

          {/* Futuristic Interactive Security Hologram Badge */}
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
            {/* Dynamic clearance background aura */}
            <div 
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 blur-2xl transition-all group-hover:opacity-20"
              style={{ backgroundColor: selectedVisitor.badgeColor }}
            />
            
            {/* Header of Badge */}
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full animate-ping"
                  style={{ backgroundColor: selectedVisitor.badgeColor }}
                />
                <span className="text-[10px] font-mono tracking-wider text-slate-500 dark:text-zinc-400 font-bold uppercase">Aegis Facility Access</span>
              </div>
              <Printer className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-550 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors cursor-pointer" title="Mock Holographic Badge Emission" />
            </div>

            {/* Profile Core */}
            <div className="py-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center font-mono font-black text-lg shadow-inner relative overflow-hidden select-none">
                  {/* Grid lines for scifi look */}
                  <div className="absolute inset-0 bg-grid opacity-10" />
                  <span style={{ color: selectedVisitor.badgeColor }}>
                    {selectedVisitor.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-zinc-100 text-sm leading-tight uppercase tracking-wide">
                    {selectedVisitor.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">{selectedVisitor.company}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-xs pt-1.5 border-t border-slate-100 dark:border-zinc-900">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-550 font-mono uppercase tracking-wider block">Target Node</span>
                  <span className="text-slate-700 dark:text-zinc-200 font-semibold">{selectedVisitor.department}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-550 font-mono uppercase tracking-wider block">Security Officer Host</span>
                  <span className="text-slate-700 dark:text-zinc-200 font-semibold">{selectedVisitor.hostName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-xs pt-2">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-550 font-mono uppercase tracking-wider block">Clearance Tier</span>
                  <div className="mt-0.5">{getClearanceLevelBadge(selectedVisitor.clearanceLevel)}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-550 font-mono uppercase tracking-wider block">Assessed Risk Rating</span>
                  <span className="font-mono font-bold mt-0.5 block" style={{ color: selectedVisitor.badgeColor }}>
                    {selectedVisitor.riskScore}% Risk Index
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Protocol instructions block */}
            <div className="p-2.5 rounded-lg text-[10px] font-mono leading-relaxed bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 mt-1">
              <span className="text-slate-500 dark:text-zinc-400 font-bold block mb-0.5">Countermeasure Directives:</span>
              <span className="text-slate-700 dark:text-zinc-300">{selectedVisitor.securityProtocol}</span>
            </div>

            {/* QR Code Scan Pass Section */}
            <div className="mt-3.5 pt-3 border-t border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3">
              <div className="space-y-1 flex-1">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block">RAPID ACCESS PASS</span>
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono block leading-tight">
                  ID: <span className="text-slate-800 dark:text-zinc-200 font-bold">{selectedVisitor.id}</span>
                </span>
                {onCheckIn && onCheckOut && (
                  <button
                    onClick={() => {
                      if (selectedVisitor.status === "registered") {
                        onCheckIn(selectedVisitor.id);
                      } else if (selectedVisitor.status === "checked-in") {
                        onCheckOut(selectedVisitor.id);
                      }
                    }}
                    disabled={selectedVisitor.status === "checked-out"}
                    className={`mt-1.5 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      selectedVisitor.status === "registered"
                        ? "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white"
                        : selectedVisitor.status === "checked-in"
                        ? "bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40 hover:bg-amber-600 dark:hover:bg-amber-600 hover:text-white"
                        : "bg-slate-100 text-slate-400 border border-slate-200 dark:bg-zinc-900 dark:text-zinc-600 dark:border-zinc-800 cursor-not-allowed"
                    }`}
                  >
                    {selectedVisitor.status === "registered" && "Simulate Scan In"}
                    {selectedVisitor.status === "checked-in" && "Simulate Scan Out"}
                    {selectedVisitor.status === "checked-out" && "Deactivated"}
                  </button>
                )}
              </div>
              <div 
                onClick={() => {
                  if (onCheckIn && onCheckOut) {
                    if (selectedVisitor.status === "registered") {
                      onCheckIn(selectedVisitor.id);
                    } else if (selectedVisitor.status === "checked-in") {
                      onCheckOut(selectedVisitor.id);
                    }
                  }
                }}
                title="Scan QR Code to rapidly change visitor status at gate reader"
                className="p-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm flex items-center justify-center relative group/qr hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
              >
                <QRCodeSVG
                  value={selectedVisitor.id}
                  size={56}
                  level="H"
                  fgColor="#0f172a"
                  bgColor="#ffffff"
                  includeMargin={false}
                />
                <div className="absolute inset-0 bg-blue-500/0 group-hover/qr:bg-blue-500/10 flex items-center justify-center transition-all rounded-xl">
                  <span className="text-[8px] font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover/qr:opacity-100 uppercase tracking-widest bg-white/95 dark:bg-zinc-900/95 px-1 py-0.5 rounded border border-blue-200 dark:border-blue-800 shadow-sm">
                    SCAN
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security NDA Waiver Verification Section */}
          <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs shadow-sm space-y-3">
            <div className="font-bold text-slate-700 dark:text-zinc-300 font-mono text-[10px] uppercase tracking-wider border-b border-slate-100 dark:border-zinc-900 pb-1.5 flex items-center justify-between">
              <span>Security NDA Waiver</span>
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider ${
                selectedVisitor.ndaSigned 
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50" 
                  : "bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50"
              }`}>
                {selectedVisitor.ndaSigned ? "Verified Signed" : "Pending Signature"}
              </span>
            </div>

            {selectedVisitor.ndaSigned ? (
              <div className="space-y-2">
                <div className="bg-slate-50 dark:bg-zinc-900/40 border border-slate-150 dark:border-zinc-850 p-2.5 rounded-lg flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono text-slate-400 dark:text-zinc-500 block uppercase tracking-widest">SECURE DIGITAL LOCK</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold font-mono block">BIOMETRIC ACKNOWLEDGED</span>
                  </div>
                  {selectedVisitor.ndaSignature && selectedVisitor.ndaSignature.startsWith("data:image/") && (
                    <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded p-1 shadow-sm max-w-[80px]">
                      <img 
                        src={selectedVisitor.ndaSignature} 
                        alt="Signature Lock" 
                        referrerPolicy="no-referrer"
                        className="max-h-7 object-contain select-none filter dark:invert dark:hue-rotate-185" 
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono leading-relaxed">
                  Visitor must sign the facility NDA and operating boundary liability waiver prior to receiving active gate check-in clearance.
                </p>
                {onSignNDA && (
                  <button
                    onClick={() => onSignNDA(selectedVisitor)}
                    className="w-full py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 dark:border-blue-900/50 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer text-center block"
                  >
                    ✍️ Hand-Sign Waiver & Seal Access
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Selected Profile Detailed logs */}
          <div className="space-y-2 bg-white dark:bg-zinc-950 p-4 rounded-xl border border-slate-200 dark:border-zinc-900 text-xs shadow-sm">
            <div className="font-bold text-slate-700 dark:text-zinc-300 font-mono text-[10px] uppercase tracking-wider border-b border-slate-100 dark:border-zinc-900 pb-1.5 flex items-center justify-between">
              <span>Biometric Timeline Sync</span>
              <Database className="w-3 h-3 text-slate-400" />
            </div>
            <div className="space-y-2 max-h-36 overflow-y-auto font-mono text-[11px] pt-1 leading-relaxed">
              {selectedVisitor.visitHistory?.map((log, idx) => (
                <div key={idx} className="flex gap-2 text-slate-600 dark:text-zinc-400">
                  <span className="text-blue-600 dark:text-blue-400 select-none">»</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-48 flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-zinc-800 rounded-2xl text-center text-slate-400 dark:text-zinc-500 p-6 bg-white dark:bg-zinc-950/45 shadow-sm">
          <User className="w-8 h-8 mb-2 text-slate-300 dark:text-zinc-700 animate-pulse" />
          <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">No active dossier selected.</p>
          <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">Select a visitor profile in the main gate directory table.</p>
        </div>
      )}

      {/* Section 2: AI Cognitive Security Mainframe Chatbot */}
      <div className="flex-1 flex flex-col border-t border-slate-200 dark:border-zinc-900 pt-6 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Aegis AI Mainframe
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400">Query threat databases on visitors using server-side intelligence</p>
        </div>

        {/* Chatbot Dialogue Area */}
        <div className="flex-1 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-xl p-3.5 flex flex-col space-y-3.5 min-h-[160px] max-h-[220px] overflow-y-auto font-mono text-xs select-text scrollbar-thin shadow-inner">
          {aiResponse ? (
            <div className="space-y-2">
              <div className="text-purple-700 dark:text-purple-450 font-bold flex items-center gap-1 text-[10px] uppercase tracking-wider">
                <span>Aegis Security Response:</span>
              </div>
              <p className="text-slate-700 dark:text-zinc-300 leading-relaxed text-[11px] whitespace-pre-wrap">{aiResponse}</p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-zinc-600 text-center select-none pt-6">
              <HelpCircle className="w-8 h-8 text-slate-300 dark:text-zinc-800 mb-1" />
              <p className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400">Security AI interface idle.</p>
              <p className="text-[9px] text-slate-400 dark:text-zinc-500">Enter a manual screening query or request detailed background checks below.</p>
            </div>
          )}
        </div>

        {/* Mainframe Dialogue query form */}
        <form onSubmit={onAiQuerySubmit} className="flex gap-2">
          <input
            type="text"
            disabled={aiLoading}
            placeholder={selectedVisitor ? `Query regarding ${selectedVisitor.name}...` : "Query general mainframe stats..."}
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            className="flex-1 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs p-2.5 focus:outline-none focus:ring-1 focus:ring-purple-600 dark:focus:ring-purple-500 focus:bg-white dark:focus:bg-zinc-950 font-mono text-slate-800 dark:text-zinc-100 transition-all"
          />
          <button
            type="submit"
            disabled={aiLoading}
            className="bg-purple-100 hover:bg-purple-600 hover:text-white dark:bg-purple-950/40 dark:hover:bg-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-900/40 text-purple-700 p-2.5 rounded-lg transition-colors flex items-center justify-center cursor-pointer shadow-sm"
          >
            {aiLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>

    </aside>
  );
}
