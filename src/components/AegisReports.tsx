import React, { useState } from "react";
import { 
  FileSpreadsheet, Calendar, Printer, Download, Search, 
  MapPin, ShieldCheck, Clock, Check, Award
} from "lucide-react";
import { Visitor, Employee } from "../types";
import { QRCodeSVG } from "qrcode.react";

interface AegisReportsProps {
  visitors: Visitor[];
}

export default function AegisReports({ visitors }: AegisReportsProps) {
  const [selectedPassVisitor, setSelectedPassVisitor] = useState<Visitor | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = visitors.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        v.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        v.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Export to CSV helper
  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Contact", "Organization", "Purpose", "Department", "Host", "Status", "Check-In", "Check-Out", "Risk Score"];
    const rows = filtered.map(v => [
      v.id,
      v.name,
      v.contact,
      v.company,
      v.purpose,
      v.department,
      v.hostName,
      v.status,
      v.checkInTime || "",
      v.checkOutTime || "",
      v.riskScore
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aegis_visitor_report_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintMockPass = () => {
    window.print();
  };

  return (
    <div id="aegis-reports" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Printable Badge Designer & Pass View (Left 4 cols) */}
      <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 h-fit">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Printer className="w-4 h-4 text-blue-600" />
            Badge Pass Generator
          </h3>
          <p className="text-xs text-slate-500">Generate and print professional access credentials</p>
        </div>

        {selectedPassVisitor ? (
          <div className="space-y-4">
            {/* The Badge Container */}
            <div id="printable-badge" className="border border-slate-300 rounded-xl bg-slate-50 p-4 relative overflow-hidden flex flex-col items-center text-center space-y-3.5 shadow">
              {/* Colored Header Strip */}
              <div className={`absolute top-0 inset-x-0 h-3 ${
                selectedPassVisitor.riskScore > 50 ? "bg-red-600" :
                selectedPassVisitor.riskScore > 20 ? "bg-amber-500" : "bg-blue-600"
              }`} />

              <div className="pt-2">
                <span className="text-[10px] tracking-widest font-mono uppercase text-slate-500 font-bold">
                  AEGIS VISITOR PASS
                </span>
                <h4 className="text-sm font-black text-slate-800 tracking-tight mt-0.5 uppercase">
                  {selectedPassVisitor.name}
                </h4>
                <p className="text-[10px] font-mono text-slate-400 font-medium">ID Ref: {selectedPassVisitor.id}</p>
              </div>

              {/* QR Code section */}
              <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                <QRCodeSVG value={selectedPassVisitor.id} size={100} />
              </div>

              <div className="text-[11px] space-y-1.5 w-full text-slate-600 font-mono text-left px-3">
                <div className="flex justify-between border-b border-slate-200/60 pb-1">
                  <span>Organization:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[120px]">{selectedPassVisitor.company}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1">
                  <span>Sector Gate:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[120px]">{selectedPassVisitor.department}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1">
                  <span>Escorted Host:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[120px]">{selectedPassVisitor.hostName}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 pt-1.5 font-bold">
                  <span>IN: {selectedPassVisitor.checkInTime || "AWAITING"}</span>
                  <span>OUT: {selectedPassVisitor.checkOutTime || "PENDING"}</span>
                </div>
              </div>

              {/* Warning label */}
              <div className="text-[9px] font-mono text-center text-slate-400 font-medium pt-1 uppercase tracking-wide">
                AUTHORIZATION SIGNATURE REQUIRED AT ALL GATE THRESHOLDS
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrintMockPass}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Physical Pass
              </button>
              <button
                onClick={() => setSelectedPassVisitor(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2 px-3 rounded-lg text-xs transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs space-y-2">
            <Printer className="w-8 h-8 text-slate-300 mx-auto" />
            <p>Select a visitor from the report roster to design & preview their printable security pass.</p>
          </div>
        )}
      </div>

      {/* Roster & Advanced Filters (Right 8 cols) */}
      <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Telemetry Export Center</h3>
            <p className="text-xs text-slate-500">Query and compile complete historical visitor parameters</p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter results..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-blue-600 w-36 sm:w-48 font-medium text-slate-700"
              />
            </div>

            {/* Filter Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-600 font-mono focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Visitors</option>
              <option value="checked-in">ACTIVE ONLY</option>
              <option value="checked-out">ARCHIVED OUT</option>
              <option value="registered">PRE-REGISTERED</option>
            </select>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        {/* Roster Table */}
        <div className="overflow-x-auto max-h-[380px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase font-semibold">
                <th className="p-3">Reference ID</th>
                <th className="p-3">Full Visitor Name</th>
                <th className="p-3">Organization</th>
                <th className="p-3">Authorized Quadrant</th>
                <th className="p-3">Duty Status</th>
                <th className="p-3 text-right">Badge Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(v => (
                <tr key={v.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-bold text-slate-500">{v.id}</td>
                  <td className="p-3 font-semibold text-slate-800">{v.name}</td>
                  <td className="p-3 text-slate-600">{v.company}</td>
                  <td className="p-3 text-slate-600 font-medium">{v.department}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider ${
                      v.status === "checked-in" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                      v.status === "checked-out" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {v.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedPassVisitor(v)}
                      className="px-2.5 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-mono text-[10px] font-bold rounded transition-colors cursor-pointer"
                    >
                      MINT PASS
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No records locked matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
