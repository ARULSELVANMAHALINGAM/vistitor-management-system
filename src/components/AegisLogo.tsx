import React from "react";

interface AegisLogoProps {
  className?: string;
  glow?: boolean;
}

export default function AegisLogo({ className = "w-8 h-8", glow = true }: AegisLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} transition-all duration-300 select-none`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Futuristic primary gradient */}
        <linearGradient id="aegisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" /> {/* Vivid blue */}
          <stop offset="50%" stopColor="#3b82f6" /> {/* Electric blue */}
          <stop offset="100%" stopColor="#06b6d4" /> {/* Cyber cyan */}
        </linearGradient>

        {/* Ambient glow filter for the core */}
        {glow && (
          <filter id="aegisGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>

      {/* Cybernetic background circle pattern (subtle technical coordinate system) */}
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" className="opacity-20 text-slate-400 dark:text-zinc-600" />
      <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 8" className="opacity-30 text-slate-400 dark:text-zinc-600" />

      {/* Outer Hexagonal Shield Shell */}
      <path
        d="M50 8 L85 24 V58 C85 75 70 88 50 92 C30 88 15 75 15 58 V24 L50 8 Z"
        stroke="url(#aegisGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)]"
      />

      {/* Inner Vetting Lattice Lines */}
      <path
        d="M50 15 L78 28 V56 C78 69 66 80 50 84 C34 80 22 69 22 56 V28 L50 15 Z"
        stroke="currentColor"
        strokeWidth="1"
        className="opacity-40 text-blue-400 dark:text-blue-500"
        strokeDasharray="4 2"
      />

      {/* Futuristic "A" chevron core */}
      <g filter={glow ? "url(#aegisGlowFilter)" : undefined}>
        {/* Left pillar of Chevron */}
        <path
          d="M50 28 L32 58 H41 L50 43 L59 58 H68 L50 28 Z"
          fill="url(#aegisGrad)"
          className="animate-pulse"
        />
        {/* Center security focal point node */}
        <circle
          cx="50"
          cy="48"
          r="4.5"
          fill="#ffffff"
          className="shadow-sm"
        />
        {/* Inner core lock dot */}
        <circle
          cx="50"
          cy="48"
          r="2"
          fill="#06b6d4"
        />
        {/* Sub-node horizontal locking bar */}
        <path
          d="M38 52 H62"
          stroke="url(#aegisGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-80"
        />
      </g>

      {/* Small tech corner accents */}
      <path d="M46 72 H54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-60 text-slate-400 dark:text-zinc-500" />
      <circle cx="50" cy="78" r="1.5" fill="url(#aegisGrad)" />
    </svg>
  );
}
