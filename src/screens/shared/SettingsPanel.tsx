import React, { useRef, useState } from 'react';
import {
  AlertTriangle, Bot, Check, Database, Download, Eye, EyeOff, KeyRound, Loader2,
  Rocket, Settings2, ShieldCheck, Trash2, Upload, Wand2,
} from 'lucide-react';
import { useApp } from '../../state/app';
import { APP_VERSION, GEMINI_MODELS } from '../../config/app';
import { testGeminiConnection } from '../../services/ai';
import { testVercelToken, testSupabaseToken } from '../../services/deploy';
import { toast } from '../../components/Toast';
import { Btn, IconTile, Panel, Pill, Toggle, cx } from '../../ui/Toon';

type TestKey = 'gemini' | 'vercel' | 'supabase';
interface TestResult {
  key: TestKey;
  ok: boolean;
  message: string;
}

const SecretField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  mono?: boolean;
}> = ({ label, value, onChange, placeholder, mono }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="text-[10px] font-extrabold uppercase tracking-wider text-ink-soft">{label}</label>
      <div className="relative mt-1">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className={cx('field pr-10 py-2 text-xs', mono && 'field-mono')}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg grid place-items-center text-ink-soft hover:bg-cream-2"
          aria-label={show ? 'Hide value' : 'Show value'}
        >
          {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};

export const SettingsPanel: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { settings, setSettings, aiLive, projects, tickets, feedback, clearData, importData } = useApp();
  const [testing, setTesting] = useState<TestKey | null>(null);
  const [result, setResult] = useState<TestResult | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const runTest = async (key: TestKey) => {
    setTesting(key);
    setResult(null);
    try {
      const res =
        key === 'gemini'
          ? await testGeminiConnection(settings)
          : key === 'vercel'
          ? await testVercelToken(settings.vercelToken)
          : await testSupabaseToken(settings.supabaseToken);
      setResult({ key, ok: res.ok, message: res.message });
      if (res.ok) toast.success('Connection verified');
      else toast.error(res.message);
    } catch {
      setResult({ key, ok: false, message: 'Could not reach the provider from this browser.' });
      toast.error('Connection test failed');
    } finally {
      setTesting(null);
    }
  };

  const exportBackup = () => {
    const payload = {
      app: 'H.AI',
      version: APP_VERSION,
      exportedAt: new Date().toISOString(),
      projects,
      tickets,
      feedback,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hai-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
    toast.success('Backup downloaded (keys excluded)');
  };

  const importBackup = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      importData({ projects: data.projects, tickets: data.tickets, feedback: data.feedback });
      toast.success('Backup imported');
    } catch {
      toast.error('That file is not a valid H.AI backup');
    }
  };

  const statusPill = (ok: boolean, okLabel: string, offLabel: string) => (
    <Pill tone={ok ? 'mint' : 'cream'} dot={ok ? '#159570' : '#9C8DBF'}>
      {ok ? okLabel : offLabel}
    </Pill>
  );

  return (
    <div className={cx('grid gap-4', compact ? '' : 'lg:grid-cols-[1.15fr_0.85fr]')}>
      <div className="space-y-4">
        <Panel className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <IconTile tone="sun" className="w-9 h-9 rounded-lg">
                <Bot className="w-4 h-4" />
              </IconTile>
              <div>
                <h3 className="text-lg leading-none">Gemini brain</h3>
                <p className="text-[10px] font-bold text-ink-soft">powers builds + support</p>
              </div>
            </div>
            {statusPill(aiLive, 'Connected', 'Demo')}
          </div>

          <SecretField
            label="Gemini API key"
            value={settings.geminiKey}
            onChange={(v) => setSettings((s) => ({ ...s, geminiKey: v }))}
            placeholder="AIza…"
            mono
          />

          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-ink-soft">Model</label>
            <select
              value={settings.model}
              onChange={(e) => setSettings((s) => ({ ...s, model: e.target.value }))}
              className="field mt-1 py-2 text-xs"
            >
              {GEMINI_MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.label} — {m.note}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Btn
              tone="cream"
              size="sm"
              onClick={() => runTest('gemini')}
              disabled={!settings.geminiKey || testing === 'gemini'}
            >
              {testing === 'gemini' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
              Test connection
            </Btn>
            {result?.key === 'gemini' && (
              <span className={cx('text-[10px] font-bold', result.ok ? 'text-mint' : 'text-coral')}>
                {result.message}
              </span>
            )}
          </div>
          {!aiLive && (
            <p className="text-[10px] font-semibold text-ink-soft leading-relaxed">
              Without a key the app runs in demo mode: builds use the local engine and support uses
              the built-in playbook. Everything else works.
            </p>
          )}
        </Panel>

        <Panel className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <IconTile tone="cream" className="w-9 h-9 rounded-lg">
              <Rocket className="w-4 h-4" />
            </IconTile>
            <div>
              <h3 className="text-lg leading-none">Deploy providers</h3>
              <p className="text-[10px] font-bold text-ink-soft">Vercel + Supabase</p>
            </div>
          </div>

          <div className="space-y-3">
            <SecretField
              label="Vercel token"
              value={settings.vercelToken}
              onChange={(v) => setSettings((s) => ({ ...s, vercelToken: v }))}
              placeholder="vercel_…"
              mono
            />
            <div className="flex items-center gap-2">
              <Btn
                tone="cream"
                size="xs"
                onClick={() => runTest('vercel')}
                disabled={!settings.vercelToken || testing === 'vercel'}
              >
                {testing === 'vercel' ? <Loader2 className="w-3 h-3 animate-spin" /> : <KeyRound className="w-3 h-3" />}
                Test Vercel
              </Btn>
              {result?.key === 'vercel' && (
                <span className={cx('text-[10px] font-bold', result.ok ? 'text-mint' : 'text-coral')}>
                  {result.message}
                </span>
              )}
            </div>
          </div>

          <div className="h-px bg-aqua/10 rounded-full" />

          <div className="space-y-3">
            <SecretField
              label="Supabase access token"
              value={settings.supabaseToken}
              onChange={(v) => setSettings((s) => ({ ...s, supabaseToken: v }))}
              placeholder="sbp_…"
              mono
            />
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-ink-soft">Project ref</label>
              <input
                value={settings.supabaseProjectRef}
                onChange={(e) => setSettings((s) => ({ ...s, supabaseProjectRef: e.target.value.trim() }))}
                placeholder="abcdefghijklmnopqrst"
                spellCheck={false}
                className="field mt-1 py-2 text-xs field-mono"
              />
            </div>
            <div className="flex items-center gap-2">
              <Btn
                tone="cream"
                size="xs"
                onClick={() => runTest('supabase')}
                disabled={!settings.supabaseToken || testing === 'supabase'}
              >
                {testing === 'supabase' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Database className="w-3 h-3" />}
                Test Supabase
              </Btn>
              {result?.key === 'supabase' && (
                <span className={cx('text-[10px] font-bold', result.ok ? 'text-mint' : 'text-coral')}>
                  {result.message}
                </span>
              )}
            </div>
          </div>
        </Panel>

        <Panel className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <IconTile tone="mint" className="w-9 h-9 rounded-lg">
              <Settings2 className="w-4 h-4" />
            </IconTile>
            <h3 className="text-lg leading-none">Preferences</h3>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-aqua/15 bg-white/[0.03] p-3">
            <div>
              <div className="text-xs font-extrabold">Auto-deploy after build</div>
              <p className="text-[10px] font-semibold text-ink-soft">Publish with your saved tokens when a build finishes.</p>
            </div>
            <Toggle
              checked={settings.autoDeploy}
              onChange={(v) => setSettings((s) => ({ ...s, autoDeploy: v }))}
              label="Auto deploy"
            />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-aqua/15 bg-white/[0.03] p-3">
            <div>
              <div className="text-xs font-extrabold">Learn from feedback</div>
              <p className="text-[10px] font-semibold text-ink-soft">Feed ratings into the next build's prompt weights.</p>
            </div>
            <Toggle
              checked={settings.learningEnabled}
              onChange={(v) => setSettings((s) => ({ ...s, learningEnabled: v }))}
              label="Learning enabled"
            />
          </div>
        </Panel>
      </div>

      <div className="space-y-4">
        <Panel className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <IconTile tone="grape" className="w-9 h-9 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </IconTile>
            <div>
              <h3 className="text-lg leading-none">Local workspace</h3>
              <p className="text-[10px] font-bold text-ink-soft">everything stays on this device</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Builds', value: projects.length },
              { label: 'Tickets', value: tickets.length },
              { label: 'Signals', value: feedback.length },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-aqua/15 bg-white/[0.03] py-2">
                <div className="font-display text-xl leading-none">{s.value}</div>
                <div className="text-[9px] font-extrabold uppercase tracking-wider text-ink-soft mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Btn tone="cream" size="sm" onClick={exportBackup} block>
              <Download className="w-3.5 h-3.5" /> Download backup (no keys)
            </Btn>
            <Btn tone="cream" size="sm" onClick={() => fileRef.current?.click()} block>
              <Upload className="w-3.5 h-3.5" /> Import backup
            </Btn>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) importBackup(file);
                e.target.value = '';
              }}
            />
            <Btn
              tone={confirmClear ? 'coral' : 'cream'}
              size="sm"
              block
              onClick={() => {
                if (!confirmClear) {
                  setConfirmClear(true);
                  window.setTimeout(() => setConfirmClear(false), 5000);
                  return;
                }
                clearData();
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              {confirmClear ? 'Tap again to erase everything' : 'Clear local data'}
            </Btn>
          </div>

          <p className="text-[10px] font-semibold text-ink-soft leading-relaxed flex gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            Clearing removes builds, tickets, ratings and keys from this browser. Download a backup first.
          </p>
        </Panel>

        <Panel className="p-4 sm:p-5 space-y-2.5 bg-cream">
          <div className="flex items-center gap-2 text-sm font-extrabold">
            <Wand2 className="w-4 h-4" /> How keys work
          </div>
          <ul className="space-y-1.5 text-[10px] font-semibold text-ink-soft leading-relaxed">
            {[
              'Keys are saved in localStorage on this device only.',
              'They are sent only to the provider you call (Google, Vercel, Supabase).',
              'Export backups never include keys.',
              'In demo mode nothing leaves the browser at all.',
            ].map((line) => (
              <li key={line} className="flex gap-1.5">
                <Check className="w-3 h-3 shrink-0 mt-0.5 text-emerald-600" />
                {line}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
};
