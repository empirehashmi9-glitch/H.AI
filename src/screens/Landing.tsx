import React from 'react';
import {
  ArrowRight, Bot, Check, Clock, Globe, Layers, Power, Rocket, Server, ShieldCheck, Sparkles, Wand2, Zap,
} from 'lucide-react';
import { useApp } from '../state/app';
import { APP_VERSION } from '../config/app';
import { LandingBackdrop } from '../ui/Backdrop';
import { Btn, Panel, Pill, cx } from '../ui/Toon';

const isoPt = (x: number, y: number, z = 0) => ({
  x: 300 + (x - y) * 31,
  y: 16 + (x + y) * 10 - z,
});

const isoPoly = (x: number, y: number, w: number, d: number, z = 0) =>
  [isoPt(x, y, z), isoPt(x + w, y, z), isoPt(x + w, y + d, z), isoPt(x, y + d, z)]
    .map((p) => `${p.x},${p.y}`)
    .join(' ');

const Rooms = [
  { x: 0, y: 0, tone: '#67e8f9' },
  { x: 3, y: 0, tone: '#67e8f9' },
  { x: 6, y: 0, tone: '#2ee6b0' },
  { x: 0, y: 3, tone: '#67e8f9' },
  { x: 3, y: 3, tone: '#ffb347' },
  { x: 6, y: 3, tone: '#67e8f9' },
  { x: 0, y: 6, tone: '#67e8f9' },
  { x: 3, y: 6, tone: '#67e8f9' },
  { x: 6, y: 6, tone: '#67e8f9' },
];

const HqPreview: React.FC = () => (
  <svg viewBox="0 0 600 220" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden="true">
    <defs>
      <radialGradient id="hqGlow" cx="50%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
      </radialGradient>
      <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="2.2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <rect width="600" height="220" fill="#03101a" />
    <rect width="600" height="220" fill="url(#hqGlow)" />

    {[...Array(13)].map((_, i) => (
      <g key={`g${i}`} stroke="#67e8f9" strokeOpacity="0.07" strokeWidth="0.7">
        <line x1={isoPt(i, 0).x} y1={isoPt(i, 0).y} x2={isoPt(i, 9).x} y2={isoPt(i, 9).y} />
        <line x1={isoPt(0, i).x} y1={isoPt(0, i).y} x2={isoPt(9, i).x} y2={isoPt(9, i).y} />
      </g>
    ))}

    <polygon points={isoPoly(0, 0, 9, 9)} fill="#02101a" fillOpacity="0.55" stroke="#67e8f9" strokeOpacity="0.3" strokeWidth="1" />

    {Rooms.map((room, i) => {
      const h = 16;
      const a = isoPt(room.x, room.y);
      const b = isoPt(room.x + 3, room.y);
      const c = isoPt(room.x, room.y + 3);
      return (
        <g key={i}>
          <polygon points={isoPoly(room.x, room.y, 3, 3)} fill={room.tone} fillOpacity="0.045" stroke={room.tone} strokeOpacity="0.28" strokeWidth="0.9" />
          <polygon
            points={`${a.x},${a.y} ${b.x},${b.y} ${b.x},${b.y - h} ${a.x},${a.y - h}`}
            fill={room.tone}
            fillOpacity="0.06"
            stroke={room.tone}
            strokeOpacity="0.38"
            strokeWidth="0.9"
          />
          <polygon
            points={`${a.x},${a.y} ${c.x},${c.y} ${c.x},${c.y - h} ${a.x},${a.y - h}`}
            fill={room.tone}
            fillOpacity="0.04"
            stroke={room.tone}
            strokeOpacity="0.26"
            strokeWidth="0.9"
          />
          <polygon points={isoPoly(room.x + 0.9, room.y + 1.3, 1.2, 0.6, 2)} fill="#dff7ff" fillOpacity="0.12" stroke="#dff7ff" strokeOpacity="0.2" strokeWidth="0.6" />
          <circle cx={isoPt(room.x + 2.2, room.y + 2.3, 6).x} cy={isoPt(room.x + 2.2, room.y + 2.3, 6).y} r="2.4" fill={room.tone} filter="url(#softGlow)" opacity="0.9" />
        </g>
      );
    })}

    <g fontFamily="JetBrains Mono, monospace" fontSize="7.5" letterSpacing="2.2" fill="#67e8f9" fillOpacity="0.6">
      <text x="18" y="22">FLOOR 02 · OPS GRID</text>
      <text x="582" y="212" textAnchor="end">30 AGENTS · 9 ROOMS</text>
    </g>
  </svg>
);

