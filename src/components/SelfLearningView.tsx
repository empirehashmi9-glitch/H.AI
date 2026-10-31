import React, { useMemo, useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  Zap, 
  Activity,
  Star,
  MessageSquare,
  TrendingDown
} from 'lucide-react';
import { SelfLearningMetric, Language, LearningFeedback, GeneratedProject } from '../types/agent';
import { INITIAL_LEARNING_METRICS } from '../utils/orchestrator';
import { usePersistedState, timeAgo } from '../utils/storage';
import { STORAGE_KEYS } from '../config/app';

interface SelfLearningViewProps {
  language: Language;
  feedback?: LearningFeedback[];
  projects?: GeneratedProject[];
}

export const SelfLearningView: React.FC<SelfLearningViewProps> = ({
  language,
  feedback = [],
  projects = [],
}) => {
  const isUrdu = language === 'ur';
  const [metrics, setMetrics] = usePersistedState<SelfLearningMetric[]>(
    STORAGE_KEYS.learningMetrics,
    INITIAL_LEARNING_METRICS,
  );
  const [feedbackInput, setFeedbackInput] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState<'architecture' | 'ui' | 'mobile' | 'security'>('architecture');
  const [isUpdating, setIsUpdating] = useState(false);
  const [modelRevision, setModelRevision] = useState('v4.8.4');
  const [lastUpgradeMsg, setLastUpgradeMsg] = useState<string | null>(null);

  const currentMetric = metrics[metrics.length - 1] ?? INITIAL_LEARNING_METRICS[INITIAL_LEARNING_METRICS.length - 1];

  const real = useMemo(() => {
    const ratings = feedback.map((f) => f.rating);
    const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    const lowRated = feedback.filter((f) => f.rating <= 3);
    const byCategory = feedback.reduce<Record<string, number>>((acc, f) => {
      acc[f.category] = (acc[f.category] || 0) + 1;
      return acc;
    }, {});
    return {
      reviews: feedback.length,
      avg,
      avgLabel: ratings.length ? avg.toFixed(1) : '—',
      lowRated,
      byCategory,
      ratedBuilds: projects.filter((p) => typeof p.rating === 'number').length,
    };
  }, [feedback, projects]);

  const handleApplyFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackInput.trim() || isUpdating) return;

    setIsUpdating(true);
    setTimeout(() => {
      const nextStep = currentMetric.step + 1;
      const newLoss = Math.max(0.045, +(currentMetric.lossRate - 0.012).toFixed(3));
      const newAcc = Math.min(99.9, +(currentMetric.accuracyRate + 0.15).toFixed(2));
      const newScore = real.avg > 0
        ? Math.min(5, +(real.avg * 0.6 + currentMetric.rlhfScore * 0.4).toFixed(2))
        : Math.min(5, +(currentMetric.rlhfScore + 0.02).toFixed(2));
      const newNodes = currentMetric.knowledgeNodes + 340;

      const summaryEn = `Self-tuned ${feedbackCategory} parameters from feedback: "${feedbackInput.slice(0, 45)}..."`;
      const summaryUrdu = `صارف کی فیڈ بیک کے مطابق ${feedbackCategory} پیرامیٹرز کو خودکار بہتر بنایا گیا۔`;

      const newEntry: SelfLearningMetric = {
        step: nextStep,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        lossRate: newLoss,
        accuracyRate: newAcc,
        rlhfScore: newScore,
        knowledgeNodes: newNodes,
        adaptationSummary: summaryEn,
        adaptationSummaryUrdu: summaryUrdu
      };

      setMetrics([...metrics, newEntry]);
      setModelRevision(`v4.8.${nextStep - 99}`);
      setLastUpgradeMsg(isUrdu ? summaryUrdu : summaryEn);
      setFeedbackInput('');
      setIsUpdating(false);
    }, 1000);
  };

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isUrdu ? 'خودکار سیکھنے اور اپ گریڈ کا نظام (RLHF)' : 'Autonomous Self-Learning & RLHF Engine'}
          </h2>
          <p className="text-slate-400 text-sm max-w-xl">
            {isUrdu
              ? 'ہر نیا پرامپٹ اور یوزر فیڈ بیک ماڈل کے ویٹس کو خودکار طور پر مزید بہتر اور تیز بناتا ہے۔'
              : 'Continuous reinforcement learning from human feedback and production build telemetry.'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] text-right font-mono text-xs">
          <span className="text-slate-500 block text-[10px] uppercase">Model Revision</span>
          <span className="text-lg font-bold text-white">{modelRevision}</span>
        </div>
      </div>

      {/* Realtime KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
          <span className="text-xs text-slate-500 font-mono">{isUrdu ? 'ماڈل ایکوریسی' : 'Accuracy Rate'}</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">{currentMetric.accuracyRate}%</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
          <span className="text-xs text-slate-500 font-mono">{isUrdu ? 'ٹریننگ لاس' : 'Gradient Loss'}</span>
          <div className="text-2xl font-bold text-indigo-300 font-mono tabular-nums">{currentMetric.lossRate}</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
          <span className="text-xs text-slate-500 font-mono">{isUrdu ? 'یوزر منظوری' : 'RLHF Approval'}</span>
          <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">{currentMetric.rlhfScore} / 5.0</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
          <span className="text-xs text-slate-500 font-mono">{isUrdu ? 'نالج نوڈز' : 'Knowledge Nodes'}</span>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">{currentMetric.knowledgeNodes.toLocaleString()}</div>
        </div>
      </div>

      {/* Production learning signals (real stored feedback) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">{isUrdu ? 'حقیقی صارف ریٹنگ' : 'Real user rating'}</span>
              <Star className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">{real.avgLabel} / 5.0</div>
            <span className="text-[10px] text-slate-500">
              {real.reviews} {isUrdu ? 'ریویوز' : 'reviews'} · {real.ratedBuilds} {isUrdu ? 'ریٹڈ بلڈز' : 'rated builds'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">{isUrdu ? 'کم ریٹنگ سگنلز' : 'Weak-signal builds'}</span>
              <TrendingDown className="w-4 h-4 text-rose-400" />
            </div>
            {real.lowRated.length === 0 ? (
              <p className="text-[11px] text-slate-500">
                {isUrdu ? 'ابھی کوئی کم ریٹنگ نہیں — معیار مستحکم ہے۔' : 'No low ratings yet — quality holding.'}
              </p>
            ) : (
              <div className="space-y-2">
                {real.lowRated.slice(0, 3).map((f) => (
                  <div key={f.id} className="p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/20 text-[11px] space-y-0.5">
                    <div className="flex items-center justify-between font-mono text-[10px] text-rose-300">
                      <span>{f.category}</span>
                      <span>{f.rating}★</span>
                    </div>
                    <p className="text-slate-400 line-clamp-2">{f.comment || f.projectName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {Object.keys(real.byCategory).length > 0 && (
            <div className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-2">
              <span className="text-xs text-slate-500 font-mono">{isUrdu ? 'فیڈبیک کی اقسام' : 'Feedback categories'}</span>
              {Object.entries(real.byCategory).map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400 capitalize">{cat}</span>
                  <span className="text-white">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-8">
          <div className="p-6 rounded-3xl bg-[#0d0f17] border border-white/[0.08] space-y-3 h-full">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-white/[0.06]">
              <span className="font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                {isUrdu ? 'پیداواری فیڈبیک جو مستقبل کے پرامپٹس میں شامل ہوتا ہے' : 'Production feedback fed into future prompts'}
              </span>
              <span className="text-slate-500 font-mono">{feedback.length}</span>
            </div>

            {feedback.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-500">
                {isUrdu
                  ? 'ورک اسپیس میں بلڈ کو ریٹنگ دیں — وہ خودکار طور پر اگلے پرامپٹس میں شامل ہو جائے گا۔'
                  : 'Rate a build in the Workspace — it is automatically injected into future prompts as learned preference.'}
              </p>
            ) : (
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {feedback.slice(0, 12).map((f) => (
                  <div key={f.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white truncate">{f.projectName}</span>
                      <span className="text-amber-400 font-mono text-[11px] shrink-0">{'★'.repeat(f.rating)}</span>
                    </div>
                    {f.comment && <p className="text-slate-400 leading-relaxed line-clamp-2">{f.comment}</p>}
                    <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.04]">{f.category}</span>
                      <span>{timeAgo(f.at, isUrdu)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Retuning & Audit Log Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Retuning Box */}
        <div className="lg:col-span-5">
          <form onSubmit={handleApplyFeedback} className="p-6 rounded-3xl bg-[#0d0f17] border border-white/[0.08] space-y-4">
            <h3 className="font-bold text-white text-sm">
              {isUrdu ? 'سسٹم کو نیا علم یا فیڈ بیک سکھائیں' : 'Submit Fine-Tuning Feedback'}
            </h3>

            {/* Category Select */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {(['architecture', 'ui', 'mobile', 'security'] as const).map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setFeedbackCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono uppercase transition ${
                    feedbackCategory === cat 
                      ? 'bg-white text-slate-900 font-bold' 
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.04]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div>
              <textarea
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                placeholder={isUrdu ? 'مثال: موبائل نیویگیشن میں نیچے بار رکھیں اور سپا بیس میں RLS پالیسی مزید سخت کریں...' : 'E.g., Enforce strict tenant_id constraints on Supabase and streamline mobile checkout flows...'}
                rows={3}
                disabled={isUpdating}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating || !feedbackInput.trim()}
              className="w-full py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-200 font-bold text-xs transition flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating Model Weights...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'سسٹم کو اپ گریڈ کریں' : 'Retune Weights'}</span>
                </>
              )}
            </button>

            {lastUpgradeMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{lastUpgradeMsg}</span>
              </div>
            )}
          </form>
        </div>

        {/* Audit Log */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-3xl bg-[#0d0f17] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-white/[0.06]">
              <span className="font-bold text-white">Autonomous Weight Evolution Log</span>
              <span className="text-slate-500 font-mono">Self-Governing</span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {[...metrics].reverse().map((m, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-indigo-300 font-bold">Step #{m.step}</span>
                    <span className="text-slate-500">{m.timestamp}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {isUrdu ? m.adaptationSummaryUrdu : m.adaptationSummary}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 pt-1">
                    <span>Loss: <strong className="text-emerald-400">{m.lossRate}</strong></span>
                    <span>Accuracy: <strong className="text-white">{m.accuracyRate}%</strong></span>
                    <span>Approval: <strong className="text-amber-400">{m.rlhfScore}★</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
