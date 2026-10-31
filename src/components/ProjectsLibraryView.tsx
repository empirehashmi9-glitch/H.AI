import React, { useMemo, useState } from 'react';
import {
  Search, Sparkles, Clock, FileCode2, Globe, Smartphone, Database, Trash2,
  Download, ArrowRight, FolderOpen, Star, Zap, CheckCircle2, AlertTriangle,
  Layers
} from 'lucide-react';
import { GeneratedProject, Language, LearningFeedback } from '../types/agent';
import { formatBytes, timeAgo } from '../utils/storage';
import { toast } from './Toast';

interface ProjectsLibraryViewProps {
  projects: GeneratedProject[];
  activeId: string | null;
  feedback: LearningFeedback[];
  language: Language;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onZip: (project: GeneratedProject) => void;
  onNewBuild: () => void;
}

type Filter = 'all' | 'ai' | 'demo' | 'live';

export const ProjectsLibraryView: React.FC<ProjectsLibraryViewProps> = ({
  projects, activeId, feedback, language, onOpen, onDelete, onZip, onNewBuild,
}) => {
  const isUrdu = language === 'ur';
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const live = projects.filter((p) => p.status === 'live').length;
    const avgTime = projects.length
      ? Math.round(projects.reduce((s, p) => s + (p.durationSeconds || 0), 0) / projects.length)
      : 0;
    const ratings = feedback.map((f) => f.rating);
    const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '—';
    const files = projects.reduce((s, p) => s + (p.files?.length || 0), 0);
    return { live, avgTime, avgRating, files };
  }, [projects, feedback]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .filter((p) => {
        if (filter === 'ai' && p.source !== 'ai') return false;
        if (filter === 'demo' && p.source !== 'demo') return false;
        if (filter === 'live' && p.status !== 'live') return false;
        if (!q) return true;
        return `${p.name} ${p.prompt}`.toLowerCase().includes(q);
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [projects, query, filter]);

  const ratingFor = (projectId: string) => {
    const list = feedback.filter((f) => f.projectId === projectId);
    if (!list.length) return null;
    return list[list.length - 1];
  };

  if (projects.length === 0) {
    return (
      <div className="py-20 max-w-md mx-auto text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center">
          <Layers className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{isUrdu ? 'لائبریری خالی ہے' : 'Your library is empty'}</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          {isUrdu ? 'پہلا پراجیکٹ بنائیں — یہ ہمیشہ اسی براؤزر میں محفوظ رہے گا۔' : 'Generate your first product. Every build is saved in this browser with its code, preview and deploy state.'}
        </p>
        <button onClick={onNewBuild} className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> {isUrdu ? 'پہلا بلڈ بنائیں' : 'Create first build'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isUrdu ? 'پراجیکٹس لائبریری' : 'Projects Library'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isUrdu ? 'ہر بلڈ کا کوڈ، پریویو اور ڈیپلائمنٹ محفوظ ہے۔' : 'Every build saved locally with source, preview and deployment state.'}
          </p>
        </div>
        <button onClick={onNewBuild} className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-2 self-start">
          <Sparkles className="w-4 h-4" /> {isUrdu ? 'نیا بلڈ' : 'New build'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: isUrdu ? 'کل بلڈز' : 'Total builds', value: projects.length, icon: FolderOpen },
          { label: isUrdu ? 'لائیو' : 'Live', value: stats.live, icon: Zap },
          { label: isUrdu ? 'اوسط وقت' : 'Avg time', value: `${stats.avgTime}s`, icon: Clock },
          { label: isUrdu ? 'اوسط ریٹنگ' : 'Avg rating', value: stats.avgRating === '—' ? '—' : `${stats.avgRating}★`, icon: Star },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0d0f17]">
            <div className="flex items-center justify-between text-slate-400"><span className="text-[10px] uppercase tracking-wide">{label}</span><Icon className="w-3.5 h-3.5" /></div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1">{value}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isUrdu ? 'نام یا پرامپٹ سے تلاش کریں…' : 'Search by name or prompt…'}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] text-xs text-slate-800 dark:text-white outline-none focus:border-indigo-400"
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] overflow-x-auto no-scrollbar">
          {([
            { id: 'all' as const, label: isUrdu ? 'سب' : 'All' },
            { id: 'ai' as const, label: 'Gemini' },
            { id: 'demo' as const, label: 'Demo' },
            { id: 'live' as const, label: isUrdu ? 'لائیو' : 'Live' },
          ]).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition ${
                filter === id ? 'bg-white dark:bg-white/[0.12] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const rating = ratingFor(p.id);
          const isActive = activeId === p.id;
          return (
            <div
              key={p.id}
              className={`group rounded-2xl border bg-white/80 dark:bg-[#0d0f17] overflow-hidden transition hover:-translate-y-0.5 hover:shadow-xl ${
                isActive ? 'border-indigo-400 dark:border-indigo-500/50 ring-1 ring-indigo-400/30' : 'border-slate-200 dark:border-white/[0.08]'
              }`}
            >
              <div className="h-24 relative overflow-hidden bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-emerald-500/20 flex items-center justify-center">
                <span className="text-3xl font-black text-slate-900/20 dark:text-white/20 tracking-tight">{p.name.slice(0, 2).toUpperCase()}</span>
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border ${p.source === 'ai' ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-700 dark:text-indigo-200' : 'bg-amber-500/20 border-amber-500/40 text-amber-800 dark:text-amber-200'}`}>
                    {p.source === 'ai' ? 'GEMINI' : 'DEMO'}
                  </span>
                  {p.status === 'live' && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-200">LIVE</span>
                  )}
                </div>
                {isActive && <span className="absolute top-2.5 right-2.5 text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-slate-900 text-white">ACTIVE</span>}
              </div>

              <div className="p-4 space-y-2.5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{p.name}</h3>
                  <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">{p.prompt}</p>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1"><FileCode2 className="w-3 h-3" />{p.files?.length || 0}</span>
                  <span>{formatBytes((p.files || []).reduce((s, f) => s + f.bytes, 0))}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{p.durationSeconds}s</span>
                  <span>{timeAgo(p.timestamp, isUrdu)}</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400">
                  {p.platforms.web && <Globe className="w-3 h-3" />}
                  {p.platforms.ios && <Smartphone className="w-3 h-3" />}
                  {p.platforms.android && <Smartphone className="w-3 h-3" />}
                  <Database className="w-3 h-3" />
                  <span className="text-[10px] text-slate-500 ml-0.5">{p.spec?.dataModels.length || p.supabase.tables.length} tables</span>
                  {rating && (
                    <span className="ml-auto text-[10px] text-amber-500 flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{rating.rating}
                    </span>
                  )}
                </div>

                {(p.quality || []).some((q) => !q.passed) && (
                  <div className="flex items-center gap-1 text-[9px] text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="w-3 h-3" /> some checks flagged
                  </div>
                )}
                {p.quality && p.quality.length > 0 && p.quality.every((q) => q.passed) && (
                  <div className="flex items-center gap-1 text-[9px] text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> all checks passed
                  </div>
                )}

                <div className="flex items-center gap-1.5 pt-1">
                  <button onClick={() => onOpen(p.id)} className="flex-1 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center justify-center gap-1.5">
                    {isUrdu ? 'کھولیں' : 'Open'} <ArrowRight className="w-3 h-3" />
                  </button>
                  <button onClick={() => { onZip(p); toast.success(isUrdu ? 'ZIP تیار ہے' : 'ZIP ready'); }} className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 hover:text-indigo-500" aria-label="Download ZIP">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  {confirmId === p.id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => { onDelete(p.id); setConfirmId(null); toast.success(isUrdu ? 'حذف ہو گیا' : 'Deleted'); }} className="px-2 py-2 rounded-xl bg-rose-600 text-white text-[10px] font-bold">Yes</button>
                      <button onClick={() => setConfirmId(null)} className="px-2 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-[10px] text-slate-500">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmId(p.id)} className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 hover:text-rose-500" aria-label="Delete project">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-xs text-slate-500">No projects match this filter.</div>
      )}
    </div>
  );
};
