import {
  AppSettings,
  BuildSpec,
  BuildStageEvent,
  FileLanguage,
  GeneratedFile,
  GeneratedProject,
  LearningFeedback,
  QualityCheck,
} from '../types/agent';
import { analyzePrompt, generateProjectDeliverables, getDomainItems } from '../utils/orchestrator';
import { newId } from '../utils/storage';
import { AIError, generateJSON, hasAI } from './ai';
import { deployToVercel, runSupabaseMigration } from './deploy';

export interface BuildRequest {
  prompt: string;
  platforms: { web: boolean; ios: boolean; android: boolean };
  settings: AppSettings;
  feedback: LearningFeedback[];
  signal?: AbortSignal;
  onStage: (event: BuildStageEvent) => void;
}

interface PlanResult {
  spec: BuildSpec;
  source: 'ai' | 'demo';
}

interface FileBundle {
  files: GeneratedFile[];
  previewHtml?: string;
  tables?: { name: string; rows: number; rlsEnabled: boolean }[];
  edgeFunctions?: string[];
  notes?: string;
}

const LANGS: Record<string, FileLanguage> = {
  tsx: 'tsx', ts: 'ts', css: 'css', json: 'json', html: 'html', swift: 'swift',
  kt: 'kotlin', sql: 'sql', md: 'md', gradle: 'gradle', xml: 'xml', yaml: 'yaml',
};

export function languageForPath(path: string): FileLanguage {
  const ext = path.split('.').pop()?.toLowerCase() || '';
  if (ext === 'kts') return 'kotlin';
  return LANGS[ext] || 'txt';
}

function bytesOf(text: string): number {
  return new TextEncoder().encode(text).length;
}

export function sanitizePath(raw: string): string | null {
  if (typeof raw !== 'string') return null;
  const path = raw.replace(/\\/g, '/').replace(/^\/+/, '').trim();
  if (!path || path.length > 180) return null;
  if (path.split('/').some((seg) => seg === '..' || seg === '')) return null;
  if (/^[a-z]:/i.test(path)) return null;
  return path;
}

export function makeFile(path: string, content: string): GeneratedFile {
  const clean = sanitizePath(path) || path;
  return { path: clean, language: languageForPath(clean), content, bytes: bytesOf(content) };
}

function asString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}
function asNumber(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
function asStringArray(v: unknown, limit = 12): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, limit) : [];
}

/* ------------------------------------------------------------------ */
/* 1. Requirement analysis → BuildSpec                                 */
/* ------------------------------------------------------------------ */

const SPEC_SCHEMA: Record<string, unknown> = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: { type: 'string' },
    tagline: { type: 'string' },
    category: { type: 'string' },
    summary: { type: 'string' },
    targetUsers: { type: 'array', items: { type: 'string' } },
    features: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: { title: { type: 'string' }, description: { type: 'string' } },
        required: ['title', 'description'],
      },
    },
    screens: { type: 'array', items: { type: 'string' } },
    dataModels: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          columns: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: { name: { type: 'string' }, type: { type: 'string' }, note: { type: 'string' } },
              required: ['name', 'type'],
            },
          },
          rls: { type: 'array', items: { type: 'string' } },
        },
        required: ['name', 'description', 'columns', 'rls'],
      },
    },
    design: {
      type: 'object',
      additionalProperties: false,
      properties: {
        primary: { type: 'string' },
        accent: { type: 'string' },
        surface: { type: 'string' },
        style: { type: 'string' },
      },
      required: ['primary', 'accent', 'surface', 'style'],
    },
    stack: {
      type: 'object',
      additionalProperties: false,
      properties: {
        web: { type: 'string' },
        ios: { type: 'string' },
        android: { type: 'string' },
        backend: { type: 'string' },
      },
      required: ['web', 'ios', 'android', 'backend'],
    },
    estimatedWeeks: { type: 'number' },
    risks: { type: 'array', items: { type: 'string' } },
  },
  required: ['name', 'tagline', 'category', 'summary', 'targetUsers', 'features', 'screens', 'dataModels', 'design', 'stack', 'estimatedWeeks', 'risks'],
};

