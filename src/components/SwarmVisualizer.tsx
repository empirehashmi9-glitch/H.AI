import React from 'react';
import { Layers, Network, Activity, Cpu, Shield, Zap } from 'lucide-react';

interface SwarmVisualizerProps {
  currentTps: number;
  isAssembling: boolean;
}

export const SwarmVisualizer: React.FC<SwarmVisualizerProps> = ({ currentTps, isAssembling }) => {
  const swarmNodesCount = Math.round((currentTps / 100000) * 100000);

  const sectors = [
    { name: 'Sector I: Spec & Architecture Swarm', nodes: Math.round(swarmNodesCount * 0.15), color: '#06b6d4' },
    { name: 'Sector II: UI/UX & Shader Swarm', nodes: Math.round(swarmNodesCount * 0.20), color: '#a855f7' },
    { name: 'Sector III: Full-Stack Code Synthesizer (React/Swift/Kotlin)', nodes: Math.round(swarmNodesCount * 0.35), color: '#3b82f6' },
    { name: 'Sector IV: Supabase DDL & RLS Security Swarm', nodes: Math.round(swarmNodesCount * 0.18), color: '#10b981' },
    { name: 'Sector V: ULTRON Self-Healing & QA Swarm', nodes: Math.round(swarmNodesCount * 0.12), color: '#f59e0b' }
  ];

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
            <Network className="w-4 h-4 text-cyan-400" />
            <span>100,000 Distributed Neural Swarm Topology</span>
          </div>
          <h3 className="text-xl font-bold text-white font-orbitron mt-0.5">
            Real-Time Node Distribution & Bandwidth
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 block">Total Active Nodes</span>
            <span className="text-emerald-400 font-bold text-sm">{swarmNodesCount.toLocaleString()} Nodes</span>
          </div>
          <div>
            <span className="text-slate-500 block">Cluster Bandwidth</span>
            <span className="text-cyan-400 font-bold text-sm">48.2 GB/s</span>
          </div>
          <div>
            <span className="text-slate-500 block">Inter-Agent Latency</span>
            <span className="text-purple-400 font-bold text-sm">&lt; 1.2ms</span>
          </div>
        </div>
      </div>

      {/* Visualizer Sectors Grid */}
      <div className="space-y-3">
        {sectors.map((sec, i) => (
          <div key={i} className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-white flex items-center gap-2">
                <span style={{ backgroundColor: sec.color }} className="w-2.5 h-2.5 rounded-full inline-block" />
                {sec.name}
              </span>
              <span className="font-mono text-slate-300 font-semibold">
                {sec.nodes.toLocaleString()} Nodes ({Math.round((sec.nodes / swarmNodesCount) * 100)}%)
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                style={{
                  width: `${(sec.nodes / swarmNodesCount) * 100}%`,
                  backgroundColor: sec.color
                }}
                className={`h-full rounded-full transition-all duration-300 ${isAssembling ? 'animate-pulse' : ''}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