const StudioPreview: React.FC = () => (
  <div className="absolute inset-0 bg-[#03101a]" aria-hidden="true">
    <div className="absolute inset-0 hud-grid opacity-30" />
    <div className="absolute left-1/3 top-[-4rem] h-64 w-64 rounded-full bg-aqua/[0.09] blur-3xl" />
    <div className="absolute inset-0 flex items-center justify-center px-6">
      <div className="w-full max-w-[400px] rounded-xl border border-aqua/20 bg-[#02101a]/95 shadow-[0_24px_50px_rgba(0,0,0,0.55)]">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="w-1.5 h-1.5 rounded-full bg-coral/70" />
          <span className="w-1.5 h-1.5 rounded-full bg-sun/70" />
          <span className="w-1.5 h-1.5 rounded-full bg-mint/70" />
          <span className="ml-auto font-mono text-[8px] uppercase tracking-[0.2em] text-aqua/50">studio · build 042</span>
        </div>
        <div className="p-3 space-y-2.5">
          <div className="flex items-center gap-2 rounded-lg border border-aqua/20 bg-black/30 px-2.5 py-2">
            <Wand2 className="w-3 h-3 text-aqua" />
            <span className="text-[9px] font-semibold text-ink-soft">Boutique store · web · iOS · Android</span>
            <span className="ml-auto rounded border border-aqua/30 px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.14em] text-aqua">generate</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {['Web', 'iOS', 'Android'].map((p) => (
              <div key={p} className="flex items-center justify-between rounded border border-white/10 bg-white/[0.04] px-2 py-1">
                <span className="text-[8px] font-bold text-ink-soft uppercase tracking-[0.1em]">{p}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-mint shadow-[0_0_6px_#2ee6b0]" />
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            {[
              { label: 'Design system', width: '86%' },
              { label: 'Web app', width: '64%' },
              { label: 'Mobile bundle', width: '38%' },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-2">
                <span className="w-[74px] shrink-0 text-[7.5px] font-semibold text-ink-soft">{row.label}</span>
                <span className="h-1 flex-1 rounded-full bg-white/10">
                  <span className="block h-full rounded-full bg-aqua/70" style={{ width: row.width }} />
                </span>
                <span className="w-7 text-right font-mono text-[7px] text-aqua/70">{row.width}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const stats = [
  { icon: Bot, label: '30 agents', sub: 'always on', tone: 'text-aqua' },
  { icon: Clock, label: '1–2 min', sub: 'per build', tone: 'text-mint' },
  { icon: Layers, label: '3 platforms', sub: 'web · iOS · Android', tone: 'text-sun' },
  { icon: Rocket, label: 'Live deploys', sub: 'Supabase + Vercel', tone: 'text-coral' },
];

const tel = [
  { k: 'AGENTS', v: '30/30' },
  { k: 'CORES', v: '6' },
  { k: 'UPTIME', v: '99.98%' },
  { k: 'LATENCY', v: '14ms' },
];

export const Landing: React.FC = () => {
  const { setMode, aiLive, projects, feedback } = useApp();

  return (
    <div className="relative min-h-screen flex flex-col">
      <LandingBackdrop />

      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="toon-card hud-frame flex items-center justify-between gap-3 px-4 py-2.5 rounded-full">
          <div className="flex items-center gap-3 min-w-0">
            <span className="relative w-9 h-9 shrink-0 rounded-[10px] bg-ink/[0.06] border border-aqua/60 grid place-items-center font-display text-base font-bold text-aqua shadow-[0_0_18px_rgba(34,211,238,0.35)]">
              H
              <span className="absolute -right-0.5 -bottom-0.5 w-1.5 h-1.5 rounded-full bg-mint shadow-[0_0_8px_#2ee6b0]" />
            </span>
            <div className="min-w-0">
              <div className="font-display text-[13px] leading-none tracking-[0.16em]">H.AI</div>
              <div className="hud-label mt-1 hidden sm:block truncate">J.A.R.V.I.S. core</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Pill tone={aiLive ? 'mint' : 'sun'} dot={aiLive ? '#2EE6B0' : '#FFB347'} className="hidden sm:inline-flex">
              {aiLive ? 'Systems online' : 'Demo'}
            </Pill>
            <Pill tone="cream" className="hidden sm:inline-flex">{APP_VERSION}</Pill>
            <Btn tone="grape" size="sm" onClick={() => setMode('customer')} className="hidden sm:inline-flex">
              Enter Studio <ArrowRight className="w-3.5 h-3.5" />
            </Btn>
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 flex-1">
        <section className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-center py-8 sm:py-12">
          <div className="space-y-5 sm:space-y-6 anim-pop">
            <div className="flex items-center gap-2 font-mono text-[11px] text-aqua/90">
              <span className="w-2 h-2 rounded-full bg-mint shadow-[0_0_10px_#2ee6b0]" />
              <span className="hud-label terminal-caret">J.A.R.V.I.S. online · all systems nominal</span>
            </div>

            <h1 className="text-[2.5rem] leading-[1.05] sm:text-6xl font-semibold">
              Good evening, sir.
              <br />
              <span className="bg-gradient-to-r from-aqua via-mint to-sun bg-clip-text text-transparent">
                Shall we build?
              </span>
            </h1>

            <p className="text-ink/75 text-sm sm:text-base leading-relaxed max-w-xl">
              Ek idea likhein — H.AI usse web, iOS aur Android app bana kar live karta hai.
              Design, code, tests aur deploy, sab ek hi console se.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Btn tone="grape" size="lg" onClick={() => setMode('customer')} className="group">
                <Sparkles className="w-4 h-4" />
                Start building
                <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
              </Btn>
              <Btn tone="cream" size="lg" onClick={() => setMode('admin')} className="border-aqua/40">
                <Server className="w-4 h-4" />
                Open Admin HQ
              </Btn>
            </div>

            <p className="text-[11px] font-semibold text-ink-soft">
              Free to try · no install · English ya Roman Urdu, dono chalte hain
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 max-w-xl">
              {tel.map((t) => (
                <div key={t.k} className="rounded-lg border border-aqua/15 bg-white/[0.03] px-3 py-2">
                  <div className="hud-label">{t.k}</div>
                  <div className="font-mono text-sm text-aqua tabular-nums">{t.v}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold text-ink/60">
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-sun" /> {projects.length} {projects.length === 1 ? 'build' : 'builds'} in this browser</span>
              <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-aqua" /> Supabase + Vercel ready</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-mint" /> {feedback.length} learning signals</span>
            </div>
          </div>

          <div className="relative anim-pop" style={{ animationDelay: '0.08s' }}>
            <Panel className="hud-frame relative overflow-hidden p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="hud-label">arc reactor · core</span>
                <Pill tone="mint">stable</Pill>
              </div>

              <div className="relative mt-4 grid place-items-center">
                <div className="arc-reactor w-full max-w-[19rem] hud-flicker">
                  <span className="arc-core" />
                </div>
                <div className="pointer-events-none absolute inset-0">
                  <span className="absolute left-0 top-[16%] hud-label">pwr 98%</span>
                  <span className="absolute right-0 top-[44%] hud-label text-right">sync ok</span>
                  <span className="absolute left-[6%] bottom-[12%] hud-label">thermal 31°c</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { k: 'AGENTS', v: '30/30' },
                  { k: 'BUILDS', v: String(projects.length) },
                  { k: 'SIGNALS', v: String(feedback.length) },
                ].map((s) => (
                  <div key={s.k} className="rounded-lg border border-aqua/15 bg-white/[0.03] px-2.5 py-2 text-center">
                    <div className="hud-label">{s.k}</div>
                    <div className="font-mono text-sm text-aqua tabular-nums">{s.v}</div>
                  </div>
                ))}
              </div>
            </Panel>

            <div className="absolute -top-4 -right-2 hidden sm:flex items-center gap-1.5 rounded-md border border-aqua/40 bg-[#02121a]/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-aqua">
              <Power className="w-3 h-3" /> vox enabled
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-5 sm:gap-6 pb-10">
          <Panel className="overflow-hidden flex flex-col transition hover:-translate-y-1">
            <div className="relative h-40 sm:h-48 border-b border-aqua/20 overflow-hidden bg-[#041e28]">
              <StudioPreview />
              <div className="absolute inset-0 hud-scan opacity-30" />
            </div>
            <div className="p-5 sm:p-6 flex-1 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-lg bg-aqua/10 border border-aqua/40 grid place-items-center text-aqua shadow-[0_0_18px_rgba(34,211,238,0.2)]">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg leading-none tracking-[0.12em]">H.AI Studio</h2>
                  <p className="hud-label mt-1">prompt → app → live</p>
                </div>
              </div>
              <p className="text-xs text-ink-soft leading-relaxed">
                Describe your idea in plain English. Pick the platforms, watch the crew build, refine
                it in one line, then preview the real files and deploy.
              </p>
              <ul className="space-y-1.5 text-xs font-semibold">
                {['One prompt, three native platforms', 'Refine any build in one sentence', 'Live preview + full source code', 'One-tap Vercel & Supabase publish'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-[3px] bg-mint/15 border border-mint/60 grid place-items-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-mint" strokeWidth={3.5} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Btn tone="grape" block onClick={() => setMode('customer')} className="mt-1">
                Open the Studio <ArrowRight className="w-4 h-4" />
              </Btn>
            </div>
          </Panel>

          <Panel className="overflow-hidden flex flex-col transition hover:-translate-y-1">
            <div className="relative h-40 sm:h-48 border-b border-aqua/20 overflow-hidden bg-[#041e28]">
              <HqPreview />
              <div className="absolute inset-0 hud-scan opacity-30" />
            </div>
            <div className="p-5 sm:p-6 flex-1 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-lg bg-grape/10 border border-aqua/40 grid place-items-center text-aqua shadow-[0_0_18px_rgba(34,211,238,0.2)]">
                  <Server className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg leading-none tracking-[0.12em]">H.AI HQ</h2>
                  <p className="hud-label mt-1">the 30-agent office</p>
                </div>
              </div>
              <p className="text-xs text-ink-soft leading-relaxed">
                Walk the isometric office, watch every robot work, scale the cluster to 100,000
                agents, and answer support tickets in real time.
              </p>
              <ul className="space-y-1.5 text-xs font-semibold">
                {['3D office with 30 live agents', 'Builds, deploys and support telemetry', 'Cluster slider from 30 → 100,000'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-[3px] bg-aqua/15 border border-aqua/60 grid place-items-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-aqua" strokeWidth={3.5} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Btn tone="cream" block onClick={() => setMode('admin')} className="mt-1 border-aqua/40">
                Open Admin HQ <ArrowRight className="w-4 h-4" />
              </Btn>
            </div>
          </Panel>
        </section>

        <section className="pb-8 sm:pb-10">
          <div className="toon-card-sm p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="font-display text-sm tracking-[0.14em]">How it works</h2>
              <span className="hud-label hidden sm:block">3 steps · about 2 minutes</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { n: '01', title: 'Write the idea', copy: 'One sentence, English or Roman Urdu. Add platforms if you like.' },
                { n: '02', title: 'Watch the crew', copy: '30 agents design, code, test and wire the database in parallel.' },
                { n: '03', title: 'Preview & ship', copy: 'Check the live preview, refine any change in one line, then publish in one tap.' },
              ].map((step) => (
                <div key={step.n} className="flex items-start gap-2.5 rounded-xl border border-aqua/15 bg-white/[0.03] p-3">
                  <span className="shrink-0 w-7 h-7 rounded-lg border border-aqua/30 bg-aqua/10 text-aqua grid place-items-center font-mono text-[10px] font-bold">
                    {step.n}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold">{step.title}</div>
                    <p className="text-[11px] text-ink-soft leading-relaxed mt-0.5">{step.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map(({ icon: Icon, label, sub, tone }, i) => (
              <div
                key={label}
                className="toon-card-sm p-3.5 sm:p-4 flex items-center gap-3 anim-pop"
                style={{ animationDelay: `${0.1 + i * 0.05}s` }}
              >
                <span className={cx('w-10 h-10 rounded-lg border border-white/10 bg-white/[0.04] grid place-items-center shrink-0', tone)}>
                  <Icon className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <div className="font-display text-sm leading-none tracking-[0.1em]">{label}</div>
                  <div className="hud-label mt-1 truncate">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-aqua/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 hud-label">
          <span>H.AI · {APP_VERSION} · J.A.R.V.I.S. interface</span>
          <span className="flex items-center gap-2">
            <span className={aiLive ? 'text-mint' : 'text-sun'}>{aiLive ? 'Gemini connected' : 'Demo mode — add a key in Account'}</span>
            <span aria-hidden="true">·</span>
            <span>keys never leave this browser</span>
          </span>
        </div>
      </footer>
    </div>
  );
};