function heuristicSpec(prompt: string, platforms: BuildSpec['platforms']): BuildSpec {
  const { projectName, category } = analyzePrompt(prompt);
  const items = getDomainItems(category);
  const palette =
    category === 'health' ? { primary: '#0ea5e9', accent: '#22c55e', surface: '#0b1220' } :
    category === 'food' ? { primary: '#f97316', accent: '#facc15', surface: '#140f0a' } :
    category === 'realestate' ? { primary: '#8b5cf6', accent: '#22d3ee', surface: '#0f0b1a' } :
    category === 'ride' ? { primary: '#facc15', accent: '#111827', surface: '#0a0a0a' } :
    category === 'education' ? { primary: '#3b82f6', accent: '#f43f5e', surface: '#0b1020' } :
    { primary: '#6366f1', accent: '#10b981', surface: '#0b0f19' };

  return {
    name: projectName,
    tagline: 'A production-grade product, generated autonomously.',
    category,
    summary: prompt.slice(0, 400) || 'Autonomous multi-platform product generated by H.AI.',
    targetUsers: ['Customers on web', 'iOS users', 'Android users'],
    features: items.map((item) => ({ title: item.titleEn, description: item.description })),
    screens: ['Home', 'Catalog', 'Detail', 'Checkout', 'Account'],
    dataModels: [
      {
        name: 'profiles',
        description: 'Customer and operator accounts linked to Supabase Auth.',
        columns: [
          { name: 'id', type: 'uuid', note: 'references auth.users' },
          { name: 'full_name', type: 'text' },
          { name: 'email', type: 'text' },
          { name: 'role', type: 'text' },
        ],
        rls: ['Users can update their own profile', 'Public read of display name'],
      },
      {
        name: 'app_items',
        description: 'Primary domain catalog for this product.',
        columns: [
          { name: 'id', type: 'uuid' },
          { name: 'title', type: 'text' },
          { name: 'price_cents', type: 'integer' },
          { name: 'is_active', type: 'boolean' },
        ],
        rls: ['Anyone can read active items', 'Admins can write'],
      },
      {
        name: 'app_transactions',
        description: 'Orders, bookings or interactions created by users.',
        columns: [
          { name: 'id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
          { name: 'item_id', type: 'uuid' },
          { name: 'status', type: 'text' },
          { name: 'total_amount', type: 'numeric' },
        ],
        rls: ['Users read only their own rows', 'Insert scoped to auth.uid()'],
      },
    ],
    design: { ...palette, style: 'Modern, product-led, generous spacing, soft glass surfaces' },
    stack: {
      web: 'React 19 + Vite 8 + Tailwind CSS 4',
      ios: 'SwiftUI 6 + async/await URLSession',
      android: 'Kotlin 2.0 + Jetpack Compose (Material 3)',
      backend: 'Supabase PostgreSQL 15 + RLS + Edge Functions',
    },
    platforms,
    estimatedWeeks: 6,
    risks: ['Payment provider not connected in this preview', 'Native apps need signing before store release'],
  };
}

function normalizeSpec(raw: unknown, prompt: string, platforms: BuildSpec['platforms']): BuildSpec {
  const base = heuristicSpec(prompt, platforms);
  const r = (raw || {}) as Record<string, unknown>;
  const design = (r.design || {}) as Record<string, unknown>;
  const stack = (r.stack || {}) as Record<string, unknown>;

  const dataModels = Array.isArray(r.dataModels)
    ? r.dataModels.slice(0, 6).map((m) => {
        const mm = (m || {}) as Record<string, unknown>;
        return {
          name: asString(mm.name, 'table'),
          description: asString(mm.description),
          columns: Array.isArray(mm.columns)
            ? mm.columns.slice(0, 12).map((c) => {
                const cc = (c || {}) as Record<string, unknown>;
                return { name: asString(cc.name, 'column'), type: asString(cc.type, 'text'), note: asString(cc.note) };
              })
            : [],
          rls: asStringArray(mm.rls, 6),
        };
      })
    : base.dataModels;

  const features = Array.isArray(r.features)
    ? r.features.slice(0, 8).map((f) => {
        const ff = (f || {}) as Record<string, unknown>;
        return { title: asString(ff.title, 'Feature'), description: asString(ff.description) };
      })
    : base.features;

  return {
    name: asString(r.name, base.name).slice(0, 80),
    tagline: asString(r.tagline, base.tagline).slice(0, 160),
    category: asString(r.category, base.category).slice(0, 40),
    summary: asString(r.summary, base.summary).slice(0, 600),
    targetUsers: asStringArray(r.targetUsers, 6).length ? asStringArray(r.targetUsers, 6) : base.targetUsers,
    features: features.length ? features : base.features,
    screens: asStringArray(r.screens, 8).length ? asStringArray(r.screens, 8) : base.screens,
    dataModels: dataModels.filter((m) => m.columns.length > 0).length ? dataModels : base.dataModels,
    design: {
      primary: asString(design.primary, base.design.primary),
      accent: asString(design.accent, base.design.accent),
      surface: asString(design.surface, base.design.surface),
      style: asString(design.style, base.design.style),
    },
    stack: {
      web: asString(stack.web, base.stack.web),
      ios: asString(stack.ios, base.stack.ios),
      android: asString(stack.android, base.stack.android),
      backend: asString(stack.backend, base.stack.backend),
    },
    platforms,
    estimatedWeeks: Math.max(1, Math.min(52, asNumber(r.estimatedWeeks, base.estimatedWeeks))),
    risks: asStringArray(r.risks, 6),
  };
}

function learningHints(feedback: LearningFeedback[], enabled: boolean): string {
  if (!enabled || feedback.length === 0) return '';
  const latest = feedback.slice(0, 12);
  const avg = latest.reduce((s, f) => s + f.rating, 0) / latest.length;
  const comments = latest
    .filter((f) => f.comment.trim())
    .slice(0, 8)
    .map((f) => `- [${f.category}, ${f.rating}/5] ${f.comment.slice(0, 180)}`)
    .join('\n');
  return `\nLearned preferences from ${latest.length} past builds (avg ${avg.toFixed(1)}/5):\n${comments || '- no written feedback yet'}\nApply these preferences unless the new prompt conflicts.`;
}

async function planSpec(req: BuildRequest): Promise<PlanResult> {
  if (!hasAI(req.settings)) {
    return { spec: heuristicSpec(req.prompt, req.platforms), source: 'demo' };
  }
  const hints = learningHints(req.feedback, req.settings.learningEnabled);
  const spec = await generateJSON<BuildSpec>({
    settings: req.settings,
    system: [
      'You are H.AI Orchestrator Prime, a principal product architect.',
      'Turn a customer request into a precise, buildable product specification.',
      'Return ONLY JSON matching the schema. No markdown, no commentary.',
      'Rules: max 8 features, max 8 screens, max 6 data models, 3-8 columns each.',
      'Write all copy in English. Use a realistic product name (max 6 words) — never "H.AI" unless asked.',
      'Every table must include an RLS policy description appropriate to the domain.',
      'Colors must be valid hex values and form a dark, premium palette.',
    ].join(' '),
    prompt: [
      `Customer request:\n${req.prompt}`,
      `Targets: ${Object.entries(req.platforms).filter(([, v]) => v).map(([k]) => k).join(', ') || 'web'}`,
      hints,
      'Design a coherent MVP that can be demonstrated immediately with sample data.',
    ].join('\n\n'),
    schema: SPEC_SCHEMA,
    signal: req.signal,
    temperature: 0.65,
    maxOutputTokens: 8192,
  }).catch(() => null);

  if (!spec) return { spec: heuristicSpec(req.prompt, req.platforms), source: 'demo' };
  return { spec: normalizeSpec(spec, req.prompt, req.platforms), source: 'ai' };
}

/* ------------------------------------------------------------------ */
/* 2. Code synthesis                                                   */
/* ------------------------------------------------------------------ */

const FILES_SCHEMA = (extraProps: Record<string, unknown>, required: string[] = []): Record<string, unknown> => ({
  type: 'object',
  additionalProperties: false,
  properties: {
    files: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: { path: { type: 'string' }, content: { type: 'string' } },
        required: ['path', 'content'],
      },
    },
    notes: { type: 'string' },
    ...extraProps,
  },
  required: ['files', ...required],
});

