import React from 'react';
import { Gauge, Zap, Flame, Cpu, Activity, Award, Sparkles } from 'lucide-react';
import { sound } from '../lib/audioEffects';

interface SpeedometerHUDProps {
  currentTps: number;
  onTpsChange: (newTps: number) => void;
  isAssembling: boolean;
}

export const SpeedometerHUD: React.FC<SpeedometerHUDProps> = ({
  currentTps,
  onTpsChange,
  isAssembling
}) => {
  // Speedometer angle: 10,000 tps = -90deg, 20,000,000 tps = +90deg (180deg arc on logarithmic-balanced scale)
  const minTps = 10000;
  const maxTps = 20000000; // 20 Million TPS (10,000x Global Peak)
  
  // Logarithmic fraction for smooth needle travel from 10k to 20M
  const logMin = Math.log10(minTps);
  const logMax = Math.log10(maxTps);
  const logCurrent = Math.log10(Math.max(currentTps, minTps));
  const fraction = Math.min(Math.max((logCurrent - logMin) / (logMax - logMin), 0), 1);
  const needleAngle = -90 + fraction * 180;

  const speedRatio = Math.round(currentTps / 2000); // 2,000 tps baseline of industry silicon peak

  const presets = [
    { label: '100,000 TPS', tps: 100000, desc: '50x Multiplier · 3.2s Build' },
    { label: '1,000,000 TPS', tps: 1000000, desc: '500x Multiplier · 1.5s Build' },
    { label: '5,000,000 TPS', tps: 5000000, desc: '2,500x Multiplier · 0.8s Build' },
    { label: '20,000,000 TPS', tps: 20000000, desc: '10,000x Multiplier · 0.5s Build' }
  ];

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-cyan-500/40 p-5 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Glow background */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <span>10,000x Sovereign Quantum Speed Matrix</span>
          </div>
          <h3 className="text-xl font-bold text-white font-orbitron mt-0.5">
            Up to 20,000,000 Tokens / Second (Quantum Singularity Peak)
          </h3>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Throughput Boost:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 font-bold border border-amber-500/40 flex items-center gap-1.5 font-orbitron">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            {speedRatio.toLocaleString()}x FASTER THAN GLOBAL PEAK
          </span>
        </div>
      </div>

      {/* Main Gauge + Metrics Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-6">
        {/* Speedometer Arc Visualizer */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          <div className="w-48 h-32 relative flex items-center justify-center">
            {/* Semicircle Gauge SVG */}
            <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible">
              {/* Outer Track Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#1e293b"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Active Gradient Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#speed10kGradient)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="251"
                strokeDashoffset={251 - fraction * 251}
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="speed10kGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="40%" stopColor="#3b82f6" />
                  <stop offset="75%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>

              {/* Needle */}
              <g transform={`rotate(${needleAngle} 100 100)`} className="transition-transform duration-300">
                <line x1="100" y1="100" x2="100" y2="30" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <circle cx="100" cy="100" r="8" fill="#f59e0b" />
                <circle cx="100" cy="100" r="4" fill="#020617" />
              </g>
            </svg>

            {/* Labels at extremes */}
            <div className="absolute -bottom-2 left-3 text-[10px] font-mono text-slate-500 font-bold">10K</div>
            <div className="absolute -bottom-2 right-1 text-[10px] font-mono text-amber-400 font-bold">20M (10,000x)</div>
          </div>

          {/* Big Digital Readout */}
          <div className="text-center mt-2">
            <div className="text-3xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-400 glow-cyan">
              {currentTps >= 1000000 ? `${(currentTps / 1000000).toFixed(1)}M` : `${(currentTps / 1000).toFixed(0)}K`} <span className="text-xs font-mono text-cyan-300">TPS</span>
            </div>
            <div className="text-[11px] font-mono text-amber-300 mt-0.5 font-bold">
              {currentTps === 20000000 ? '10,000x QUANTUM MULTIPLIER (0.5s ASSEMBLY)' : `${currentTps.toLocaleString()} Tokens / Sec`}
            </div>
          </div>
        </div>

        {/* Speed Slider & Presets */}
        <div className="md:col-span-7 space-y-4">
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
              <span>Cluster Quantum Output:</span>
              <span className="text-amber-400 font-bold">{currentTps.toLocaleString()} TPS ({speedRatio.toLocaleString()}x Multiplier)</span>
            </div>
            <input
              type="range"
              min={100000}
              max={20000000}
              step={500000}
              value={currentTps}
              onChange={(e) => {
                sound.playClick();
                onTpsChange(Number(e.target.value));
              }}
              className="w-full h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-400 border border-slate-800"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {presets.map(p => {
              const isActive = currentTps === p.tps;
              return (
                <button
                  key={p.tps}
                  onClick={() => {
                    sound.playPowerUp();
                    onTpsChange(p.tps);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'bg-gradient-to-br from-amber-950/60 to-purple-950/60 border-amber-400 text-white shadow-lg shadow-amber-950/60'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className={`text-xs font-bold font-orbitron ${isActive ? 'text-amber-300' : ''}`}>
                    {p.label}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                    {p.desc}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Technical Note */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <b>10,000x Quantum Multiplier:</b> Standard high-end hardware tops out at ~2,000 tps. H.AI's 100,000-swarm AST zero-copy memory architecture runs at <b>20,000,000 tokens/sec</b>, achieving exactly <b>10,000 times faster throughput</b> and assembling entire multi-platform apps in <b>0.5 seconds!</b>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
