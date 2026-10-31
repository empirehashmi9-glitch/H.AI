import {
  AppSettings,
  BuildStageEvent,
  GeneratedProject,
  GeneratedFile,
  LearningFeedback,
  ProjectRevision,
} from '../types/agent';
import { makeFile, runBuild } from './buildPipeline';
import { newId } from '../utils/storage';

export interface RefineOutcome {
  project: GeneratedProject;
  applied: string[];
  source: 'ai' | 'local';
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const clip = (s: string, n: number) => (s.length <= n ? s : `${s.slice(0, n - 1)}…`);

const BASE_CSS = `
  .hai-rev{margin:26px 0;padding:22px;border-radius:20px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.03)}
  .hai-rev h2{margin:0 0 6px;font-size:21px;letter-spacing:-.01em}
  .hai-rev .lead{color:var(--m);font-size:13px;line-height:1.65;margin:0 0 16px}
  .hai-rev .tag{display:inline-block;margin-left:8px;padding:2px 7px;border-radius:999px;border:1px solid rgba(255,255,255,.2);font-size:9px;letter-spacing:.08em;text-transform:uppercase;vertical-align:middle}
  .hai-prices{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}
  .hai-price{padding:16px;border-radius:16px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);display:flex;flex-direction:column;gap:8px}
  .hai-price.best{border-color:color-mix(in srgb,var(--p) 60%,transparent);background:linear-gradient(160deg,color-mix(in srgb,var(--p) 22%,transparent),rgba(255,255,255,.02))}
  .hai-price b{font-size:26px;font-weight:800;letter-spacing:-.02em}
  .hai-price small{color:var(--m);font-size:12px}
  .hai-price button{border:0;border-radius:10px;padding:8px 10px;background:var(--p);color:#fff;font-weight:700;cursor:pointer}
  .hai-quotes{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
  .hai-quote{padding:14px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);font-size:13px;line-height:1.6;color:var(--t)}
  .hai-quote span{display:block;margin-top:8px;color:var(--m);font-size:11px}
  .hai-form{display:grid;gap:10px;max-width:380px}
  .hai-form button{border:0;border-radius:12px;padding:11px 14px;background:var(--p);color:#fff;font-weight:700;cursor:pointer}
  .hai-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px}
  .hai-kpi{padding:14px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03)}
  .hai-kpi b{display:block;font-size:24px;letter-spacing:-.02em}
  .hai-kpi small{color:var(--m);font-size:11px;text-transform:uppercase;letter-spacing:.08em}
  .hai-chat{display:flex;gap:10px;flex-wrap:wrap}
  .hai-chat input{flex:1;min-width:180px}
  .hai-chat button{border:0;border-radius:12px;padding:11px 16px;background:var(--p);color:#fff;font-weight:700;cursor:pointer}
  .hai-chat-reply{margin:12px 0 0;color:var(--t);font-size:13px;line-height:1.6}
  @media(max-width:640px){.hai-rev{padding:16px}.hai-rev h2{font-size:18px}}
`;

function pricingSection(name: string): string {
  const plans = [
    { tier: 'Starter', price: '$0', note: 'Sample tier', cta: 'Try demo' },
    { tier: 'Pro', price: '$29', note: 'Sample tier', cta: 'Choose demo', best: true },
    { tier: 'Scale', price: '$99', note: 'Sample tier', cta: 'Contact demo' },
  ];
  return `<section class="hai-rev" id="pricing">
      <h2>Pricing plans <span class="tag">sample</span></h2>
      <p class="lead">Layout only — these tiers and prices are placeholders. Replace them and connect a billing provider before launch.</p>
      <div class="hai-prices">
        ${plans
          .map(
            (p) => `<article class="hai-price${p.best ? ' best' : ''}">
          <small>${p.tier}</small>
          <b>${p.price}</b>
          <small>${p.note} · not connected</small>
          <button type="button" onclick="showToast('Sample plan — billing is not connected')">${p.cta}</button>
        </article>`,
          )
          .join('\n        ')}
      </div>
    </section>`;
}

function loginSection(): string {
  return `<section class="hai-rev" id="accounts">
      <h2>Sign in <span class="tag">demo</span></h2>
      <p class="lead">A form-only preview. No auth backend is connected in this revision — wire Supabase Auth before relying on accounts.</p>
      <form class="hai-form" onsubmit="event.preventDefault();showToast('Demo form — no account was created')">
        <input type="email" placeholder="you@example.com" required>
        <input type="password" placeholder="Password" required>
        <button type="submit">Sign in</button>
      </form>
    </section>`;
}

function reviewsSection(): string {
  return `<section class="hai-rev" id="reviews">
      <h2>Customer reviews <span class="tag">placeholder</span></h2>
      <p class="lead">These quotes are sample copy for layout preview — they are not real customer feedback.</p>
      <div class="hai-quotes">
        <div class="hai-quote">“Sample review copy for layout preview.”<span>Sample customer · boutique owner</span></div>
        <div class="hai-quote">“Sample review copy for layout preview.”<span>Sample customer · store manager</span></div>
        <div class="hai-quote">“Sample review copy for layout preview.”<span>Sample customer · returning customer</span></div>
      </div>
    </section>`;
}

function analyticsSection(): string {
  return `<section class="hai-rev" id="analytics">
      <h2>Operator analytics <span class="tag">sample data</span></h2>
      <p class="lead">Mock numbers for the layout. Connect an analytics source to show real traffic and revenue.</p>
      <div class="hai-kpis">
        <div class="hai-kpi"><b>12.4k</b><small>Visitors · sample</small></div>
        <div class="hai-kpi"><b>4.8%</b><small>Conversion · sample</small></div>
        <div class="hai-kpi"><b>$8,900</b><small>Revenue · sample</small></div>
        <div class="hai-kpi"><b>96%</b><small>Checkout · sample</small></div>
      </div>
    </section>`;
}

function chatSection(): string {
  return `<section class="hai-rev" id="assist">
      <h2>Ask H.AI Assist <span class="tag">demo</span></h2>
      <p class="lead">Replies stay inside this preview page. No support backend or human desk is connected in this revision.</p>
      <div class="hai-chat">
        <input id="hai-chat-input" placeholder="e.g. Where is my order?">
        <button type="button" onclick="haiReply()">Send</button>
      </div>
      <p class="hai-chat-reply" id="hai-chat-reply"></p>
    </section>`;
}

const CHAT_JS = `<script>
function haiReply(){var i=document.getElementById('hai-chat-input'),o=document.getElementById('hai-chat-reply');if(!i||!o)return;var q=(i.value||'').trim();o.textContent=q?('Demo reply for "'+q.slice(0,80)+'": this preview has no support backend, so nothing was sent.'):'Type a question first.';i.value='';}
</script>`;

function notificationsSection(): string {
  return `<section class="hai-rev" id="alerts">
      <h2>Notification centre <span class="tag">sample</span></h2>
      <p class="lead">Sample feed only. Email and push delivery are not connected in this revision.</p>
      <div class="hai-quotes">
        <div class="hai-quote">Sample order event · 2 min ago<span>Orders channel · preview</span></div>
        <div class="hai-quote">Sample payment event · 18 min ago<span>Billing channel · preview</span></div>
        <div class="hai-quote">Sample weekly digest<span>Reports channel · preview</span></div>
      </div>
    </section>`;
}

function bilingualSection(): string {
  return `<section class="hai-rev" id="language">
      <h2>English + اردو <span class="tag">sample</span></h2>
      <p class="lead">Adds one Urdu block to the preview. Full bilingual routing and RTL parity still need to be wired screen by screen.</p>
      <div class="hai-quote" dir="rtl" style="text-align:right;font-size:14px">یہ اردو نمونہ ہے۔ مکمل دو لسانی انٹرفیس کے لیے ہر اسکرین الگ سے تیار کرنی ہوگی۔<span style="text-align:right">اردو نمونہ</span></div>
    </section>`;
}

const PALETTES: Array<{ re: RegExp; label: string; primary: string; accent: string }> = [
  { re: /purple|violet|lavender|جامنی/i, label: 'purple palette', primary: '#8b5cf6', accent: '#22d3ee' },
  { re: /blue|navy|نیلا/i, label: 'blue palette', primary: '#3b82f6', accent: '#22d3ee' },
  { re: /green|emerald|lime|سبز/i, label: 'green palette', primary: '#10b981', accent: '#a3e635' },
  { re: /orange|amber|sunset|نارنجی/i, label: 'orange palette', primary: '#f97316', accent: '#facc15' },
  { re: /red|crimson|rose|لال/i, label: 'red palette', primary: '#f43f5e', accent: '#f97316' },
  { re: /pink|magenta|گلابی/i, label: 'pink palette', primary: '#ec4899', accent: '#22d3ee' },
  { re: /teal|cyan|turquoise/i, label: 'teal palette', primary: '#06b6d4', accent: '#a3e635' },
  { re: /gold|yellow/i, label: 'gold palette', primary: '#f59e0b', accent: '#22c55e' },
];

function renameTarget(instruction: string): string | null {
  const m =
    instruction.match(/\brename\s+(?:(?:the\s+app|it)\s+)?(?:to|as)\s+["“']?([A-Za-z0-9][A-Za-z0-9 .&'_-]{0,39}?)["”']?(?=[.,!]|$)/i) ||
    instruction.match(/\b(?:call|name)\s+it\s+["“']?([A-Za-z0-9][A-Za-z0-9 .&'_-]{0,39}?)["”']?(?=[.,!]|$)/i);
  return m ? m[1].trim() : null;
}

function upsertChangelog(files: GeneratedFile[], name: string, revisions: ProjectRevision[]): GeneratedFile[] {
  if (!revisions.length) return files;
  const body = [
    `# Changelog — ${name}`,
    '',
    ...revisions
      .slice()
      .sort((a, b) => b.version - a.version)
      .map(
        (r) =>
          `## v${r.version} · ${new Date(r.at).toLocaleString()} · ${r.source === 'ai' ? 'AI rebuild' : 'Preview edit'}\n\n**Request:** ${r.instruction}\n\n**Applied:** ${r.summary}\n`,
      ),
  ].join('\n');
  return [...files.filter((f) => f.path !== 'CHANGELOG.md'), makeFile('CHANGELOG.md', body)];
}

function nextIdentity(base: GeneratedProject, name: string, revision: ProjectRevision) {
  const revisions = [...(base.revisions || []), revision];
  const fromName = (s: string) => (name === base.name ? s : s.split(base.name).join(name));
  const files = upsertChangelog(
    (base.files || []).map((f) => {
      const content = fromName(f.content);
      return content === f.content ? f : { ...f, content, bytes: new Blob([content]).size };
    }),
    name,
    revisions,
  );
  const code = base.code
    ? {
        web: {
          framework: base.code.web.framework,
          mainComponent: fromName(base.code.web.mainComponent),
          appCss: fromName(base.code.web.appCss),
          packageJson: fromName(base.code.web.packageJson),
        },
        ios: {
          framework: base.code.ios.framework,
          contentViewSwift: fromName(base.code.ios.contentViewSwift),
          appSwift: fromName(base.code.ios.appSwift),
          podfile: fromName(base.code.ios.podfile),
        },
        android: {
          framework: base.code.android.framework,
          mainActivityKt: fromName(base.code.android.mainActivityKt),
          buildGradle: fromName(base.code.android.buildGradle),
        },
      }
    : base.code;
  return { revisions, files, code };
}

/** Refinements always invalidate the previous deploy state. */
function clearedDeploy(base: GeneratedProject) {
  return {
    status: 'ready' as const,
    deploys: {},
    vercel: { ...base.vercel, deployed: false, deployUrl: '' },
    supabase: { ...base.supabase, deployed: false },
  };
}

/**
 * Deterministic preview editor for demo builds (or when Gemini is unavailable).
 * Only applies the changes it actually renders. Returns null when the request
 * cannot be represented, so the UI can ask for a Gemini key instead of faking it.
 */
export function refineLocally(base: GeneratedProject, rawInstruction: string): RefineOutcome | null {
  const instruction = rawInstruction.trim();
  const lower = instruction.toLowerCase();
  const has = (re: RegExp) => re.test(lower);
  const version = (base.revisions?.length || 0) + 1;
  const applied: string[] = [];
  const design = { ...(base.spec?.design ?? { primary: '#6366f1', accent: '#10b981', surface: '#0b0f19', style: 'modern' }) };

  const rename = renameTarget(instruction);
  const wantsDark = has(/\bdark\b|midnight|night mode|black theme|dark mode/);
  const palette = PALETTES.find((p) => p.re.test(lower) && has(/colou?r|theme|palette/));

  if (rename) applied.push(`renamed to ${rename}`);
  if (wantsDark) {
    design.surface = '#05070d';
    design.style = `${design.style}, deep dark surfaces`;
    applied.push('dark theme');
  }
  if (palette) {
    design.primary = palette.primary;
    design.accent = palette.accent;
    applied.push(palette.label);
  }

  let html = base.previewHtml || '';
  const sections: string[] = [];
  const scripts: string[] = [];
  const addedFeatures: { title: string; description: string }[] = [];

  const section = (id: string, label: string, title: string, body: string, js?: string) => {
    if (html.includes(`id="${id}"`)) {
      applied.push(`${label} (already present)`);
      return;
    }
    sections.push(body);
    if (js) scripts.push(js);
    applied.push(label);
    addedFeatures.push({ title, description: `Preview section added in revision ${version}.` });
  };

  if (html) {
    if (has(/pricing|plans?\b|subscription|tiers?\b|monetiz/)) {
      section('pricing', 'pricing plans', 'Pricing plans', pricingSection(rename || base.name));
    }
    if (has(/log ?in|sign ?in|sign ?up|accounts?\b|\bauth/)) {
      section('accounts', 'accounts & login (demo form)', 'Accounts & login', loginSection());
    }
    if (has(/review|rating|testimonial|social proof/)) {
      section('reviews', 'customer reviews (placeholder)', 'Customer reviews', reviewsSection());
    }
    if (has(/analytic|dashboard|insight|metric|report/)) {
      section('analytics', 'operator analytics (sample data)', 'Operator analytics', analyticsSection());
    }
    if (has(/chat|assistant|\bbot\b|helpdesk|support widget|\bfaq\b/)) {
      section('assist', 'AI support chat (demo)', 'AI support chat', chatSection(), CHAT_JS);
    }
    if (has(/notif|alert|email update/)) {
      section('alerts', 'notifications (sample)', 'Notification centre', notificationsSection());
    }
    if (has(/urdu|bilingual|\brtl\b|translation|language/)) {
      section('language', 'Urdu sample block', 'English + Urdu layouts', bilingualSection());
    }
  }

  if (!html && !rename && !wantsDark && !palette) return null;
  if (!applied.length) return null;

  if (html) {
    if (!html.includes('.hai-rev{')) html = html.replace('</style>', `${BASE_CSS}\n</style>`);
    if (wantsDark) {
      html = html.replace(/--s:#?[0-9a-zA-Z(),.%\s]+;/, '--s:#05070d;');
      html = html.replace(/--t:#[0-9a-fA-F]{3,8};/, '--t:#eef6ff;');
    }
    if (palette) {
      html = html.replace(/--p:#[0-9a-fA-F]{3,8};/, `--p:${palette.primary};`);
      html = html.replace(/--a:#[0-9a-fA-F]{3,8};/, `--a:${palette.accent};`);
    }
    if (rename) {
      html = html.split(esc(base.name)).join(esc(rename));
      html = html.split(base.name).join(rename);
    }
    if (sections.length) {
      const block = `\n${sections.join('\n')}\n`;
      const anchor = html.indexOf('</section>');
      if (anchor >= 0) {
        html = `${html.slice(0, anchor + '</section>'.length)}${block}${html.slice(anchor + '</section>'.length)}`;
      } else if (html.includes('<footer')) {
        html = html.replace('<footer', `${block}<footer`);
      } else {
        html = html.replace('</main>', `${block}</main>`);
      }
    }
    if (scripts.length && !html.includes('function haiReply')) {
      html = html.replace('</body>', `${scripts.join('\n')}\n</body>`);
    }
    html = html.replace(
      /(<div class="badge">)([^<]*)(<\/div>)/,
      (_m, a: string, b: string, c: string) => `${a}${b} · REV ${version}${c}`,
    );
  }

  const revision: ProjectRevision = {
    id: newId('rev'),
    version,
    instruction,
    summary: applied.join(' · '),
    at: new Date().toISOString(),
    source: 'local',
  };
  const identity = nextIdentity(base, rename || base.name, revision);
  const nextFeatures = [...addedFeatures, ...(base.spec?.features || [])]
    .filter((f, i, arr) => arr.findIndex((x) => x.title.toLowerCase() === f.title.toLowerCase()) === i)
    .slice(0, 10);

  return {
    applied,
    source: 'local',
    project: {
      ...base,
      ...clearedDeploy(base),
      name: rename || base.name,
      spec: base.spec
        ? { ...base.spec, name: rename || base.name, design, features: nextFeatures.length ? nextFeatures : base.spec.features }
        : base.spec,
      previewHtml: html || base.previewHtml,
      files: identity.files,
      code: identity.code,
      revisions: identity.revisions,
      isSeed: false,
      timestamp: new Date().toISOString(),
    },
  };
}

function buildContext(base: GeneratedProject): string {
  const spec = base.spec
    ? [
        `Name: ${base.spec.name}`,
        `Tagline: ${base.spec.tagline}`,
        `Summary: ${base.spec.summary}`,
        `Features: ${base.spec.features.map((f) => `${f.title} — ${f.description}`).join(' | ')}`,
        `Screens: ${base.spec.screens.join(', ')}`,
        `Data models: ${base.spec.dataModels.map((m) => `${m.name}(${m.columns.map((c) => c.name).join('/')})`).join(', ')}`,
        `Design: primary ${base.spec.design.primary}, accent ${base.spec.design.accent}, ${base.spec.design.style}`,
      ].join('\n')
    : 'No structured spec.';
  const files = (base.files || [])
    .slice(0, 30)
    .map((f) => `--- ${f.path}\n${clip(f.content, 1200)}`)
    .join('\n\n');
  return clip(`${spec}\n\nExisting files:\n${files}`, 15000);
}

/**
 * AI refinement: regenerates the product but feeds the current spec and source
 * into the prompt so existing features survive. Auto-deploy is always disabled.
 */
export async function refineWithAI(
  base: GeneratedProject,
  instruction: string,
  settings: AppSettings,
  feedback: LearningFeedback[],
  onStage: (e: BuildStageEvent) => void,
  signal?: AbortSignal,
): Promise<RefineOutcome> {
  const fresh = await runBuild({
    prompt: [
      base.prompt,
      '',
      'EXISTING PRODUCT — PRESERVE EVERYTHING BELOW:',
      buildContext(base),
      '',
      `Change request: ${instruction.trim()}`,
      'Apply only this change. Keep every existing screen, feature, data model and working file. Do not rename the product unless the request explicitly asks for a rename.',
    ].join('\n'),
    platforms: base.platforms,
    settings: { ...settings, autoDeploy: false },
    feedback,
    signal,
    onStage,
  });

  if (signal?.aborted) throw new Error('aborted');

  if (fresh.source === 'ai') {
    const rename = renameTarget(instruction);
    const name = rename || base.name;
    const revision: ProjectRevision = {
      id: newId('rev'),
      version: (base.revisions?.length || 0) + 1,
      instruction: instruction.trim(),
      summary: rename ? `AI rebuild · renamed to ${rename}` : 'AI regeneration · review the new files before deploying',
      at: new Date().toISOString(),
      source: 'ai',
    };
    const renamer = (s: string) => (name === fresh.name ? s : s.split(fresh.name).join(name));
    const files = (fresh.files || []).map((f) => {
      const content = renamer(f.content);
      return content === f.content ? f : { ...f, content, bytes: new Blob([content]).size };
    });
    const revisions = [...(base.revisions || []), revision];
    return {
      applied: rename ? [`renamed to ${rename}`, 'AI rebuild'] : ['AI rebuild'],
      source: 'ai',
      project: {
        ...fresh,
        ...clearedDeploy(base),
        id: base.id,
        name,
        rating: base.rating,
        isSeed: false,
        timestamp: new Date().toISOString(),
        spec: fresh.spec ? { ...fresh.spec, name } : fresh.spec,
        previewHtml: fresh.previewHtml ? renamer(fresh.previewHtml) : fresh.previewHtml,
        revisions,
        files: upsertChangelog(files, name, revisions),
      },
    };
  }

  const fallback = refineLocally(base, instruction);
  if (!fallback) {
    throw new Error("Gemini didn't return a usable build, and the demo engine can't apply this change. Try again or rephrase it.");
  }
  return fallback;
}
