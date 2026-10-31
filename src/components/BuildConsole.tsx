import React, { useRef, useEffect } from 'react';
import { Terminal, Shield, CheckCircle, Activity, Sparkles } from 'lucide-react';

interface BuildLog {
  timestamp: string;
  agent: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'system';
}

interface BuildConsoleProps {
  logs: BuildLog[];
  overallProgress: number;
  currentPhase: string;
  isBuilding: boolean;
}

export const BuildConsole: React.FC<BuildConsoleProps> = ({
  logs,
  overallProgress,
  currentPhase,
  isBuilding
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 flex flex-col h-72 sm:h-80 overflow-hidden font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-slate-400 font-bold ml-2 text-[11px] flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" /> J.A.R.V.I.S. MULTI-AGENT TELEMETRY BUS
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-cyan-400 font-bold">
            {overallProgress}% COMPLETE
          </span>
          <span className={`w-2 h-2 rounded-full ${isBuilding ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`} />
        </div>
      </div>

      {/* Terminal Output */}
      <div ref={scrollContainerRef} className="flex-1 p-3.5 overflow-y-auto space-y-1.5 text-slate-300">
        {logs.map((log, index) => {
          let color = 'text-cyan-400';
          if (log.type === 'success') color = 'text-emerald-400';
          if (log.type === 'warn') color = 'text-amber-400';
          if (log.type === 'system') color = 'text-purple-400 font-bold';

          return (
            <div key={index} className="flex items-start gap-2 leading-relaxed">
              <span className="text-slate-600 shrink-0 select-none">{log.timestamp}</span>
              <span className="text-slate-400 font-bold shrink-0">[{log.agent}]</span>
              <span className={color}>{log.message}</span>
            </div>
          );
        })}
      </div>

      {/* Terminal Status Footer */}
      <div className="bg-slate-900/60 px-4 py-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="truncate">
          Current Stage: <span className="text-cyan-300 font-semibold">{currentPhase}</span>
        </span>
        <span className="text-slate-500 shrink-0">30 Parallel Agents Attached</span>
      </div>
    </div>
  );
};
