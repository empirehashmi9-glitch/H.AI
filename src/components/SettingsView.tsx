import React, { useRef, useState } from 'react';
import {
  KeyRound, Cpu, Rocket, BrainCircuit, Database, CloudUpload, Eye, EyeOff,
  CheckCircle2, XCircle, Loader2, ShieldCheck, Download, Upload, Trash2,
  Sparkles, PlugZap, HardDrive, ExternalLink, Info
} from 'lucide-react';
import { AppSettings, Language } from '../types/agent';
import { GEMINI_MODELS } from '../config/app';
import { hasAI } from '../services/ai';
import { testGeminiConnection } from '../services/ai';
import { testVercelToken, testSupabaseToken } from '../services/deploy';
import { toast } from './Toast';

interface SettingsViewProps {
  settings: AppSettings;
  onChange: (patch: Partial<AppSettings>) => void;
  language: Language;
  counts: { projects: number; tickets: number; feedback: number };
  onClearData: () => void;
  onImportData: (payload: { projects?: unknown; tickets?: unknown; feedback?: unknown }) => void;
}

type TestState = { pending: boolean; ok?: boolean; message?: string };

const emptyTest: TestState = { pending: false };

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings, onChange, language, counts, onClearData, onImportData,
}) => {
  const isUrdu = language === 'ur';
  const [showGemini, setShowGemini] = useState(false);
  const [showVercel, setShowVercel] = useState(false);
  const [showSupabase, setShowSupabase] = useState(false);
  const [geminiTest, setGeminiTest] = useState<TestState>(emptyTest);
  const [vercelTest, setVercelTest] = useState<TestState>(emptyTest);
  const [supabaseTest, setSupabaseTest] = useState<TestState>(emptyTest);
  const [confirmClear, setConfirmClear] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  const aiLive = hasAI(settings);

  const runGeminiTest = async () => {
    setGeminiTest({ pending: true });
    const res = await testGeminiConnection(settings);
    setGeminiTest({ pending: false, ok: res.ok, message: res.message });
    if (res.ok) toast.success(res.message); else toast.error(res.message);
  };

  const runVercelTest = async () => {
    setVercelTest({ pending: true });
    const res = await testVercelToken(settings.vercelToken);
    setVercelTest({ pending: false, ok: res.ok, message: res.message });
    if (res.ok) toast.success(res.message); else toast.error(res.message);
  };

  const runSupabaseTest = async () => {
    setSupabaseTest({ pending: true });
    const res = await testSupabaseToken(settings.supabaseToken);
    setSupabaseTest({ pending: false, ok: res.ok, message: res.message });
    if (res.ok) toast.success(res.message); else toast.error(res.message);
  };

  const exportData = () => {
    const payload = {
      version: 5,
      exportedAt: new Date().toISOString(),
      settings: { ...settings, geminiKey: '', vercelToken: '', supabaseToken: '' },
      counts,
      note: 'Credentials are excluded. Re-enter API keys after import.',
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hai-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(isUrdu ? 'بیک اپ ڈاؤن لوڈ ہو گیا' : 'Backup downloaded');
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      onImportData({ projects: data.projects, tickets: data.tickets, feedback: data.feedback });
      toast.success(isUrdu ? 'ڈیٹا بحال ہو گیا' : 'Data imported successfully');
    } catch {
      toast.error(isUrdu ? 'فائل درست نہیں ہے' : 'Invalid backup file');
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/[0.06]">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isUrdu ? 'کنٹرول سینٹر اور API کنکشنز' : 'Control Center & Connections'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl">
            {isUrdu
              ? 'یہاں اپنی Gemini کلید، ورسل اور سپا بیس ٹوکنز محفوظ کریں۔ سب کچھ صرف اسی براؤزر میں محفوظ رہتا ہے۔'
              : 'Connect your own Gemini, Vercel and Supabase credentials. Everything is stored locally in this browser only — never sent to our servers.'}
          </p>
        </div>
        <div className={`px-4 py-2.5 rounded-2xl border font-mono text-xs flex items-center gap-2 ${aiLive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'}`}>
          <span className={`w-2 h-2 rounded-full ${aiLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          {aiLive ? 'LIVE · Gemini connected' : 'DEMO MODE · no API key'}
        </div>
      </div>

      {!aiLive && (
        <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-200">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="font-semibold">{isUrdu ? 'ابھی ڈیمو موڈ فعال ہے' : 'You are in demo mode'}</p>
            <p className="leading-relaxed">
              {isUrdu
                ? 'کلید کے بغیر سسٹم تیار شدہ ٹیمپلیٹس سے کوڈ بناتا ہے۔ حقیقی Gemini سے ہر پرامپٹ کے مطابق نیا کوڈ بنانے کے لیے نیچے اپنی API کلید درج کریں۔'
                : 'Without a key, builds use deterministic templates. Add your Gemini API key below to synthesize real, prompt-specific code, SQL and previews.'}
            </p>
          </div>
        </div>
      )}

      {/* AI Engine */}
      <section className="p-6 rounded-3xl bg-white/80 dark:bg-[#0d0f17] border border-slate-200 dark:border-white/[0.08] space-y-5">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-500" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">AI Engine · Google Gemini</h3>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center justify-between">
            <span>GEMINI_API_KEY</span>
            <span className="text-[10px] text-slate-400">{isUrdu ? 'صرف مقامی براؤزر میں محفوظ' : 'stored locally'}</span>
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showGemini ? 'text' : 'password'}
              value={settings.geminiKey}
              onChange={(e) => onChange({ geminiKey: e.target.value.trim() })}
              placeholder="AIza…"
              autoComplete="off"
              spellCheck={false}
              className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
            <button type="button" onClick={() => setShowGemini((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white" aria-label="Toggle key visibility">
              {showGemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            {isUrdu
              ? 'کلید aistudio.google.com/apikey سے بنائیں۔ اگر AI Studio میں پہلے سے کلید موجود ہے تو یہ خودکار استعمال ہوگی۔'
              : 'Create a key at aistudio.google.com/apikey. If a GEMINI_API_KEY secret already exists in AI Studio, it is picked up automatically.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Model</label>
            <select
              value={settings.model}
              onChange={(e) => onChange({ model: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              {GEMINI_MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.label} — {m.note}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={runGeminiTest}
              disabled={geminiTest.pending || !settings.geminiKey}
              className="w-full px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {geminiTest.pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlugZap className="w-3.5 h-3.5" />}
              {isUrdu ? 'کنکشن ٹیسٹ کریں' : 'Test connection'}
            </button>
          </div>
        </div>

        <TestResult state={geminiTest} />
      </section>

      {/* Deployment */}
      <section className="p-6 rounded-3xl bg-white/80 dark:bg-[#0d0f17] border border-slate-200 dark:border-white/[0.08] space-y-5">
        <div className="flex items-center gap-2">
          <Rocket className="w-4 h-4 text-emerald-500" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Deployment · Vercel & Supabase</h3>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5">
            <CloudUpload className="w-3 h-3" /> VERCEL_TOKEN
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type={showVercel ? 'text' : 'password'}
                value={settings.vercelToken}
                onChange={(e) => onChange({ vercelToken: e.target.value.trim() })}
                placeholder="vercel_…"
                autoComplete="off"
                spellCheck={false}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <button type="button" onClick={() => setShowVercel((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle token visibility">
                {showVercel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={runVercelTest}
              disabled={vercelTest.pending || !settings.vercelToken}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-emerald-400 transition flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {vercelTest.pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              Verify
            </button>
          </div>
          <TestResult state={vercelTest} />
          <p className="text-[10px] text-slate-500">
            {isUrdu ? 'ورسل اکاؤنٹ ٹوکن بنائیں اور لائیو پبلشنگ فعال کریں۔' : 'Create a token at vercel.com/account/tokens. The static preview is published as a production deployment.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5">
              <Database className="w-3 h-3" /> SUPABASE_ACCESS_TOKEN
            </label>
            <div className="relative">
              <input
                type={showSupabase ? 'text' : 'password'}
                value={settings.supabaseToken}
                onChange={(e) => onChange({ supabaseToken: e.target.value.trim() })}
                placeholder="sbp_…"
                autoComplete="off"
                spellCheck={false}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <button type="button" onClick={() => setShowSupabase((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle token visibility">
                {showSupabase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">SUPABASE_PROJECT_REF</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.supabaseProjectRef}
                onChange={(e) => onChange({ supabaseProjectRef: e.target.value.trim().toLowerCase() })}
                placeholder="abcdefghijklmnopqrst"
                autoComplete="off"
                spellCheck={false}
                className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={runSupabaseTest}
                disabled={supabaseTest.pending || !settings.supabaseToken}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-emerald-400 transition flex items-center justify-center disabled:opacity-40"
                aria-label="Test Supabase token"
              >
                {supabaseTest.pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
        <TestResult state={supabaseTest} />

        <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={settings.autoDeploy}
            onChange={(e) => onChange({ autoDeploy: e.target.checked })}
            className="mt-0.5 accent-emerald-500"
          />
          <span className="text-xs text-slate-700 dark:text-slate-300">
            <span className="font-semibold block">{isUrdu ? 'ہر بلڈ کے بعد خودکار ڈیپلائے' : 'Auto-deploy after every build'}</span>
            <span className="text-[11px] text-slate-500">
              {isUrdu ? 'ٹوکن موجود ہوں تو لائیو پبلش ہو گا، ورنہ صرف کوڈ تیار رہے گا۔' : 'Publishes the generated web preview to Vercel and applies the schema to Supabase when credentials are present.'}
            </span>
          </span>
        </label>
      </section>

      {/* Learning */}
      <section className="p-6 rounded-3xl bg-white/80 dark:bg-[#0d0f17] border border-slate-200 dark:border-white/[0.08] space-y-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-purple-500" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Self-learning loop</h3>
        </div>
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={settings.learningEnabled}
            onChange={(e) => onChange({ learningEnabled: e.target.checked })}
            className="mt-0.5 accent-purple-500"
          />
          <span className="text-xs text-slate-700 dark:text-slate-300">
            <span className="font-semibold block">{isUrdu ? 'ریٹنگز کو اگلے بلڈز میں استعمال کریں' : 'Feed build ratings into future prompts'}</span>
            <span className="text-[11px] text-slate-500">
              {isUrdu
                ? `آپ کی ${counts.feedback} ریٹنگز اور تبصرے اگلے پرامپٹ کے ساتھ آرکسٹریٹر کو بھیجے جاتے ہیں۔`
                : `${counts.feedback} ratings and comments are distilled into learned preferences passed to the orchestrator on every new build.`}
            </span>
          </span>
        </label>
      </section>

      {/* Data */}
      <section className="p-6 rounded-3xl bg-white/80 dark:bg-[#0d0f17] border border-slate-200 dark:border-white/[0.08] space-y-4">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-slate-500" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Local data</h3>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
            <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">{counts.projects}</div>
            <div className="text-[10px] text-slate-500 uppercase">Projects</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
            <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">{counts.tickets}</div>
            <div className="text-[10px] text-slate-500 uppercase">Tickets</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
            <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">{counts.feedback}</div>
            <div className="text-[10px] text-slate-500 uppercase">Feedback</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportData} className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-400 transition flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> {isUrdu ? 'بیک اپ' : 'Export backup'}
          </button>
          <button onClick={() => importRef.current?.click()} className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-400 transition flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" /> {isUrdu ? 'درآمد کریں' : 'Import backup'}
          </button>
          <input
            ref={importRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImport(file);
              e.target.value = '';
            }}
          />
          {!confirmClear ? (
            <button onClick={() => setConfirmClear(true)} className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-500/30 text-xs font-semibold text-rose-600 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5" /> {isUrdu ? 'ڈیٹا صاف کریں' : 'Clear local data'}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => { onClearData(); setConfirmClear(false); toast.success('Local data cleared'); }}
                className="px-3.5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                {isUrdu ? 'تصدیق کریں' : 'Confirm delete'}
              </button>
              <button onClick={() => setConfirmClear(false)} className="px-3 py-2 text-xs text-slate-500">{isUrdu ? 'منسوخ' : 'Cancel'}</button>
            </div>
          )}
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed">
          {isUrdu
            ? 'یہ تمام ڈیٹا آپ کے براؤزر میں محفوظ ہے۔ صاف کرنے سے پراجیکٹس، ٹکٹس، فیڈ بیک اور API کلیدیں حذف ہو جائیں گی۔'
            : 'All projects, tickets, feedback and credentials live in this browser’s localStorage. Clearing removes them permanently.'}
        </p>
      </section>

      <section className="p-6 rounded-3xl border border-indigo-300/40 dark:border-indigo-500/20 bg-indigo-50/60 dark:bg-indigo-500/[0.06] space-y-3">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
          <ShieldCheck className="w-4 h-4" />
          <h3 className="font-bold text-sm">{isUrdu ? 'یہ سب کیسے کام کرتا ہے' : 'How the platform actually works'}</h3>
        </div>
        <ol className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
          <li>{isUrdu ? 'آرکسٹریٹر آپ کے پرامپٹ کو اسپیک میں بدلتا ہے (فیچرز، اسکرینز، ڈیٹا ماڈلز)۔' : 'The orchestrator turns your prompt into a build spec: features, screens, data models and design tokens.'}</li>
          <li>{isUrdu ? 'چار ایجنٹ ٹیمیں متوازی طور پر ویب، iOS، اینڈرائیڈ اور بیک اینڈ کوڈ لکھتی ہیں۔' : 'Four agent teams run in parallel: React web, SwiftUI, Jetpack Compose and Supabase backend.'}</li>
          <li>{isUrdu ? 'ہر فائل، SQL اور لائیو پریویو آپ کے براؤزر میں بنتا اور محفوظ ہوتا ہے۔' : 'Every file, SQL migration, seed script and self-contained preview is generated in your browser and saved locally.'}</li>
          <li>{isUrdu ? 'ٹوکن موجود ہو تو ورسل پر لائیو ڈیپلائے اور سپا بیس پر اسکیما لاگو ہوتا ہے۔' : 'With tokens connected, the web build goes live on Vercel and the schema is applied to Supabase automatically.'}</li>
          <li>{isUrdu ? 'آپ کی ریٹنگز اگلے بلڈز کے لیے سیکھی گئی ترجیحات بن جاتی ہیں۔' : 'Your ratings become learned preferences that shape every subsequent build.'}</li>
        </ol>
        <div className="pt-1 text-[10px] text-slate-500 flex items-center gap-1.5">
          <ExternalLink className="w-3 h-3" />
          <span>Gemini · Vercel REST · Supabase Management API · React 19</span>
        </div>
      </section>
    </div>
  );
};

const TestResult: React.FC<{ state: TestState }> = ({ state }) => {
  if (state.pending) {
    return <div className="text-[11px] text-slate-500 flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" /> Testing…</div>;
  }
  if (!state.message) return null;
  return (
    <div className={`text-[11px] flex items-start gap-1.5 ${state.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
      {state.ok ? <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
      <span className="leading-relaxed">{state.message}</span>
    </div>
  );
};
