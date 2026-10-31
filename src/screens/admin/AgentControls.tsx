import React, { useMemo, useState } from 'react';
import {
  ArrowRight, CheckCircle2, Pause, Play, RotateCcw, Search, Send, SlidersHorizontal,
} from 'lucide-react';
import { SpecializedAgent } from '../../types/agent';
import { useApp } from '../../state/app';
import { toast } from '../../components/Toast';
import { ChibiRobot } from '../../ui/Chibi';
import { Btn, IconTile, Panel, Pill, ProgressBar } from '../../ui/Toon';
import { OFFICE_ROOMS } from '../../ui/Office3D';

const agentColor = (agent: SpecializedAgent) =>
  OFFICE_ROOMS.find((r) => r.category === agent.category)?.color || '#6FD6FF';

const statusTone = (status: SpecializedAgent['status']) =>
  status === 'paused' ? 'coral' : status === 'deployed' ? 'mint' : status === 'idle' ? 'cream' : 'sun';

const statusLabel = (status: SpecializedAgent['status']) =>
  status === 'optimizing' ? 'tuning' : status;

export const AgentControls: React.FC<{ agent: SpecializedAgent }> = ({ agent }) => {
  const { updateAgent } = useApp();
  const [task, setTask] = useState('');
  const paused = agent.status === 'paused';

  const assign = () => {
    const next = task.trim();
    if (!next) {
      toast.error('Write a task first');
      return;
    }
    updateAgent(agent.id, { currentTask: next, status: 'synthesizing', progress: 5 });
    setTask('');
    toast.success(`Agent #${agent.number} picked up the task`);
  };

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-3 gap-1.5">
        <Btn
          size="xs"
          tone={paused ? 'mint' : 'sun'}
          onClick={() =>
            updateAgent(agent.id, paused
              ? { status: 'analyzing', currentTask: 'Back on the floor', progress: 10 }
              : { status: 'paused' })
          }
        >
          {paused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          {paused ? 'Resume' : 'Pause'}
        </Btn>
        <Btn
          size="xs"
          tone="cream"
          onClick={() => updateAgent(agent.id, { status: 'deployed', progress: 100, currentTask: 'Deployed · standing by' })}
        >
          <CheckCircle2 className="w-3 h-3" /> Deploy
        </Btn>
        <Btn
          size="xs"
          tone="cream"
          onClick={() => updateAgent(agent.id, { status: 'idle', progress: 0, currentTask: 'Standing by' })}
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </Btn>
      </div>
      <div className="flex gap-1.5">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') assign();
          }}
          placeholder="Assign a task to this agent…"
          aria-label={`Assign task to agent ${agent.number}`}
          className="field py-1.5 text-[11px]"
        />
        <Btn size="sm" tone="grape" onClick={assign} aria-label="Assign task">
          <Send className="w-3.5 h-3.5" />
        </Btn>
      </div>
    </div>
  );
};

export const AgentAccessPanel: React.FC<{ onOpenOffice: (agentId?: string) => void }> = ({ onOpenOffice }) => {
  const { agents, updateAgent } = useApp();
  const [query, setQuery] = useState('');
  const pausedCount = agents.filter((a) => a.status === 'paused').length;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return agents;
    return agents.filter((a) =>
      `${a.number} ${a.name} ${a.role} ${a.category}`.toLowerCase().includes(q),
    );
  }, [agents, query]);

  return (
    <Panel className="p-4 sm:p-5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <IconTile tone="grape" className="w-9 h-9 rounded-lg">
            <SlidersHorizontal className="w-4 h-4" />
          </IconTile>
          <div>
            <h3 className="text-base leading-none">Agent access</h3>
            <p className="text-[10px] font-bold text-ink-soft">pause, resume, deploy or assign any of the 30 specialists</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Pill tone={pausedCount ? 'coral' : 'cream'}>{pausedCount} paused</Pill>
          <Pill tone="cream">{agents.length} agents</Pill>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-soft" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find an agent by name, role or number…"
          aria-label="Search agents"
          className="field pl-9 py-2 text-xs"
        />
      </div>

      <div className="relative">
        <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
          {list.map((agent) => {
          const paused = agent.status === 'paused';
          const done = agent.status === 'deployed';
          return (
            <div key={agent.id} className="rounded-xl border border-aqua/12 bg-white/[0.03] p-2.5">
              <div className="flex items-center gap-2">
                <span className="w-8 shrink-0">
                  <ChibiRobot
                    size={30}
                    color={agentColor(agent)}
                    accent={paused ? '#FF7A8A' : done ? '#3DD9B3' : '#FFC93C'}
                    mood={done ? 'wink' : paused ? 'happy' : 'focus'}
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-extrabold truncate">
                    <span className="font-mono text-aqua/70">#{agent.number}</span> {agent.name}
                  </div>
                  <div className="text-[9.5px] font-semibold text-ink-soft truncate">{agent.role}</div>
                </div>
                <Pill tone={statusTone(agent.status) as any}>{statusLabel(agent.status)}</Pill>
                <button
                  type="button"
                  onClick={() =>
                    updateAgent(agent.id, paused
                      ? { status: 'analyzing', currentTask: 'Back on the floor', progress: 10 }
                      : { status: 'paused' })
                  }
                  aria-label={paused ? `Resume agent ${agent.number}` : `Pause agent ${agent.number}`}
                  title={paused ? 'Resume' : 'Pause'}
                  className="w-7 h-7 shrink-0 rounded-lg border border-white/15 bg-white/[0.05] text-ink-soft hover:text-ink hover:border-aqua/40 grid place-items-center transition"
                >
                  {paused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenOffice(agent.id)}
                  aria-label={`Open controls for agent ${agent.number}`}
                  title="Open in office inspector"
                  className="w-7 h-7 shrink-0 rounded-lg border border-aqua/25 bg-aqua/[0.08] text-aqua hover:bg-aqua/15 grid place-items-center transition"
                >
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              {agent.status === 'idle' ? (
                <div className="mt-1.5 text-[9px] font-semibold text-ink-soft">Standing by · ready for a task</div>
              ) : (
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-[9px] font-semibold text-ink-soft truncate flex-1">{agent.currentTask}</span>
                  <span className="font-mono text-[9px] text-ink-soft">{agent.progress}%</span>
                  <span className="w-16 shrink-0">
                    <ProgressBar value={agent.progress} tone={paused ? 'coral' : done ? 'mint' : 'aqua'} height="h-1.5" />
                  </span>
                </div>
              )}
            </div>
          );
        })}
        {!list.length && (
          <p className="py-6 text-center text-xs font-semibold text-ink-soft">No agent matches “{query}”.</p>
        )}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-[#06151d] to-transparent" />
      </div>
      <div className="flex items-center justify-between text-[9px] font-bold text-ink-soft pt-0.5">
        <span>{query.trim() ? `${list.length} of ${agents.length} match` : `${agents.length} agents`}</span>
        <span>{pausedCount ? `${pausedCount} paused · tap play to resume` : 'Scroll to browse · search to filter'}</span>
      </div>
    </Panel>
  );
};