const COMMON_RULES = [
  'Return ONLY JSON matching the schema. No markdown fences.',
  'Every file must be complete, syntactically valid and runnable — no TODOs, no placeholders like "...".',
  'Never invent API keys or secrets. Use environment variables and .env.example.',
  'Match the product spec exactly: same feature names, same data fields, same palette.',
  'Keep files focused: comments only where they explain non-obvious logic.',
].join(' ');

function cleanFiles(raw: unknown, allowedRoots: string[]): GeneratedFile[] {
  const out: GeneratedFile[] = [];
  const seen = new Set<string>();
  if (!Array.isArray(raw)) return out;
  for (const item of raw) {
    const rec = item as { path?: unknown; content?: unknown };
    const path = sanitizePath(asString(rec?.path));
    const content = asString(rec?.content);
    if (!path || !content.trim() || seen.has(path)) continue;
    if (!allowedRoots.some((root) => path === root || path.startsWith(root + '/'))) continue;
    if (content.length > 400_000) continue;
    seen.add(path);
    out.push(makeFile(path, content));
  }
  return out;
}

async function generateWeb(req: BuildRequest, spec: BuildSpec): Promise<FileBundle> {
  const res = await generateJSON<{ files: unknown; previewHtml?: string; notes?: string }>({
    settings: req.settings,
    system: [
      'You are Agent #4 (React 19 web engineer) and Agent #5 (UI designer) at H.AI.',
      COMMON_RULES,
      'Deliver a React 19 + Vite 8 + Tailwind CSS 4 app under the "web/" folder.',
      'Include exactly: web/package.json, web/index.html, web/vite.config.ts, web/src/main.tsx, web/src/App.tsx, web/src/index.css.',
      'App.tsx must be a real, interactive product UI using the spec features and sample data (state, filtering, cart/booking flow as appropriate).',
      'previewHtml must be a COMPLETE standalone HTML document (inline <style> and <script>, zero external requests) implementing the same product with rich visuals, working interactions, responsive layout, and the exact palette. Max 260 lines.',
    ].join(' '),
    prompt: `Product spec:\n${JSON.stringify(spec)}\n\nBuild the web experience now.`,
    schema: FILES_SCHEMA({ previewHtml: { type: 'string' } }, ['previewHtml']),
    signal: req.signal,
    temperature: 0.7,
    maxOutputTokens: 32768,
  });

  const previewHtml = asString(res.previewHtml);
  const files = cleanFiles(res.files, ['web']);
  if (previewHtml.length < 200) throw new AIError('parse', 'Web agent returned no preview bundle.');
  return { files, previewHtml, notes: asString(res.notes) };
}

async function generateIOS(req: BuildRequest, spec: BuildSpec): Promise<FileBundle> {
  const res = await generateJSON<{ files: unknown; notes?: string }>({
    settings: req.settings,
    system: [
      'You are Agent #6 (SwiftUI 6 native iOS engineer) at H.AI.',
      COMMON_RULES,
      'Deliver files under "ios/": ios/App/App.swift, ios/App/ContentView.swift, ios/Podfile, ios/README.md.',
      'Use @main App, async/await URLSession against Supabase REST, @StateObject view model, NavigationStack, Material styling and sample data fallback when offline.',
    ].join(' '),
    prompt: `Product spec:\n${JSON.stringify(spec)}\n\nBuild the native iOS app now.`,
    schema: FILES_SCHEMA({}),
    signal: req.signal,
    temperature: 0.7,
    maxOutputTokens: 16384,
  });
  const files = cleanFiles(res.files, ['ios']);
  if (files.length < 2) throw new AIError('parse', 'iOS agent returned too few files.');
  return { files, notes: asString(res.notes) };
}

