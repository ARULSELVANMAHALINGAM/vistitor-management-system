import React, { useState, useEffect } from "react";
import { Check, X, Shield, Calendar, UserCheck, AlertTriangle, Radio } from "lucide-react";
import { Appointment, Employee } from "../types";

interface EmployeeWorkstationProps {
  appointments: Appointment[];
  employees: Employee[];
  onUpdateAppointmentStatus: (id: string, status: string) => void;
  showNotification: (text: string, type: "success" | "error" | "info") => void;
  onRefreshData?: () => void;
}

export default function EmployeeWorkstation({
  appointments,
  employees,
  onUpdateAppointmentStatus,
  showNotification,
  onRefreshData
}: EmployeeWorkstationProps) {
  // Selected mock employee to act as
  const [activeEmployeeId, setActiveEmployeeId] = useState<string>("E-101");
  const [employeeList, setEmployeeList] = useState<Employee[]>(employees);

  useEffect(() => {
    setEmployeeList(employees);
    if (employees.length > 0 && !employees.find(e => e.id === activeEmployeeId)) {
      setActiveEmployeeId(employees[0].id);
    }
  }, [employees]);

  const activeEmployee = employeeList.find(e => e.id === activeEmployeeId) || employeeList[0];

  const toggleAvailability = async () => {
    if (!activeEmployee) return;
    const newAvail = !activeEmployee.availability;

    // Call API to update employee availability
    try {
      const res = await fetch(`/api/employees/${activeEmployee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          availability: newAvail,
          operator: activeEmployee.name
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setEmployeeList(prev => prev.map(e => e.id === updated.id ? updated : e));
        showNotification(`${activeEmployee.name} is now ${newAvail ? "AVAILABLE" : "UNAVAILABLE"} for visits.`, "info");
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      // Fallback local update
      setEmployeeList(prev => prev.map(e => e.id === activeEmployee.id ? { ...e, availability: newAvail } : e));
    }
  };

  // Filter appointments for the selected active employee host
  const filteredAppts = appointments.filter(
    appt => appt.employeeId.toLowerCase() === (activeEmployee?.id || "").toLowerCase()
  );

  return (
    <div id="employee-workstation" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Host Status Panel */}
      <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 h-fit">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-600 animate-pulse" />
            Host Console Profile
          </h3>
          <p className="text-xs text-slate-500">Manage hosting availability & security credentials</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
          <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Select Host Identity</label>
          <select
            value={activeEmployeeId || (activeEmployee?.id || "")}
            onChange={(e) => setActiveEmployeeId(e.target.value)}
            className="w-full bg-white text-slate-800 p-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-purple-600 cursor-pointer"
          >
            {employeeList.length === 0 ? (
              <option value="" disabled className="bg-white text-slate-800">
                No hosts available
              </option>
            ) : (
              employeeList.map(emp => (
                <option key={emp.id} value={emp.id} className="bg-white text-slate-800">
                  {emp.name} ({emp.department})
                </option>
              ))
            )}
          </select>

          {activeEmployee && (
            <div className="pt-2 text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Access Key:</span>
                <span className="font-mono font-semibold text-slate-700">{activeEmployee.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Direct Contact:</span>
                <span className="text-slate-700">{activeEmployee.contact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Security Ring:</span>
                <span className="text-slate-700 font-medium">B-Block Internal</span>
              </div>
              <hr className="border-slate-200 my-2" />
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Receiving Visitors:</span>
                <button
                  onClick={toggleAvailability}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                    activeEmployee.availability
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {activeEmployee.availability ? "● AVAILABLE" : "■ DND / BUSY"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="border border-purple-100 bg-purple-50/50 p-3.5 rounded-xl text-xs text-purple-900 space-y-1.5">
          <div className="font-bold flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-purple-700" />
            Sponsorship Policy
          </div>
          <p className="text-[11px] leading-relaxed text-purple-700/80">
            Hosts are legally responsible for sponsored visitors. Visitors must remain escorted within restricted B-Block zones.
          </p>
        </div>
      </div>

      {/* Appointment Approvals Panel */}
      <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              My Appointment Dashboard ({filteredAppts.length})
            </h3>
            <p className="text-xs text-slate-500">Vetting requests directed to your sponsorship signature</p>
          </div>
        </div>

        {filteredAppts.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-2">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-xs font-bold text-slate-600">No Vetting Slots Scheduled</h4>
            <p className="text-[11px] text-slate-400">There are no pending or registered appointments under your sponsorship ID.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAppts.map((appt) => (
              <div
                key={appt.id}
                className={`p-4 rounded-xl border transition-all ${
                  appt.status === "pending"
                    ? "border-amber-200 bg-amber-50/20"
                    : appt.status === "approved"
                    ? "border-emerald-200 bg-emerald-50/10"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-xs">{appt.visitorName}</span>
                      <span className="text-[9px] font-mono text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                        {appt.company}
                      </span>
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                        appt.status === "approved"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : appt.status === "pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : appt.status === "rejected"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : appt.status === "checked-in"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}>
                        {appt.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-4 gap-y-1 font-mono">
                      <span>Time: <strong className="text-slate-800">{appt.dateTime}</strong></span>
                      <span>ID Reference: <strong className="text-slate-800">{appt.visitorId}</strong></span>
                      <span>Sponsor Badge: <strong className="text-slate-800">{appt.id}</strong></span>
                    </div>
                    <p className="text-[11px] text-slate-500 italic mt-1">
                      &ldquo;{appt.purpose}&rdquo;
                    </p>
                  </div>

                  {/* Actions depending on status */}
                  <div className="flex flex-wrap gap-2 sm:self-center">
                    {appt.status === "pending" && (
                      <>
                        <button
                          onClick={() => onUpdateAppointmentStatus(appt.id, "approved")}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[10px] font-bold tracking-wider rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" /> APPROVE
                        </button>
                        <button
                          onClick={() => onUpdateAppointmentStatus(appt.id, "rejected")}
                          className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-mono text-[10px] font-bold tracking-wider rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3 h-3" /> REJECT
                        </button>
                      </>
                    )}

                    {appt.status === "approved" && (
                      <button
                        onClick={() => onUpdateAppointmentStatus(appt.id, "checked-in")}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-mono text-[10px] font-bold tracking-wider rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <UserCheck className="w-3 h-3" /> CHECK-IN ARRIVAL
                      </button>
                    )}

                    {appt.status === "checked-in" && (
                      <button
                        onClick={() => onUpdateAppointmentStatus(appt.id, "checked-out")}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-mono text-[10px] font-bold tracking-wider rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3 h-3" /> MEETING COMPLETED
                      </button>
                    )}

                    {(appt.status === "rejected" || appt.status === "cancelled" || appt.status === "checked-out") && (
                      <span className="text-[10px] font-mono text-slate-400 font-bold italic">
                        Archived File
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
