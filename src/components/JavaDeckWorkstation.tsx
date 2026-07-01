import React from "react";
import { FileCode, Cpu, Play, RefreshCw, Terminal as TerminalIcon, Square } from "lucide-react";

interface JavaDeckWorkstationProps {
  javaCode: string;
  codeDraft: string;
  setCodeDraft: (v: string) => void;
  isEditingCode: boolean;
  setIsEditingCode: (v: boolean) => void;
  onSaveCode: () => void;
  onCompile: () => void;
  isCompiling: boolean;
  compilationLog: string;
  compileSuccess: boolean | null;
  isTerminalActive: boolean;
  onStartTerminal: () => void;
  onStopTerminal: () => void;
  terminalOutput: string;
  terminalInput: string;
  setTerminalInput: (v: string) => void;
  onSendTerminalInput: (e?: React.FormEvent) => void;
  terminalBottomRef: React.RefObject<HTMLDivElement | null>;
}

export default function JavaDeckWorkstation({
  javaCode,
  codeDraft,
  setCodeDraft,
  isEditingCode,
  setIsEditingCode,
  onSaveCode,
  onCompile,
  isCompiling,
  compilationLog,
  compileSuccess,
  isTerminalActive,
  onStartTerminal,
  onStopTerminal,
  terminalOutput,
  terminalInput,
  setTerminalInput,
  onSendTerminalInput,
  terminalBottomRef
}: JavaDeckWorkstationProps) {
  return (
    <div id="java-deck-workstation" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      
      {/* Java Source Code View (Left 6 Cols) */}
      <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 flex flex-col space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <FileCode className="w-4.5 h-4.5 text-blue-600" />
              VisitorManagementSystem.java
            </h2>
            <p className="text-xs text-slate-500">Upgraded Enterprise-grade JVM Core Source Code</p>
          </div>

          <div className="flex items-center gap-2">
            {isEditingCode ? (
              <>
                <button
                  onClick={onSaveCode}
                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer"
                >
                  Save Code
                </button>
                <button
                  onClick={() => {
                    setCodeDraft(javaCode);
                    setIsEditingCode(false);
                  }}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditingCode(true)}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold flex items-center gap-1 border border-slate-200 cursor-pointer"
              >
                Modify Source
              </button>
            )}
          </div>
        </div>

        {isEditingCode ? (
          <textarea
            value={codeDraft}
            onChange={(e) => setCodeDraft(e.target.value)}
            className="flex-1 min-h-[450px] bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs border border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 overflow-y-auto"
          />
        ) : (
          <div className="flex-1 bg-slate-900 p-4 rounded-lg font-mono text-xs border border-slate-800 overflow-y-auto max-h-[500px] text-slate-100 whitespace-pre scrollbar-thin">
            <code>{javaCode}</code>
          </div>
        )}

        {/* Compilation Command Center */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-600" />
              Aegis Compiler Controller
            </span>
            <button
              onClick={onCompile}
              disabled={isCompiling}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs hover:bg-blue-700 font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {isCompiling ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Compiling...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Compile Bytecode
                </>
              )}
            </button>
          </div>

          {compilationLog && (
            <div className={`p-3 rounded text-[11px] font-mono whitespace-pre-wrap border ${
              compileSuccess === true 
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : compileSuccess === false
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-slate-100 border-slate-200 text-slate-700"
            }`}>
              {compilationLog}
            </div>
          )}
        </div>
      </div>

      {/* Live Subprocess Terminal Console Simulator (Right 6 Cols) */}
      <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 flex flex-col space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <TerminalIcon className="w-4.5 h-4.5 text-emerald-600" />
              Live Java App Terminal
            </h2>
            <p className="text-xs text-slate-500">Run and interact with the compiled Java program</p>
          </div>

          <div className="flex items-center gap-2">
            {isTerminalActive ? (
              <button
                onClick={onStopTerminal}
                className="px-2.5 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm"
              >
                <Square className="w-3 h-3 fill-white" /> Terminate App
              </button>
            ) : (
              <button
                onClick={onStartTerminal}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm"
              >
                <Play className="w-3 h-3 fill-white" /> Run Java System
              </button>
            )}
          </div>
        </div>

        {/* Subprocess Terminal Display */}
        <div className="flex-1 min-h-[380px] bg-slate-950 text-emerald-400 p-4 rounded-lg font-mono text-xs border border-slate-900 overflow-y-auto max-h-[420px] scrollbar-thin">
          {terminalOutput ? (
            <div className="whitespace-pre-wrap leading-relaxed text-slate-300">
              {terminalOutput}
              <div ref={terminalBottomRef} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center select-none pt-24 space-y-3">
              <TerminalIcon className="w-12 h-12 text-slate-300" />
              <div>
                <p className="text-xs font-semibold text-slate-600">Terminal pipeline inactive.</p>
                <p className="text-[10px] text-slate-400 mt-1">Click &quot;Run Java System&quot; to execute the VisitorManagementSystem class.</p>
              </div>
            </div>
          )}
        </div>

        {/* Terminal Command Line Input */}
        <form onSubmit={onSendTerminalInput} className="flex gap-2">
          <div className="flex-1 relative bg-slate-50 border border-slate-200 rounded-lg flex items-center px-3 focus-within:bg-white focus-within:border-blue-500 transition-all">
            <span className="text-emerald-600 font-mono text-xs mr-2 font-black select-none">&gt;</span>
            <input
              type="text"
              disabled={!isTerminalActive}
              placeholder={isTerminalActive ? "Enter command telemetry option (1-9)..." : "Launch Java subsystem to input data."}
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              className="flex-1 bg-transparent text-slate-800 text-xs py-2.5 focus:outline-none font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={!isTerminalActive}
            className="px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Send Input
          </button>
        </form>

        {/* Instructions Helper */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 space-y-1.5 font-mono">
          <div className="text-slate-800 font-bold uppercase tracking-wider text-[10px]">[💡 Terminal Manual]</div>
          <p>When the Java system is active:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-1">
            <li>Type <span className="text-slate-800 font-bold">1</span> to pre-register a visitor with terminal prompts.</li>
            <li>Type <span className="text-slate-800 font-bold">2</span> then the ID to log biometric check-in.</li>
            <li>Type <span className="text-slate-800 font-bold">4</span> to scan the active synchronized visitor database.</li>
            <li>Type <span className="text-slate-800 font-bold">6</span> and then ID to render a dynamic holographic badge in ASCII.</li>
          </ul>
        </div>
      </div>

    </div>
  );
}