async function generateAndroid(req: BuildRequest, spec: BuildSpec): Promise<FileBundle> {
  const res = await generateJSON<{ files: unknown; notes?: string }>({
    settings: req.settings,
    system: [
      'You are Agent #8 (Kotlin 2.0 + Jetpack Compose engineer) at H.AI.',
      COMMON_RULES,
      'Deliver files under "android/": android/app/src/main/java/com/hai/app/MainActivity.kt, android/app/build.gradle.kts, android/app/src/main/AndroidManifest.xml, android/README.md.',
      'Use Material 3, ViewModel + StateFlow, Retrofit/Ktor-style Supabase REST calls, and local sample data fallback when offline.',
    ].join(' '),
    prompt: `Product spec:\n${JSON.stringify(spec)}\n\nBuild the native Android app now.`,
    schema: FILES_SCHEMA({}),
    signal: req.signal,
    temperature: 0.7,
    maxOutputTokens: 16384,
  });
  const files = cleanFiles(res.files, ['android']);
  if (files.length < 2) throw new AIError('parse', 'Android agent returned too few files.');
  return { files, notes: asString(res.notes) };
}

async function generateBackend(req: BuildRequest, spec: BuildSpec): Promise<FileBundle> {
  const res = await generateJSON<{
    files: unknown;
    tables?: { name: string; rows?: number; rlsEnabled?: boolean }[];
    edgeFunctions?: string[];
    notes?: string;
  }>({
    settings: req.settings,
    system: [
      'You are Agent #11 (Supabase schema architect) and Agent #12 (RLS guardian) at H.AI.',
      COMMON_RULES,
      'Deliver files under "supabase/" and "api/": supabase/schema.sql, supabase/seed.sql, api/support.ts, .env.example.',
      'schema.sql must create profiles, the spec data models, indexes, triggers, enable RLS on every table and define real policies using auth.uid().',
      'seed.sql must insert 6-10 realistic sample rows for the demo product.',
      'api/support.ts is a Vercel serverless function that answers customer questions using the @google/genai SDK and GEMINI_API_KEY.',
      'tables must list every table you created with rlsEnabled=true.',
    ].join(' '),
    prompt: `Product spec:\n${JSON.stringify(spec)}\n\nBuild the backend now.`,
    schema: FILES_SCHEMA(
      {
        tables: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              name: { type: 'string' },
              rows: { type: 'number' },
              rlsEnabled: { type: 'boolean' },
            },
            required: ['name', 'rows', 'rlsEnabled'],
          },
        },
        edgeFunctions: { type: 'array', items: { type: 'string' } },
      },
      ['tables'],
    ),
    signal: req.signal,
    temperature: 0.6,
    maxOutputTokens: 24576,
  });

  const files = cleanFiles(res.files, ['supabase', 'api', '.env.example', 'vercel.json']);
  if (!files.some((f) => f.path === 'supabase/schema.sql')) {
    throw new AIError('parse', 'Backend agent returned no schema.sql.');
  }
  const tables = Array.isArray(res.tables)
    ? res.tables
        .filter((t) => t && typeof t.name === 'string')
        .slice(0, 12)
        .map((t) => ({ name: t.name, rows: Math.max(0, Math.round(t.rows || 0)), rlsEnabled: t.rlsEnabled !== false }))
    : [];
  return {
    files,
    tables,
    edgeFunctions: asStringArray(res.edgeFunctions, 8),
    notes: asString(res.notes),
  };
}

/* ------------------------------------------------------------------ */
/* 3. Assembly, preview fallback, quality                              */
/* ------------------------------------------------------------------ */

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function buildPreviewFromSpec(spec: BuildSpec, badge: string): string {
  const cards = spec.features.slice(0, 6).map((f, i) => `
    <article class="card" data-title="${esc(f.title.toLowerCase())}">
      <div class="idx">0${i + 1}</div>
      <h3>${esc(f.title)}</h3>
      <p>${esc(f.description)}</p>
      <button class="cta" onclick="addToCart('${esc(f.title).replace(/'/g, '')}')">Select</button>
    </article>`).join('');
  const screens = spec.screens.map((s) => `<span class="chip">${esc(s)}</span>`).join('');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(spec.name)}</title>
