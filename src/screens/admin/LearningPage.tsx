import React, { useMemo } from 'react';
import { ArrowRight, BrainCircuit, MessageSquareText, Network, Sparkles, Star, TrendingUp, Wand2 } from 'lucide-react';
import { useApp } from '../../state/app';
import { ChibiRobot } from '../../ui/Chibi';
import { Btn, EmptyState, Panel, Pill, SectionHead, Stars, StatCard, ToneBar } from '../../ui/Toon';
import { INITIAL_LEARNING_METRICS } from '../../utils/orchestrator';
import { timeAgo } from '../../utils/storage';

const CATEGORY_TONES = ['#FF7A8A', '#FFC93C', '#3DD9B3', '#6C4CF1', '#6FD6FF', '#F45D9C'];

export const LearningPage: React.FC = () => {
  const { feedback, projects, setMode, openProject } = useApp();

  const stats = useMemo(() => {
    const ratings = feedback.map((f) => f.rating);
    const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    const five = ratings.filter((r) => r === 5).length;
    const low = ratings.filter((r) => r <= 2).length;
    const categories = Object.entries(
      feedback.reduce<Record<string, number>>((acc, f) => {
        const key = f.category || 'general';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {}),
    ).sort((a, b) => b[1] - a[1]);
    const nodes = 14200 + feedback.length * 34 + projects.length * 120;
    return { avg, five, low, categories, nodes, max: Math.max(1, ...categories.map(([, n]) => n)) };
  }, [feedback, projects]);

  const recent = [...feedback].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, 8);

  return (
    <div className="space-y-4 sm:space-y-5">
      <SectionHead
        light
        eyebrow="Self-learning loop"
        title="The factory learns from every rating"
        sub="Agent #24 turns customer stars and comments into prompt weights, design defaults and QA checks for the next build."
        right={
          <div className="flex flex-wrap gap-1.5">
            <Pill tone="dark"><Sparkles className="w-3 h-3" /> {stats.nodes.toLocaleString()} knowledge nodes</Pill>
            <Pill tone="dark"><Star className="w-3 h-3" /> {feedback.length} signals</Pill>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Average rating" value={feedback.length ? stats.avg.toFixed(1) : '—'} sub="out of 5" icon={<Star className="w-5 h-5" />} tone="sun" />
        <StatCard label="Signals" value={feedback.length} sub="customer reviews" icon={<MessageSquareText className="w-5 h-5" />} tone="coral" />
        <StatCard label="5-star builds" value={stats.five} sub={`${stats.low} need another pass`} icon={<TrendingUp className="w-5 h-5" />} tone="mint" />
        <StatCard label="Tuned builds" value={projects.length} sub="reused pattern memory" icon={<Network className="w-5 h-5" />} tone="grape" />
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4 items-start">
        <div className="space-y-3 min-w-0">
          {recent.length ? (
            <div className="space-y-2.5">
              {recent.map((f) => (
                <Panel key={f.id} className="p-3.5 space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Stars value={f.rating} size={14} />
                    <Pill tone="cream">{f.category || 'general'}</Pill>
                    <span className="ml-auto text-[10px] font-bold text-ink-soft">{timeAgo(f.at, false)}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (projects.some((p) => p.id === f.projectId)) {
                        openProject(f.projectId);
                        setMode('customer');
                      }
                    }}
                    className="text-xs font-extrabold text-left hover:underline decoration-ink/30 underline-offset-2 truncate max-w-full"
                  >
                    {f.projectName || 'Untitled build'}
                  </button>
                  {f.comment ? (
                    <p className="text-[11px] font-semibold text-ink-soft leading-relaxed">“{f.comment}”</p>
                  ) : (
                    <p className="text-[10px] font-semibold text-ink-soft/70 italic">No comment — rating only.</p>
                  )}
                </Panel>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Star className="w-6 h-6" />}
              title="No signals yet"
              sub="Ratings left in the customer studio show up here and feed the next build."
              action={
                <Btn tone="coral" size="sm" onClick={() => setMode('customer')}>
                  <Wand2 className="w-3.5 h-3.5" /> Rate a build
                </Btn>
              }
            />
          )}

          <Panel className="p-4 space-y-3">
            <h3 className="text-base leading-none flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Where the signals come from
            </h3>
            {stats.categories.length ? (
              <div className="space-y-2">
                {stats.categories.map(([cat, count], i) => (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-ink-soft">
                      <span>{cat}</span>
                      <span className="font-mono normal-case tracking-normal">{count}</span>
                    </div>
                    <ToneBar value={count} max={stats.max} tone={CATEGORY_TONES[i % CATEGORY_TONES.length]} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] font-semibold text-ink-soft">Categories appear once customers rate a few builds.</p>
            )}
          </Panel>
        </div>

        <div className="space-y-3">
          <Panel className="p-4 space-y-2.5 text-center">
            <div className="w-20 mx-auto">
              <ChibiRobot size={78} color="#FFC93C" accent="#04141d" mood="focus" float />
            </div>
            <h3 className="text-base leading-none">Agent #24</h3>
            <p className="text-[10px] font-semibold text-ink-soft leading-relaxed">
              Self-Learning Autonomous Weights Tuner. Recalculates prompt weights after every rating. No manual retraining.
            </p>
            <div className="flex justify-center gap-1.5 flex-wrap">
              <Pill tone="mint">online</Pill>
              <Pill tone="cream">5,490 updates</Pill>
            </div>
          </Panel>

          <Panel className="p-4 space-y-2.5">
            <h3 className="text-base leading-none flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4" /> Recent adaptations
            </h3>
            {INITIAL_LEARNING_METRICS.slice(-4).reverse().map((m) => (
              <div key={m.step} className="rounded-xl border border-aqua/15 bg-white/[0.03] p-2.5 space-y-1">
                <div className="flex items-center justify-between text-[9px] font-extrabold uppercase tracking-wider text-ink-soft">
                  <span>step {m.step}</span>
                  <span className="font-mono normal-case tracking-normal">{m.accuracyRate}% acc</span>
                </div>
                <p className="text-[10px] font-semibold leading-snug">{m.adaptationSummary}</p>
                <div className="text-[9px] font-bold text-ink-soft font-mono">loss {m.lossRate} · rlhf {m.rlhfScore}</div>
              </div>
            ))}
          </Panel>

          <Panel className="p-4 space-y-2 bg-cream">
            <h3 className="text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5" /> How the loop closes
            </h3>
            <ol className="space-y-1.5 text-[10px] font-semibold text-ink-soft leading-relaxed list-decimal list-inside">
              <li>Customer rates a build and leaves a note.</li>
              <li>#24 reweights the prompt recipe and design defaults.</li>
              <li>#25 stores the pattern in the knowledge graph.</li>
              <li>The next build starts from what worked.</li>
            </ol>
          </Panel>
        </div>
      </div>
    </div>
  );
};
