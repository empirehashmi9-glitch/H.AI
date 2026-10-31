import React, { useEffect, useRef, useState } from 'react';
import {
  Apple, BrainCircuit, Check, Clock, Globe, Hammer, Loader2, Mic, MicOff, Rocket,
  ShieldCheck, Smartphone, Sparkles, Wand2, XCircle,
} from 'lucide-react';
import { useApp } from '../../state/app';
import { SAMPLE_PROMPTS } from '../../utils/orchestrator';
import { enhancePrompt } from '../../services/enhance';
import { Btn, IconTile, Panel, Pill, ProgressBar, Sticker, cx } from '../../ui/Toon';
import { toast } from '../../components/Toast';

const PLATFORMS = [
  { key: 'web' as const, label: 'Web', icon: Globe, tone: 'bg-aqua/15 text-aqua border-aqua/40' },
  { key: 'ios' as const, label: 'iOS', icon: Apple, tone: 'bg-mint/15 text-mint border-mint/40' },
  { key: 'android' as const, label: 'Android', icon: Smartphone, tone: 'bg-sun/15 text-sun border-sun/40' },
];

const STATIONS = [
  { label: 'Plan', icon: BrainCircuit, tone: 'bg-grape/15 text-aqua', until: 14 },
  { label: 'Build', icon: Hammer, tone: 'bg-coral/15 text-coral', until: 80 },
  { label: 'Verify', icon: ShieldCheck, tone: 'bg-sun/15 text-sun', until: 95 },
  { label: 'Ship', icon: Rocket, tone: 'bg-mint/15 text-mint', until: 100 },
];

function useSpeechToText(onText: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);

  useEffect(
    () => () => {
      try {
        recRef.current?.stop();
      } catch {
        /* ignore */
      }
    },
    [],
  );

  const toggle = () => {
    if (listening) {
      try {
        recRef.current?.stop();
      } catch {
        /* ignore */
      }
      setListening(false);
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error('Voice input is not supported in this browser');
      return;
    }
    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) onText(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      toast.error('Could not hear you — try again');
    };
    try {
      recognition.start();
      recRef.current = recognition;
      setListening(true);
    } catch {
      toast.error('Voice input is busy');
    }
  };

  return { listening, toggle };
}

