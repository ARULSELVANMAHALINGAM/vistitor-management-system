import React, { useRef, useState, useEffect } from "react";
import { X, FileText, PenTool, Check, Shield } from "lucide-react";
import { Visitor } from "../types";

interface NDASignatureModalProps {
  visitor: Visitor;
  isOpen: boolean;
  onClose: () => void;
  onSignComplete: (signatureDataUrl: string) => void;
}

export default function NDASignatureModal({
  visitor,
  isOpen,
  onClose,
  onSignComplete
}: NDASignatureModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [typedName, setTypedName] = useState("");
  const [signMethod, setSignMethod] = useState<"draw" | "type">("draw");
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (isOpen && signMethod === "draw") {
      // Small timeout to allow canvas to render in DOM and receive correct dimensions
      const timer = setTimeout(() => {
        initCanvas();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, signMethod]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Make canvas sharp on Retina displays
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Style the pen
    ctx.strokeStyle = "#2563eb"; // Blue pen for security biometric authenticity
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Draw background subtle grid lines
    drawCanvasGrid(ctx, rect.width, rect.height);
    setIsEmpty(true);
  };

  const drawCanvasGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = "rgba(59, 130, 246, 0.04)";
    ctx.lineWidth = 1;
    // Horizontal lines
    for (let y = 15; y < height; y += 15) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    // Signature baseline
    ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(20, height - 25);
    ctx.lineTo(width - 20, height - 25);
    ctx.stroke();

    // Subtle "Sign Here" text watermarked
    ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
    ctx.font = "italic 9px monospace";
    ctx.fillText("SPECIMEN SIGNATURE AREA", 25, height - 12);

    // Restore brush style for drawing
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2.5;
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    setIsEmpty(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    initCanvas();
  };

  const handleConfirm = () => {
    if (signMethod === "draw") {
      const canvas = canvasRef.current;
      if (!canvas || isEmpty) return;
      
      // Convert drawn canvas to base64 image data
      const dataUrl = canvas.toDataURL("image/png");
      onSignComplete(dataUrl);
    } else {
      if (!typedName.trim()) return;
      
      // Render typed name into an image to save as a uniform cryptographic signature seal
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = 400;
      tempCanvas.height = 100;
      const ctx = tempCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 400, 100);
        
        // Beautiful digital pen blue signature look
        ctx.fillStyle = "#2563eb";
        ctx.font = "italic 32px 'Brush Script MT', 'Caveat', 'Great Vibes', cursive, sans-serif";
        ctx.fillText(typedName, 40, 55);
        
        ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(20, 75);
        ctx.lineTo(380, 75);
        ctx.stroke();
        
        ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
        ctx.font = "8px monospace";
        ctx.fillText("AEGIS SECURITY CRYPTO-SIGNATURE SYSTEM", 20, 88);
        
        onSignComplete(tempCanvas.toDataURL("image/png"));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-zinc-900 flex justify-between items-center bg-slate-50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-zinc-100 text-sm font-mono uppercase tracking-wider">Security Access Agreement</h3>
              <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono">FACILITY GATE PROTOCOL VECTOR</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg text-slate-400 dark:text-zinc-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable NDA Legal Copy */}
        <div className="p-5 overflow-y-auto space-y-4 max-h-[40vh] border-b border-slate-100 dark:border-zinc-900 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed scrollbar-thin">
          <div className="flex items-center gap-2 text-slate-800 dark:text-zinc-100 font-bold font-mono text-[11px] uppercase tracking-wide">
            <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
            <span>Facility Access & Intellectual Protection Waiver</span>
          </div>
          
          <div className="bg-slate-50 dark:bg-zinc-900 p-3.5 rounded-xl border border-slate-150 dark:border-zinc-800 space-y-3 font-mono text-[10.5px]">
            <p>
              I, <strong className="text-slate-800 dark:text-white uppercase">{visitor.name}</strong>, representing <strong className="text-slate-800 dark:text-white uppercase">{visitor.company}</strong>, hereby covenant and agree to the following terms as a mandatory prerequisite for temporary clearance at Aegis Facilities:
            </p>
            
            <p className="border-l-2 border-blue-500 pl-2 text-slate-500 dark:text-zinc-400">
              <strong>1. NON-DISCLOSURE OF CLASSIFIED ASSETS:</strong> All technical structures, physical layouts, server hardware grids, quantum processors, and codebases examined or encountered during this visit are trade secrets of Aegis Corp. Capturing photo, audio, or computational telemetry without high-tier supervisor endorsement is strictly prohibited.
            </p>

            <p className="border-l-2 border-blue-500 pl-2 text-slate-500 dark:text-zinc-400">
              <strong>2. OPERATIONAL BOUNDARIES:</strong> Clearance is provided solely for access to <strong className="text-slate-700 dark:text-zinc-200">{visitor.department}</strong>. Any deviation into unassigned sectors (especially Quantum Core, Reactor Labs, or Secure Archives G) without escort constitutes a security breach and will trigger emergency perimeter lockdowns.
            </p>

            <p className="border-l-2 border-blue-500 pl-2 text-slate-500 dark:text-zinc-400">
              <strong>3. BIOMETRIC LOGGING & AUDITING:</strong> For safety and compliance verification, physical entry, exit, and badge scans are permanently logged to the secure backend. These metrics are compiled into standard audit logs and can be synchronized with regulatory oversight authorities.
            </p>
          </div>
          
          <div className="text-[10px] text-slate-400 dark:text-zinc-500 italic font-mono">
            By signing below, I certify that I have read, understood, and accept all listed security countermeasure regulations and operational restrictions of Aegis Corporation.
          </div>
        </div>

        {/* Signature Pad Controls */}
        <div className="p-5 bg-slate-50 dark:bg-zinc-900/20 space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Authorized Signature Method
            </label>
            <div className="flex bg-slate-200 dark:bg-zinc-800 p-0.5 rounded-lg text-[10px] font-mono">
              <button 
                type="button"
                onClick={() => setSignMethod("draw")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-bold uppercase ${
                  signMethod === "draw" ? "bg-white dark:bg-zinc-700 text-blue-600 dark:text-zinc-100 shadow-sm" : "text-slate-500 dark:text-zinc-400"
                }`}
              >
                Draw Signature
              </button>
              <button 
                type="button"
                onClick={() => setSignMethod("type")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-bold uppercase ${
                  signMethod === "type" ? "bg-white dark:bg-zinc-700 text-blue-600 dark:text-zinc-100 shadow-sm" : "text-slate-500 dark:text-zinc-400"
                }`}
              >
                Type Legal Name
              </button>
            </div>
          </div>

          {signMethod === "draw" ? (
            <div className="space-y-2">
              <div className="relative border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl overflow-hidden h-36 flex flex-col justify-between shadow-inner">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-full cursor-crosshair touch-none"
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                <span className="flex items-center gap-1">
                  <PenTool className="w-3 h-3 text-blue-500 animate-pulse" /> Use mouse or trackpad to sign
                </span>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-bold uppercase transition-all cursor-pointer bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-100 dark:border-red-900/50 hover:bg-red-100"
                >
                  Clear Pad
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-white dark:bg-zinc-950 p-4 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-inner">
                <input
                  type="text"
                  placeholder="Type legal name to generate cryptographic key..."
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-slate-800 dark:text-zinc-100 font-mono transition-all uppercase"
                />
                
                {typedName && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-900 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-zinc-900/30 p-2.5 rounded-lg border border-dashed border-slate-200 dark:border-zinc-800">
                    <span className="text-[8px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">Generated Handwritten Specimen</span>
                    <span className="text-2xl text-blue-600 font-bold italic tracking-wide font-serif py-1 block" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                      {typedName}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[9px] font-mono text-slate-400 dark:text-zinc-500">
                Type your full legal name as a declaration of digital agreement. System registers this declaration as a valid cryptographic biometric key.
              </p>
            </div>
          )}
        </div>

        {/* Actions footer */}
        <div className="p-4 border-t border-slate-100 dark:border-zinc-900 bg-slate-50 dark:bg-zinc-900/40 flex justify-end gap-3.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono font-bold uppercase border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400 transition-colors cursor-pointer bg-white dark:bg-zinc-950"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={signMethod === "draw" ? isEmpty : !typedName.trim()}
            className={`px-5 py-2 rounded-xl text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
              (signMethod === "draw" ? !isEmpty : typedName.trim())
                ? "bg-blue-600 hover:bg-blue-700 text-white hover:shadow"
                : "bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 cursor-not-allowed border border-slate-300 dark:border-zinc-700"
            }`}
          >
            <Check className="w-3.5 h-3.5" /> Sign & Verify Access
          </button>
        </div>
      </div>
    </div>
  );
}
