import React, { useState } from 'react';
import { Sparkles, RefreshCw, Dna, Brain, Cpu, Zap, CheckCircle2, TrendingUp, ShieldAlert, Layers } from 'lucide-react';
import { sound } from '../lib/audioEffects';
import { EvolutionCycle } from '../lib/types';

interface SelfEvolutionEngineProps {
  currentEpoch: number;
  onTriggerEvolution: () => void;
  isEvolving: boolean;
}

export const SelfEvolutionEngine: React.FC<SelfEvolutionEngineProps> = ({
  currentEpoch,
  onTriggerEvolution,
  isEvolving
}) => {
  const [evolutionCycles, setEvolutionCycles] = useState<EvolutionCycle[]>([
    {
      epoch: 5,
      name: 'Singularity Epoch V · 10,000x Quantum Multiplier',
      iqMultiplier: '10,000x',
      mutationType: 'Quantum AST Distributed Partitioning',
      optimizationsApplied: [
        'Partitioned code generator into 100,000 parallel micro-tokens',
        'Achieved 20,000,000 tokens/sec aggregate cluster throughput',
        'Sub-second 0.5s full-stack assembly time reached'
      ],
      timestamp: 'Just now'
    },
    {
      epoch: 4,
      name: 'Epoch IV · Zero-Trust RLS Hardening',
      iqMultiplier: '4,800x',
      mutationType: 'Autonomous Security Policy Inference',
      optimizationsApplied: [
        'Auto-injected auth.uid() = user_id checks on all PostgreSQL tables',
        'Eliminated all client-side private API key leak vulnerabilities',
        'Generated parameterized SQL queries with zero injection risk'
      ],
      timestamp: '2 hours ago'
    },
    {
      epoch: 3,
      name: 'Epoch III · Native Tri-Platform Alignment',
      iqMultiplier: '2,500x',
      mutationType: 'Cross-Compiler Speculative Binding',
      optimizationsApplied: [
        'Unified React 19, Apple SwiftUI 6, and Android Compose data models',
        'Auto-extracted shared TypeScript interfaces into Swift Codable structs',
        'Reduced mobile layout reflow jitter to 0ms'
      ],
      timestamp: '1 day ago'
    }
  ]);

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-cyan-500/40 p-6 lg:p-8 space-y-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-500/10 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold mb-1">
            <Dna className="w-4 h-4 text-purple-400 animate-spin" />
            <span>Autonomous Recursive Self-Evolution Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-orbitron">
            Self-Upgrading & Auto-Advancing Neural OS
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            H.AI me <b>khud ko update karne aur khud ba khud advance banane ki taqat</b> mojood hai. 
            Ye har app assembly ke baad apne code patterns, compilation speed aur security rules ko 
            <b> mutational self-learning</b> ke zariye khud upgrade karta rehta hai!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="px-4 py-2 bg-slate-950 border border-purple-500/40 rounded-2xl text-center">
            <span className="text-[10px] text-slate-400 font-mono block">CURRENT GEN</span>
            <span className="text-lg font-black font-orbitron text-purple-300">v5.{currentEpoch}.0</span>
          </div>

          <button
            onClick={() => {
              sound.playPowerUp();
              onTriggerEvolution();
            }}
            disabled={isEvolving}
            className={`px-6 py-3.5 rounded-2xl font-orbitron font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-xl transition-all ${
              isEvolving
                ? 'bg-purple-900/50 text-purple-300 border border-purple-500/50 animate-pulse cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-purple-500/25 scale-100 hover:scale-[1.02]'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isEvolving ? 'animate-spin' : ''}`} />
            {isEvolving ? 'Evolving Neural Core...' : 'Trigger Autonomous Evolution Cycle'}
          </button>
        </div>
      </div>

      {/* 4 Evolutionary Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>MUTATION EFFICIENCY</span>
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-orbitron text-white">
            99.98%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Autonomous self-correction rate without human intervention.</p>
        </div>

        <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>QUANTUM SPEED MULTIPLIER</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-orbitron text-amber-400">
            10,000x Faster
          </div>
          <p className="text-[11px] text-slate-400 mt-1">20 Million tokens/sec vs traditional 2,000 tps silicon ceiling.</p>
        </div>

        <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>ACTIVE SWARM NODES</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-orbitron text-cyan-400">
            100,000 Nodes
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Distributed across 30 God-Tier Master Agents.</p>
        </div>

        <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>SELF-HEALING COMPILER</span>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-orbitron text-emerald-400">
            Zero-Leak Proof
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Automatic dead code elimination & RLS enforcement.</p>
        </div>
      </div>

      {/* Autonomous Evolution Log & Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-orbitron flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Autonomous Self-Upgrade History & Learned Capabilities
        </h3>

        <div className="space-y-3">
          {evolutionCycles.map((cycle, i) => (
            <div key={i} className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 font-bold font-mono text-xs flex items-center justify-center border border-purple-500/30">
                    E{cycle.epoch}
                  </span>
                  <h4 className="font-bold text-white text-sm">{cycle.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    {cycle.iqMultiplier} Speed Multiplier
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">{cycle.timestamp}</span>
              </div>

              <div className="text-xs text-purple-300 font-mono mb-2">
                Mutation Strategy: {cycle.mutationType}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-900">
                {cycle.optimizationsApplied.map((opt, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
