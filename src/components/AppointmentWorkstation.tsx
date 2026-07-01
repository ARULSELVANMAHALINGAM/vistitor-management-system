import React, { useState } from "react";
import { 
  Calendar, Clock, User, PlusCircle, Search, Filter, 
  Check, X, Trash2, Shield, CalendarCheck2
} from "lucide-react";
import { Appointment, Employee, Department, Visitor } from "../types";

interface AppointmentWorkstationProps {
  appointments: Appointment[];
  employees: Employee[];
  departments: Department[];
  visitors: Visitor[];
  onBookAppointment: (formData: any) => void;
  onUpdateStatus: (id: string, status: string) => void;
  showNotification: (text: string, type: "success" | "error" | "info") => void;
}

export default function AppointmentWorkstation({
  appointments,
  employees,
  departments,
  visitors,
  onBookAppointment,
  onUpdateStatus,
  showNotification
}: AppointmentWorkstationProps) {
  // Booking Form State
  const [visitorName, setVisitorName] = useState("");
  const [visitorId, setVisitorId] = useState(""); // Can select existing visitor
  const [company, setCompany] = useState("");
  const [dept, setDept] = useState("");
  const [hostId, setHostId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [purpose, setPurpose] = useState("");

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleSelectExistingVisitor = (id: string) => {
    if (!id) {
      setVisitorId("");
      setVisitorName("");
      setCompany("");
      return;
    }
    const selected = visitors.find(v => v.id === id);
    if (selected) {
      setVisitorId(selected.id);
      setVisitorName(selected.name);
      setCompany(selected.company);
    }
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !dept || !hostId || !dateTime) {
      showNotification("Sponsorship booking require all primary fields.", "error");
      return;
    }

    const selectedHost = employees.find(e => e.id === hostId);
    if (!selectedHost) return;

    onBookAppointment({
      visitorId: visitorId || undefined,
      visitorName,
      company,
      department: dept,
      employeeId: hostId,
      employeeName: selectedHost.name,
      dateTime,
      purpose
    });

    // Reset Form
    setVisitorName("");
    setVisitorId("");
    setCompany("");
    setDept("");
    setHostId("");
    setDateTime("");
    setPurpose("");
  };

  const filteredAppts = appointments.filter(appt => {
    const matchesSearch = appt.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          appt.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          appt.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || appt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div id="appointment-workstation" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Appointment Booking Panel */}
      <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 h-fit">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <CalendarCheck2 className="w-4 h-4 text-blue-600" />
            Vetting Slot Scheduler
          </h3>
          <p className="text-xs text-slate-500">Book secure future gate arrivals and sponsor channels</p>
        </div>

        <form onSubmit={handleSubmitBooking} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1 font-semibold">Existing Profile (Optional)</label>
            <select
              value={visitorId}
              onChange={(e) => handleSelectExistingVisitor(e.target.value)}
              className="bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white w-full text-xs"
            >
              <option value="">-- Fresh Pre-Registration --</option>
              {visitors.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.company})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1 font-semibold">Visitor Name</label>
              <input
                type="text"
                required
                disabled={!!visitorId}
                placeholder="Helen Vance"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className="bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white w-full disabled:bg-slate-100 disabled:text-slate-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1 font-semibold">Organization</label>
              <input
                type="text"
                disabled={!!visitorId}
                placeholder="Apex Research"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white w-full disabled:bg-slate-100 disabled:text-slate-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1 font-semibold">Target Sector</label>
              <select
                required
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white w-full text-xs"
              >
                <option value="">Select...</option>
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1 font-semibold">Host Employee Sponsor</label>
              <select
                required
                value={hostId}
                onChange={(e) => setHostId(e.target.value)}
                className="bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white w-full text-xs"
              >
                <option value="">Select...</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.availability ? "Ready" : "Busy"})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1 font-semibold">Date & Clock</label>
              <input
                type="text"
                required
                placeholder="2026-06-30 14:00"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white w-full font-mono transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1 font-semibold">Visit Agenda</label>
              <input
                type="text"
                placeholder="Infrastructure Inspection"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white w-full transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" /> Schedule Visit Slot
          </button>
        </form>
      </div>

      {/* Appointment Listings Directory */}
      <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        
        {/* Search & Filter Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Visit Registration Log</h3>
            <p className="text-xs text-slate-500">Scheduled slots awaiting security checkpoint approvals</p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search schedule..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-blue-600 w-36 sm:w-48 font-medium text-slate-700"
              />
            </div>

            {/* Filter Category */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-600 font-mono focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Slots</option>
              <option value="pending">PENDING</option>
              <option value="approved">APPROVED</option>
              <option value="checked-in">CHECKED-IN</option>
              <option value="checked-out">COMPLETED</option>
              <option value="rejected">REJECTED</option>
            </select>
          </div>
        </div>

        {filteredAppts.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs">No matching visit slots found in datastore.</p>
          </div>
        ) : (
          <div className="space-y-2.5 overflow-y-auto max-h-[420px] pr-1">
            {filteredAppts.map((appt) => (
              <div
                key={appt.id}
                className="border border-slate-200 hover:border-slate-300 p-3.5 rounded-xl hover:shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-800">{appt.visitorName}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded font-mono">
                        {appt.company}
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                        appt.status === "approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        appt.status === "pending" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        appt.status === "checked-in" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                        "bg-slate-50 text-slate-500 border border-slate-200"
                      }`}>
                        {appt.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-4 gap-y-1 font-mono">
                      <span>Ref: <strong className="text-slate-800">{appt.id}</strong></span>
                      <span>Target: <strong className="text-slate-800">{appt.department}</strong></span>
                      <span>Host: <strong className="text-slate-800">{appt.employeeName}</strong></span>
                      <span>Schedule: <strong className="text-slate-800">{appt.dateTime}</strong></span>
                    </div>

                    {appt.purpose && (
                      <p className="text-[11px] text-slate-500 italic">
                        &ldquo;{appt.purpose}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Context controls */}
                  <div className="flex gap-1.5 self-start sm:self-center">
                    {appt.status === "pending" && (
                      <>
                        <button
                          onClick={() => onUpdateStatus(appt.id, "approved")}
                          className="p-1 hover:text-emerald-600 hover:bg-emerald-50 rounded text-xs font-semibold cursor-pointer"
                          title="Approve Slot"
                        >
                          <Check className="w-4 h-4 text-emerald-600" />
                        </button>
                        <button
                          onClick={() => onUpdateStatus(appt.id, "rejected")}
                          className="p-1 hover:text-red-600 hover:bg-red-50 rounded text-xs font-semibold cursor-pointer"
                          title="Reject Slot"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </>
                    )}

                    {appt.status === "approved" && (
                      <button
                        onClick={() => onUpdateStatus(appt.id, "checked-in")}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[9px] font-bold tracking-wider rounded uppercase hover:bg-blue-100 transition-all cursor-pointer"
                      >
                        Check-In Visitor
                      </button>
                    )}

                    {appt.status === "checked-in" && (
                      <button
                        onClick={() => onUpdateStatus(appt.id, "checked-out")}
                        className="px-2.5 py-1 bg-slate-800 text-white font-mono text-[9px] font-bold tracking-wider rounded uppercase hover:bg-slate-900 transition-all cursor-pointer"
                      >
                        Check-Out Completed
                      </button>
                    )}

                    {appt.status === "checked-out" && (
                      <span className="text-[10px] text-slate-400 font-mono italic">
                        Archived Meeting
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
