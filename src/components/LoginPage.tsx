import React, { useState } from "react";
import { Shield, Key, Eye, EyeOff, Terminal, Activity, Sun, Moon, Lock, CheckCircle, HelpCircle } from "lucide-react";
import { UserRole } from "../types";
import AegisLogo from "./AegisLogo";

interface LoginPageProps {
  onLoginSuccess: (user: { id: string; username: string; name: string; role: UserRole; department?: string }) => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
}

export default function LoginPage({ onLoginSuccess, theme, onThemeToggle }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("receptionist");
  const [username, setUsername] = useState("reception_gate");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const rolesPreset = [
    {
      role: "receptionist" as UserRole,
      label: "Gate Receptionist",
      user: "reception_gate",
      name: "Officer Sarah Connor",
      dept: "Perimeter Gate",
      badgeId: "U-102",
      desc: "Visitor register & badge minting"
    },
    {
      role: "employee" as UserRole,
      label: "Host Employee",
      user: "employee_host",
      name: "Dr. Aiden Vance",
      dept: "Research & Development",
      badgeId: "U-103",
      desc: "Meeting approvals & sponsorship"
    },
    {
      role: "admin" as UserRole,
      label: "System Admin",
      user: "admin",
      name: "Administrator Root",
      dept: "Security Command Center",
      badgeId: "U-101",
      desc: "Full mainframe & audit tools"
    }
  ];

  const handleSelectPreset = (preset: typeof rolesPreset[0]) => {
    setSelectedRole(preset.role);
    setUsername(preset.user);
    setPassword("••••••••");
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage("Corporate username parameter is required.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setAuthStatus("Initiating SSL quantum handshake...");

    // Stage 1: Handshake
    setTimeout(() => {
      setAuthStatus("Verifying holographic security hash...");
      
      // Stage 2: Biometric check
      setTimeout(() => {
        setAuthStatus("Access parameters validated. Granting clearance...");
        
        // Stage 3: Success & Login Callback
        setTimeout(() => {
          const currentPreset = rolesPreset.find(p => p.role === selectedRole) || {
            role: "receptionist" as UserRole,
            badgeId: `U-${Math.floor(Math.random() * 900) + 100}`,
            name: username.replace(/_|[0-9]/g, ' '),
            dept: "External Contractor"
          };

          onLoginSuccess({
            id: currentPreset.badgeId,
            username: username,
            name: currentPreset.name,
            role: selectedRole,
            department: (currentPreset as any).dept
          });
          setLoading(false);
        }, 800);
      }, 900);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-800 dark:text-zinc-200 font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden">
      
      {/* Background Matrix Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.03] dark:opacity-[0.15] pointer-events-none" />

      {/* Top Header */}
      <header className="px-6 py-4 flex justify-between items-center z-10 border-b border-slate-200/60 dark:border-zinc-900 bg-white/75 dark:bg-zinc-950/70 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-50/50 dark:bg-zinc-900 border border-blue-100 dark:border-zinc-800 rounded-xl shadow-sm">
            <AegisLogo className="w-7 h-7" glow={true} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-900/40">v3.5-Active</span>
            </div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-zinc-100 font-mono">AEGIS SECURITY SYSTEMS</h1>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={onThemeToggle}
          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm transition-all text-slate-600 dark:text-zinc-400 cursor-pointer flex items-center gap-1.5"
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4 text-slate-600" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
          )}
        </button>
      </header>

      {/* Central Login Deck */}
      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-2xl shadow-xl dark:shadow-zinc-950/50 flex flex-col overflow-hidden">
          
          {/* Top Visual Lock Banner */}
          <div className="bg-slate-50 dark:bg-zinc-900/30 px-6 py-5 border-b border-slate-100 dark:border-zinc-900 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">FACILITY ACCESS DECK</span>
              <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-200 font-mono uppercase tracking-wide">Mainframe Decryption Core</h2>
            </div>
            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/30 text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>TERMINAL SECURE</span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Step 1: Simulated Access Roles Selection */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block">
                Select Active Operational Preset
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {rolesPreset.map((preset) => {
                  const isActive = selectedRole === preset.role;
                  return (
                    <button
                      key={preset.role}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`text-left p-3 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                        isActive 
                          ? "bg-blue-50/75 dark:bg-blue-950/20 border-blue-500/65 shadow-inner" 
                          : "bg-slate-50/50 hover:bg-slate-50 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/80 border-slate-200 dark:border-zinc-850 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[11px] font-bold ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-zinc-300"}`}>
                            {preset.label}
                          </span>
                          {isActive && <CheckCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 leading-tight mt-1">
                          {preset.desc}
                        </p>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-zinc-800 text-[9px] font-mono text-slate-500 dark:text-zinc-400 truncate">
                        ID: {preset.badgeId}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block">
                  Corporate Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                    <Terminal className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter database alias..."
                    className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:text-zinc-200 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all uppercase"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block">
                  Security Mainframe Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security key..."
                    className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-800 dark:text-zinc-200 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 cursor-pointer"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-150 dark:border-red-900/40 text-red-600 dark:text-red-400 rounded-xl text-[11px] font-mono">
                  🚨 {errorMessage}
                </div>
              )}

              {/* Extra Parameters: Remember / Password Helper */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-zinc-400 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 dark:border-zinc-800 text-blue-600 focus:ring-0 w-3.5 h-3.5 bg-slate-50 dark:bg-zinc-900 cursor-pointer"
                    disabled={loading}
                  />
                  <span>Authorize terminal persistence</span>
                </label>
                
                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Credential Help</span>
                </div>
              </div>

              {/* Actions Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-250 flex items-center justify-center gap-2 cursor-pointer ${
                    loading 
                      ? "bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 cursor-not-allowed" 
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20"
                  }`}
                >
                  {loading ? (
                    <>
                      <Lock className="w-4 h-4 animate-bounce text-blue-500" />
                      <span>DECRYPTING CORE...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Authenticate Secure Session</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Decryption status feedback tracker */}
            {loading && (
              <div className="p-3.5 bg-slate-50 dark:bg-zinc-900/50 border border-slate-150 dark:border-zinc-900 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[9px] font-mono font-bold uppercase">
                  <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <Activity className="w-3 h-3 animate-pulse" /> {authStatus}
                  </span>
                  <span className="text-slate-400 dark:text-zinc-500">Progress: 68%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" style={{ width: "68%" }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Credentials Info */}
      <footer className="px-6 py-4 border-t border-slate-200/50 dark:border-zinc-900 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-slate-400 dark:text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>FACILITY PERIMETER SECURED BY AEGIS-CRYPT COMPILER v2</span>
        </div>
        <div>
          <span>LOGGED IP TRACKED UNDER SECURITY WAIVER PROT-90</span>
        </div>
      </footer>
    </div>
  );
}
