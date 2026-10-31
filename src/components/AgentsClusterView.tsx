import React, { useState } from 'react';
import { 
  Bot, 
  Search, 
  Zap, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight
} from 'lucide-react';
import { SpecializedAgent, Language } from '../types/agent';

interface AgentsClusterViewProps {
  agents: SpecializedAgent[];
  language: Language;
}

export const AgentsClusterView: React.FC<AgentsClusterViewProps> = ({ agents, language }) => {
  const isUrdu = language === 'ur';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', labelEn: 'All 30 Agents', labelUrdu: 'تمام 30 ایجنٹس' },
    { id: 'orchestration', labelEn: 'Orchestration', labelUrdu: 'آرکسٹریشن' },
    { id: 'frontend', labelEn: 'Frontend Web', labelUrdu: 'ویب فرنٹ اینڈ' },
    { id: 'mobile', labelEn: 'Mobile (iOS/Android)', labelUrdu: 'موبائل ایپس' },
    { id: 'backend', labelEn: 'Supabase Database', labelUrdu: 'سپا بیس ڈیٹا بیس' },
    { id: 'devops', labelEn: 'Vercel Deployment', labelUrdu: 'ورسل ڈیپلائمنٹ' },
    { id: 'qa_security', labelEn: 'Security & QA', labelUrdu: 'سیکیورٹی' },
    { id: 'learning', labelEn: 'Self-Learning', labelUrdu: 'لرننگ' },
    { id: 'support', labelEn: 'Customer Support', labelUrdu: 'کسٹمر سپورٹ' },
  ];

  const filteredAgents = agents.filter(agent => {
    const matchesCat = selectedCategory === 'all' || agent.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      agent.name.toLowerCase().includes(q) ||
      agent.nameUrdu.includes(q) ||
      agent.role.toLowerCase().includes(q) ||
      agent.roleUrdu.includes(q) ||
      agent.number.toString() === q;
    return matchesCat && matchesSearch;
  });

  const totalTasks = agents.reduce((acc, a) => acc + a.tasksCompleted, 0);
  const avgLatency = Math.round(agents.reduce((acc, a) => acc + a.latencyMs, 0) / agents.length);
  const avgThroughput = Math.round(agents.reduce((acc, a) => acc + a.throughputTps, 0) / agents.length);

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto">
      {/* Header & Cluster Telemetry */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.06]">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isUrdu ? '30 خصوصی پیشہ ور ایجنٹس کا متحرک گرڈ' : '30 Specialized Autonomous Agents'}
          </h2>
          <p className="text-slate-400 text-sm max-w-xl">
            {isUrdu
              ? 'ہر ایجنٹ ایک مخصوص ٹاسک کا ماہر ہے جو متوازی طور پر ملی سیکنڈز میں ہدایات پر عمل درآمد کرتا ہے۔'
              : 'Dedicated micro-agents operating concurrently across architecture, native mobile, security, and edge deployments.'}
          </p>
        </div>

        {/* Telemetry Strip */}
        <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Active Agents</span>
            <span className="text-base font-bold text-white tabular-nums">30 / 30 Active</span>
          </div>
          <div className="h-6 w-[1px] bg-white/[0.08] hidden sm:block"></div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Avg Latency</span>
            <span className="text-base font-bold text-emerald-400 tabular-nums">{avgLatency}ms</span>
          </div>
          <div className="h-6 w-[1px] bg-white/[0.08] hidden sm:block"></div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Throughput</span>
            <span className="text-base font-bold text-indigo-400 tabular-nums">{avgThroughput.toLocaleString()} tps</span>
          </div>
          <div className="h-6 w-[1px] bg-white/[0.08] hidden sm:block"></div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Total Operations</span>
            <span className="text-base font-bold text-slate-300 tabular-nums">{totalTasks.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Segmented Category Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-white text-slate-900 font-semibold shadow-sm'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.04]'
              }`}
            >
              {isUrdu ? cat.labelUrdu : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isUrdu ? 'ایجنٹ تلاش کریں...' : 'Filter by name or role...'}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
      </div>

      {/* 30 Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.06] hover:border-white/[0.14] transition-all flex flex-col justify-between space-y-4 group"
          >
            {/* Header: Index & Category */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-400">
                #{agent.number.toString().padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-400 font-mono uppercase px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06]">
                {agent.category}
              </span>
            </div>

            {/* Name & Role */}
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                {isUrdu ? agent.nameUrdu : agent.name}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isUrdu ? agent.roleUrdu : agent.role}
              </p>
            </div>

            {/* Current Activity */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Active Task</span>
                <span className="text-emerald-400">Online</span>
              </div>
              <p className="text-xs text-slate-300 font-mono line-clamp-1">
                {isUrdu ? agent.currentTaskUrdu : agent.currentTask}
              </p>
            </div>

            {/* Telemetry Footer */}
            <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span className="text-slate-400">{agent.throughputTps} tps</span>
              <span className="text-slate-400">{agent.latencyMs}ms</span>
              <span className="text-slate-400">{agent.tasksCompleted.toLocaleString()} ops</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
