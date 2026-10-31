import React, { useEffect, useMemo, useState } from 'react';
import {
  Building2, Crown, DraftingCompass, Monitor, Smartphone, Database, Rocket,
  ShieldCheck, BrainCircuit, Headphones, Coffee, Leaf, Wifi, Search, Users,
  Activity, Zap, ChevronRight, Radio, Sparkles, Clock3, LampDesk, X,
} from 'lucide-react';
import { AgentCategory, Language, SpecializedAgent } from '../types/agent';
import { toast } from './Toast';

interface AgentOfficeViewProps {
  agents: SpecializedAgent[];
  language: Language;
  isGenerating?: boolean;
  onOpenCluster?: () => void;
}

type Room = {
  category: AgentCategory;
  nameEn: string;
  nameUrdu: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  ring: string;
  glow: string;
};

const ROOMS: Room[] = [
  { category: 'orchestration', nameEn: 'Executive Suite', nameUrdu: 'ایگزیکٹو سوٹ', icon: Crown, accent: 'text-amber-300', ring: 'border-amber-400/25', glow: 'from-amber-500/15' },
  { category: 'architecture', nameEn: 'Strategy Room', nameUrdu: 'اسٹریٹجی روم', icon: DraftingCompass, accent: 'text-violet-300', ring: 'border-violet-400/25', glow: 'from-violet-500/15' },
  { category: 'frontend', nameEn: 'Web Studio', nameUrdu: 'ویب اسٹوڈیو', icon: Monitor, accent: 'text-sky-300', ring: 'border-sky-400/25', glow: 'from-sky-500/15' },
  { category: 'mobile', nameEn: 'Mobile Bay', nameUrdu: 'موبائل بے', icon: Smartphone, accent: 'text-emerald-300', ring: 'border-emerald-400/25', glow: 'from-emerald-500/15' },
  { category: 'backend', nameEn: 'Data Vault', nameUrdu: 'ڈیٹا والٹ', icon: Database, accent: 'text-cyan-300', ring: 'border-cyan-400/25', glow: 'from-cyan-500/15' },
  { category: 'devops', nameEn: 'Launch Control', nameUrdu: 'لانچ کنٹرول', icon: Rocket, accent: 'text-indigo-300', ring: 'border-indigo-400/25', glow: 'from-indigo-500/15' },
  { category: 'qa_security', nameEn: 'QA & Security Lab', nameUrdu: 'کوالٹی اینڈ سیکیورٹی لیب', icon: ShieldCheck, accent: 'text-rose-300', ring: 'border-rose-400/25', glow: 'from-rose-500/15' },
  { category: 'learning', nameEn: 'Learning Lab', nameUrdu: 'لرننگ لیب', icon: BrainCircuit, accent: 'text-fuchsia-300', ring: 'border-fuchsia-400/25', glow: 'from-fuchsia-500/15' },
  { category: 'support', nameEn: 'Front Desk', nameUrdu: 'فرنٹ ڈیسک', icon: Headphones, accent: 'text-teal-300', ring: 'border-teal-400/25', glow: 'from-teal-500/15' },
];

const STATUS: Record<
  SpecializedAgent['status'],
  { en: string; ur: string; dot: string; chip: string }
