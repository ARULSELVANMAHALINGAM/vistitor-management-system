import React, { useState, useEffect } from "react";
import { 
  Users, Layers, Settings, FileSpreadsheet, 
  Trash2, Plus, Edit3, ShieldAlert, CheckCircle2, RefreshCw, Database, FileText
} from "lucide-react";
import { Employee, Department, AuditLog, SystemSettings } from "../types";

interface AdminWorkstationProps {
  employees: Employee[];
  departments: Department[];
  auditLogs: AuditLog[];
  settings: SystemSettings | null;
  onRefreshData: () => void;
  showNotification: (text: string, type: "success" | "error" | "info") => void;
}

export default function AdminWorkstation({
  employees,
  departments,
  auditLogs,
  settings,
  onRefreshData,
  showNotification
}: AdminWorkstationProps) {
  // Tabs: "employees" | "departments" | "logs" | "settings"
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<"employees" | "departments" | "logs" | "settings">("employees");

  // Employee Form State
  const [empName, setEmpName] = useState("");
  const [empDept, setEmpDept] = useState("");
  const [empEmail, setEmpEmail] = useState("");
  const [empContact, setEmpContact] = useState("");
  const [editingEmpId, setEditingEmpId] = useState<string | null>(null);

  // Department Form State
  const [deptName, setDeptName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);

  // System Settings local state
  const [companyName, setCompanyName] = useState(settings?.companyName || "Aegis Corporation");
  const [securityLevel, setSecurityLevel] = useState(settings?.securityLevel || "high");
  const [autoCheckOutHours, setAutoCheckOutHours] = useState(settings?.autoCheckOutHours || 8);
  const [themePreference, setThemePreference] = useState(settings?.themePreference || "light");
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Audit Log filter state
  const [logFilterCategory, setLogFilterCategory] = useState<string>("all");

  useEffect(() => {
    if (settings) {
      setCompanyName(settings.companyName);
      setSecurityLevel(settings.securityLevel);
      setAutoCheckOutHours(settings.autoCheckOutHours);
      setThemePreference(settings.themePreference);
    }
  }, [settings]);

  // Employee actions
  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empDept || !empEmail || !empContact) {
      showNotification("Please provide all required employee fields.", "error");
      return;
    }

    try {
      const url = editingEmpId ? `/api/employees/${editingEmpId}` : "/api/employees";
      const method = editingEmpId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: empName,
          department: empDept,
          email: empEmail,
          contact: empContact,
          operator: "Administrator"
        })
      });

      if (res.ok) {
        showNotification(
          editingEmpId 
            ? `Employee ${empName} details updated successfully.` 
            : `Added employee ${empName} to database registry.`, 
          "success"
        );
        setEmpName("");
        setEmpDept("");
        setEmpEmail("");
        setEmpContact("");
        setEditingEmpId(null);
        onRefreshData();
      }
    } catch (err) {
      showNotification("Could not complete employee transaction.", "error");
    }
  };

  const handleEditEmployee = (emp: Employee) => {
    setEditingEmpId(emp.id);
    setEmpName(emp.name);
    setEmpDept(emp.department);
    setEmpEmail(emp.email);
    setEmpContact(emp.contact);
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!window.confirm("Purge employee credential index? This will alter active sponsorship listings.")) {
      return;
    }
    try {
      const res = await fetch(`/api/employees/${id}?operator=Administrator`, { method: "DELETE" });
      if (res.ok) {
        showNotification("Employee profile successfully expunged from register.", "info");
        onRefreshData();
      }
    } catch (err) {
      showNotification("Purge transaction rejected.", "error");
    }
  };

  // Department actions
  const handleSaveDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName || !deptCode) {
      showNotification("Department name and locator code required.", "error");
      return;
    }

    try {
      const url = editingDeptId ? `/api/departments/${editingDeptId}` : "/api/departments";
      const method = editingDeptId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: deptName,
          code: deptCode,
          operator: "Administrator"
        })
      });

      if (res.ok) {
        showNotification(
          editingDeptId 
            ? `Department ${deptName} updated successfully.` 
            : `Department ${deptName} successfully cataloged.`, 
          "success"
        );
        setDeptName("");
        setDeptCode("");
        setEditingDeptId(null);
        onRefreshData();
      }
    } catch (err) {
      showNotification("Department catalogue failure.", "error");
    }
  };

  const handleEditDepartment = (dept: Department) => {
    setEditingDeptId(dept.id);
    setDeptName(dept.name);
    setDeptCode(dept.code);
  };

  const handleDeleteDepartment = async (id: string) => {
    if (!window.confirm("Delete selected department locator node?")) {
      return;
    }
    try {
      const res = await fetch(`/api/departments/${id}?operator=Administrator`, { method: "DELETE" });
      if (res.ok) {
        showNotification("Department locator index purged.", "info");
        onRefreshData();
      }
    } catch (err) {
      showNotification("Purge query failed.", "error");
    }
  };

  // System Settings update
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          securityLevel,
          autoCheckOutHours,
          themePreference,
          operator: "Administrator"
        })
      });
      if (res.ok) {
        showNotification("Mainframe system parameters adjusted safely.", "success");
        onRefreshData();
      }
    } catch (err) {
      showNotification("Could not save core config parameters.", "error");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Backup Datastore
  const handleBackupDatabase = async () => {
    setIsBackingUp(true);
    try {
      const res = await fetch("/api/settings/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operator: "Administrator" })
      });
      if (res.ok) {
        const data = await res.json();
        showNotification(data.message || "Database snapshot created successfully.", "success");
        onRefreshData();
      }
    } catch (err) {
      showNotification("Backup snapshot writing failed.", "error");
    } finally {
      setIsBackingUp(false);
    }
  };

  // Restore Datastore
  const handleRestoreDatabase = async () => {
    if (!window.confirm("WARNING: Restoring will overwrite all active sessions with the latest backup snapshot. Proceed?")) {
      return;
    }
    setIsRestoring(true);
    try {
      const res = await fetch("/api/settings/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operator: "Administrator" })
      });
      if (res.ok) {
        const data = await res.json();
        showNotification(data.message || "Database restored successfully.", "success");
        onRefreshData();
      }
    } catch (err) {
      showNotification("Restore pipeline failure.", "error");
    } finally {
      setIsRestoring(false);
    }
  };

  // Filter logs
  const filteredLogs = auditLogs
    .filter(log => logFilterCategory === "all" || log.category === logFilterCategory)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return (
    <div id="admin-workstation" className="space-y-6">
      
      {/* Sub-Tabs Nav */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1">
        <button
          onClick={() => setActiveAdminSubTab("employees")}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
            activeAdminSubTab === "employees"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Employee Directory
        </button>
        <button
          onClick={() => setActiveAdminSubTab("departments")}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
            activeAdminSubTab === "departments"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Department Locator Nodes
        </button>
        <button
          onClick={() => setActiveAdminSubTab("logs")}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
            activeAdminSubTab === "logs"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          System Audit Logs
        </button>
        <button
          onClick={() => setActiveAdminSubTab("settings")}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
            activeAdminSubTab === "settings"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          Datastore & Settings
        </button>
      </div>

      {/* SUB-TAB 1: EMPLOYEE DIRECTORY */}
      {activeAdminSubTab === "employees" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Employee Directory List */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Sponsorship Roster</h4>
                <p className="text-xs text-slate-500">Authorized personnel indices available to host incoming visitors</p>
              </div>
              <span className="text-xs font-mono bg-slate-50 text-slate-500 border border-slate-200 px-2 py-1 rounded">
                Total: {employees.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase font-semibold">
                    <th className="p-3">ID</th>
                    <th className="p-3">Employee Name</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3 text-center">Duty Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono font-bold text-slate-500">{emp.id}</td>
                      <td className="p-3 font-semibold text-slate-800">{emp.name}</td>
                      <td className="p-3 text-slate-600">{emp.department}</td>
                      <td className="p-3 text-slate-500 font-mono">{emp.email}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider ${
                          emp.availability
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                          {emp.availability ? "AVAILABLE" : "BUSY"}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleEditEmployee(emp)}
                            className="p-1 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(emp.id)}
                            className="p-1 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Employee Register Form */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 h-fit">
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                {editingEmpId ? "Update Employee Details" : "Enroll New Employee"}
              </h4>
              <p className="text-xs text-slate-500">
                {editingEmpId ? "Modify specific host sponsorship parameters" : "Index a new sponsor credential onto system registry"}
              </p>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1 font-semibold">Full Employee Name</label>
                <input
                  type="text"
                  required
                  placeholder="Aiden Vance"
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  className="bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white w-full transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1 font-semibold">Department Node</label>
                <select
                  required
                  value={empDept}
                  onChange={(e) => setEmpDept(e.target.value)}
                  className="bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white w-full transition-all"
                >
                  <option value="">Select Department...</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1 font-semibold">Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="a.vance@aegis.com"
                  value={empEmail}
                  onChange={(e) => setEmpEmail(e.target.value)}
                  className="bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white w-full font-mono transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1 font-semibold">Security Contact Comm</label>
                <input
                  type="text"
                  required
                  placeholder="+1 (555) 019-2193"
                  value={empContact}
                  onChange={(e) => setEmpContact(e.target.value)}
                  className="bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white w-full font-mono transition-all"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer text-center"
                >
                  {editingEmpId ? "Update Employee" : "Enroll Identity"}
                </button>
                {editingEmpId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEmpId(null);
                      setEmpName("");
                      setEmpDept("");
                      setEmpEmail("");
                      setEmpContact("");
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 px-3 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DEPARTMENTS NODE GRID */}
      {activeAdminSubTab === "departments" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Department List */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Security Department Quadrants</h4>
              <p className="text-xs text-slate-500">Active perimeter quadrants with mapped access nodes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departments.map(dept => (
                <div key={dept.id} className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex justify-between items-center group">
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono tracking-widest font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 w-fit">
                      {dept.code}
                    </div>
                    <div className="font-bold text-slate-800 text-xs">{dept.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Locator: {dept.id}</div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditDepartment(dept)}
                      className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDepartment(dept.id)}
                      className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Form */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 h-fit">
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                {editingDeptId ? "Update Sector Node" : "Catalog Sector Node"}
              </h4>
              <p className="text-xs text-slate-500">Map a physical corporate quadrant into system routing matrix</p>
            </div>

            <form onSubmit={handleSaveDepartment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1 font-semibold">Quadrant Name</label>
                <input
                  type="text"
                  required
                  placeholder="Aegis Research & Diagnostics"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white w-full transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1 font-semibold">Sector Code Prefix</label>
                <input
                  type="text"
                  required
                  placeholder="AEGIS-RD"
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value)}
                  className="bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white w-full font-mono transition-all"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer text-center"
                >
                  {editingDeptId ? "Update Sector" : "Map Sector"}
                </button>
                {editingDeptId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDeptId(null);
                      setDeptName("");
                      setDeptCode("");
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 px-3 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: AUDIT LOG TRAIL */}
      {activeAdminSubTab === "logs" && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-slate-700" />
                Immutable System Security Audit Trail
              </h4>
              <p className="text-xs text-slate-500">Continuous ledger of credentials, database snapshots, and gate clearance actions</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono">Category:</span>
              <select
                value={logFilterCategory}
                onChange={(e) => setLogFilterCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 p-1.5 rounded-lg text-xs font-mono text-slate-600 focus:outline-none focus:border-blue-600"
              >
                <option value="all">All Logs [Mainframe]</option>
                <option value="auth">AUTHENTICATION</option>
                <option value="visitor">VISITOR</option>
                <option value="appointment">APPOINTMENT</option>
                <option value="employee">EMPLOYEE</option>
                <option value="department">DEPARTMENT</option>
                <option value="system">SYSTEM</option>
                <option value="database">DATABASE_SYNC</option>
              </select>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[380px] border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase font-semibold">
                  <th className="p-3">ID Reference</th>
                  <th className="p-3">Timestamp (UTC)</th>
                  <th className="p-3">User Node</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Operation Category</th>
                  <th className="p-3">Core Action Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/40">
                    <td className="p-3 text-slate-400 text-[10px]">{log.id}</td>
                    <td className="p-3 text-slate-500">{log.timestamp.replace('T', ' ').substring(0, 19)}</td>
                    <td className="p-3 text-slate-700 font-bold">{log.user}</td>
                    <td className="p-3">
                      <span className={`text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded ${
                        log.role === "admin"
                          ? "bg-red-50 text-red-700 border border-red-100"
                          : log.role === "receptionist"
                          ? "bg-blue-50 text-blue-700 border border-blue-100"
                          : log.role === "employee"
                          ? "bg-purple-50 text-purple-700 border border-purple-100"
                          : "bg-slate-50 text-slate-500 border border-slate-200"
                      }`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        log.category === "auth" ? "bg-amber-100 text-amber-800" :
                        log.category === "database" ? "bg-emerald-100 text-emerald-800" :
                        log.category === "system" ? "bg-slate-200 text-slate-800" : "bg-slate-100 text-slate-600"
                      }`}>
                        {log.category.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 max-w-[280px] truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      No matching audit parameters locked.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SETTINGS & DATABASE snapSHOPS */}
      {activeAdminSubTab === "settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Company Details Form */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-blue-600" />
                Global System Parameters
              </h4>
              <p className="text-xs text-slate-500">Configure global business operations and physical rulesets</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1 font-semibold">Registered Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white w-full transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1 font-semibold">Security Clearance Enforcement</label>
                  <select
                    value={securityLevel}
                    onChange={(e) => setSecurityLevel(e.target.value as any)}
                    className="bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white w-full transition-all"
                  >
                    <option value="relaxed">Relaxed Vetting (Fast-Pass)</option>
                    <option value="standard">Standard Perimeter Escort</option>
                    <option value="high">High Security (Aegis AI Active)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1 font-semibold">Auto Check-Out (Hours)</label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={autoCheckOutHours}
                    onChange={(e) => setAutoCheckOutHours(Number(e.target.value))}
                    className="bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white w-full transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1 font-semibold">Visual Interface Preference</label>
                <select
                  value={themePreference}
                  onChange={(e) => setThemePreference(e.target.value as any)}
                  className="bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white w-full transition-all"
                >
                  <option value="light">Professional Polish Light Mode</option>
                  <option value="dark">Professional Polish Dark Mode</option>
                  <option value="hologram">Hologram Command Terminal (Sci-Fi)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSavingSettings}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                {isSavingSettings ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Synchronizing Mainframe Config...
                  </>
                ) : (
                  "Update Global Parameters"
                )}
              </button>
            </form>
          </div>

          {/* Database Backup & Snapshot management */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-600" />
                Datastore Snapshot Recovery (File DB)
              </h4>
              <p className="text-xs text-slate-500">Commit system state to JSON files or restore previously compiled snapshots</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5 text-xs">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-500">Target Database:</span>
                <span className="font-bold text-slate-700">visitor_db.json</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-500">Snapshot Directory:</span>
                <span className="font-bold text-slate-700">./backups/</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-500">Last Backup Snapshot:</span>
                <span className="font-bold text-blue-600">{settings?.lastBackup || "None Recorded"}</span>
              </div>

              <hr className="border-slate-200" />

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleBackupDatabase}
                  disabled={isBackingUp}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  {isBackingUp ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Compiling Backup Snapshot...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4" /> Create Local Datastore Backup
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleRestoreDatabase}
                  disabled={isRestoring}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {isRestoring ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Unpacking Database Archive...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" /> Restore Latest DB Snapshot
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="border border-amber-100 bg-amber-50/50 p-3.5 rounded-xl text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1 text-amber-800">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                Disaster Recovery Mode
              </div>
              <p className="text-[11px] leading-relaxed text-amber-700/80">
                Restoration operations immediately replace active records with the target snapshot. Secure gate active clearances will sync automatically.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
