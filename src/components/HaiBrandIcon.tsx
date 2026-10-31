import React from 'react';

interface HaiBrandIconProps {
  size?: number;
  className?: string;
  glow?: boolean;
  animated?: boolean;
}

export const HaiBrandIcon: React.FC<HaiBrandIconProps> = ({
  size = 36,
  className = '',
  glow = true,
  animated = false
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Radial Aura Glow */}
      {glow && (
        <div 
          className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500/30 via-purple-500/25 to-cyan-400/30 blur-md -z-10 transform scale-110"
        />
      )}

      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full select-none ${animated ? 'transition-transform duration-300 hover:scale-105' : ''}`}
      >
        <defs>
          {/* Main Shield / Hex Facet Gradients */}
          <linearGradient id="haiBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#0b0f19" />
            <stop offset="100%" stopColor="#04060b" />
          </linearGradient>

          <linearGradient id="haiBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="35%" stopColor="#a855f7" />
            <stop offset="70%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          <linearGradient id="haiPillarGradLeft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>

          <linearGradient id="haiPillarGradRight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <linearGradient id="haiCrossbarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          <radialGradient id="coreSpark" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <filter id="haiDropGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6366f1" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Outer Isometric Faceted Chassis (Beveled Rounded Hex-Shield) */}
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="24"
          fill="url(#haiBgGrad)"
          stroke="url(#haiBorderGrad)"
          strokeWidth="3.5"
          filter="url(#haiDropGlow)"
        />

        {/* Geometric Microgrid Background Details */}
        <path
          d="M 24 16 L 24 84 M 76 16 L 76 84 M 16 50 L 84 50"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        {/* Outer Quantum Synapse Ring (Orbit Ring) */}
        <ellipse
          cx="50"
          cy="50"
          rx="36"
          ry="15"
          transform="rotate(-28 50 50)"
          stroke="url(#haiBorderGrad)"
          strokeWidth="1.2"
          strokeOpacity="0.6"
          strokeDasharray="4 6"
        />

        {/* Quantum Orbital Node Beads */}
        <circle cx="21" cy="35" r="2.8" fill="#38bdf8" />
        <circle cx="79" cy="65" r="2.8" fill="#a855f7" />

        {/* ======================================================== */}
        {/* THE UNIQUE "H.AI" MONOGRAM EMBLEM */}
        {/* ======================================================== */}

        {/* Left Neural Pillar of 'H' */}
        <path
          d="M 28 26 L 38 26 L 38 74 L 28 74 Z"
          fill="url(#haiPillarGradLeft)"
          rx="3"
        />
        {/* Left Pillar Accents & Nodes */}
        <circle cx="33" cy="28" r="2.5" fill="#c7d2fe" />
        <circle cx="33" cy="72" r="2.5" fill="#4338ca" />
        <line x1="33" y1="32" x2="33" y2="68" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />

        {/* Right Neural Pillar of 'H' */}
        <path
          d="M 62 26 L 72 26 L 72 74 L 62 74 Z"
          fill="url(#haiPillarGradRight)"
          rx="3"
        />
        {/* Right Pillar Accents & Nodes */}
        <circle cx="67" cy="28" r="2.5" fill="#a7f3d0" />
        <circle cx="67" cy="72" r="2.5" fill="#047857" />
        <line x1="67" y1="32" x2="67" y2="68" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />

        {/* Cyber Bridge / Crossbar of 'H' connecting with Quantum Hub */}
        <path
          d="M 36 45 L 64 45 L 64 55 L 36 55 Z"
          fill="url(#haiCrossbarGrad)"
          rx="2"
        />

        {/* Central Neural Hub / Singularity Diamond */}
        <path
          d="M 50 36 L 61 50 L 50 64 L 39 50 Z"
          fill="#0a0e1a"
          stroke="url(#haiBorderGrad)"
          strokeWidth="2.5"
        />

        {/* Glowing AI Core Singularity */}
        <circle
          cx="50"
          cy="50"
          r="6.5"
          fill="url(#coreSpark)"
        />

        {/* Central 4-Point Radiant AI Core Spark */}
        <path
          d="M 50 42 Q 50 50 42 50 Q 50 50 50 58 Q 50 50 58 50 Q 50 50 50 42 Z"
          fill="#ffffff"
        />

        {/* Micro Dot - The Dot in "H.AI" */}
        <circle
          cx="79"
          cy="74"
          r="4"
          fill="#10b981"
          stroke="#059669"
          strokeWidth="1.5"
        />
        <circle
          cx="79"
          cy="74"
          r="1.8"
          fill="#ffffff"
        />
      </svg>
    </div>
  );
};