> = {
  idle: { en: 'Standby', ur: 'اسٹینڈ بائی', dot: 'bg-slate-500', chip: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  analyzing: { en: 'Analyzing', ur: 'تجزیہ', dot: 'bg-sky-400', chip: 'bg-sky-500/10 text-sky-300 border-sky-500/25' },
  synthesizing: { en: 'Building', ur: 'تعمیر', dot: 'bg-indigo-400', chip: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25' },
  reviewing: { en: 'Reviewing', ur: 'جائزہ', dot: 'bg-amber-400', chip: 'bg-amber-500/10 text-amber-300 border-amber-500/25' },
  deployed: { en: 'Deployed', ur: 'ڈیپلائے', dot: 'bg-emerald-400', chip: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25' },
  optimizing: { en: 'Optimizing', ur: 'آپٹمائز', dot: 'bg-fuchsia-400', chip: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/25' },
  paused: { en: 'Paused', ur: 'روکا گیا', dot: 'bg-rose-400', chip: 'bg-rose-500/10 text-rose-300 border-rose-500/25' },
};

const AVATARS = [
  'from-indigo-500 to-violet-600',
  'from-emerald-500 to-teal-600',
  'from-sky-500 to-blue-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-fuchsia-500 to-purple-600',
  'from-cyan-500 to-sky-600',
];

const initials = (name: string) =>
  name
    .split(' ')
    .filter((w) => !['&', 'H.AI'].includes(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

export const AgentOfficeView: React.FC<AgentOfficeViewProps> = ({
  agents,
  language,
  isGenerating = false,
  onOpenCluster,
}) => {
  const isUrdu = language === 'ur';
  const [selectedId, setSelectedId] = useState<string>('agent-1');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [focusMode, setFocusMode] = useState(false);
  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    const t = window.setInterval(() => setClock(new Date()), 30000);
    return () => window.clearInterval(t);
  }, []);

  const working = agents.filter((a) => a.status !== 'idle').length;
  const tasksDone = agents.reduce((s, a) => s + a.tasksCompleted, 0);
  const avgLatency = Math.round(agents.reduce((s, a) => s + a.latencyMs, 0) / Math.max(1, agents.length));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return agents;
    return agents.filter((a) =>
      `${a.name} ${a.nameUrdu} ${a.role} ${a.roleUrdu}`.toLowerCase().includes(q),
    );
  }, [agents, query]);

  const selected =
    agents.find((a) => a.id === selectedId) ||
    agents.find((a) => a.status !== 'idle') ||
    agents[0];

  const selectedRoom = ROOMS.find((r) => r.category === selected?.category);

  const pulseFeed = useMemo(
    () =>
      [...agents]
        .sort((a, b) => {
          const rank = (s: string) => (s === 'idle' ? 1 : 0);
          return rank(a.status) - rank(b.status) || b.progress - a.progress;
        })
        .slice(0, 6),
    [agents],
  );

  const openDesk = (id: string) => {
    setSelectedId(id);
    setSheetOpen(true);
  };

  const ping = () => {
    if (!selected) return;
    toast.success(
      isUrdu ? `${selected.nameUrdu} کو پنگ بھیج دیا گیا` : `Ping sent to ${selected.name}`,
    );
  };

  const openCluster = () => {
    setSheetOpen(false);
    onOpenCluster?.();
  };

  const timeLabel = clock.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto">
      {/* Hero / HQ card */}
      <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-br from-[#0b1022] via-[#0d0f17] to-[#160f24] p-5 sm:p-7">
        <div aria-hidden="true" className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-fuchsia-600/10 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
              <span className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isGenerating ? 'bg-indigo-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
                {isGenerating ? (isUrdu ? 'بلڈ جاری ہے' : 'BUILD IN PROGRESS') : (isUrdu ? 'آفس کھلا ہے' : 'OFFICE OPEN')}
              </span>
              <span className="px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400 flex items-center gap-1.5">
                <Clock3 className="w-3 h-3" /> {timeLabel}
              </span>
              <span className="px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400 flex items-center gap-1.5">
                <Wifi className="w-3 h-3 text-emerald-400" /> Floor 30 · H.AI HQ
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {isUrdu ? 'ایجنٹ آفس' : 'The Agent Office'}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm max-w-xl mt-1 leading-relaxed">
                {isUrdu
                  ? 'آپ کے 30 ایجنٹس یہاں اپنے ڈیسک پر کام کرتے ہیں۔ کسی بھی ڈیسک پر کلک کریں اور اس کی لائیو رپورٹ دیکھیں۔'
                  : 'A living floor plan of your 30-agent crew. Tap any desk to inspect its live telemetry, current task and output.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-1 sm:flex sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
              <Stat icon={Users} label={isUrdu ? 'آن لائن' : 'On floor'} value={`${agents.length}/30`} tone="text-white" />
              <Stat icon={Activity} label={isUrdu ? 'کام کر رہے' : 'Working now'} value={String(working)} tone="text-emerald-400" />
              <Stat icon={Zap} label={isUrdu ? 'ٹاسک مکمل' : 'Tasks done'} value={tasksDone.toLocaleString()} tone="text-indigo-300" />
              <Stat icon={Radio} label={isUrdu ? 'اوسط لیٹنسی' : 'Avg latency'} value={`${avgLatency}ms`} tone="text-amber-300" />
            </div>
          </div>

          {/* Office window skyline */}
          <div className="relative w-full lg:w-72 h-32 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#141a38] via-[#0f1225] to-[#0a0c16] shrink-0">
            <div className="absolute inset-0 opacity-70" style={{
              backgroundImage: 'linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }} />
            <div className="absolute top-4 right-5 w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 blur-[1px] shadow-[0_0_28px_rgba(251,191,36,0.55)]" />
            <div className="absolute bottom-6 left-0 right-0 flex items-end justify-center gap-1.5 px-4">
              {[34, 52, 26, 64, 40, 74, 48, 30, 58, 36, 68, 44].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-[3px] bg-gradient-to-t from-indigo-950 to-indigo-700/70 border-t border-indigo-400/30"
                  style={{ height: `${h}px` }}
                >
                  <div className="grid grid-cols-2 gap-[3px] p-[3px] opacity-70">
                    {Array.from({ length: Math.max(2, Math.floor(h / 14)) }).map((_, j) => (
                      <span key={j} className={`h-[3px] rounded-sm ${j % 3 === 0 ? 'bg-amber-300/80' : 'bg-sky-300/25'}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#0a0c16] to-transparent" />
            <div className="absolute top-3 left-3 flex items-center gap-1 text-[9px] font-mono text-slate-400">
              <Leaf className="w-3 h-3 text-emerald-400" /> skyline · live
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isUrdu ? 'ایجنٹ یا کردار تلاش کریں...' : 'Find an agent or role...'}
            className="w-full ps-9 pe-3 py-2 rounded-xl bg-[#0d0f17] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setFocusMode((f) => !f)}
            className={`px-3 py-2 rounded-xl text-[11px] font-semibold border transition flex items-center gap-1.5 ${
              focusMode
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-[#0d0f17] border-white/[0.08] text-slate-400 hover:text-white'
            }`}
          >
            <LampDesk className="w-3.5 h-3.5" />
            {isUrdu ? 'فوکس موڈ' : 'Focus mode'}
          </button>
          {onOpenCluster && (
            <button
              onClick={onOpenCluster}
              className="px-3 py-2 rounded-xl text-[11px] font-semibold bg-[#0d0f17] border border-white/[0.08] text-slate-300 hover:text-white hover:border-indigo-400/50 transition flex items-center gap-1.5"
            >
              {isUrdu ? 'کلسٹر' : 'Cluster view'}
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Floor plan */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ROOMS.map((room) => {
            const members = filtered.filter((a) => a.category === room.category);
            if (members.length === 0) return null;
            const active = members.filter((a) => a.status !== 'idle').length;
            const Icon = room.icon;

            return (
              <section
                key={room.category}
                className={`relative rounded-3xl border ${room.ring} bg-[#0d0f17] overflow-hidden`}
              >
                <div className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${room.glow} to-transparent pointer-events-none`} />

                <div className="relative px-4 pt-4 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center ${room.accent}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-white truncate">
                        {isUrdu ? room.nameUrdu : room.nameEn}
                      </h3>
                      <p className="text-[10px] font-mono text-slate-500">
                        {members.length} {isUrdu ? 'ڈیسک' : 'desks'} · {active} {isUrdu ? 'مصروف' : 'active'}
                      </p>
                    </div>
                  </div>
                  <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                </div>

                <div
                  className="relative px-3 pb-3 pt-1 grid grid-cols-2 gap-2"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.13) 1px, transparent 0)',
                    backgroundSize: '16px 16px',
                  }}
                >
                  {members.map((agent) => {
                    const status = STATUS[agent.status];
                    const isActive = agent.status !== 'idle';
                    const isSelected = selected?.id === agent.id;
                    return (
                      <button
                        key={agent.id}
                        onClick={() => openDesk(agent.id)}
                        aria-pressed={isSelected}
                        className={`group relative text-left rounded-2xl p-2.5 border transition-all duration-200 ${
                          isSelected
                            ? 'bg-white/[0.08] border-indigo-400/50 shadow-lg shadow-indigo-950/40'
                            : 'bg-[#0b0e19]/85 border-white/[0.06] hover:border-white/20 hover:bg-[#111527]'
                        } ${focusMode && !isActive ? 'opacity-45 saturate-50' : ''}`}
                      >
                        {isActive && (
                          <span className="absolute -top-px left-3 right-3 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />
                        )}

                        <div className="flex items-start justify-between gap-1">
                          <div
                            className={`relative w-9 h-9 rounded-xl bg-gradient-to-br ${AVATARS[agent.number % AVATARS.length]} flex items-center justify-center text-[11px] font-black text-white shadow-inner`}
                          >
                            {initials(agent.name)}
                            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0b0e19] ${status.dot} ${isActive ? 'animate-pulse' : ''}`} />
                          </div>
                          <span className="text-[9px] font-mono text-slate-500">#{agent.number}</span>
                        </div>

                        <div className="mt-2">
                          <p className="text-[10px] font-semibold text-slate-200 truncate">
                            {isUrdu ? agent.nameUrdu : agent.name}
                          </p>
                          <p className="text-[9px] text-slate-500 truncate mt-0.5">
                            {isUrdu ? agent.roleUrdu : agent.role}
                          </p>
                        </div>

                        {/* desk + monitor */}
                        <div className="mt-2.5 flex items-end justify-between gap-2">
                          <div className="flex-1">
                            <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                              <div
                                className={`h-full rounded-full ${isActive ? 'bg-gradient-to-r from-indigo-400 to-emerald-400' : 'bg-slate-700'}`}
                                style={{ width: `${isActive ? Math.max(6, agent.progress) : 4}%` }}
                              />
                            </div>
                            <div className="mx-auto mt-1 w-6 h-[2px] rounded-full bg-white/[0.08]" />
                          </div>
                          <Coffee className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Inspector + pulse (desktop) */}
        <div className="hidden lg:block lg:col-span-4 space-y-4 lg:sticky lg:top-24">
          {selected && (
            <AgentInspector
              key={selected.id}
              agent={selected}
              room={selectedRoom}
              isUrdu={isUrdu}
              onPing={ping}
              onOpenCluster={openCluster}
            />
          )}

          <PulseCard feed={pulseFeed} working={working} isUrdu={isUrdu} onSelect={(id) => setSelectedId(id)} />

          <div className="px-1 flex items-center justify-between text-[9px] font-mono text-slate-600">
            <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> H.AI HQ · Floor 30</span>
            <span>{isUrdu ? 'لائیو ڈیٹا' : 'live telemetry'}</span>
          </div>
        </div>

        {/* Pulse (mobile, below floor) */}
        <div className="lg:hidden space-y-4">
          <PulseCard feed={pulseFeed} working={working} isUrdu={isUrdu} onSelect={openDesk} />
          <div className="px-1 flex items-center justify-between text-[9px] font-mono text-slate-600">
            <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> H.AI HQ · Floor 30</span>
            <span>{isUrdu ? 'لائیو ڈیٹا' : 'live telemetry'}</span>
          </div>
        </div>
      </div>

      {/* Mobile bottom sheet */}
      {sheetOpen && selected && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            aria-label={isUrdu ? 'بند کریں' : 'Close'}
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={() => setSheetOpen(false)}
          />
          <div className="absolute bottom-0 inset-x-0 rounded-t-3xl border-t border-white/10 bg-[#0b0e19] p-4 pb-6 max-h-[85vh] overflow-y-auto animate-[toastIn_.22s_ease-out]">
            <div className="w-10 h-1 rounded-full bg-white/15 mx-auto mb-3" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                {isUrdu ? 'ڈیسک رپورٹ' : 'Desk report'}
              </span>
              <button
                onClick={() => setSheetOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-white flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <AgentInspector
              agent={selected}
              room={selectedRoom}
              isUrdu={isUrdu}
              onPing={ping}
              onOpenCluster={onOpenCluster ? openCluster : undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const AgentInspector: React.FC<{
  agent: SpecializedAgent;
  room?: Room;
  isUrdu: boolean;
  onPing: () => void;
  onOpenCluster?: () => void;
}> = ({ agent, room, isUrdu, onPing, onOpenCluster }) => {
  const status = STATUS[agent.status];
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[#0d0f17] p-5 space-y-4 animate-fade-up">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${AVATARS[agent.number % AVATARS.length]} flex items-center justify-center text-sm font-black text-white shrink-0`}>
            {initials(agent.name)}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-mono text-slate-500">
              AGENT #{agent.number} · {isUrdu ? room?.nameUrdu : room?.nameEn}
            </p>
            <h3 className="text-sm font-bold text-white truncate">
              {isUrdu ? agent.nameUrdu : agent.name}
            </h3>
            <p className="text-[10px] text-slate-400 truncate">
              {isUrdu ? agent.roleUrdu : agent.role}
            </p>
          </div>
        </div>
        <span className={`shrink-0 px-2 py-0.5 rounded-full border text-[9px] font-mono ${status.chip}`}>
          {isUrdu ? status.ur : status.en}
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>{isUrdu ? 'موجودہ ٹاسک' : 'Current task'}</span>
          <span>{agent.status === 'idle' ? 0 : agent.progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-700"
            style={{ width: `${agent.status === 'idle' ? 2 : Math.max(4, agent.progress)}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
          {isUrdu ? agent.currentTaskUrdu : agent.currentTask}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <MiniStat label={isUrdu ? 'ٹاسک' : 'Tasks'} value={agent.tasksCompleted.toLocaleString()} />
        <MiniStat label={isUrdu ? 'تھروپٹ' : 'Throughput'} value={`${agent.throughputTps}`} />
        <MiniStat label={isUrdu ? 'لیٹنسی' : 'Latency'} value={`${agent.latencyMs}ms`} />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPing}
          className="flex-1 py-2 rounded-xl bg-white text-slate-900 text-[11px] font-bold hover:bg-slate-200 transition flex items-center justify-center gap-1.5"
        >
          <Radio className="w-3.5 h-3.5" />
          {isUrdu ? 'پنگ کریں' : 'Ping desk'}
        </button>
        {onOpenCluster && (
          <button
            onClick={onOpenCluster}
            className="px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white text-[11px] font-semibold transition"
          >
            {isUrdu ? 'تفصیل' : 'Details'}
          </button>
        )}
      </div>
    </div>
  );
};

const PulseCard: React.FC<{
  feed: SpecializedAgent[];
  working: number;
  isUrdu: boolean;
  onSelect: (id: string) => void;
}> = ({ feed, working, isUrdu, onSelect }) => (
  <div className="rounded-3xl border border-white/[0.08] bg-[#0d0f17] p-5 space-y-3">
    <div className="flex items-center justify-between text-[10px] font-mono pb-2 border-b border-white/[0.06]">
      <span className="text-white font-bold flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        {isUrdu ? 'آفس کی لائیو سرگرمی' : 'Office pulse'}
      </span>
      <span className="text-slate-500">{working} active</span>
    </div>

    <div className="space-y-1.5">
      {feed.map((a) => (
        <button
          key={a.id}
          onClick={() => onSelect(a.id)}
          className="w-full text-start flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/[0.03] transition"
        >
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS[a.status].dot}`} />
          <span className="text-[10px] text-slate-300 truncate flex-1">
            <span className="font-semibold text-white">#{a.number}</span>{' '}
            {isUrdu ? a.currentTaskUrdu : a.currentTask}
          </span>
          <span className="text-[9px] font-mono text-slate-600 shrink-0">
            {a.status === 'idle' ? '—' : `${a.progress}%`}
          </span>
        </button>
      ))}
    </div>
  </div>
);

const Stat: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: string;
}> = ({ icon: Icon, label, value, tone }) => (
  <div className="flex items-center gap-2">
    <Icon className="w-3.5 h-3.5 text-slate-500" />
    <div className="leading-tight">
      <div className={`text-xs font-bold font-mono tabular-nums ${tone}`}>{value}</div>
      <div className="text-[9px] uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  </div>
);

const MiniStat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center">
    <div className="text-[11px] font-bold text-white font-mono tabular-nums">{value}</div>
    <div className="text-[8px] uppercase tracking-wide text-slate-500">{label}</div>
  </div>
);
