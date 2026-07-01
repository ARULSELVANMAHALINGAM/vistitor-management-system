import React, { useState, useEffect, useRef } from "react";
import { 
  Layers, FileCode, Users, Layers3, Calendar, ShieldAlert, 
  Settings, RefreshCw, BarChart2, FileSpreadsheet, Bell, Trash2, Shield,
  Sun, Moon
} from "lucide-react";
import { Visitor, JavaStatus, Employee, Department, Appointment, AuditLog, SystemNotification, SystemSettings, UserRole } from "./types";
import AegisHeader from "./components/AegisHeader";
import AegisStats from "./components/AegisStats";
import GateDirectoryMatrix from "./components/GateDirectoryMatrix";
import PreRegisterTerminal from "./components/PreRegisterTerminal";
import JavaDeckWorkstation from "./components/JavaDeckWorkstation";
import HolographicBadgeDetail from "./components/HolographicBadgeDetail";
import NDASignatureModal from "./components/NDASignatureModal";
import LoginPage from "./components/LoginPage";

// Advanced Modular Import Extensions
import EmployeeWorkstation from "./components/EmployeeWorkstation";
import AdminWorkstation from "./components/AdminWorkstation";
import AppointmentWorkstation from "./components/AppointmentWorkstation";
import AegisAnalytics from "./components/AegisAnalytics";
import AegisReports from "./components/AegisReports";