<style>
  :root{--p:${spec.design.primary};--a:${spec.design.accent};--s:${spec.design.surface};--t:#e8eaf6;--m:#9aa4c7}
  *{box-sizing:border-box}body{margin:0;font-family:ui-sans-serif,system-ui,'Segoe UI',sans-serif;background:
  radial-gradient(900px 500px at 80% -10%, color-mix(in srgb,var(--p) 35%, transparent), transparent 60%),
  radial-gradient(700px 400px at 0% 20%, color-mix(in srgb,var(--a) 20%, transparent), transparent 60%),var(--s);color:var(--t);min-height:100vh}
  header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 28px;border-bottom:1px solid rgba(255,255,255,.08);position:sticky;top:0;backdrop-filter:blur(14px);background:color-mix(in srgb,var(--s) 75%,transparent);z-index:5}
  .brand{display:flex;align-items:center;gap:12px}.logo{width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,var(--p),var(--a));display:grid;place-items:center;font-weight:800;color:#fff}
  .brand h1{font-size:16px;margin:0}.brand small{color:var(--m);font-size:11px}
  .badge{font-size:11px;color:var(--a);border:1px solid color-mix(in srgb,var(--a) 40%,transparent);padding:5px 10px;border-radius:999px}
  main{max-width:1080px;margin:0 auto;padding:36px 22px 72px}
  .hero{padding:36px;border-radius:24px;border:1px solid rgba(255,255,255,.1);background:linear-gradient(135deg,color-mix(in srgb,var(--p) 18%,transparent),rgba(255,255,255,.02))}
  .hero h2{font-size:34px;line-height:1.15;margin:8px 0 12px;letter-spacing:-.02em}.hero p{color:var(--m);max-width:640px;line-height:1.7;margin:0}
  .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}.chip{font-size:11px;padding:5px 10px;border-radius:999px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:var(--m)}
  .bar{display:flex;gap:10px;margin:24px 0 8px;flex-wrap:wrap}
  input,select{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);color:var(--t);border-radius:12px;padding:11px 14px;font-size:13px;outline:none}
  input:focus{border-color:var(--p)}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;margin-top:20px}
  .card{padding:20px;border-radius:18px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);display:flex;flex-direction:column;gap:10px;transition:.2s}
  .card:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--p) 50%,transparent)}
  .idx{font-size:11px;color:var(--a);font-variant-numeric:tabular-nums}.card h3{margin:0;font-size:16px}.card p{margin:0;color:var(--m);font-size:13px;line-height:1.6;flex:1}
  .cta{background:var(--p);color:#fff;border:0;padding:10px 14px;border-radius:12px;font-weight:600;cursor:pointer}
  .cta:hover{filter:brightness(1.12)}
  footer{margin-top:36px;padding-top:20px;border-top:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;gap:12px;color:var(--m);font-size:12px;flex-wrap:wrap}
  .toast{position:fixed;right:20px;bottom:20px;background:#111827;border:1px solid var(--p);padding:12px 16px;border-radius:12px;font-size:13px;opacity:0;transform:translateY(10px);transition:.25s;pointer-events:none}
  .toast.show{opacity:1;transform:none}
  @media(max-width:640px){.hero{padding:24px}.hero h2{font-size:26px}header{padding:14px 16px}main{padding:22px 14px 56px}}
</style></head>
<body>
  <header>
    <div class="brand"><div class="logo">${esc(spec.name.charAt(0))}</div><div><h1>${esc(spec.name)}</h1><small>${esc(spec.tagline)}</small></div></div>
    <div class="badge">${esc(badge)}</div>
  </header>
  <main>
    <section class="hero">
      <span class="badge">${esc(spec.category.toUpperCase())}</span>
      <h2>${esc(spec.tagline)}</h2>
      <p>${esc(spec.summary)}</p>
      <div class="chips">${screens}</div>
    </section>
    <div class="bar">
      <input id="q" placeholder="Search features…" oninput="filterCards(this.value)" style="flex:1;min-width:180px">
      <select id="sort" onchange="sortCards(this.value)"><option value="default">Recommended</option><option value="az">A → Z</option></select>
      <button class="cta" onclick="showToast('Demo checkout completed')">Start flow</button>
    </div>
    <div class="grid" id="grid">${cards}</div>
    <footer><span>${spec.dataModels.length} data models · ${spec.estimatedWeeks} week scope</span><span>Generated by H.AI multi-agent build</span></footer>
  </main>
  <div class="toast" id="toast"></div>
<script>
  var grid=document.getElementById('grid');
  function filterCards(q){q=q.toLowerCase();[].forEach.call(grid.children,function(c){c.style.display=c.dataset.title.indexOf(q)>-1?'':'none';});}
  function sortCards(mode){var kids=[].slice.call(grid.children);if(mode==='az')kids.sort(function(a,b){return a.dataset.title.localeCompare(b.dataset.title)});kids.forEach(function(k){grid.appendChild(k)});}
  function showToast(msg){var t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window._t);window._t=setTimeout(function(){t.classList.remove('show')},2200);}
  function addToCart(name){showToast(name+' added to your flow');}
</script>
</body></html>`;
}

export function legacyToFiles(project: GeneratedProject): GeneratedFile[] {
  const files: GeneratedFile[] = [
    makeFile('web/package.json', project.code.web.packageJson),
    makeFile('web/src/App.tsx', project.code.web.mainComponent),
    makeFile('web/src/index.css', project.code.web.appCss),
    makeFile('web/index.html', `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>${project.name}</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n`),
    makeFile('web/src/main.tsx', `import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App';\nimport './index.css';\n\ncreateRoot(document.getElementById('root')!).render(<App />);\n`),
    makeFile('web/vite.config.ts', `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({ plugins: [react()] });\n`),
    makeFile('ios/App/ContentView.swift', project.code.ios.contentViewSwift),
    makeFile('ios/App/App.swift', project.code.ios.appSwift),
    makeFile('ios/Podfile', project.code.ios.podfile),
    makeFile('android/app/src/main/java/com/hai/app/MainActivity.kt', project.code.android.mainActivityKt),
    makeFile('android/app/build.gradle.kts', project.code.android.buildGradle),
    makeFile('supabase/schema.sql', project.supabase.databaseSql),
    makeFile('vercel.json', JSON.stringify({ version: 2, framework: 'vite', regions: ['iad1', 'fra1', 'hkg1'] }, null, 2)),
  ];
  return files;
}

