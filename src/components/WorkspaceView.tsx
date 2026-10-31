import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Globe, Smartphone, Database, CloudUpload, Download, Copy, Check, ExternalLink,
  Code2, Eye, ShieldCheck, Terminal, FileCode2, FolderTree, Search, RefreshCw,
  Star, Rocket, AlertTriangle, Loader2, Play, Monitor, Tablet, Settings2,
  CheckCircle2, XCircle, Sparkles, Boxes, Layers
} from 'lucide-react';
import { AppSettings, GeneratedProject, Language, LearningFeedback, DeployResult } from '../types/agent';
import { exportProjectZip } from '../utils/zipExport';
import { deployToVercel, runSupabaseMigration, deployCommands } from '../services/deploy';
import { formatBytes, newId, timeAgo } from '../utils/storage';
import { toast } from './Toast';

interface WorkspaceViewProps {
  project: GeneratedProject | null;
  language: Language;
  settings: AppSettings;
  onUpdate: (id: string, patch: Partial<GeneratedProject>) => void;
  onAddFeedback: (feedback: LearningFeedback) => void;
  onOpenSettings: () => void;
  onNewBuild: () => void;
}

type Tab = 'preview' | 'code' | 'deploy' | 'verify';
type Device = 'desktop' | 'tablet' | 'mobile';

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  project, language, settings, onUpdate, onAddFeedback, onOpenSettings, onNewBuild,
}) => {
  const isUrdu = language === 'ur';
  const [tab, setTab] = useState<Tab>('preview');
  const [device, setDevice] = useState<Device>('desktop');
  const [previewKey, setPreviewKey] = useState(0);
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [busy, setBusy] = useState<'vercel' | 'supabase' | null>(null);
  const [zipBusy, setZipBusy] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingCategory, setRatingCategory] = useState('architecture');
  const [comment, setComment] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const files = project?.files || [];
  const groups = useMemo(() => {
    const map = new Map<string, typeof files>();
    files.forEach((f) => {
      const root = f.path.includes('/') ? f.path.split('/')[0] : 'root';
      const arr = map.get(root) || [];
      arr.push(f);
      map.set(root, arr);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [files]);

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map(([root, list]) => [root, list.filter((f) => f.path.toLowerCase().includes(q))] as [string, typeof files])
      .filter(([, list]) => list.length > 0);
  }, [groups, search]);

  useEffect(() => {
    if (!project) return;
    const preferred =
      project.files?.find((f) => f.path === 'web/src/App.tsx')?.path ||
      project.files?.find((f) => f.path.endsWith('.tsx'))?.path ||
      project.files?.[0]?.path ||
      '';
    setSelectedPath(preferred);
    setTab('preview');
    setRating(0);
    setComment('');
  }, [project?.id]);

  const selectedFile = files.find((f) => f.path === selectedPath);

  if (!project) {
    return (
      <div className="py-20 max-w-md mx-auto text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center">
          <Boxes className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{isUrdu ? 'ابھی کوئی بلڈ نہیں' : 'No build yet'}</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          {isUrdu
            ? 'پہلے آرکسٹریٹر سے بات کریں یا پرامپٹ فورج سے ایک بلڈ چلائیں — پھر یہاں مکمل کوڈ، لائیو پریویو اور ڈیپلائمنٹ ملے گا۔'
            : 'Talk to the orchestrator or run a build from the Forge. Your file tree, live preview, deploy controls and verification report will appear here.'}
        </p>
        <button onClick={onNewBuild} className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> {isUrdu ? 'نیا بلڈ شروع کریں' : 'Start a new build'}
        </button>
      </div>
    );
  }

  const sourceLabel = project.source === 'ai' ? `Gemini · ${project.aiModel || 'live'}` : 'Demo engine';
  const totalBytes = files.reduce((s, f) => s + f.bytes, 0);
  const vercelDeploy = project.deploys?.vercel;
  const supabaseDeploy = project.deploys?.supabase;
  const liveUrl = project.status === 'live' && project.vercel.deployUrl ? project.vercel.deployUrl : '';

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1800);
  };

  const downloadFile = (path: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = path.split('/').pop() || 'file.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleZip = async () => {
    setZipBusy(true);
    try {
      await exportProjectZip(project);
      toast.success(isUrdu ? 'ZIP ڈاؤن لوڈ ہو گیا' : 'Source ZIP downloaded');
    } catch {
      toast.error('ZIP export failed');
    } finally {
      setZipBusy(false);
    }
  };

  const openPreviewTab = () => {
    const blob = new Blob([project.previewHtml || ''], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener');
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const applyDeploy = async (provider: 'vercel' | 'supabase') => {
    if (provider === 'vercel' && !settings.vercelToken) {
      toast.info(isUrdu ? 'پہلے ورسل ٹوکن شامل کریں' : 'Add a Vercel token in Settings first');
      onOpenSettings();
      return;
    }
    if (provider === 'supabase' && (!settings.supabaseToken || !settings.supabaseProjectRef)) {
      toast.info(isUrdu ? 'سپا بیس ٹوکن اور پروجیکٹ ریف درج کریں' : 'Add a Supabase token + project ref first');
      onOpenSettings();
      return;
    }
    setBusy(provider);
    onUpdate(project.id, { status: 'deploying' });
    try {
      const result: DeployResult = provider === 'vercel'
        ? await deployToVercel(project, settings.vercelToken)
        : await runSupabaseMigration(project, settings.supabaseToken, settings.supabaseProjectRef);

      const deploys = { ...(project.deploys || {}), [provider]: result };
      const patch: Partial<GeneratedProject> = { deploys };
      if (provider === 'vercel') {
        patch.vercel = {
          ...project.vercel,
          deployUrl: result.url || project.vercel.deployUrl,
          logs: [...project.vercel.logs.slice(-40), ...result.logs],
        };
        patch.status = result.status === 'success' ? 'live' : result.status === 'failed' ? 'failed' : project.status;
      }
      onUpdate(project.id, patch);
      if (result.status === 'success') toast.success(result.message);
      else toast.error(result.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Deploy failed');
      onUpdate(project.id, { status: 'failed' });
    } finally {
      setBusy(null);
    }
  };

  const submitRating = () => {
    if (!rating) {
      toast.error(isUrdu ? 'ستارے منتخب کریں' : 'Pick a star rating');
      return;
    }
    onAddFeedback({
      id: newId('fb'),
      projectId: project.id,
      projectName: project.name,
      rating,
      category: ratingCategory,
      comment: comment.trim(),
      at: new Date().toISOString(),
    });
    toast.success(isUrdu ? 'شکریہ! اگلے بلڈ اس سے بہتر ہوگا' : 'Thanks — this shapes your next build');
    setRating(0);
    setComment('');
  };

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/80 dark:bg-[#0d0f17] border border-slate-200 dark:border-white/[0.08] shadow-lg space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
              <span className={`px-2 py-0.5 rounded-full border ${project.source === 'ai' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'}`}>
                {sourceLabel}
              </span>
              <span className={`px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                project.status === 'live' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300'
                : project.status === 'failed' ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-300'
                : 'bg-slate-500/10 border-slate-500/20 text-slate-500'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {project.status === 'live' ? 'LIVE' : project.status === 'deploying' ? 'DEPLOYING' : project.status === 'failed' ? 'DEPLOY FAILED' : 'READY'}
              </span>
              <span className="text-slate-400">{project.id}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">{project.name}</h2>
            <p className="text-[11px] text-slate-500 line-clamp-2 max-w-2xl">{project.prompt}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleZip}
              disabled={zipBusy}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-2 disabled:opacity-50"
            >
              {zipBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              {isUrdu ? 'ZIP' : 'Download ZIP'}
            </button>
            {liveUrl ? (
              <a href={liveUrl} target="_blank" rel="noreferrer" className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" /> {isUrdu ? 'لائیو دیکھیں' : 'Open live site'}
              </a>
            ) : (
              <button onClick={() => setTab('deploy')} className="px-3.5 py-2.5 rounded-xl border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 hover:bg-emerald-500/10">
                <Rocket className="w-3.5 h-3.5" /> {isUrdu ? 'لائیو کریں' : 'Publish'}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] font-mono text-slate-500">
          <span>{files.length} files</span>
          <span>{formatBytes(totalBytes)}</span>
          <span>{project.durationSeconds}s build</span>
          <span>{timeAgo(project.timestamp, isUrdu)}</span>
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3" /> {project.platforms.web ? 'Web' : ''}
            {project.platforms.ios ? ' · iOS' : ''}
            {project.platforms.android ? ' · Android' : ''}
          </span>
          <span className="text-emerald-500">Supabase RLS</span>
        </div>

        {project.warnings && project.warnings.length > 0 && (
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-300/50 dark:border-amber-500/25 text-[10px] text-amber-800 dark:text-amber-200 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>{project.warnings.slice(0, 3).join(' · ')}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] overflow-x-auto no-scrollbar">
        {([
          { id: 'preview' as const, label: isUrdu ? 'لائیو پریویو' : 'Live Preview', icon: Eye },
          { id: 'code' as const, label: isUrdu ? 'سورس کوڈ' : 'Source Files', icon: Code2 },
          { id: 'deploy' as const, label: isUrdu ? 'ڈیپلائمنٹ' : 'Deploy', icon: Rocket },
          { id: 'verify' as const, label: isUrdu ? 'تصدیق اور اسپیک' : 'Verification & Spec', icon: ShieldCheck },
        ]).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
              tab === id ? 'bg-white dark:bg-white/[0.1] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* PREVIEW */}
      {tab === 'preview' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06]">
              {([
                { id: 'desktop' as const, icon: Monitor },
                { id: 'tablet' as const, icon: Tablet },
                { id: 'mobile' as const, icon: Smartphone },
              ]).map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setDevice(id)}
                  className={`p-2 rounded-lg transition ${device === id ? 'bg-white dark:bg-white/[0.12] text-indigo-600 dark:text-white shadow-sm' : 'text-slate-400'}`}
                  aria-label={`${id} preview`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPreviewKey((k) => k + 1)} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> {isUrdu ? 'ری فریش' : 'Refresh'}
              </button>
              <button onClick={openPreviewTab} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" /> {isUrdu ? 'نئی ٹیب' : 'New tab'}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-white/[0.08] overflow-hidden bg-slate-100 dark:bg-[#080a11] shadow-2xl">
            <div className="px-4 py-2.5 border-b border-slate-200 dark:border-white/[0.06] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
              <div className="ml-2 flex-1 px-3 py-1 rounded-lg bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-[10px] font-mono text-slate-500 truncate">
                {liveUrl || `preview://${project.name.toLowerCase().replace(/\s+/g, '-')}`}
              </div>
            </div>
            <div className={`mx-auto transition-all duration-300 ${device === 'mobile' ? 'max-w-[390px]' : device === 'tablet' ? 'max-w-[820px]' : 'max-w-full'}`}>
              <iframe
                key={previewKey}
                ref={iframeRef}
                title={`${project.name} preview`}
                srcDoc={project.previewHtml || '<h1 style="font-family:sans-serif;padding:24px">No preview generated.</h1>'}
                sandbox="allow-scripts allow-forms"
                className="w-full h-[68vh] min-h-[420px] bg-white"
              />
            </div>
          </div>
          <p className="text-[10px] text-slate-500 text-center">
            {isUrdu
              ? 'یہ مکمل خودمختار HTML پریویو ہے جو ایجنٹ #4 نے بنایا — اسی کو ورسل پر لائیو کیا جاتا ہے۔'
              : 'This standalone HTML build is generated by Agent #4 and is exactly what gets published to Vercel.'}
          </p>
        </div>
      )}

      {/* CODE */}
      {tab === 'code' && (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0d0f17] overflow-hidden">
            <div className="p-2.5 border-b border-slate-200 dark:border-white/[0.06]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={isUrdu ? 'فائل تلاش کریں…' : 'Filter files…'}
                  className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] text-[11px] text-slate-800 dark:text-white outline-none focus:border-indigo-400"
                />
              </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2 space-y-2">
              {filteredGroups.map(([root, list]) => (
                <div key={root}>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                    <FolderTree className="w-3 h-3" /> {root}
                  </div>
                  {list.map((f) => (
                    <button
                      key={f.path}
                      onClick={() => setSelectedPath(f.path)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-mono truncate transition ${
                        selectedPath === f.path
                          ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-200'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                      }`}
                      title={f.path}
                    >
                      {f.path.split('/').slice(1).join('/') || f.path}
                    </button>
                  ))}
                </div>
              ))}
              {filteredGroups.length === 0 && <div className="p-4 text-center text-[11px] text-slate-500">No files match.</div>}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0d0f17] overflow-hidden min-w-0">
            {selectedFile ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 border-b border-slate-200 dark:border-white/[0.06]">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-600 dark:text-slate-300 min-w-0">
                    <FileCode2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">{selectedFile.path}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{formatBytes(selectedFile.bytes)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => copy(selectedFile.content, selectedFile.path)} className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.05] text-[10px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                      {copied === selectedFile.path ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copied === selectedFile.path ? 'Copied' : 'Copy'}
                    </button>
                    <button onClick={() => downloadFile(selectedFile.path, selectedFile.content)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300" aria-label="Download file">
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div dir="ltr" className="overflow-auto max-h-[60vh] bg-[#08090d]">
                  <div className="flex text-[11px] font-mono leading-relaxed min-w-full">
                    <div className="py-3 px-2.5 text-right text-slate-600 select-none border-r border-white/[0.05] bg-black/20 sticky left-0">
                      {selectedFile.content.split('\n').slice(0, 4000).map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                    <pre className="py-3 px-3 text-slate-300 whitespace-pre text-left">{selectedFile.content.split('\n').slice(0, 4000).join('\n')}</pre>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-10 text-center text-xs text-slate-500">Select a file to view its code.</div>
            )}
          </div>
        </div>
      )}

      {/* DEPLOY */}
      {tab === 'deploy' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DeployCard
              title="Vercel Edge"
              icon={<CloudUpload className="w-4 h-4" />}
              result={vercelDeploy}
              isUrdu={isUrdu}
              busy={busy === 'vercel'}
              connected={Boolean(settings.vercelToken)}
              onConnect={onOpenSettings}
              onRun={() => applyDeploy('vercel')}
              hint={isUrdu ? 'لائیو سٹیٹک بلڈ ورسل پر شائع ہو گا۔' : 'Publishes the generated standalone build to production.'}
              actionLabel={vercelDeploy?.status === 'success' ? (isUrdu ? 'دوبارہ شائع کریں' : 'Redeploy') : (isUrdu ? 'ورسل پر شائع کریں' : 'Deploy to Vercel')}
            />
            <DeployCard
              title="Supabase PostgreSQL"
              icon={<Database className="w-4 h-4" />}
              result={supabaseDeploy}
              isUrdu={isUrdu}
              busy={busy === 'supabase'}
              connected={Boolean(settings.supabaseToken && settings.supabaseProjectRef)}
              onConnect={onOpenSettings}
              onRun={() => applyDeploy('supabase')}
              hint={isUrdu ? 'schema.sql اور RLS پالیسیاں آپ کے پروجیکٹ پر لاگو ہوں گی۔' : 'Applies schema.sql + RLS policies to your existing project.'}
              actionLabel={isUrdu ? 'اسکیما لاگو کریں' : 'Apply schema'}
            />
          </div>

          <div className="p-4 rounded-2xl border border-indigo-300/40 dark:border-indigo-500/20 bg-indigo-50/60 dark:bg-indigo-500/[0.06] text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
            {isUrdu
              ? 'نوٹ: براؤزر سے سیدھا API کال ہوتی ہے۔ اگر ورسل یا سپا بیس CORS بلاک کرے تو نیچے دیے گئے کمانڈز یا ZIP استعمال کریں۔'
              : 'Browser calls go directly to the Vercel / Supabase APIs with your token. If a provider blocks browser CORS, use the CLI commands or the exported ZIP.'}
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0d0f17] overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-white/[0.06] flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
              <Terminal className="w-3.5 h-3.5 text-indigo-500" />
              {isUrdu ? 'ڈیپلائمنٹ لاگز' : 'Deployment log'}
              <span className="ml-auto text-[10px] font-mono text-slate-400">{project.vercel.buildTime}</span>
            </div>
            <div dir="ltr" className="p-4 bg-[#08090d] font-mono text-[11px] text-emerald-400/90 space-y-1 max-h-56 overflow-auto">
              {[...(project.deploys?.vercel?.logs || []), ...(project.deploys?.supabase?.logs || []), ...project.vercel.logs].slice(-40).map((log, i) => (
                <div key={i} className="flex gap-2"><span className="text-slate-600 select-none">›</span><span className={log.includes('error') ? 'text-rose-400' : ''}>{log}</span></div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0d0f17] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2"><Terminal className="w-3.5 h-3.5" /> CLI fallback</span>
              <button onClick={() => copy(deployCommands(project).join('\n'), 'cmds')} className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 flex items-center gap-1">
                {copied === 'cmds' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />} Copy
              </button>
            </div>
            <pre dir="ltr" className="p-3 rounded-xl bg-slate-50 dark:bg-black/40 text-[10px] font-mono text-slate-600 dark:text-slate-300 overflow-x-auto">{deployCommands(project).join('\n')}</pre>
          </div>
        </div>
      )}

      {/* VERIFY */}
      {tab === 'verify' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0d0f17] p-4 space-y-2.5">
              <h3 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Automated verification</h3>
              {(project.quality || []).map((q) => (
                <div key={q.id} className="flex items-start gap-2 text-[11px]">
                  {q.passed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />}
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{q.label}</span>
                    <span className="text-slate-400"> — {q.detail}</span>
                  </div>
                </div>
              ))}
              {(project.quality || []).length === 0 && <p className="text-[11px] text-slate-500">No checks recorded.</p>}
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0d0f17] p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2"><Layers className="w-3.5 h-3.5 text-indigo-500" /> Design system</h3>
              <div className="flex gap-2">
                {project.spec && ['primary', 'accent', 'surface'].map((key) => {
                  const color = (project.spec!.design as unknown as Record<string, string>)[key];
                  return (
                    <div key={key} className="flex-1 space-y-1">
                      <div className="h-12 rounded-xl border border-black/10" style={{ background: color }} />
                      <div className="text-[9px] font-mono text-slate-500">{key} {color}</div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{project.spec?.design.style}</p>
              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-slate-500">
                <span className="truncate">web: {project.spec?.stack.web}</span>
                <span className="truncate">ios: {project.spec?.stack.ios}</span>
                <span className="truncate">android: {project.spec?.stack.android}</span>
                <span className="truncate">db: {project.spec?.stack.backend}</span>
              </div>
            </div>
          </div>

          {project.spec && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0d0f17] p-4 space-y-2">
                <h3 className="text-xs font-bold text-slate-800 dark:text-white">Screens & features</h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.spec.screens.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/[0.05] text-[10px] text-slate-600 dark:text-slate-300">{s}</span>
                  ))}
                </div>
                <div className="space-y-1.5 pt-1">
                  {project.spec.features.map((f, i) => (
                    <div key={i} className="text-[11px]">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{f.title}</span>
                      <span className="text-slate-500"> — {f.description}</span>
                    </div>
                  ))}
                </div>
                {project.spec.risks.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-white/[0.06] space-y-1">
                    <div className="text-[10px] uppercase font-semibold text-amber-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Risks</div>
                    {project.spec.risks.map((r, i) => <div key={i} className="text-[10px] text-slate-500">• {r}</div>)}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0d0f17] p-4 space-y-2">
                <h3 className="text-xs font-bold text-slate-800 dark:text-white">Data models</h3>
                {project.spec.dataModels.map((m) => (
                  <div key={m.name} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] space-y-1">
                    <div className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-300">{m.name}</div>
                    <div className="text-[10px] text-slate-500">{m.columns.map((c) => `${c.name}:${c.type}`).join(' · ')}</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400">RLS: {m.rls[0] || 'protected'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-purple-300/40 dark:border-purple-500/20 bg-purple-50/60 dark:bg-purple-500/[0.06] p-4 space-y-3">
            <h3 className="text-xs font-bold text-purple-800 dark:text-purple-200 flex items-center gap-2"><Star className="w-3.5 h-3.5" /> Rate this build · teach the orchestrator</h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setRating(n)} aria-label={`${n} stars`} className="p-0.5">
                    <Star className={`w-5 h-5 ${n <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
                  </button>
                ))}
              </div>
              <select
                value={ratingCategory}
                onChange={(e) => setRatingCategory(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-white/80 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-[11px] text-slate-700 dark:text-slate-200"
              >
                <option value="architecture">Architecture</option>
                <option value="ui">UI / UX</option>
                <option value="mobile">Mobile</option>
                <option value="security">Security</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={isUrdu ? 'کیا بہتر ہو سکتا ہے؟ (اختیاری)' : 'What should improve next time? (optional)'}
                className="flex-1 px-3 py-2 rounded-xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] text-[11px] text-slate-800 dark:text-white outline-none focus:border-purple-400"
              />
              <button onClick={submitRating} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold">
                {isUrdu ? 'فیڈ بیک جمع کریں' : 'Submit feedback'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DeployCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  result?: DeployResult;
  isUrdu: boolean;
  busy: boolean;
  connected: boolean;
  hint: string;
  actionLabel: string;
  onConnect: () => void;
  onRun: () => void;
}> = ({ title, icon, result, isUrdu, busy, connected, hint, actionLabel, onConnect, onRun }) => {
  const status = result?.status;
  const statusColor =
    status === 'success' ? 'text-emerald-600 dark:text-emerald-400'
    : status === 'failed' ? 'text-rose-600 dark:text-rose-400'
    : 'text-slate-500';
  return (
    <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0d0f17] space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">{icon}{title}</div>
        <span className={`text-[9px] font-mono uppercase ${statusColor}`}>{status || 'not deployed'}</span>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">{hint}</p>
      {result?.message && (
        <p className={`text-[10px] leading-relaxed ${statusColor}`}>{result.message}</p>
      )}
      {result?.url && (
        <a href={result.url} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-indigo-500 hover:underline flex items-center gap-1 truncate">
          <ExternalLink className="w-3 h-3 shrink-0" /> {result.url}
        </a>
      )}
      <div className="flex flex-wrap gap-2 pt-1">
        <button
          onClick={connected ? onRun : onConnect}
          disabled={busy}
          className={`px-3 py-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5 disabled:opacity-50 ${
            connected ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-indigo-600 text-white'
          }`}
        >
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : connected ? <Play className="w-3.5 h-3.5" /> : <Settings2 className="w-3.5 h-3.5" />}
          {connected ? actionLabel : isUrdu ? 'ٹوکن شامل کریں' : 'Connect token'}
        </button>
      </div>
    </div>
  );
};