const BuildTheatre: React.FC = () => {
  const { progress, stage, stageMessage, elapsed, cancel } = useApp();
  const activeIdx =
    stage === 'done' ? 4 : progress <= 14 ? 0 : progress <= 80 ? 1 : progress <= 95 ? 2 : 3;

  return (
    <div className="space-y-4 anim-pop" aria-live="polite">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <IconTile tone="mint" className="w-9 h-9 rounded-lg">
            <Hammer className="w-4 h-4" />
          </IconTile>
          <div>
            <div className="font-display text-lg leading-none">The crew is on it</div>
            <div className="text-[11px] font-bold text-ink-soft">30 robots · one build line</div>
          </div>
        </div>
        <Pill tone={stage === 'done' ? 'mint' : 'grape'} dot={stage === 'done' ? '#159570' : '#FF7A8A'}>
          {stage === 'done' ? 'Complete' : 'Building'} · {Math.round(progress)}%
        </Pill>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {STATIONS.map((station, i) => {
          const Icon = station.icon;
          const done = activeIdx > i || stage === 'done';
          const active = activeIdx === i && stage !== 'done';
          return (
            <div
              key={station.label}
              className={cx(
                'relative flex flex-col items-center gap-1.5 rounded-xl border px-1.5 py-3 transition',
                done
                  ? 'bg-mint/[0.08] border-mint/40'
                  : active
                    ? 'bg-aqua/[0.06] border-aqua/40 shadow-[0_0_18px_rgba(34,211,238,0.12)]'
                    : 'bg-white/[0.03] border-white/10 opacity-70',
                active && 'anim-bob',
              )}
            >
              <span
                className={cx(
                  'w-8 h-8 rounded-full grid place-items-center border',
                  done ? 'bg-mint/15 border-mint/40 text-mint' : active ? `${station.tone} border-white/20` : 'bg-white/[0.04] border-white/10 text-ink/50',
                )}
              >
                {done && stage !== 'done' ? <Check className="w-4 h-4" strokeWidth={3.5} /> : <Icon className="w-4 h-4" />}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wide">{station.label}</span>
              {active && <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-coral shadow-[0_0_8px_rgba(255,122,138,0.8)] anim-wiggle" />}
            </div>
          );
        })}
      </div>

      <ProgressBar value={progress} tone={stage === 'done' ? 'mint' : 'coral'} striped height="h-4" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p className="text-xs font-bold text-ink-soft leading-relaxed">{stageMessage}</p>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-ink-soft">
            <Clock className="w-3.5 h-3.5" /> {elapsed}s
          </span>
          <Btn tone="cream" size="sm" onClick={cancel} disabled={stage === 'done'}>
            <XCircle className="w-3.5 h-3.5" /> Cancel
          </Btn>
        </div>
      </div>
    </div>
  );
};

export const BuildComposer: React.FC<{ autoFocus?: boolean }> = ({ autoFocus }) => {
  const { generate, generating, settings, aiLive } = useApp();
  const [prompt, setPrompt] = useState('');
  const [platforms, setPlatforms] = useState({ web: true, ios: true, android: true });
  const [enhancing, setEnhancing] = useState(false);
  const { listening, toggle } = useSpeechToText((text) =>
    setPrompt((prev) => (prev ? `${prev} ${text}` : text)),
  );

  const start = () => {
    if (!prompt.trim()) {
      toast.error('Type an idea first — even one sentence works');
      return;
    }
    generate(prompt, platforms);
  };

  const enhance = async () => {
    if (!prompt.trim() || enhancing) return;
    setEnhancing(true);
    try {
      const richer = await enhancePrompt(prompt, settings);
      setPrompt(richer);
      toast.success(aiLive ? 'Idea expanded with Gemini — edit anything' : 'Idea expanded — edit anything');
    } catch {
      toast.error('Could not expand that idea — try rephrasing');
    } finally {
      setEnhancing(false);
    }
  };

  if (generating) {
    return (
      <Panel className="p-4 sm:p-6">
        <BuildTheatre />
      </Panel>
    );
  }

  return (
    <Panel className="p-4 sm:p-6 space-y-4 relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <IconTile tone="sun" className="w-10 h-10 rounded-xl">
            <Wand2 className="w-5 h-5" />
          </IconTile>
          <div>
            <div className="font-display text-lg leading-none">What are we building?</div>
            <div className="text-[11px] font-bold text-ink-soft">One sentence is enough — English or Roman Urdu</div>
          </div>
        </div>
      </div>

      <div className="relative">
        <textarea
          autoFocus={autoFocus}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') start();
          }}
          placeholder="e.g. A boutique clothing store with web shop, iOS checkout and an admin dashboard, deployed to Supabase and Vercel…"
          rows={4}
          className="field resize-y min-h-[112px] pr-14 text-sm leading-relaxed"
        />
        <button
          type="button"
          onClick={toggle}
          aria-label={listening ? 'Stop voice input' : 'Start voice input'}
          className={cx(
            'absolute right-2.5 bottom-2.5 w-9 h-9 rounded-lg border grid place-items-center transition',
            listening ? 'bg-coral/20 border-coral/50 text-coral anim-wiggle' : 'bg-white/[0.05] border-white/15 text-ink-soft hover:text-ink hover:bg-white/10',
          )}
        >
          {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-ink-soft mr-1">Try:</span>
        {SAMPLE_PROMPTS.map((sample) => (
          <button
            key={sample.titleEn}
            type="button"
            onClick={() => setPrompt(sample.promptEn)}
            className="max-w-[15rem] truncate rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold text-ink-soft hover:border-aqua/45 hover:text-ink hover:bg-white/[0.07] transition"
            title={sample.titleEn}
          >
            {sample.titleEn}
          </button>
        ))}
        <button
          type="button"
          onClick={enhance}
          disabled={!prompt.trim() || enhancing}
          title="Turn a rough idea into a detailed build brief"
          className="inline-flex items-center gap-1 rounded-full border border-aqua/35 bg-aqua/[0.08] px-2.5 py-1 text-[10px] font-extrabold text-aqua hover:bg-aqua/15 hover:border-aqua/55 transition disabled:opacity-45 disabled:cursor-not-allowed"
        >
          {enhancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          {enhancing ? 'Expanding…' : 'Enhance idea'}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-aqua/10 pt-4">
        <div className="flex items-center gap-1.5">
          {PLATFORMS.map(({ key, label, icon: Icon, tone }) => {
            const on = platforms[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() => setPlatforms((prev) => ({ ...prev, [key]: !prev[key] }))}
                className={cx(
                  'toy-btn toy-btn-sm px-3 py-2 text-xs',
                  on ? `${tone}` : 'bg-white/[0.04] border-white/10 text-ink/45',
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
                {on ? <Check className="w-3 h-3" strokeWidth={3.5} /> : null}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-end">
          <Btn tone="coral" size="lg" onClick={start} disabled={!prompt.trim()} className="flex-1 sm:flex-none">
            <Sparkles className="w-4 h-4" /> Generate app
          </Btn>
        </div>
      </div>
    </Panel>
  );
};