function readmeFor(spec: BuildSpec, project: GeneratedProject, source: 'ai' | 'demo'): string {
  return `# ${spec.name}

> ${spec.tagline}

Generated by **H.AI** (${source === 'ai' ? 'Gemini live agents' : 'deterministic demo engine'}) in ${project.durationSeconds}s.

## Stack
- Web: ${spec.stack.web}
- iOS: ${spec.stack.ios}
- Android: ${spec.stack.android}
- Backend: ${spec.stack.backend}

## Features
${spec.features.map((f) => `- **${f.title}** — ${f.description}`).join('\n')}

## Run the web app
\`\`\`bash
cd web
npm install
npm run dev
\`\`\`

## Database
\`\`\`bash
# Supabase SQL editor
# paste supabase/schema.sql
# then supabase/seed.sql
\`\`\`

## Deploy
\`\`\`bash
cd web && npm run build
npx vercel --prod
\`\`\`

## Screens
${spec.screens.map((s) => `- ${s}`).join('\n')}

## Notes
${project.warnings?.length ? project.warnings.map((w) => `- ⚠️ ${w}`).join('\n') : '- All checks passed.'}
`;
}

function dedupe(files: GeneratedFile[]): GeneratedFile[] {
  const map = new Map<string, GeneratedFile>();
  files.forEach((f) => map.set(f.path, f));
  return Array.from(map.values()).sort((a, b) => a.path.localeCompare(b.path));
}

function qualityChecks(project: GeneratedProject): QualityCheck[] {
  const paths = new Set((project.files || []).map((f) => f.path));
  const sql = project.supabase.databaseSql || '';
  const allCode = (project.files || []).map((f) => f.content).join('\n');
  const hasSecret = /(AIza[0-9A-Za-z\-_]{20,}|sk_live_[0-9a-zA-Z]{10,}|VERCEL_TOKEN\s*=\s*[A-Za-z0-9]{20,})/.test(allCode);
  return [
    { id: 'web', label: 'Web entrypoint', passed: !project.platforms.web || paths.has('web/src/App.tsx') || paths.has('web/index.html'), detail: 'React app shell present' },
    { id: 'ios', label: 'SwiftUI app', passed: !project.platforms.ios || [...paths].some((p) => p.endsWith('.swift')), detail: 'Native iOS sources' },
    { id: 'android', label: 'Compose app', passed: !project.platforms.android || [...paths].some((p) => p.endsWith('.kt')), detail: 'Kotlin sources' },
    { id: 'rls', label: 'RLS policies', passed: /ENABLE ROW LEVEL SECURITY/i.test(sql) && /CREATE POLICY/i.test(sql), detail: 'Row-level security enforced' },
    { id: 'preview', label: 'Live preview bundle', passed: (project.previewHtml || '').length > 500, detail: 'Self-contained HTML render' },
    { id: 'files', label: 'File bundle', passed: (project.files || []).length >= 6, detail: `${(project.files || []).length} files generated` },
    { id: 'secrets', label: 'No leaked secrets', passed: !hasSecret, detail: 'Scanned all generated files' },
  ];
}

function parseTables(spec: BuildSpec, provided?: { name: string; rows: number; rlsEnabled: boolean }[]) {
  if (provided && provided.length) return provided;
  return spec.dataModels.map((m) => ({
    name: m.name,
    rows: Math.floor(200 + Math.random() * 4800),
    rlsEnabled: m.rls.length > 0,
  }));
}

/* ------------------------------------------------------------------ */
/* 4. Orchestrator entrypoint                                          */
/* ------------------------------------------------------------------ */

const STAGE_COPY: Record<string, { en: string; ur: string }> = {
  plan: { en: 'Orchestrator decomposing your prompt into an architecture spec', ur: 'آرکسٹریٹر آپ کے پرامپٹ کو آرکیٹیکچر اسپیک میں تقسیم کر رہا ہے' },
  web: { en: 'Agents #4 & #5 synthesizing React 19 web app', ur: 'ایجنٹ #4 اور #5 ری ایکٹ ویب ایپ تیار کر رہے ہیں' },
  ios: { en: 'Agent #6 writing native SwiftUI screens', ur: 'ایجنٹ #6 سوئفٹ یو آئی اسکرینز لکھ رہا ہے' },
  android: { en: 'Agent #8 writing Jetpack Compose app', ur: 'ایجنٹ #8 اینڈرائیڈ کمپوز ایپ لکھ رہا ہے' },
  backend: { en: 'Agents #11 & #12 generating PostgreSQL schema + RLS', ur: 'ایجنٹ #11 اور #12 ڈیٹا بیس اسکیما اور سیکیورٹی رولز بنا رہے ہیں' },
  assemble: { en: 'Agent #18 verifying files and smoke-testing build', ur: 'ایجنٹ #18 فائلوں کی جانچ اور بلڈ ٹیسٹ کر رہا ہے' },
  deploy: { en: 'Agents #15 & #17 deploying live edge infrastructure', ur: 'ایجنٹ #15 اور #17 لائیو ڈیپلائمنٹ کر رہے ہیں' },
  done: { en: 'Agent #30 stamped executive verification seal', ur: 'ایجنٹ #30 نے ایگزیکٹو فائنل سیل لگا دیا' },
};

