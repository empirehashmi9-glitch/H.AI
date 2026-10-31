import React, { useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowUpRight, Check, ChevronDown, Code2, Database, Download, ExternalLink,
  FileCode2, Globe, History, Loader2, MessageSquareHeart, Play, Rocket, Sparkles, Star,
  Terminal, TriangleAlert, Wand2,
} from 'lucide-react';
import { useApp } from '../../state/app';
import { GeneratedProject, LearningFeedback } from '../../types/agent';
import { deployCommands, deployToVercel, runSupabaseMigration } from '../../services/deploy';
import { legacyToFiles } from '../../services/buildPipeline';
import { exportProjectZip } from '../../utils/zipExport';
import { newId, timeAgo } from '../../utils/storage';
import { toast } from '../../components/Toast';
import {
  Btn, CopyButton, EmptyState, IconTile, Panel, Pill, ProgressBar, Stars, cx,
} from '../../ui/Toon';
import { BrowserFrame, PhoneMockup } from '../shared/DevicePreview';
import { PlatformPills, paletteFor, statusTone } from '../shared/ProjectCard';

type Tab = 'preview' | 'refine' | 'files' | 'deploy' | 'feedback';

const TABS: Array<{ id: Tab; label: string; icon: React.ElementType }> = [
  { id: 'preview', label: 'Preview', icon: Play },
  { id: 'refine', label: 'Refine', icon: Wand2 },
  { id: 'files', label: 'Files', icon: FileCode2 },
  { id: 'deploy', label: 'Deploy', icon: Rocket },
  { id: 'feedback', label: 'Feedback', icon: MessageSquareHeart },
];

const REFINE_IDEAS = [
  'Make it dark and premium',
  'Add pricing plans',
  'Add login and accounts',
  'Add customer reviews',
  'Add an operator analytics view',
  'Add an AI support chat',
  'Add English + Urdu layouts',
];

