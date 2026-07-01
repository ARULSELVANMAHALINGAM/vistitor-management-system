import React from "react";
import { PlusCircle, RefreshCw } from "lucide-react";

interface PreRegisterTerminalProps {
  newId: string;
  setNewId: (v: string) => void;
  newName: string;
  setNewName: (v: string) => void;
  newCompany: string;
  setNewCompany: (v: string) => void;
  newContact: string;
  setNewContact: (v: string) => void;
  newPurpose: string;
  setNewPurpose: (v: string) => void;
  newDept: string;
  setNewDept: (v: string) => void;
  newHost: string;
  setNewHost: (v: string) => void;
  formError: string;
  formSuccess: string;
  isRegistering: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function PreRegisterTerminal({
  newId,
  setNewId,
  newName,
  setNewName,
  newCompany,
  setNewCompany,
  newContact,
  setNewContact,
  newPurpose,
  setNewPurpose,
  newDept,
  setNewDept,
  newHost,
  setNewHost,
  formError,
  formSuccess,
  isRegistering,
  onSubmit
}: PreRegisterTerminalProps) {
  return (
    <div id="pre-register-terminal" className="bg-white dark:bg-zinc-950 rounded-xl border border-slate-200/80 dark:border-zinc-900 p-5 flex flex-col space-y-4 shadow-sm h-full transition-colors duration-300">
      <div>
        <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Pre-Register Terminal
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">Initialize dynamic vetting record profile</p>
      </div>

      {formError && (
        <div className="p-2.5 bg-red-50/50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/50 text-red-800 dark:text-red-400 text-xs rounded font-mono">
          [!] ERROR: {formError}
        </div>
      )}

      {formSuccess && (
        <div className="p-2.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-400 text-xs rounded font-mono">
          [✓] SUCCESS: {formSuccess}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 dark:text-zinc-450 font-mono uppercase tracking-wider mb-1 font-semibold">Access ID</label>
            <input
              type="text"
              required
              placeholder="V-105"
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              className="bg-slate-50 dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 p-2.5 rounded border border-slate-200 dark:border-zinc-800 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 w-full font-mono transition-all"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] text-slate-500 dark:text-zinc-450 font-mono uppercase tracking-wider mb-1 font-semibold">Full Visitor Name</label>
            <input
              type="text"
              required
              placeholder="Aiden Vance"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-slate-50 dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 p-2.5 rounded border border-slate-200 dark:border-zinc-800 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 w-full transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 dark:text-zinc-450 font-mono uppercase tracking-wider mb-1 font-semibold">Corporate Affiliation</label>
            <input
              type="text"
              required
              placeholder="Weyland-Yutani Corp"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              className="bg-slate-50 dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 p-2.5 rounded border border-slate-200 dark:border-zinc-800 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 w-full transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 dark:text-zinc-450 font-mono uppercase tracking-wider mb-1 font-semibold">Security Contact Comm</label>
            <input
              type="text"
              required
              placeholder="+1 (555) 019-9231"
              value={newContact}
              onChange={(e) => setNewContact(e.target.value)}
              className="bg-slate-50 dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 p-2.5 rounded border border-slate-200 dark:border-zinc-800 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 w-full font-mono transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-slate-500 dark:text-zinc-450 font-mono uppercase tracking-wider mb-1 font-semibold">Vetting Access Purpose</label>
          <input
            type="text"
            required
            placeholder="Biomarker Scan Calibration Diagnostics"
            value={newPurpose}
            onChange={(e) => setNewPurpose(e.target.value)}
            className="bg-slate-50 dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 p-2.5 rounded border border-slate-200 dark:border-zinc-800 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 w-full transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 dark:text-zinc-450 font-mono uppercase tracking-wider mb-1 font-semibold">Target Grid</label>
            <input
              type="text"
              required
              placeholder="Sub-level Command Hub"
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              className="bg-slate-50 dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 p-2.5 rounded border border-slate-200 dark:border-zinc-800 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 w-full transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 dark:text-zinc-450 font-mono uppercase tracking-wider mb-1 font-semibold">Authorizing Commander Host</label>
            <input
              type="text"
              required
              placeholder="Lt. Ellen Ripley"
              value={newHost}
              onChange={(e) => setNewHost(e.target.value)}
              className="bg-slate-50 dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 p-2.5 rounded border border-slate-200 dark:border-zinc-800 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 w-full transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isRegistering}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-sm"
        >
          {isRegistering ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Assessing Threat Parameters...
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" /> Trigger Mainframe AI Registration
            </>
          )}
        </button>
      </form>
    </div>
  );
}