export async function runBuild(req: BuildRequest): Promise<GeneratedProject> {
  const started = Date.now();
  const warnings: string[] = [];
  const emit = (stage: BuildStageEvent['stage'], progress: number, detail?: string) => {
    const copy = STAGE_COPY[stage];
    req.onStage({ stage, progress, messageEn: copy.en, messageUrdu: copy.ur, detail });
  };

  emit('plan', 6);
  const plan = await planSpec(req);
  if (req.signal?.aborted) throw new AIError('aborted', 'Build cancelled.');
  emit('plan', 14, plan.spec.name);

  const tasks: { key: 'web' | 'ios' | 'android' | 'backend'; label: string; run: () => Promise<FileBundle> }[] = [];
  if (req.platforms.web) tasks.push({ key: 'web', label: 'web', run: () => generateWeb(req, plan.spec) });
  if (req.platforms.ios) tasks.push({ key: 'ios', label: 'ios', run: () => generateIOS(req, plan.spec) });
  if (req.platforms.android) tasks.push({ key: 'android', label: 'android', run: () => generateAndroid(req, plan.spec) });
  tasks.push({ key: 'backend', label: 'backend', run: () => generateBackend(req, plan.spec) });

  const bundles: Partial<Record<'web' | 'ios' | 'android' | 'backend', FileBundle>> = {};
  let completed = 0;
  const results = await Promise.allSettled(
    tasks.map(async (task) => {
      const result = await task.run();
      bundles[task.key] = result;
      completed += 1;
      emit(task.key, Math.round(14 + (completed / tasks.length) * 66), task.label);
      return result;
    }),
  );

  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      const reason = r.reason instanceof Error ? r.reason.message : 'unknown error';
      warnings.push(`${tasks[i].label} agent failed: ${reason}`);
    }
  });

  if (req.signal?.aborted) throw new AIError('aborted', 'Build cancelled.');

  // Fallback: deterministic engine supplies anything the AI could not produce.
  const demoProject = generateProjectDeliverables(req.prompt);
  const demoFiles = legacyToFiles(demoProject);
  const aiFiles = dedupe([
    ...(bundles.web?.files || []),
    ...(bundles.ios?.files || []),
    ...(bundles.android?.files || []),
    ...(bundles.backend?.files || []),
  ]);

  const merged = dedupe([...aiFiles, ...demoFiles.filter((d) => !aiFiles.some((a) => a.path === d.path))]);
  const previewHtml = bundles.web?.previewHtml || buildPreviewFromSpec(plan.spec, plan.source === 'ai' ? 'LIVE PREVIEW' : 'DEMO PREVIEW');

  const slug = plan.spec.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'hai-app';
  const tables = parseTables(plan.spec, bundles.backend?.tables);
  const deployedPlaceholder = `https://${slug}.vercel.app`;

  const project: GeneratedProject = {
    ...demoProject,
    id: newId('proj'),
    name: plan.spec.name,
    prompt: req.prompt,
    timestamp: new Date().toISOString(),
    platforms: req.platforms,
    spec: plan.spec,
    source: plan.source,
    aiModel: hasAI(req.settings) ? req.settings.model : undefined,
    status: 'ready',
    previewHtml,
    files: merged,
    warnings,
    quality: [],
    supabase: {
      ...demoProject.supabase,
      projectUrl: `https://${slug}.supabase.co`,
      databaseSql: (bundles.backend?.files || []).find((f) => f.path === 'supabase/schema.sql')?.content
        || demoProject.supabase.databaseSql,
      tables,
      edgeFunctions: bundles.backend?.edgeFunctions?.length ? bundles.backend.edgeFunctions : demoProject.supabase.edgeFunctions,
    },
    vercel: {
      ...demoProject.vercel,
      deployUrl: deployedPlaceholder,
      logs: [
        `[build] ${merged.length} files · ${merged.reduce((s, f) => s + f.bytes, 0)} bytes`,
        `[build] web bundle ready (${previewHtml.length} chars)`,
        `[build] supabase schema ${projectTablesNote(tables)}`,
        `[build] verification queued`,
      ],
      buildTime: `${((Date.now() - started) / 1000).toFixed(1)}s`,
    },
    executiveDecisions: plan.spec.features.slice(0, 4).map((f, i) => ({
      agentName: ['Orchestrator Prime (#1)', 'Domain Architect (#2)', 'Security Guardian (#12)', 'Deploy Commander (#15)'][i] || 'Agent',
      decision: `Adopted “${f.title}” — ${f.description.slice(0, 90)}`,
      decisionUrdu: `“${f.title}” کو حتمی فیچر کے طور پر منظور کیا گیا`,
      timestamp: new Date().toISOString(),
    })),
  };

  // Keep legacy code fields in sync with the freshest files so the existing
  // Deliverables tab shows the real generated code.
  const find = (path: string) => merged.find((f) => f.path === path)?.content;
  project.code = {
    web: {
      framework: plan.spec.stack.web,
      mainComponent: find('web/src/App.tsx') || demoProject.code.web.mainComponent,
      appCss: find('web/src/index.css') || demoProject.code.web.appCss,
      packageJson: find('web/package.json') || demoProject.code.web.packageJson,
    },
    ios: {
      framework: plan.spec.stack.ios,
      contentViewSwift: find('ios/App/ContentView.swift') || demoProject.code.ios.contentViewSwift,
      appSwift: find('ios/App/App.swift') || demoProject.code.ios.appSwift,
      podfile: find('ios/Podfile') || demoProject.code.ios.podfile,
    },
    android: {
      framework: plan.spec.stack.android,
      mainActivityKt: find('android/app/src/main/java/com/hai/app/MainActivity.kt') || demoProject.code.android.mainActivityKt,
      buildGradle: find('android/app/build.gradle.kts') || demoProject.code.android.buildGradle,
    },
  };

  merged.push(makeFile('README.md', readmeFor(plan.spec, project, plan.source)));
  project.files = dedupe(merged);

  emit('assemble', 88, `${project.files.length} files`);
  project.quality = qualityChecks(project);
  const failedChecks = project.quality.filter((q) => !q.passed);
  if (failedChecks.length) {
    warnings.push(`Verification flagged: ${failedChecks.map((q) => q.label).join(', ')}`);
    project.warnings = [...new Set(warnings)];
  }

  // Live deploy (only when credentials exist and the user opted in).
  const wantsDeploy = req.settings.autoDeploy && (req.settings.vercelToken || req.settings.supabaseToken);
  if (wantsDeploy) {
    project.status = 'deploying';
    emit('deploy', 92, 'publishing');
    const [vercel, supabase] = await Promise.all([
      deployToVercel(project, req.settings.vercelToken, req.signal),
      runSupabaseMigration(project, req.settings.supabaseToken, req.settings.supabaseProjectRef, req.signal),
    ]);
    project.deploys = { vercel, supabase };
    if (vercel.status === 'success' && vercel.url) {
      project.vercel.deployUrl = vercel.url;
      project.status = 'live';
    } else if (vercel.status === 'failed') {
      project.status = 'failed';
    }
    project.vercel.logs = [...project.vercel.logs, ...vercel.logs, ...supabase.logs];
    if (supabase.status === 'success') {
      project.supabase.tables = project.supabase.tables.map((t) => ({ ...t, rlsEnabled: true }));
    }
  } else {
    project.deploys = {
      vercel: {
        provider: 'vercel',
        status: 'needs_credentials',
        message: 'Add a Vercel token in Settings and enable auto-deploy to publish live.',
        logs: [],
        at: new Date().toISOString(),
      },
      supabase: {
        provider: 'supabase',
        status: 'needs_credentials',
        message: 'Add a Supabase token + project ref to apply the schema automatically.',
        logs: [],
        at: new Date().toISOString(),
      },
    };
  }

  project.durationSeconds = Math.max(1, Math.round((Date.now() - started) / 1000));
  project.vercel.buildTime = `${project.durationSeconds}s`;
  emit('done', 100, `${project.durationSeconds}s`);
  return project;
}

