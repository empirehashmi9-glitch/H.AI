import React, { useState } from 'react';
import { SpecialistAgent } from '../lib/types';
import { Shield, CheckCircle2, Clock, AlertCircle, Terminal, Layers, Dna, Brain, Sparkles } from 'lucide-react';
import { sound } from '../lib/audioEffects';

interface AgentsGridProps {
  agents: SpecialistAgent[];
  onSelectAgent?: (agent: SpecialistAgent) => void;
}

export const AgentsGrid: React.FC<AgentsGridProps> = ({ agents, onSelectAgent }) => {
  const [selectedSquad, setSelectedSquad] = useState<string>('all');
  const [activeAgentLogs, setActiveAgentLogs] = useState<SpecialistAgent | null>(null);

  const squads = ['all', 'Strategy & Spec', 'UI & UX Design', 'Full-Stack Code', 'Database & API', 'QA & DevOps'];

  const filteredAgents = selectedSquad === 'all'
    ? agents
    : agents.filter(a => a.squad === selectedSquad);

  return (
    <div className="space-y-6">
      {/* Squad Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <Dna className="w-4 h-4 text-purple-400" />
            <span>Gen-5 Quantum Singularity Architecture</span>
          </div>
          <h2 className="text-xl font-bold text-white font-orbitron flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            30 Full-Advance God-Tier Autonomous Agents
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Every agent possesses self-learning neural weights, AST self-correction, and zero-day immunity.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          {squads.map(squad => (
            <button
              key={squad}
              onClick={() => {
                sound.playClick();
                setSelectedSquad(squad);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedSquad === squad
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {squad === 'all' ? 'All 30 God-Tier Agents' : squad}
            </button>
          ))}
        </div>
      </div>

      {/* Agents Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {filteredAgents.map(agent => {
          const isBusy = agent.status === 'analyzing' || agent.status === 'coding' || agent.status === 'verifying';
          const isDone = agent.status === 'complete';

          return (
            <div
              key={agent.id}
              onClick={() => {
                sound.playClick();
                setActiveAgentLogs(agent);
                if (onSelectAgent) onSelectAgent(agent);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                isBusy
                  ? 'bg-purple-950/40 border-purple-400 shadow-lg shadow-purple-950/50'
                  : isDone
                  ? 'bg-slate-900/80 border-cyan-500/40 hover:border-cyan-400'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] font-bold text-amber-300 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800">
                    {agent.codename}
                  </span>
                  <span className="text-[10px] font-mono text-purple-300 font-bold flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                    {agent.selfLearningScore}% IQ
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                  {agent.name}
                </h3>
                <div className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                  {agent.role}
                </div>

                {/* Autonomous Capabilities Pill */}
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {agent.autonomousCapabilities.slice(0, 2).map((cap, i) => (
                    <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/50 text-cyan-300 border border-cyan-500/20 truncate max-w-full">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 truncate max-w-[100px] font-mono">
                  {agent.evolutionLevel.split(' ')[0]}
                </span>
                <span className="font-mono text-emerald-400 font-semibold">
                  Self-Evolving
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent Logs & Neural Inspection Modal */}
      {activeAgentLogs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 text-slate-950 flex items-center justify-center font-bold font-mono">
                  {activeAgentLogs.codename.slice(0, 3)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{activeAgentLogs.name}</h3>
                  <p className="text-xs text-purple-300 font-mono">
                    {activeAgentLogs.evolutionLevel} · {activeAgentLogs.squad}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveAgentLogs(null)}
                className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              >
                Close
              </button>
            </div>

            {/* Neural Capabilities */}
            <div className="space-y-2 mb-4">
              <div className="text-xs text-slate-400 font-mono">Autonomous Self-Upgraded Capabilities:</div>
              <div className="flex flex-wrap gap-1.5">
                {activeAgentLogs.autonomousCapabilities.map((cap, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-xl bg-slate-950 border border-purple-500/30 text-purple-200 font-mono font-semibold">
                    ✓ {cap}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-xs text-slate-400 font-mono">Current Task:</div>
              <div className="text-sm font-semibold text-white bg-slate-950 p-3 rounded-xl border border-slate-800">
                {activeAgentLogs.currentTask}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> Neural Weight Logs & Telemetry:
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 space-y-1.5 max-h-48 overflow-y-auto">
                {activeAgentLogs.logs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-slate-600 select-none">[{i + 1}]</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
