import React, { useMemo, useState } from 'react';
import { 
  Server, 
  Cpu, 
  Zap, 
  Activity, 
  Globe, 
  HardDrive, 
  Sliders, 
  Headphones,
  Rocket,
  Star,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { GeneratedProject, Language, LearningFeedback, SupportTicket } from '../types/agent';
import { INITIAL_NODES, calculateClusterMetrics } from '../utils/orchestrator';
import { timeAgo } from '../utils/storage';

interface AdminCockpitViewProps {
  clusterScale: number;
  setClusterScale: (val: number) => void;
  supportTickets: SupportTicket[];
  language: Language;
  projects?: GeneratedProject[];
  feedback?: LearningFeedback[];
  aiLive?: boolean;
}

export const AdminCockpitView: React.FC<AdminCockpitViewProps> = ({
  clusterScale,
  setClusterScale,
  supportTickets,
  language,
  projects = [],
  feedback = [],
  aiLive = false,
}) => {
  const isUrdu = language === 'ur';
  const metrics = calculateClusterMetrics(clusterScale);
  const [loadBalanceMode, setLoadBalanceMode] = useState<'latency' | 'geo' | 'weighted'>('latency');

  const real = useMemo(() => {
    const live = projects.filter((p) => p.status === 'live');
    const files = projects.reduce((s, p) => s + (p.files?.length || 0), 0);
    const ratings = feedback.map((f) => f.rating);
    const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '—';
    const escalated = supportTickets.filter((t) => t.status === 'escalated').length;
    const flagged = projects.filter((p) => (p.quality || []).some((q) => !q.passed)).length;
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - (6 - i));
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      const count = projects.filter((p) => {
        const t = new Date(p.timestamp).getTime();
        return t >= d.getTime() && t < next.getTime();
      }).length;
      return { label: d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2), count };
    });
    return { live: live.length, files, avgRating, escalated, flagged, days, escalatedList: supportTickets.filter((t) => t.status === 'escalated') };
  }, [projects, feedback, supportTickets]);

  const maxDay = Math.max(1, ...real.days.map((d) => d.count));

  const presetScales = [
    { label: '30 Baseline Agents', val: 30, desc: 'Single Tenant' },
    { label: '10,000 Agents', val: 10000, desc: 'Enterprise' },
    { label: '50,000 Agents', val: 50000, desc: 'High Load' },
    { label: '100,000 Supercluster', val: 100000, desc: '100k Peak' },
  ];

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isUrdu ? 'ایڈمن ڈیش بورڈ اور کلسٹر اسکیلنگ (1 لاکھ تک)' : 'Admin Operations & 100K Cluster Scaler'}
          </h2>
          <p className="text-slate-400 text-sm max-w-xl">
            {isUrdu
              ? 'سسٹم کی صلاحیت کو 30 سے لے کر ایک لاکھ ایجنٹس تک فوری اسکیل کریں، نوڈز اور لائیو کسٹمر ڈیٹا کی نگرانی کریں۔'
              : 'Autonomous cluster scheduler scaling from 30 core agents to 100,000 concurrent agent worker threads.'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] text-right font-mono text-xs">
          <span className="text-slate-500 block text-[10px] uppercase">Active Allocation</span>
          <span className="text-lg font-bold text-white">{metrics.normalizedScale.toLocaleString()} / 100,000</span>
        </div>
      </div>

      {/* Live platform data (real localStorage records) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">{isUrdu ? 'کل بلڈز' : 'Total Builds'}</span>
            <Rocket className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">{projects.length}</div>
          <span className="text-[10px] text-slate-500">
            {aiLive ? (isUrdu ? 'Gemini لائیو' : 'Gemini live') : (isUrdu ? 'ڈیمو موڈ' : 'Demo mode')}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">{isUrdu ? 'لائیو ڈیپلائے' : 'Live Deploys'}</span>
            <Globe className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">{real.live}</div>
          <span className="text-[10px] text-slate-500">Vercel + Supabase</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">{isUrdu ? 'جنریٹڈ فائلز' : 'Generated Files'}</span>
            <HardDrive className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">{real.files}</div>
          <span className="text-[10px] text-slate-500">web · iOS · Android · SQL</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">{isUrdu ? 'اوسط ریٹنگ' : 'Avg Rating'}</span>
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">{real.avgRating}</div>
          <span className="text-[10px] text-slate-500">{feedback.length} {isUrdu ? 'فیڈبیک' : 'reviews'}</span>
        </div>
      </div>

      {/* 7-day output + alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0d0f17] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              {isUrdu ? 'پچھلے 7 دن کے بلڈز' : 'Builds · last 7 days'}
            </span>
            <span className="text-slate-500 font-mono">{real.days.reduce((s, d) => s + d.count, 0)} total</span>
          </div>

          <div className="flex items-end justify-between gap-2 h-28" dir="ltr">
            {real.days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-mono text-slate-500">{d.count || ''}</span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-indigo-600/80 to-cyan-400/80 min-h-[3px]"
                  style={{ height: `${Math.max(3, (d.count / maxDay) * 100)}%` }}
                  title={`${d.count} builds`}
                />
                <span className={`text-[10px] font-mono ${i === 6 ? 'text-indigo-300' : 'text-slate-500'}`}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0d0f17] border border-white/[0.08] space-y-3">
          <span className="font-bold text-white text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            {isUrdu ? 'توجہ درکار' : 'Needs attention'}
          </span>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs">
            <span className="text-slate-400">{isUrdu ? 'ایسکلیٹڈ ٹکٹس' : 'Escalated tickets'}</span>
            <span className={`font-mono font-bold ${real.escalated ? 'text-amber-400' : 'text-emerald-400'}`}>{real.escalated}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs">
            <span className="text-slate-400">{isUrdu ? 'کوالٹی فلیگز' : 'Quality-flagged builds'}</span>
            <span className={`font-mono font-bold ${real.flagged ? 'text-rose-400' : 'text-emerald-400'}`}>{real.flagged}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs">
            <span className="text-slate-400">{isUrdu ? 'کلسٹر اسٹیٹس' : 'Cluster health'}</span>
            <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> OK
            </span>
          </div>

          {real.escalatedList.length > 0 && (
            <div className="pt-1 space-y-2 max-h-32 overflow-y-auto">
              {real.escalatedList.slice(0, 3).map((t) => (
                <div key={t.id} className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 text-[11px]">
                  <div className="flex items-center justify-between font-mono text-[10px] text-amber-300">
                    <span>{t.id}</span>
                    <span>{t.priority}</span>
                  </div>
                  <p className="text-slate-400 line-clamp-2">{t.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent builds */}
      <div className="p-6 rounded-3xl bg-[#0d0f17] border border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/[0.06]">
          <span className="font-bold text-white">{isUrdu ? 'حالیہ بلڈز' : 'Recent Builds'}</span>
          <span className="text-slate-500 font-mono">{projects.length} in library</span>
        </div>

        {projects.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-500">
            {isUrdu ? 'ابھی کوئی بلڈ نہیں — پرامپٹ فورج سے شروع کریں۔' : 'No builds yet — start from Prompt Forge.'}
          </p>
        ) : (
          <div className="space-y-2">
            {projects.slice(0, 5).map((p) => {
              const passed = (p.quality || []).filter((q) => q.passed).length;
              const total = (p.quality || []).length;
              return (
                <div key={p.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white truncate">{p.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase ${p.source === 'ai' ? 'bg-indigo-500/15 text-indigo-300' : 'bg-slate-500/15 text-slate-400'}`}>
                        {p.source}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase ${p.status === 'live' ? 'bg-emerald-500/15 text-emerald-300' : p.status === 'failed' ? 'bg-rose-500/15 text-rose-300' : 'bg-white/10 text-slate-300'}`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-slate-500">
                      <span>{p.durationSeconds}s</span>
                      <span>{p.files?.length || 0} files</span>
                      {total > 0 && <span>{passed}/{total} checks</span>}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    {timeAgo(p.timestamp, isUrdu)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cluster Scale Slider Card */}
      <div className="p-6 rounded-3xl bg-[#0d0f17] border border-white/[0.08] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">
              {isUrdu ? 'کلسٹر ورکر اسکیلنگ کنٹرول' : 'Cluster Worker Scaling Control'}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono">Routing:</span>
            <select
              value={loadBalanceMode}
              onChange={(e) => setLoadBalanceMode(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 font-mono focus:outline-none"
            >
              <option value="latency">Least Latency (Default)</option>
              <option value="geo">Geographic Proximity</option>
              <option value="weighted">Weighted Round-Robin</option>
            </select>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min={30}
            max={100000}
            step={500}
            value={clusterScale}
            onChange={(e) => setClusterScale(Number(e.target.value))}
            className="w-full h-2 bg-white/[0.06] rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>30 Baseline</span>
            <span>25,000</span>
            <span>50,000</span>
            <span>75,000</span>
            <span className="text-indigo-400 font-bold">100,000 Max Peak</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {presetScales.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setClusterScale(p.val)}
              className={`p-3.5 rounded-2xl border text-left transition ${
                clusterScale === p.val
                  ? 'bg-white/[0.08] border-white/20 text-white'
                  : 'bg-white/[0.02] border-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="text-xs font-bold">{p.label}</div>
              <div className="text-[10px] text-slate-500 font-mono">{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
          <span className="text-xs text-slate-500 font-mono">Throughput</span>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
            {metrics.aggregateThroughputTps.toLocaleString()} <span className="text-xs text-slate-500">tps</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
          <span className="text-xs text-slate-500 font-mono">Memory Pool</span>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
            {metrics.totalMemoryGb} <span className="text-xs text-slate-500">GB RAM</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
          <span className="text-xs text-slate-500 font-mono">CPU Cluster Load</span>
          <div className="text-xl sm:text-2xl font-bold text-indigo-300 font-mono tabular-nums">
            {metrics.avgCpuPercent}%
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
          <span className="text-xs text-slate-500 font-mono">Tasks / Minute</span>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            {metrics.tasksPerMinute.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 6 Regional Nodes Matrix */}
      <div className="space-y-4">
        <h3 className="font-bold text-white text-sm">
          {isUrdu ? 'عالمی ڈیٹا سینٹر نوڈز (6 ریجنز)' : '6 Global Regional Supercluster Nodes'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INITIAL_NODES.map((node) => {
            const proportionalAgents = Math.round((metrics.normalizedScale / 100000) * node.capacityMax);
            const loadPercent = Math.min(95, Math.round((proportionalAgents / node.capacityMax) * 85 + 10));

            return (
              <div key={node.id} className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{node.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{node.region}</span>
                  </div>
                  <span className="text-emerald-400 font-mono text-[10px]">Healthy</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{proportionalAgents.toLocaleString()} agents</span>
                    <span>{loadPercent}% load</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                      style={{ width: `${loadPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin Live Ingestion Telemetry Stream */}
      <div className="p-6 rounded-3xl bg-[#0d0f17] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between text-xs pb-3 border-b border-white/[0.06]">
          <span className="font-bold text-white">Live Dispatched Tickets Stream</span>
          <span className="text-slate-500 font-mono">{supportTickets.length} Items Logged</span>
        </div>

        <div className="space-y-3">
          {supportTickets.map((t) => (
            <div key={t.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-indigo-400 font-bold">{t.id}</span>
                  <span className="text-white font-medium">{t.customerName}</span>
                  <span className="text-slate-500">({t.promptTopic})</span>
                </div>
                <p className="text-slate-400">"{t.message}"</p>
              </div>

              <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
                <span className="text-slate-500">{t.createdAt}</span>
                <span className={
                  t.status === 'escalated' ? 'text-amber-400' :
                  t.status === 'pending' ? 'text-indigo-300' : 'text-emerald-400'
                }>{t.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