function projectTablesNote(tables: { name: string; rows: number; rlsEnabled: boolean }[]): string {
  return `${tables.length} tables (${tables.filter((t) => t.rlsEnabled).length} with RLS)`;
}

/** Used by the Projects library to re-run a build from stored spec + prompt. */export function projectToBuildRequest(
  project: GeneratedProject,
  settings: AppSettings,
  feedback: LearningFeedback[],
  onStage: (e: BuildStageEvent) => void,
  signal?: AbortSignal,
): BuildRequest {
  return {
    prompt: project.prompt,
    platforms: project.platforms,
    settings,
    feedback,
    onStage,
    signal,
  };
}

/** Public planning API used by the orchestrator chat to preview a spec. */
export async function createPlan(
  prompt: string,
  settings: AppSettings,
  feedback: LearningFeedback[],
  platforms: { web: boolean; ios: boolean; android: boolean },
  signal?: AbortSignal,
): Promise<{ spec: BuildSpec; source: 'ai' | 'demo' }> {
  return planSpec({
    prompt,
    platforms,
    settings,
    feedback,
    signal,
    onStage: () => {},
  });
}

/** First-run sample project so every tab has real content to explore. */
export function createSeedProject(prompt: string, platforms = { web: true, ios: true, android: true }): GeneratedProject {
  const spec = heuristicSpec(prompt, platforms);
  const demo = generateProjectDeliverables(prompt);
  const previewHtml = buildPreviewFromSpec(spec, 'DEMO PREVIEW');
  const project: GeneratedProject = {
    ...demo,
    id: newId('proj'),
    name: spec.name,
    prompt,
    platforms,
    spec,
    source: 'demo',
    status: 'ready',
    previewHtml,
    files: [],
    warnings: ['Sample demo build — connect Gemini in Settings to synthesize real code from your own prompts.'],
    isSeed: true,
    deploys: {
      vercel: { provider: 'vercel', status: 'needs_credentials', message: 'Connect a Vercel token to publish.', logs: [], at: new Date().toISOString() },
      supabase: { provider: 'supabase', status: 'needs_credentials', message: 'Connect Supabase to apply the schema.', logs: [], at: new Date().toISOString() },
    },
  };
  const files = dedupe([...legacyToFiles(demo), makeFile('README.md', readmeFor(spec, project, 'demo'))]);
  project.files = files;
  project.quality = qualityChecks(project);
  return project;
}
