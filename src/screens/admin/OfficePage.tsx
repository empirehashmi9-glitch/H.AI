import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Boxes, Cpu, Gauge, MousePointer2, Sparkles, Timer, Zap } from 'lucide-react';
import { useApp } from '../../state/app';
import { Office3D, OFFICE_ROOMS } from '../../ui/Office3D';
import { ChibiRobot } from '../../ui/Chibi';
import { Btn, IconTile, Panel, Pill, ProgressBar, SectionHead, cx } from '../../ui/Toon';
import { calculateClusterMetrics } from '../../utils/orchestrator';
import { timeAgo } from '../../utils/storage';
import { AgentControls } from './AgentControls';

export const OfficePage: React.FC<{
  focusAgent: string | null;
  onFocusHandled: () => void;
}> = ({ focusAgent, onFocusHandled }) => {
  const { agents, generating, progress, stageMessage, projects, clusterScale, tickets } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(focusAgent);

  useEffect(() => {
    if (focusAgent) {
      setSelectedId(focusAgent);
      onFocusHandled();
    }
  }, [focusAgent, onFocusHandled]);

  const selected = agents.find((a) => a.id === selectedId) || null;
  const metrics = calculateClusterMetrics(clusterScale);
  const busy = agents.filter((a) => a.status !== 'idle' && a.status !== 'deployed' && a.status !== 'paused').length;

  const rooms = useMemo(
    () =>
      OFFICE_ROOMS.map((room) => ({
        ...room,
        list: agents.filter((a) => a.category === room.category),
      })),
    [agents],
  );

  return (
    <div className="space-y-4 sm:space-y-5">
      <SectionHead
        light
        eyebrow="Agent office"
        title="The isometric crew floor"
        sub="Nine rooms, thirty specialists, one orchestrator. Drag to orbit, use the mouse wheel or the ↑ ↓ / W S keys to move forward and back, tap a robot to inspect its live telemetry."
        right={
          <div className="flex flex-wrap gap-1.5">
            <Pill tone="dark" dot={generating ? '#FFC93C' : '#3DD9B3'}>
              {busy ? `${busy} on task` : 'all idle'}
            </Pill>
            <Pill tone="dark">
              <Boxes className="w-3 h-3" /> 9 rooms
            </Pill>
          </div>
        }
      />

      <Office3D
        agents={agents}
        selectedId={selectedId}
        onSelect={setSelectedId}
        building={generating}
      />

      <div className="grid xl:grid-cols-[1fr_320px] gap-4 items-start">
        <div className="space-y-3 min-w-0">
          <div className="grid sm:grid-cols-3 gap-2.5">
            {[
              { icon: <Activity className="w-4 h-4" />, label: 'Aggregate throughput', value: `${(metrics.aggregateThroughputTps / 1000).toFixed(1)}k tps`, tone: 'aqua' as const },
              { icon: <Timer className="w-4 h-4" />, label: 'Avg agent latency', value: '14 ms', tone: 'mint' as const },
              { icon: <Gauge className="w-4 h-4" />, label: 'Builds shipped', value: `${projects.length}`, tone: 'sun' as const },
            ].map((m) => (
              <Panel key={m.label} className="p-3 flex items-center gap-2.5">
                <IconTile tone={m.tone} className="w-9 h-9 rounded-lg">
                  {m.icon}
                </IconTile>
                <div className="min-w-0">
                  <div className="text-[9px] font-extrabold uppercase tracking-wider text-ink-soft truncate">{m.label}</div>
                  <div className="font-display text-lg leading-none mt-0.5">{m.value}</div>
                </div>
              </Panel>
            ))}
          </div>

          {generating && (
            <Panel className="p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold flex items-center gap-1.5 min-w-0 truncate">
                  <Zap className="w-3.5 h-3.5 shrink-0" /> {stageMessage}
                </span>
                <span className="font-mono text-xs font-bold">{Math.round(progress)}%</span>
              </div>
              <ProgressBar value={progress} tone="sun" striped />
            </Panel>
          )}

          <Panel className="p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-base leading-none">Rooms</h3>
              <Pill tone="cream">{agents.length} agents</Pill>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {rooms.map((room) => {
                const first = room.list[0];
                const working = room.list.filter((a) => a.status !== 'idle' && a.status !== 'deployed' && a.status !== 'paused').length;
                return (
                  <button
                    key={room.id}
                    onClick={() => first && setSelectedId(first.id)}
                    className={cx(
                      'w-full flex items-center gap-2 rounded-xl border-2 px-2.5 py-2 text-left transition',
                      room.list.some((a) => a.id === selectedId)
                        ? 'border-aqua/50 bg-aqua/10'
                        : 'border-white/10 bg-white/[0.04] hover:border-aqua/30',
                    )}
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-ink shrink-0" style={{ background: room.color }} />
                    <span className="text-[11px] font-extrabold flex-1 truncate">{room.label}</span>
                    <span className="font-mono text-[9px] font-bold text-ink-soft">{room.list.length}</span>
                    {working > 0 && <span className="status-dot" style={{ background: '#FFC93C' }} title="building" />}
                  </button>
                );
              })}
            </div>
          </Panel>

          <Panel className="p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base leading-none flex items-center gap-1.5">
                <Cpu className="w-4 h-4" /> Cluster
              </h3>
              <Pill tone="cream">{metrics.nodesCount} nodes</Pill>
            </div>
            <p className="text-[10px] font-semibold text-ink-soft">
              {metrics.normalizedScale.toLocaleString()} agents · {metrics.avgCpuPercent}% CPU · {tickets.length} tickets
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-aqua/10">
              <Pill tone="cream"><Sparkles className="w-3 h-3" /> autoscaler on</Pill>
              <span className="text-[9px] font-bold text-ink-soft">
                {projects[0] ? `Last build ${timeAgo(projects[0].timestamp, false)}` : 'No builds yet'}
              </span>
            </div>
          </Panel>
        </div>

        <div className="space-y-3">
          <Panel className="p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base leading-none flex items-center gap-1.5">
                <MousePointer2 className="w-4 h-4" /> Inspector
              </h3>
              {selected && (
                <Btn tone="cream" size="xs" onClick={() => setSelectedId(null)}>Clear</Btn>
              )}
            </div>

            {selected ? (
              <div className="space-y-3">
                <div className="rounded-xl border border-aqua/15 bg-white/[0.03] p-3 flex items-center gap-3">
                  <div className="shrink-0">
                    <ChibiRobot
                      size={66}
                      color={OFFICE_ROOMS.find((r) => r.category === selected.category)?.color || '#FF7A8A'}
                      accent={selected.status === 'idle' ? '#FFF7EC' : '#FFC93C'}
                      mood={selected.status === 'deployed' ? 'wink' : selected.status === 'idle' ? 'happy' : 'focus'}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] font-bold text-ink-soft">agent #{selected.number}</div>
                    <div className="font-display text-sm leading-tight">{selected.name}</div>
                    <p className="text-[10px] font-semibold text-ink-soft leading-snug mt-0.5">{selected.role}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <Pill tone={selected.status === 'paused' ? 'coral' : selected.status === 'idle' ? 'cream' : selected.status === 'deployed' ? 'mint' : 'sun'}>
                    {selected.status}
                  </Pill>
                  <Pill tone="grape">{selected.category.replace('_', ' · ')}</Pill>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Tasks done', value: selected.tasksCompleted.toLocaleString() },
                    { label: 'Throughput', value: `${selected.throughputTps} tps` },
                    { label: 'Latency', value: `${selected.latencyMs} ms` },
                    {
                      label: 'Health',
                      value: selected.status === 'idle' ? 'standby' : selected.status === 'paused' ? 'paused' : `${selected.progress}%`,
                    },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-aqua/15 bg-white/[0.03] px-2.5 py-2">
                      <div className="text-[8px] font-extrabold uppercase tracking-wider text-ink-soft">{s.label}</div>
                      <div className="font-display text-sm leading-tight">{s.value}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between text-[9px] font-extrabold uppercase tracking-wider text-ink-soft mb-1">
                    <span>Current task</span>
                    {selected.status !== 'idle' && (
                      <span className="normal-case tracking-normal font-bold">{selected.progress}%</span>
                    )}
                  </div>
                  <p className="text-[10px] font-semibold text-ink-soft leading-relaxed mb-1.5">
                    {selected.status === 'idle'
                      ? 'Standing by — assign a task below or let the orchestrator queue one.'
                      : selected.currentTask}
                  </p>
                  {selected.status !== 'idle' && (
                    <ProgressBar
                      value={selected.progress}
                      tone={selected.status === 'paused' ? 'coral' : 'sun'}
                      height="h-2.5"
                    />
                  )}
                </div>

                <div className="pt-2 border-t border-aqua/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-ink-soft">Agent controls</span>
                    <span className="text-[9px] font-bold text-ink-soft">admin access</span>
                  </div>
                  <AgentControls agent={selected} />
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-2">
                <div className="w-16 mx-auto">
                  <ChibiRobot size={64} color="#6C4CF1" accent="#FFC93C" mood="focus" />
                </div>
                <p className="text-xs font-extrabold">Tap any robot</p>
                <p className="text-[10px] font-semibold text-ink-soft leading-relaxed max-w-[220px] mx-auto">
                  You will see its role, live task, throughput and health. The orchestrator is #1.
                </p>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
};
