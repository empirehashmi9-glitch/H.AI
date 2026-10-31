import React, { useMemo } from 'react';
import {
  Activity, ArrowRight, Boxes, CheckCircle2, Clock3, Cpu, Globe2, HardDrive,
  Headphones, Rocket, Server, Sparkles, Star, TrendingUp, TriangleAlert, Users, Zap,
} from 'lucide-react';
import { useApp } from '../../state/app';
import { ChibiRobot } from '../../ui/Chibi';
import { Btn, IconTile, Panel, Pill, ProgressBar, SectionHead, StatCard, cx } from '../../ui/Toon';
import { INITIAL_NODES, calculateClusterMetrics } from '../../utils/orchestrator';
import { timeAgo } from '../../utils/storage';
import { AgentAccessPanel } from './AgentControls';

const statusTone = (status?: string) =>
  status === 'live' ? 'mint' : status === 'failed' ? 'coral' : status === 'deploying' ? 'sun' : 'cream';

const PRESETS = [
  { label: '30', val: 30, note: 'baseline' },
  { label: '10k', val: 10000, note: 'enterprise' },
  { label: '50k', val: 50000, note: 'high load' },
  { label: '100k', val: 100000, note: 'supercluster' },
];

export const DashboardPage: React.FC<{
  onOpenOffice: (agentId?: string) => void;
  onOpenBuilds: () => void;
  onOpenSupport: () => void;
}> = ({ onOpenOffice, onOpenBuilds, onOpenSupport }) => {
  const {
    projects, tickets, feedback, agents, clusterScale, setClusterScale,
    generating, progress, stageMessage, updateTicket, openProject, setMode,
  } = useApp();

  const metrics = calculateClusterMetrics(clusterScale);

  const data = useMemo(() => {
    const live = projects.filter((p) => p.status === 'live').length;
    const files = projects.reduce((s, p) => s + (p.files?.length || 0), 0);
    const ratings = feedback.map((f) => f.rating);
    const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '—';
    const open = tickets.filter((t) => t.status !== 'resolved');
    const escalated = tickets.filter((t) => t.status === 'escalated');
    const working = agents.filter((a) => a.status !== 'idle' && a.status !== 'deployed' && a.status !== 'paused').length;
    const paused = agents.filter((a) => a.status === 'paused').length;
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - (6 - i));
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      return {
        label: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
        count: projects.filter((p) => {
          const t = new Date(p.timestamp).getTime();
          return t >= d.getTime() && t < next.getTime();
        }).length,
      };
    });
    return { live, files, avg, open, escalated, working, paused, days };
  }, [projects, tickets, feedback, agents]);

  const maxDay = Math.max(1, ...data.days.map((d) => d.count));
  const queue = [...data.escalated, ...data.open.filter((t) => t.status === 'pending')].slice(0, 4);
  const nodeShare = metrics.normalizedScale / 100000;
  const nodeLoads = INITIAL_NODES.map((node) => ({
    ...node,
    running: Math.max(1, Math.round(node.agentsRunning * nodeShare)),
  }));
  const nodeTotal = nodeLoads.reduce((s, n) => s + n.running, 0) || 1;

  const openBuild = (id: string) => {
    openProject(id);
    setMode('customer');
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <SectionHead
        light
        eyebrow="Live platform"
        title="Command deck"
        sub="Every build, ticket, rating and agent in one room. Scroll for the cluster, the crew and anything that needs a human."
        right={
          <div className="flex items-center gap-2">
            <Pill tone="dark" dot={generating ? '#FFC93C' : '#3DD9B3'}>
              {generating ? 'Crew building' : 'Idle & healthy'}
            </Pill>
            <Pill tone="dark">
              <Server className="w-3 h-3" /> {metrics.normalizedScale.toLocaleString()} / 100k
            </Pill>
          </div>
        }
      />

      {generating && (
        <Panel className="p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <IconTile tone="sun" className="w-8 h-8 rounded-lg anim-wiggle">
                <Zap className="w-4 h-4" />
              </IconTile>
              <p className="text-xs font-extrabold truncate">{stageMessage}</p>
            </div>
            <span className="font-mono text-xs font-bold shrink-0">{Math.round(progress)}%</span>
          </div>
          <ProgressBar value={progress} tone="sun" striped />
        </Panel>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total builds" value={projects.length} sub={`${data.files} generated files`} icon={<Rocket className="w-5 h-5" />} tone="coral" />
        <StatCard label="Live deploys" value={data.live} sub="Vercel + Supabase" icon={<Globe2 className="w-5 h-5" />} tone="mint" />
        <StatCard label="Open tickets" value={data.open.length} sub={`${data.escalated.length} escalated`} icon={<Headphones className="w-5 h-5" />} tone="sun" />
        <StatCard label="Avg rating" value={data.avg} sub={`${feedback.length} signals`} icon={<Star className="w-5 h-5" />} tone="grape" />
      </div>

      <div className="grid lg:grid-cols-[1.35fr_1fr] gap-4 items-start">
        <Panel className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <IconTile tone="aqua" className="w-8 h-8 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </IconTile>
              <div>
                <h3 className="text-base leading-none">Factory output</h3>
                <p className="text-[10px] font-bold text-ink-soft">builds per day · last 7 days</p>
              </div>
            </div>
            <Pill tone="cream">{projects.length} total</Pill>
          </div>

          <div className="flex items-end gap-2 h-36 pt-2">
            {data.days.map((d, i) => {
              const pct = Math.max(6, Math.round((d.count / maxDay) * 100));
              const tones = ['bg-coral', 'bg-sun', 'bg-mint', 'bg-aqua', 'bg-berry', 'bg-grape', 'bg-coral'];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                  <span className="font-mono text-[10px] font-bold text-ink-soft">{d.count}</span>
                  <div className="w-full h-24 flex items-end">
                    <div
                      className={cx('w-full rounded-t-md', d.count === 0 ? 'bg-white/10' : tones[i % tones.length])}
                      style={{ height: `${pct}%` }}
                      title={`${d.count} builds`}
                    />
                  </div>
                  <span className="text-[9px] font-extrabold uppercase text-ink-soft">{d.label}</span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-ink-soft">
            <span className="inline-flex items-center gap-1"><HardDrive className="w-3 h-3" /> {data.files} files</span>
            <span className="inline-flex items-center gap-1"><Star className="w-3 h-3" /> {data.avg} avg</span>
            <span className="inline-flex items-center gap-1"><Activity className="w-3 h-3" /> {data.working} {data.working === 1 ? 'agent' : 'agents'} busy</span>
          </div>
        </Panel>

        <Panel className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <IconTile tone="grape" className="w-8 h-8 rounded-lg">
                <Users className="w-4 h-4" />
              </IconTile>
              <div>
                <h3 className="text-base leading-none">Crew on duty</h3>
                <p className="text-[10px] font-bold text-ink-soft">30 specialized agents</p>
              </div>
            </div>
            <Btn tone="cream" size="xs" onClick={() => onOpenOffice()}>
              Open office <ArrowRight className="w-3 h-3" />
            </Btn>
          </div>

          <div className="grid grid-cols-6 gap-1">
            {agents.map((a) => {
              const busy = a.status !== 'idle' && a.status !== 'deployed' && a.status !== 'paused';
              return (
                <button
                  key={a.id}
                  onClick={() => onOpenOffice(a.id)}
                  className="relative rounded-xl border border-white/10 bg-white/[0.04] py-0.5 hover:border-aqua/40 hover:-translate-y-0.5 transition"
                  title={`#${a.number} ${a.name}`}
                  aria-label={`Agent ${a.number}, ${a.name}`}
                >
                  <span className="block mx-auto w-[26px]">
                    <ChibiRobot
                      size={26}
                      color={
                        a.category === 'orchestration' ? '#FF7A8A'
                        : a.category === 'frontend' ? '#FFC93C'
                        : a.category === 'mobile' ? '#3DD9B3'
                        : a.category === 'backend' ? '#6C4CF1'
                        : a.category === 'devops' ? '#6FD6FF'
                        : a.category === 'qa_security' ? '#F45D9C'
                        : a.category === 'learning' ? '#FFC93C'
                        : a.category === 'support' ? '#3DD9B3'
                        : '#6FD6FF'
                      }
                      accent={busy ? '#FFC93C' : '#FFF7EC'}
                      mood={busy ? 'focus' : 'happy'}
                    />
                  </span>
                  <span className="absolute -top-0.5 -right-0.5 text-[7px] font-extrabold font-mono bg-black/60 border border-aqua/25 text-aqua rounded-full px-1 leading-[10px]">
                    {a.number}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[10px] font-bold text-ink-soft pt-2 border-t border-aqua/10">
            <span className="inline-flex items-center gap-1.5">
              <span className="status-dot" style={{ background: '#3DD9B3' }} /> {30 - data.working - data.paused} ready
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="status-dot" style={{ background: '#FFC93C' }} /> {data.working} building
            </span>
            {data.paused > 0 && (
              <span className="inline-flex items-center gap-1.5 text-coral">
                <span className="status-dot" style={{ background: '#FF7A8A' }} /> {data.paused} paused
              </span>
            )}
          </div>
        </Panel>
      </div>

      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-4 items-start">
        <Panel className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <IconTile tone="coral" className="w-8 h-8 rounded-lg">
                <Boxes className="w-4 h-4" />
              </IconTile>
              <h3 className="text-base leading-none">Latest builds</h3>
            </div>
            <Btn tone="cream" size="xs" onClick={onOpenBuilds}>
              All builds <ArrowRight className="w-3 h-3" />
            </Btn>
          </div>

          {projects.length ? (
            <div className="space-y-1.5">
              {projects.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => openBuild(p.id)}
                  className="w-full text-left rounded-xl border border-aqua/15 bg-white/[0.03] px-3 py-2 flex items-center gap-3 hover:border-aqua/40 hover:bg-white/[0.05] transition"
                >
                  <span className="w-7 h-7 shrink-0 rounded-lg bg-aqua/[0.08] border border-aqua/20 text-aqua grid place-items-center font-display text-xs">
                    {p.name.slice(0, 1)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-extrabold truncate">{p.name}</span>
                    <span className="block text-[10px] font-semibold text-ink-soft truncate">
                      {p.source === 'ai' ? (p.aiModel || 'AI build') : 'Demo build'} · {p.files?.length ?? 0} files
                    </span>
                  </span>
                  <Pill tone={statusTone(p.status) as any}>{p.status || 'ready'}</Pill>
                  <span className="hidden sm:inline text-[10px] font-bold text-ink-soft shrink-0">{timeAgo(p.timestamp, false)}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs font-semibold text-ink-soft py-6 text-center">
              No builds yet. Open the studio and ship the first one.
            </p>
          )}
        </Panel>

        <Panel className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <IconTile tone="sun" className="w-8 h-8 rounded-lg">
                <TriangleAlert className="w-4 h-4" />
              </IconTile>
              <h3 className="text-base leading-none">Needs a human</h3>
            </div>
            <Btn tone="cream" size="xs" onClick={onOpenSupport}>
              Support <ArrowRight className="w-3 h-3" />
            </Btn>
          </div>

          {queue.length ? (
            <div className="space-y-2">
              {queue.map((t) => (
                <div key={t.id} className="rounded-xl border border-aqua/15 bg-white/[0.03] p-2.5 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Pill tone={t.status === 'escalated' ? 'coral' : 'sun'}>{t.status}</Pill>
                    <Pill tone="cream">{t.priority}</Pill>
                    <span className="ml-auto text-[9px] font-bold text-ink-soft font-mono">{t.id}</span>
                  </div>
                  <div className="text-xs font-extrabold truncate">{t.customerName}</div>
                  <p className="text-[10px] font-semibold text-ink-soft line-clamp-2 leading-relaxed">{t.promptTopic}</p>
                  <div className="flex gap-1.5">
                    <Btn tone="mint" size="xs" onClick={() => updateTicket(t.id, { status: 'resolved' })}>
                      <CheckCircle2 className="w-3 h-3" /> Resolve
                    </Btn>
                    {t.status !== 'escalated' && (
                      <Btn tone="cream" size="xs" onClick={() => updateTicket(t.id, { status: 'escalated' })}>
                        Escalate
                      </Btn>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 mx-auto">
                <ChibiRobot size={48} color="#3DD9B3" accent="#FFF7EC" mood="wink" />
              </div>
              <p className="text-xs font-extrabold">Inbox zero</p>
              <p className="text-[10px] font-semibold text-ink-soft">Agent #26 handled every open ticket.</p>
            </div>
          )}
        </Panel>
      </div>

      <Panel className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <IconTile tone="grape" className="w-8 h-8 rounded-lg">
              <Cpu className="w-4 h-4" />
            </IconTile>
            <div>
              <h3 className="text-base leading-none">Agent cluster</h3>
              <p className="text-[10px] font-bold text-ink-soft">scale from 30 to 100,000 workers</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.val}
                onClick={() => setClusterScale(p.val)}
                className={cx(
                  'rounded-lg border px-2.5 py-1 text-[10px] font-extrabold transition',
                  clusterScale === p.val
                    ? 'bg-aqua/15 text-aqua border-aqua/50'
                    : 'bg-white/[0.04] border-white/12 text-ink-soft hover:border-aqua/40 hover:text-ink',
                )}
                title={p.note}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-ink-soft mb-1.5">
            <span>Desired agents</span>
            <span className="font-mono text-ink">{metrics.normalizedScale.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={30}
            max={100000}
            step={10}
            value={clusterScale}
            onChange={(e) => setClusterScale(Number(e.target.value))}
            className="toon-range"
            aria-label="Cluster size"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: 'Nodes', value: metrics.nodesCount, icon: <Server className="w-3.5 h-3.5" /> },
            { label: 'Avg CPU', value: `${metrics.avgCpuPercent}%`, icon: <Cpu className="w-3.5 h-3.5" /> },
            { label: 'Memory', value: `${metrics.totalMemoryGb} GB`, icon: <HardDrive className="w-3.5 h-3.5" /> },
            { label: 'Throughput', value: `${(metrics.aggregateThroughputTps / 1000).toFixed(1)}k/s`, icon: <Activity className="w-3.5 h-3.5" /> },
          ].map((m) => (
            <div key={m.label} className="rounded-xl border border-aqua/15 bg-white/[0.03] p-2.5">
              <div className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-ink-soft">
                {m.icon} {m.label}
              </div>
              <div className="font-display text-lg leading-tight mt-0.5">{m.value}</div>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
          {nodeLoads.map((node) => {
            const sharePct = Math.round((node.running / nodeTotal) * 100);
            return (
              <div key={node.id} className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-ink-soft gap-2">
                  <span className="truncate">{node.name}</span>
                  <span className="font-mono shrink-0">{node.running.toLocaleString()} agents</span>
                </div>
                <ProgressBar
                  value={sharePct}
                  tone={node.cpuPercent > 45 ? 'sun' : 'mint'}
                  height="h-2.5"
                />
              </div>
            );
          })}
        </div>

        <p className="text-[10px] font-semibold text-ink-soft flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Autoscaler #29 redistributes load across six regions and re-shards new builds automatically.
        </p>
      </Panel>

      <AgentAccessPanel onOpenOffice={onOpenOffice} />

      <div className="flex flex-wrap gap-2 text-[10px] font-bold text-ink/50">
        <span className="inline-flex items-center gap-1.5"><Clock3 className="w-3 h-3" /> uptime 99.99%</span>
        <span aria-hidden="true">·</span>
        <span className="inline-flex items-center gap-1.5"><Zap className="w-3 h-3" /> p95 build 96s</span>
        <span aria-hidden="true">·</span>
        <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> 0 security findings</span>
        <button onClick={onOpenSupport} className="ml-auto inline-flex items-center gap-1 underline decoration-cream/30 hover:text-ink">
          {data.open.length} tickets waiting <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