export default function App() {
  // Authentication & RBAC Switch
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem("aegis_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem("aegis_user");
    return saved ? (JSON.parse(saved).role as UserRole) : "receptionist";
  });

  // Global Theme State: 'light' | 'dark'
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("aegis_theme");
    return (saved === "dark" || saved === "light") ? saved : "light";
  });

  // Synchronize theme with document classList
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("aegis_theme", theme);
  }, [theme]);

  // Visitor NDA signing modal states
  const [isNdaModalOpen, setIsNdaModalOpen] = useState(false);
  const [visitorToSign, setVisitorToSign] = useState<Visitor | null>(null);

  // Database State Collections
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  // Search & Selected Profiles states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);

  // Pre-Register Form state
  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newPurpose, setNewPurpose] = useState("");
  const [newDept, setNewDept] = useState("");
  const [newHost, setNewHost] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Java sub-terminal & source compiler states
  const [javaStatus, setJavaStatus] = useState<JavaStatus | null>(null);
  const [javaCode, setJavaCode] = useState("");
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [codeDraft, setCodeDraft] = useState("");
  const [compilationLog, setCompilationLog] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileSuccess, setCompileSuccess] = useState<boolean | null>(null);
  const [isTerminalActive, setIsTerminalActive] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState("");
  const [terminalInput, setTerminalInput] = useState("");

  // AI Security Screener states
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Active Workstation Tab
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Notification Toast Banner
  const [notificationBanner, setNotificationBanner] = useState<{ type: "success" | "error" | "info"; text: string } | null>({
    type: "info",
    text: "Aegis System online. Real-time file sync active."
  });

  // UI States
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  // Terminal Auto-Scroll Ref
  const terminalBottomRef = useRef<HTMLDivElement | null>(null);

  // Sync with global system settings theme preference on mount or fetch
  useEffect(() => {
    if (settings?.themePreference) {
      const systemTheme = (settings.themePreference === "dark" || settings.themePreference === "hologram") ? "dark" : "light";
      setTheme(systemTheme);
    }
  }, [settings?.themePreference]);

  // Initial Seed
  useEffect(() => {
    refreshAllData();
    fetchJavaStatus();
    fetchJavaCode();
  }, []);

  // Poll terminal output if running
  useEffect(() => {
    let interval: any;
    if (isTerminalActive) {
      interval = setInterval(() => {
        pollTerminalOutput();
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isTerminalActive]);

  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalOutput]);

  const showToast = (text: string, type: "success" | "error" | "info" = "info") => {
    setNotificationBanner({ text, type });
    setTimeout(() => {
      setNotificationBanner(null);
    }, 5000);
  };

  const refreshAllData = () => {
    fetchVisitors();
    fetchEmployees();
    fetchDepartments();
    fetchAppointments();
    fetchAuditLogs();
    fetchSettings();
    fetchNotifications();
  };

  // REST API Data Fetchers
  const fetchVisitors = async () => {
    try {
      const res = await fetch("/api/visitors");
      if (res.ok) {
        const data = await res.json();
        setVisitors(data);
        if (data.length > 0 && !selectedVisitor) {
          setSelectedVisitor(data[0]);
        }
      }
    } catch (e) {
      console.error("Error fetching visitors:", e);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      if (res.ok) setEmployees(await res.json());
    } catch (e) {
      console.error("Error fetching employees:", e);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/departments");
      if (res.ok) setDepartments(await res.json());
    } catch (e) {
      console.error("Error fetching departments:", e);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      if (res.ok) setAppointments(await res.json());
    } catch (e) {
      console.error("Error fetching appointments:", e);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch("/api/audit-logs");
      if (res.ok) setAuditLogs(await res.json());
    } catch (e) {
      console.error("Error fetching audit logs:", e);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) setSettings(await res.json());
    } catch (e) {
      console.error("Error fetching settings:", e);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) setNotifications(await res.json());
    } catch (e) {
      console.error("Error fetching notifications:", e);
    }
  };

  const fetchJavaStatus = async () => {
    try {
      const res = await fetch("/api/java-status");
      if (res.ok) setJavaStatus(await res.json());
    } catch (e) {
      console.error("Error fetching Java status:", e);
    }
  };

  const fetchJavaCode = async () => {
    try {
      const res = await fetch("/api/java-code");
      if (res.ok) {
        const data = await res.json();
        setJavaCode(data.content);
        setCodeDraft(data.content);
      }
    } catch (e) {
      console.error("Error fetching Java code:", e);
    }
  };

  // Role SWITCH simulation helper
  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    const mockUser = role === "admin" 
      ? { id: "U-101", username: "admin", name: "Administrator Root", role: "admin", department: "Security Command Center" }
      : role === "employee"
      ? { id: "U-103", username: "employee_host", name: "Dr. Aiden Vance", role: "employee", department: "Research & Development" }
      : { id: "U-102", username: "reception_gate", name: "Officer Sarah Connor", role: "receptionist", department: "Perimeter Gate" };
    
    setCurrentUser(mockUser);
    localStorage.setItem("aegis_user", JSON.stringify(mockUser));
    
    if (role === "admin" || role === "receptionist") {
      setActiveTab("overview");
    } else {
      setActiveTab("employee");
    }
    showToast(`Assumed ${role.toUpperCase()} security clearance parameters.`, "success");
    refreshAllData();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("aegis_user");
    showToast("Terminal session logged out and secured.", "info");
  };

  // REST Visitor Check-In/Check-Out Actions
  const handleCheckIn = async (visitorId: string) => {
    try {
      const res = await fetch(`/api/visitors/${visitorId}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        const updated = await res.json();
        showToast(`${updated.name} successfully check-in at security threshold.`, "success");
        refreshAllData();
        if (selectedVisitor?.id === visitorId) {
          setSelectedVisitor(updated);
        }
      }
    } catch (e) {
      showToast("Check-in communication failed.", "error");
    }
  };

  const handleCheckOut = async (visitorId: string) => {
    try {
      const res = await fetch(`/api/visitors/${visitorId}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        const updated = await res.json();
        showToast(`${updated.name} badges neutralised and checked out safely.`, "info");
        refreshAllData();
        if (selectedVisitor?.id === visitorId) {
          setSelectedVisitor(updated);
        }
      }
    } catch (e) {
      showToast("Check-out communication failed.", "error");
    }
  };

  const triggerNdaSigning = (visitor: Visitor) => {
    setVisitorToSign(visitor);
    setIsNdaModalOpen(true);
  };

  const handleSignNDASave = async (signatureDataUrl: string) => {
    if (!visitorToSign) return;
    try {
      const res = await fetch(`/api/visitors/${visitorToSign.id}/sign-nda`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature: signatureDataUrl })
      });
      if (res.ok) {
        const updated = await res.json();
        showToast(`Security NDA Waiver successfully signed & sealed for ${updated.name}!`, "success");
        setIsNdaModalOpen(false);
        setVisitorToSign(null);
        refreshAllData();
        if (selectedVisitor?.id === updated.id) {
          setSelectedVisitor(updated);
        }
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to submit signature.", "error");
      }
    } catch (e) {
      showToast("Biometric submission failure.", "error");
    }
  };

  const handleDeleteVisitor = async (visitorId: string) => {
    if (!window.confirm("Purge visitor record? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch(`/api/visitors/${visitorId}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Visitor record purged from mainframe.", "info");
        refreshAllData();
        if (selectedVisitor?.id === visitorId) {
          setSelectedVisitor(null);
        }
      }
    } catch (e) {
      showToast("Purge rejected.", "error");
    }
  };

  // Appointment Actions
  const handleBookAppointment = async (formData: any) => {
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          operator: currentUser.name
        })
      });
      if (res.ok) {
        showToast(`Visit slot booked successfully for ${formData.visitorName}.`, "success");
        refreshAllData();
      }
    } catch (err) {
      showToast("Could not contact scheduler endpoint.", "error");
    }
  };

  const handleUpdateAppointmentStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          operator: currentUser.name,
          role: currentUser.role
        })
      });
      if (res.ok) {
        const data = await res.json();
        showToast(`Appointment status updated to ${status.toUpperCase()}.`, "info");
        refreshAllData();
      }
    } catch (err) {
      showToast("Status update failed.", "error");
    }
  };

  // Visitor Pre-Registration Submit
  const handleRegisterVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setIsRegistering(true);

    if (!newId || !newName || !newCompany || !newContact || !newPurpose || !newDept || !newHost) {
      setFormError("All fields are mandatory to satisfy secure vetting protocols.");
      setIsRegistering(false);
      return;
    }

    try {
      const res = await fetch("/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newId,
          name: newName,
          company: newCompany,
          contact: newContact,
          purpose: newPurpose,
          department: newDept,
          hostName: newHost
        })
      });

      const data = await res.json();
      setIsRegistering(false);

      if (res.ok) {
        setFormSuccess(`Profile for ${newName} initialized.`);
        showToast(`Visitor ${newName} successfully pre-registered.`, "success");
        setNewId("");
        setNewName("");
        setNewCompany("");
        setNewContact("");
        setNewPurpose("");
        setNewDept("");
        setNewHost("");
        refreshAllData();
      } else {
        setFormError(data.error || "Registry rejected.");
      }
    } catch (e) {
      setIsRegistering(false);
      setFormError("Registry timeout.");
    }
  };

  // AI Cognitive Screener Chat submit
  const handleAiQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setAiLoading(true);
    setAiResponse("");
    try {
      const res = await fetch("/api/visitors/screen-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: aiQuery,
          visitorId: selectedVisitor?.id || ""
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiResponse(data.response);
      } else {
        setAiResponse("Mainframe assessment interrupted.");
      }
    } catch (e) {
      setAiResponse("AI Screening offline.");
    } finally {
      setAiLoading(false);
    }
  };

  // Java Deck workstation compiler & sub-terminal
  const saveJavaCode = async () => {
    try {
      const res = await fetch("/api/java-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: codeDraft })
      });
      if (res.ok) {
        setJavaCode(codeDraft);
        setIsEditingCode(false);
        showToast("Java source file compiled and written to disk.", "success");
      }
    } catch (e) {
      showToast("Source file write failed.", "error");
    }
  };

  const compileJava = async () => {
    setIsCompiling(true);
    setCompilationLog("Invoking javac VisitorManagementSystem.java compiler pipeline...");
    setCompileSuccess(null);
    try {
      const res = await fetch("/api/java-compile", { method: "POST" });
      const data = await res.json();
      setIsCompiling(false);
      if (data.success) {
        setCompileSuccess(true);
        setCompilationLog(data.output || "Compilation Successful. Class compiled.");
        showToast("Java bytecode generated successfully!", "success");
      } else {
        setCompileSuccess(false);
        setCompilationLog(data.error || "Compilation diagnostics failed.");
        showToast("Java compile error.", "error");
      }
    } catch (e) {
      setIsCompiling(false);
      setCompileSuccess(false);
      setCompilationLog("Server pipeline disconnected.");
    }
  };

  const startTerminal = async () => {
    try {
      setTerminalOutput("Booting virtual machine & spawning standalone Java process...\n");
      const res = await fetch("/api/terminal/start", { method: "POST" });
      if (res.ok) {
        setIsTerminalActive(true);
        showToast("Java runtime console pipes mapped successfully.", "success");
        pollTerminalOutput();
      }
    } catch (e) {
      showToast("Subprocess spawn failed.", "error");
    }
  };

  const stopTerminal = async () => {
    try {
      const res = await fetch("/api/terminal/stop", { method: "POST" });
      if (res.ok) {
        setIsTerminalActive(false);
        pollTerminalOutput();
        showToast("Standalone Java process terminated safely.", "info");
      }
    } catch (e) {}
  };

  const pollTerminalOutput = async () => {
    try {
      const res = await fetch("/api/terminal/output");
      if (res.ok) {
        const data = await res.json();
        setTerminalOutput(data.output);
        setIsTerminalActive(data.isActive);
        refreshAllData();
      }
    } catch (e) {}
  };

  const sendTerminalInput = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!terminalInput.trim()) return;

    try {
      const inputToSend = terminalInput;
      setTerminalInput("");
      const res = await fetch("/api/terminal/input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: inputToSend })
      });
      if (res.ok) {
        pollTerminalOutput();
      }
    } catch (e) {}
  };

  // Notification center triggers
  const handleMarkNotifRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: "POST" });
      if (res.ok) fetchNotifications();
    } catch (e) {}
  };

  const handleClearNotifications = async () => {
    try {
      const res = await fetch("/api/notifications/clear", { method: "POST" });
      if (res.ok) fetchNotifications();
    } catch (e) {}
  };

  const unreadNotifs = notifications.filter(n => !n.read);

  if (!currentUser) {
    return (
      <LoginPage 
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setActiveRole(user.role);
          localStorage.setItem("aegis_user", JSON.stringify(user));
          if (user.role === "admin") {
            setActiveTab("overview");
          } else if (user.role === "employee") {
            setActiveTab("employee");
          } else {
            setActiveTab("overview");
          }
          showToast(`Biometric authentication complete. Welcome back, ${user.name}.`, "success");
          refreshAllData();
        }}
        theme={theme}
        onThemeToggle={() => setTheme(prev => prev === "light" ? "dark" : "light")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-800 dark:text-zinc-200 font-sans flex flex-col selection:bg-blue-600 selection:text-white transition-colors">
      {/* Aegis Upper System Diagnostics & Notification Header */}
      <AegisHeader 
        javaStatus={javaStatus} 
        notification={notificationBanner} 
        onCloseNotification={() => setNotificationBanner(null)} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Workspace Action Bar */}
      <div className="px-6 py-3 bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-900 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-colors">
        
        {/* Dynamic Navigation Tabs according to Role */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase font-mono bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200/60 dark:border-zinc-800">
          {(activeRole === "receptionist" || activeRole === "admin") && (
            <>
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "overview" ? "bg-white dark:bg-zinc-850 text-blue-600 dark:text-blue-400 shadow-sm font-bold border border-slate-200/30 dark:border-zinc-800" : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Overview
              </button>
              <button
                onClick={() => setActiveTab("appointments")}
                className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "appointments" ? "bg-white dark:bg-zinc-850 text-blue-600 dark:text-blue-400 shadow-sm font-bold border border-slate-200/30 dark:border-zinc-800" : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" /> Appointments
              </button>
            </>
          )}

          {activeRole === "employee" && (
            <button
              onClick={() => setActiveTab("employee")}
              className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "employee" ? "bg-white dark:bg-zinc-850 text-purple-600 dark:text-purple-400 shadow-sm font-bold border border-slate-200/30 dark:border-zinc-800" : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Host Console
            </button>
          )}

          {activeRole === "admin" && (
            <>
              <button
                onClick={() => setActiveTab("admin")}
                className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "admin" ? "bg-white dark:bg-zinc-850 text-red-600 dark:text-red-400 shadow-sm font-bold border border-slate-200/30 dark:border-zinc-800" : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
                }`}
              >
                <Settings className="w-3.5 h-3.5" /> Mainframe CRUD
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "analytics" ? "bg-white dark:bg-zinc-850 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold border border-slate-200/30 dark:border-zinc-800" : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" /> Analytics
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "reports" ? "bg-white dark:bg-zinc-850 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold border border-slate-200/30 dark:border-zinc-800" : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Reports & Passes
              </button>
            </>
          )}

          <button
            onClick={() => setActiveTab("java-deck")}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "java-deck" ? "bg-white dark:bg-zinc-850 text-slate-700 dark:text-zinc-205 shadow-sm font-bold border border-slate-200/30 dark:border-zinc-800" : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" /> Java Runtime
          </button>

          {/* In-app Broadcast Bell with dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationCenter(!showNotificationCenter)}
              className="p-2 hover:bg-white rounded-lg transition-all relative cursor-pointer text-slate-500"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white font-sans text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {showNotificationCenter && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-xl p-4 z-50 text-xs normal-case font-sans space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-800">System Broadcasts</span>
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearNotifications}
                      className="text-[10px] text-red-500 hover:underline font-semibold cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-2 rounded-lg border text-[11px] transition-all relative ${
                        notif.read ? "bg-slate-50/50 border-slate-100 text-slate-500" : "bg-blue-50/40 border-blue-100 text-slate-800 font-medium"
                      }`}
                      onClick={() => handleMarkNotifRead(notif.id)}
                    >
                      <p>{notif.message}</p>
                      <span className="text-[9px] font-mono text-slate-400 block mt-1">
                        {notif.timestamp.substring(11, 19)}
                      </span>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-center py-6 text-slate-400 text-[11px]">
                      No active broadcasts. Perimeter safe.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Accessories */}
        <div className="flex items-center gap-3">
          {/* Quick Clearances Switch Trigger for convenience */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-1 rounded-xl text-[10px] font-mono text-slate-500 dark:text-zinc-400">
            <span className="font-bold px-1 hidden md:inline text-[9px] uppercase tracking-wider text-slate-400 dark:text-zinc-500">Fast-Role:</span>
            <button 
              onClick={() => handleRoleChange("receptionist")} 
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer font-bold uppercase text-[9px] ${activeRole === "receptionist" ? "bg-blue-600 text-white shadow-sm" : "hover:text-blue-500 dark:hover:text-blue-400 text-slate-600 dark:text-zinc-400"}`}
            >
              Rec
            </button>
            <button 
              onClick={() => handleRoleChange("employee")} 
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer font-bold uppercase text-[9px] ${activeRole === "employee" ? "bg-purple-600 text-white shadow-sm" : "hover:text-purple-500 dark:hover:text-purple-400 text-slate-600 dark:text-zinc-400"}`}
            >
              Host
            </button>
            <button 
              onClick={() => handleRoleChange("admin")} 
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer font-bold uppercase text-[9px] ${activeRole === "admin" ? "bg-red-600 text-white shadow-sm" : "hover:text-red-500 dark:hover:text-red-400 text-slate-600 dark:text-zinc-400"}`}
            >
              Admin
            </button>
          </div>

          <button
            id="theme-toggle"
            onClick={() => setTheme(prev => prev === "light" ? "dark" : "light")}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm transition-all text-slate-600 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 cursor-pointer flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Light</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Sandbox Layout Container */}
      <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">
        
        {/* Left Interactive Panel */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6 relative">
          
          {/* TAB 1: OVERVIEW & RECEPTION GATE CONTROL */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stat metrics bento row */}
              <AegisStats visitors={visitors} />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Gate Matrix Grid (Left 7 cols) */}
                <div className="lg:col-span-7">
                  <GateDirectoryMatrix 
                    visitors={visitors}
                    selectedVisitor={selectedVisitor}
                    onSelectVisitor={setSelectedVisitor}
                    searchQuery={searchQuery}
                    onSearchQueryChange={setSearchQuery}
                    onCheckIn={handleCheckIn}
                    onCheckOut={handleCheckOut}
                    onDeleteVisitor={handleDeleteVisitor}
                  />
                </div>

                {/* Pre-register terminal (Right 5 cols) */}
                <div className="lg:col-span-5">
                  <PreRegisterTerminal 
                    newId={newId}
                    setNewId={setNewId}
                    newName={newName}
                    setNewName={setNewName}
                    newCompany={newCompany}
                    setNewCompany={setNewCompany}
                    newContact={newContact}
                    setNewContact={setNewContact}
                    newPurpose={newPurpose}
                    setNewPurpose={setNewPurpose}
                    newDept={newDept}
                    setNewDept={setNewDept}
                    newHost={newHost}
                    setNewHost={setNewHost}
                    formError={formError}
                    formSuccess={formSuccess}
                    isRegistering={isRegistering}
                    onSubmit={handleRegisterVisitor}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPOINTMENTS MODULE */}
          {activeTab === "appointments" && (
            <AppointmentWorkstation 
              appointments={appointments}
              employees={employees}
              departments={departments}
              visitors={visitors}
              onBookAppointment={handleBookAppointment}
              onUpdateStatus={handleUpdateAppointmentStatus}
              showNotification={showToast}
            />
          )}

          {/* TAB 3: EMPLOYEE CONTROL */}
          {activeTab === "employee" && (
            <EmployeeWorkstation 
              appointments={appointments}
              employees={employees}
              onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
              showNotification={showToast}
              onRefreshData={refreshAllData}
            />
          )}

          {/* TAB 4: ADMIN MAINFRAME CRUD */}
          {activeTab === "admin" && (
            <AdminWorkstation 
              employees={employees}
              departments={departments}
              auditLogs={auditLogs}
              settings={settings}
              onRefreshData={refreshAllData}
              showNotification={showToast}
            />
          )}

          {/* TAB 5: BENTO ANALYTICS DIAGNOSTICS */}
          {activeTab === "analytics" && (
            <AegisAnalytics visitors={visitors} />
          )}

          {/* TAB 6: PRINT BADGES & EXPORTS */}
          {activeTab === "reports" && (
            <AegisReports visitors={visitors} />
          )}

          {/* TAB 7: JAVA STANDALONE WORKSTATION */}
          {activeTab === "java-deck" && (
            <JavaDeckWorkstation 
              javaCode={javaCode}
              codeDraft={codeDraft}
              setCodeDraft={setCodeDraft}
              isEditingCode={isEditingCode}
              setIsEditingCode={setIsEditingCode}
              onSaveCode={saveJavaCode}
              onCompile={compileJava}
              isCompiling={isCompiling}
              compilationLog={compilationLog}
              compileSuccess={compileSuccess}
              isTerminalActive={isTerminalActive}
              onStartTerminal={startTerminal}
              onStopTerminal={stopTerminal}
              terminalOutput={terminalOutput}
              terminalInput={terminalInput}
              setTerminalInput={setTerminalInput}
              onSendTerminalInput={sendTerminalInput}
              terminalBottomRef={terminalBottomRef}
            />
          )}
        </main>

        {/* Right Sidebar: Badge Card Detail & AI Screening Officer */}
        <HolographicBadgeDetail 
          selectedVisitor={selectedVisitor}
          aiQuery={aiQuery}
          setAiQuery={setAiQuery}
          aiResponse={aiResponse}
          aiLoading={aiLoading}
          onAiQuerySubmit={handleAiQuery}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          onSignNDA={triggerNdaSigning}
        />
      </div>

      {/* Visitor Digital NDA & Safety Waiver Signature Modal */}
      {isNdaModalOpen && visitorToSign && (
        <NDASignatureModal
          visitor={visitorToSign}
          isOpen={isNdaModalOpen}
          onClose={() => {
            setIsNdaModalOpen(false);
            setVisitorToSign(null);
          }}
          onSignComplete={handleSignNDASave}
        />
      )}
    </div>
  );
}