export const AppDetailPage: React.FC<{
  onBack: () => void;
  onGoAccount: () => void;
  onNewBuild: () => void;
}> = ({ onBack, onGoAccount, onNewBuild }) => {
  const { activeProject: project, settings, updateProject, addFeedback, feedback, refine, refiningId, aiLive, progress, stageMessage } = useApp();
  const [tab, setTab] = useState<Tab>('preview');
  const [activeFile, setActiveFile] = useState('');
  const [busy, setBusy] = useState<null | 'vercel' | 'supabase'>(null);
  const [showCommands, setShowCommands] = useState(false);
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('architecture');
  const [comment, setComment] = useState('');
  const [instruction, setInstruction] = useState('');
  const refining = Boolean(project && refiningId === project.id);

  const files = useMemo(() => {
    if (!project) return [];
    if (project.files?.length) return project.files;
    try {
      return legacyToFiles(project);
    } catch {
      return [];
    }
  }, [project]);

  if (!project) {
    return (
      <EmptyState
        icon={<Code2 className="w-6 h-6" />}
        title="No app selected"
        sub="Build something in the Studio or open an app from your shelf."
        action={<Btn tone="coral" onClick={onNewBuild}>Open the Studio</Btn>}
      />
    );
  }

  const [c1, c2] = paletteFor(project);
  const currentFile = files.find((f) => f.path === activeFile) || files[0];
  const projectFeedback = feedback.filter((f) => f.projectId === project.id);
  const revisions = [...(project.revisions || [])].reverse();
  const avgRating = projectFeedback.length
    ? projectFeedback.reduce((s, f) => s + f.rating, 0) / projectFeedback.length
    : 0;

  const openPreview = () => {
    if (!project.previewHtml) {
      toast.error('No preview bundle in this build');
      return;
    }
    const blob = new Blob([project.previewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const zip = () => exportProjectZip(project).catch(() => toast.error('ZIP export failed'));

  const deploy = async (provider: 'vercel' | 'supabase') => {
    if (provider === 'vercel' && !settings.vercelToken.trim()) {
      toast.error('Add a Vercel token in Account first');
      onGoAccount();
      return;
    }
    if (provider === 'supabase' && (!settings.supabaseToken.trim() || !settings.supabaseProjectRef.trim())) {
      toast.error('Add a Supabase token and project ref in Account first');
      onGoAccount();
      return;
    }
    setBusy(provider);
    try {
      if (provider === 'vercel') {
        const result = await deployToVercel(project, settings.vercelToken);
        updateProject(project.id, {
          status: result.status === 'success' ? 'live' : result.status === 'failed' ? 'failed' : project.status,
          deploys: { ...(project.deploys || {}), vercel: result },
          vercel: {
            ...project.vercel,
            deployed: result.status === 'success',
            deployUrl: result.url || project.vercel.deployUrl,
          },
        });
        if (result.status === 'success') toast.success('Deployed to Vercel');
        else toast.error(result.message);
      } else {
        const result = await runSupabaseMigration(project, settings.supabaseToken, settings.supabaseProjectRef);
        updateProject(project.id, {
          deploys: { ...(project.deploys || {}), supabase: result },
          supabase: { ...project.supabase, deployed: result.status === 'success' },
        });
        if (result.status === 'success') toast.success('Supabase schema applied');
        else toast.error(result.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Deploy failed');
    } finally {
      setBusy(null);
    }
  };

  const submitFeedback = () => {
    if (!rating) {
      toast.error('Pick a star rating first');
      return;
    }
    addFeedback({
      id: newId('fb'),
      projectId: project.id,
      projectName: project.name,
      rating,
      category,
      comment: comment.trim(),
      at: new Date().toISOString(),
    });
    toast.success('Thanks — the crew will learn from this');
    setRating(0);
    setComment('');
  };

  const applyRefine = async () => {
    if (!instruction.trim() || refining) return;
    const updated = await refine(project.id, instruction);
    if (updated) {
      setInstruction('');
      setTab('preview');
    }
  };

  const vercel = project.deploys?.vercel;
  const supabase = project.deploys?.supabase;

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-full border border-aqua/25 bg-white/[0.04] px-3 py-1.5 text-[11px] font-extrabold text-ink-soft hover:text-ink hover:border-aqua/45 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All apps
        </button>
        <span className="text-[10px] font-bold text-ink-soft">
          Built {timeAgo(project.timestamp, false)} · {project.durationSeconds}s
        </span>
      </div>

      <Panel className="overflow-hidden">
        <div className="relative overflow-hidden p-5 sm:p-6" style={{ background: `radial-gradient(120% 140% at 0% 0%, ${c1}30, transparent 60%), radial-gradient(120% 140% at 100% 100%, ${c2}1c, transparent 60%), linear-gradient(180deg, #04161f, #020a11)` }}>
          <div className="absolute inset-0 hud-grid opacity-30" />
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <Pill tone={statusTone(project.status) as any}>{project.status || 'ready'}</Pill>
                <Pill tone={project.source === 'ai' ? 'grape' : 'cream'}>
                  {project.source === 'ai' ? 'AI build' : 'Demo build'}
                </Pill>
              </div>
              <h1 className="text-3xl sm:text-4xl leading-[1.05] mt-2 break-words">{project.name}</h1>
              <p className="text-xs sm:text-sm font-bold text-ink/75 mt-1 max-w-2xl">
                {project.spec?.tagline || project.prompt}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                <PlatformPills project={project} />
                <Pill tone="cream">{files.length} files</Pill>
                {project.revisions?.length ? (
                  <Pill tone="grape">rev {project.revisions.length}</Pill>
                ) : null}
                {project.rating ? <Pill tone="sun"><Star className="w-2.5 h-2.5 fill-ink" /> {project.rating}</Pill> : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <Btn tone="aqua" size="sm" onClick={openPreview}>
                <Play className="w-3.5 h-3.5" /> Live preview
              </Btn>
              <Btn tone="cream" size="sm" onClick={zip}>
                <Download className="w-3.5 h-3.5" /> ZIP
              </Btn>
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-5 gap-1.5" role="tablist" aria-label="App details">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cx(
              'inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-full border px-1.5 sm:px-3.5 py-1.5 text-[10px] sm:text-[11px] font-extrabold transition',
              tab === id ? 'bg-aqua/15 border-aqua/50 text-aqua' : 'bg-white/[0.04] border-white/10 text-ink-soft hover:text-ink hover:border-aqua/35',
            )}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" /> {label}
          </button>
        ))}
      </div>

      {tab === 'preview' && (
        <div className="space-y-4 anim-rise">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-bold text-ink-soft">
              Real HTML bundle generated by your build · sandboxed preview
            </p>
            <Btn tone="cream" size="xs" onClick={openPreview}>
              Open in new tab <ExternalLink className="w-3 h-3" />
            </Btn>
          </div>

          <BrowserFrame project={project} />

          {project.spec && (
            <Panel className="p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-soft">Blueprint</div>
                  <h3 className="text-lg leading-none mt-1">{project.spec.category} · {project.spec.design.style || 'modern'}</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  {[project.spec.design.primary, project.spec.design.accent, project.spec.design.surface].map((color, i) => (
                    <span
                      key={`${color}-${i}`}
                      title={color}
                      className="w-6 h-6 rounded-full border border-white/25 shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-2">
                {project.spec.features.slice(0, 3).map((f, i) => (
                  <div key={`${f.title}-${i}`} className="rounded-xl border border-aqua/15 bg-white/[0.03] p-2.5">
                    <div className="text-[11px] font-extrabold leading-tight">{f.title}</div>
                    <div className="text-[10px] text-ink-soft line-clamp-2 mt-0.5">{f.description}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {(project.platforms.ios || project.platforms.android) && (
            <div className="grid sm:grid-cols-2 gap-4">
              {project.platforms.ios && (
                <Panel className="p-4 bg-gradient-to-b from-[#071e28] to-[#02101a]">
                  <PhoneMockup project={project} platform="ios" />
                </Panel>
              )}
              {project.platforms.android && (
                <Panel className="p-4 bg-gradient-to-b from-[#071e28] to-[#02101a]">
                  <PhoneMockup project={project} platform="android" />
                </Panel>
              )}
            </div>
          )}
        </div>
      )}

      {tab === 'refine' && (
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] items-start gap-4 anim-rise">
          <Panel className="p-4 sm:p-5 space-y-4">
            <div className="flex items-start gap-2.5">
              <IconTile tone="grape" className="w-10 h-10 rounded-xl">
                <Wand2 className="w-5 h-5" />
              </IconTile>
              <div className="min-w-0">
                <h3 className="text-xl leading-none">Ask the crew for a change</h3>
                <p className="text-[11px] font-bold text-ink-soft mt-1 leading-relaxed">
                  Describe one tweak in plain English or Roman Urdu. The 30 agents re-work the build and save it as a
                  new revision.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {REFINE_IDEAS.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  onClick={() => setInstruction(idea)}
                  disabled={refining}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold text-ink-soft hover:border-aqua/45 hover:text-ink hover:bg-white/[0.07] transition disabled:opacity-50"
                >
                  {idea}
                </button>
              ))}
            </div>

            <div>
              <label htmlFor="refine-instruction" className="text-[10px] font-extrabold uppercase tracking-wider text-ink-soft">
                Change request
              </label>
              <textarea
                id="refine-instruction"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                rows={4}
                disabled={refining}
                className="field mt-1 resize-y text-sm leading-relaxed disabled:opacity-60"
                placeholder="e.g. Make the hero darker, add a pricing section and put a login button in the header"
              />
            </div>

            {refining && (
              <div className="rounded-xl border border-aqua/25 bg-aqua/[0.05] p-3 space-y-2">
                <div className="flex items-center justify-between gap-2 text-[10px] font-extrabold text-ink-soft">
                  <span className="truncate">{stageMessage}</span>
                  <span className="font-mono shrink-0">{Math.round(progress)}%</span>
                </div>
                <ProgressBar value={progress} tone="aqua" striped height="h-2" />
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-aqua/10 pt-3">
              <span className="text-[10px] font-bold text-ink-soft flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Every revision is saved with a changelog
              </span>
              <Btn tone="coral" onClick={applyRefine} disabled={!instruction.trim() || refining}>
                {refining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {refining ? 'Applying…' : 'Apply change'}
              </Btn>
            </div>

            {!aiLive && (
              <p className="text-[10px] font-semibold text-ink-soft leading-relaxed">
                Demo engine updates the live preview, blueprint and changelog instantly. Add a Gemini key in Account
                to let the agents rewrite the real source too.
              </p>
            )}
          </Panel>

          <Panel className="p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg leading-none flex items-center gap-2">
                <History className="w-4 h-4" /> Revision history
              </h3>
              <Pill tone="grape">{revisions.length}</Pill>
            </div>

            {revisions.length ? (
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {revisions.map((rev) => (
                  <div key={rev.id} className="rounded-xl border border-aqua/15 bg-white/[0.03] p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold text-aqua">v{rev.version}</span>
                      <span className="text-[9px] font-bold text-ink-soft">{timeAgo(rev.at, false)}</span>
                    </div>
                    <p className="text-[11px] font-semibold leading-relaxed mt-1">{rev.instruction}</p>
                    <p className="text-[9px] font-bold uppercase tracking-wide text-grape mt-1">{rev.summary}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<History className="w-5 h-5" />}
                title="No revisions yet"
                sub="Ask for a change and it will show up here with a version number."
                className="py-8"
              />
            )}

            <div className="rounded-xl border border-mint/20 bg-mint/[0.06] p-3 text-[10px] font-bold text-ink-soft leading-relaxed">
              <span className="flex items-center gap-1.5 text-ink">
                <Check className="w-3.5 h-3.5" /> Changelog file
              </span>
              Every revision is also written to CHANGELOG.md inside the generated files.
            </div>
          </Panel>
        </div>
      )}

      {tab === 'files' && (
        <div className="grid lg:grid-cols-[270px_1fr] items-start gap-3 anim-rise">
          <Panel className="p-2 max-h-[480px] overflow-y-auto">
            <div className="px-2 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-soft">
              {files.length} files
            </div>
            <div className="space-y-0.5">
              {files.map((file) => (
                <button
                  key={file.path}
                  onClick={() => setActiveFile(file.path)}
                  className={cx(
                    'w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 transition',
                    currentFile?.path === file.path
                      ? 'bg-aqua/15 border border-aqua/35 text-aqua'
                      : 'hover:bg-white/[0.05] border border-transparent',
                  )}
                >
                  <FileCode2 className="w-3.5 h-3.5 shrink-0 text-ink-soft" />
                  <span className="font-mono text-[10px] truncate flex-1">{file.path}</span>
                  <span className="text-[8px] font-extrabold uppercase text-ink-soft/70">{file.language}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            {currentFile ? (
              <>
                <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-aqua/15 bg-[#071e28]">
                  <span className="font-mono text-[10px] truncate">{currentFile.path}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-ink-soft">{(currentFile.bytes / 1024).toFixed(1)} KB</span>
                    <CopyButton text={currentFile.content} label="Copy file" />
                  </div>
                </div>
                <pre dir="ltr" className="bg-[#040c14] text-[#cfe9f5] p-4 text-[11px] leading-relaxed font-mono overflow-auto max-h-[430px] max-w-full">
                  <code>{currentFile.content}</code>
                </pre>
              </>
            ) : (
              <div className="p-6 text-center text-xs font-bold text-ink-soft">No files in this build.</div>
            )}
          </Panel>
        </div>
      )}

      {tab === 'deploy' && (
        <div className="space-y-4 anim-rise">
          <div className="grid md:grid-cols-2 gap-4">
            <Panel className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <IconTile tone="cream" className="w-10 h-10 rounded-xl">
                    <Rocket className="w-5 h-5" />
                  </IconTile>
                  <div>
                    <h3 className="text-lg leading-none">Vercel</h3>
                    <p className="text-[10px] font-bold text-ink-soft">static edge deploy</p>
                  </div>
                </div>
                <Pill tone={vercel?.status === 'success' ? 'mint' : vercel?.status === 'failed' ? 'coral' : 'cream'}>
                  {vercel?.status?.replace('_', ' ') || 'not deployed'}
                </Pill>
              </div>
              <p className="text-[11px] text-ink-soft leading-relaxed">
                Publishes the generated web bundle as a production deployment and returns a live URL.
              </p>
              {vercel?.url && (
                <a href={vercel.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-extrabold text-grape underline break-all">
                  {vercel.url} <ArrowUpRight className="w-3 h-3 shrink-0" />
                </a>
              )}
              {settings.vercelToken ? (
                <Btn tone="grape" size="sm" block onClick={() => deploy('vercel')} disabled={busy === 'vercel'}>
                  {busy === 'vercel' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                  {busy === 'vercel' ? 'Deploying…' : 'Deploy to Vercel'}
                </Btn>
              ) : (
                <Btn tone="cream" size="sm" block onClick={onGoAccount}>
                  <TriangleAlert className="w-4 h-4" /> Add Vercel token
                </Btn>
              )}
              {vercel?.logs?.length ? (
                <div className="max-h-28 overflow-auto rounded-xl bg-[#040c14] text-[#cfe9f5] p-2.5 text-[9px] font-mono">
                  {vercel.logs.slice(-6).map((log, i) => <div key={i}>{log}</div>)}
                </div>
              ) : null}
            </Panel>

            <Panel className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <IconTile tone="mint" className="w-10 h-10 rounded-xl">
                    <Database className="w-5 h-5" />
                  </IconTile>
                  <div>
                    <h3 className="text-lg leading-none">Supabase</h3>
                    <p className="text-[10px] font-bold text-ink-soft">schema + RLS migration</p>
                  </div>
                </div>
                <Pill tone={supabase?.status === 'success' ? 'mint' : supabase?.status === 'failed' ? 'coral' : 'cream'}>
                  {supabase?.status?.replace('_', ' ') || 'not applied'}
                </Pill>
              </div>
              <p className="text-[11px] text-ink-soft leading-relaxed">
                Applies the generated SQL and security policies to the Supabase project set in Account.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <Pill tone="cream">{project.supabase.tables.length} tables</Pill>
                <Pill tone="cream">{project.supabase.edgeFunctions.length} functions</Pill>
              </div>
              {settings.supabaseToken && settings.supabaseProjectRef ? (
                <Btn tone="mint" size="sm" block onClick={() => deploy('supabase')} disabled={busy === 'supabase'}>
                  {busy === 'supabase' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                  {busy === 'supabase' ? 'Applying…' : 'Apply Supabase schema'}
                </Btn>
              ) : (
                <Btn tone="cream" size="sm" block onClick={onGoAccount}>
                  <TriangleAlert className="w-4 h-4" /> Add Supabase credentials
                </Btn>
              )}
              {supabase?.logs?.length ? (
                <div className="max-h-28 overflow-auto rounded-xl bg-[#040c14] text-[#cfe9f5] p-2.5 text-[9px] font-mono">
                  {supabase.logs.slice(-6).map((log, i) => <div key={i}>{log}</div>)}
                </div>
              ) : null}
            </Panel>
          </div>

          <Panel className="p-4 sm:p-5">
            <button
              onClick={() => setShowCommands((v) => !v)}
              className="w-full flex items-center justify-between gap-2"
              aria-expanded={showCommands}
            >
              <span className="flex items-center gap-2 text-sm font-extrabold">
                <Terminal className="w-4 h-4" /> Deploy from your terminal
              </span>
              <ChevronDown className={cx('w-4 h-4 transition', showCommands && 'rotate-180')} />
            </button>
            {showCommands && (
              <div className="mt-3 space-y-2 anim-rise">
                <div className="flex justify-end">
                  <CopyButton text={deployCommands(project).join('\n')} label="Copy commands" />
                </div>
                <pre dir="ltr" className="rounded-xl bg-[#040c14] text-[#cfe9f5] p-3 text-[10px] leading-relaxed font-mono overflow-auto max-h-56">
                  {deployCommands(project).join('\n')}
                </pre>
              </div>
            )}
          </Panel>

          <p className="text-[10px] font-semibold text-ink-soft leading-relaxed">
            Browser deploys use your token directly from this device. If Vercel blocks the request
            (CORS), use the ZIP + terminal commands above. Tokens are never sent anywhere except the
            selected provider.
          </p>
        </div>
      )}

      {tab === 'feedback' && (
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-4 anim-rise">
          <Panel className="p-5 space-y-3">
            <div>
              <h3 className="text-xl leading-none">Rate this build</h3>
              <p className="text-[11px] font-bold text-ink-soft mt-1">
                Your rating updates the crew's prompt weights for the next build.
              </p>
            </div>
            <Stars value={rating} onChange={setRating} size={30} />
            <div className="flex flex-wrap gap-1.5">
              {['architecture', 'design', 'speed', 'accuracy'].map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cx(
                    'rounded-full border px-3 py-1 text-[10px] font-extrabold capitalize transition',
                    category === c ? 'bg-sun/15 border-sun/50 text-sun' : 'bg-white/[0.04] border-white/10 text-ink-soft hover:text-ink',
                  )}
                  aria-pressed={category === c}
                >
                  {c}
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="field resize-y"
              placeholder="What should the crew keep or change?"
            />
            <Btn tone="coral" onClick={submitFeedback} disabled={!rating}>
              <MessageSquareHeart className="w-4 h-4" /> Send feedback
            </Btn>
          </Panel>

          <Panel className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-none">This app's feedback</h3>
              <Pill tone="cream">
                <Star className="w-2.5 h-2.5 fill-sun" /> {avgRating ? avgRating.toFixed(1) : '—'}
              </Pill>
            </div>
            {projectFeedback.length ? (
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {projectFeedback.map((f: LearningFeedback) => (
                  <div key={f.id} className="rounded-xl border border-aqua/15 bg-white/[0.03] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <Stars value={f.rating} size={12} />
                      <span className="text-[9px] font-bold text-ink-soft">{timeAgo(f.at, false)}</span>
                    </div>
                    <div className="mt-1 text-[10px] font-extrabold uppercase tracking-wide text-grape">{f.category}</div>
                    {f.comment && <p className="text-[11px] text-ink-soft mt-1 leading-relaxed">{f.comment}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<MessageSquareHeart className="w-5 h-5" />}
                title="No feedback yet"
                sub="Be the first to rate this build and teach the crew."
                className="py-8"
              />
            )}
            <div className="rounded-xl border border-mint/20 bg-mint/[0.06] p-3 text-[10px] font-bold text-ink-soft leading-relaxed">
              <span className="flex items-center gap-1.5 text-ink"><Check className="w-3.5 h-3.5" /> Learning loop</span>
              Ratings bias your next build toward what worked.
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
};
