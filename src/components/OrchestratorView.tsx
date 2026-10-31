import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  Database, 
  CloudUpload, 
  Smartphone, 
  Globe, 
  ArrowRight, 
  Play, 
  RefreshCw,
  Cpu,
  Layers,
  Award,
  Rotate3d,
  Check,
  Zap,
  ShieldCheck,
  Code2
} from 'lucide-react';
import { Language, GeneratedProject } from '../types/agent';
import { SAMPLE_PROMPTS } from '../utils/orchestrator';
import { ThreeDeviceShowcase } from './ThreeDeviceShowcase';
import { MicrophoneInput } from './MicrophoneInput';
import { HaiBrandIcon } from './HaiBrandIcon';

interface OrchestratorViewProps {
  language: Language;
  onGenerate: (prompt: string, targetPlatforms: { web: boolean; ios: boolean; android: boolean }) => void;
  isGenerating: boolean;
  generationProgress: number;
  activeAgentTask: string;
  activeAgentTaskUrdu: string;
  elapsedSeconds: number;
  lastGeneratedProject: GeneratedProject | null;
  onViewDeliverables: () => void;
  onView3DNexus?: () => void;
  onViewSelfUpdate?: () => void;
  systemVersion?: string;
  aiLive?: boolean;
  onOpenSettings?: () => void;
  onCancel?: () => void;
}

export const OrchestratorView: React.FC<OrchestratorViewProps> = ({
  language,
  onGenerate,
  isGenerating,
  generationProgress,
  activeAgentTask,
  activeAgentTaskUrdu,
  elapsedSeconds,
  lastGeneratedProject,
  onViewDeliverables,
  onView3DNexus,
  onViewSelfUpdate,
  systemVersion = 'v5.0.0',
  aiLive = false,
  onOpenSettings,
  onCancel
}) => {
  const isUrdu = language === 'ur';
  const [promptText, setPromptText] = useState(SAMPLE_PROMPTS[0].promptEn);
  const [platforms, setPlatforms] = useState({
    web: true,
    ios: true,
    android: true
  });
  const [autoSupabase, setAutoSupabase] = useState(true);
  const [autoVercel, setAutoVercel] = useState(true);

  const handleSelectSample = (sample: typeof SAMPLE_PROMPTS[0]) => {
    setPromptText(isUrdu ? sample.promptUrdu : sample.promptEn);
  };

  const handleStartBuild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim() || isGenerating) return;
    onGenerate(promptText, platforms);
  };

  return (
    <div className="space-y-12 py-4">
      {/* Top Split Hero: Prompt Forge (Left) + Interactive 3D Showcase (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Heading, Prompt Form & Target Selectors */}
        <div className="lg:col-span-7 space-y-6">
          {/* Eyebrow Pill & Self-Evolution Status */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>{isUrdu ? '30 خودکار ایجنٹس • 24 گھنٹے کا کام 90 سیکنڈ میں' : 'Autonomous 30-Agent Supercluster • 24 Hours in 90 Seconds'}</span>
            </div>

            {onViewSelfUpdate && (
              <button
                type="button"
                onClick={onViewSelfUpdate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold transition cursor-pointer"
                title="Self-Updating Core"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{systemVersion} ({isUrdu ? 'خودکار سیلف اپ ڈیٹ فعال' : 'Self-Evolving'})</span>
              </button>
            )}

            {aiLive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-600 dark:text-indigo-300 text-xs font-mono font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                {isUrdu ? 'جیمنائی لائیو کنیکٹڈ' : 'Gemini live'}
              </span>
            ) : (
              <button
                type="button"
                onClick={onOpenSettings}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-semibold transition"
              >
                <Zap className="w-3.5 h-3.5" />
                {isUrdu ? 'ڈیمو موڈ — Gemini کلید لگائیں' : 'Demo mode — connect Gemini'}
              </button>
            )}
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            {isUrdu ? (
              <>
                ایک پرامپٹ سے <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 bg-clip-text text-transparent">مکمل ایپس اور ویب سائٹس</span> لائیو تیار کریں
              </>
            ) : (
              <>
                Build & Deploy <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 bg-clip-text text-transparent">Web, iOS & Android</span> From One Prompt
              </>
            )}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {isUrdu
              ? 'ایچ ڈاٹ اے آئی کا خودکار آرکسٹریٹر آپ کی ہدایات کو 30 پیشہ ور ایجنٹس میں تقسیم کر کے بیک وقت ویب، آئی او ایس، اینڈرائیڈ، سپا بیس اور ورسل پر لائیو تعینات کر دیتا ہے۔'
              : 'Our autonomous orchestrator splits your vision into 30 concurrent agent threads. Synthesizes native React, SwiftUI, Jetpack Compose, and deploys live to Supabase & Vercel.'}
          </p>

          {/* Luxury Frosted Prompt Console */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 via-purple-500/20 to-emerald-500/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition duration-500 pointer-events-none"></div>

            <form 
              onSubmit={handleStartBuild}
              className="relative bg-white/90 dark:bg-[#0c0e1a]/90 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5"
            >
              {/* Textarea Header with Voice Mic Input */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 flex-wrap gap-2">
                <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-indigo-500" />
                  {isUrdu ? 'ایپ یا ویب سائٹ کی تفصیل بولیں یا لکھیں:' : 'Speak or type your application prompt:'}
                </span>

                <div className="flex items-center gap-2">
                  <MicrophoneInput
                    language={language}
                    disabled={isGenerating}
                    onTranscript={(transcript) => {
                      setPromptText(transcript);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setPromptText('')}
                    className="text-slate-400 hover:text-indigo-500 transition text-[11px] px-2 py-1"
                  >
                    {isUrdu ? 'صاف کریں' : 'Clear'}
                  </button>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder={isUrdu ? 'مثال کے طور پر: ایک مکمل ای کامرس ایپ بنائیں جس میں ویب، آئی او ایس اور اینڈرائیڈ تینوں شامل ہوں، سپا بیس میں ڈیٹا بیس اور ورسل پر لائیو چلے...' : 'E.g., Build an e-commerce platform with Web shop, iOS SwiftUI app, Android Kotlin app, Supabase with RLS policies, and Vercel edge deployment...'}
                rows={3}
                disabled={isGenerating}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm leading-relaxed outline-none transition disabled:opacity-50 resize-none font-normal"
              />

              {/* Target Platforms Chips */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    {isUrdu ? 'شامل پلیٹ فارمز:' : 'Included Targets:'}
                  </span>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Web Toggle */}
                    <button
                      type="button"
                      onClick={() => setPlatforms(p => ({ ...p, web: !p.web }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                        platforms.web 
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30' 
                          : 'bg-slate-100 dark:bg-white/[0.04] text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Web (React 19)</span>
                      {platforms.web && <Check className="w-3 h-3" />}
                    </button>

                    {/* iOS Toggle */}
                    <button
                      type="button"
                      onClick={() => setPlatforms(p => ({ ...p, ios: !p.ios }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                        platforms.ios 
                          ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30' 
                          : 'bg-slate-100 dark:bg-white/[0.04] text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>iOS (SwiftUI)</span>
                      {platforms.ios && <Check className="w-3 h-3" />}
                    </button>

                    {/* Android Toggle */}
                    <button
                      type="button"
                      onClick={() => setPlatforms(p => ({ ...p, android: !p.android }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                        platforms.android 
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30' 
                          : 'bg-slate-100 dark:bg-white/[0.04] text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Android (Compose)</span>
                      {platforms.android && <Check className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Cloud Deploy Checkboxes */}
                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-600 dark:text-slate-400">
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 dark:hover:text-white transition select-none">
                    <input
                      type="checkbox"
                      checked={autoSupabase}
                      onChange={(e) => setAutoSupabase(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-0"
                    />
                    <Database className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Supabase (Postgres & RLS)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 dark:hover:text-white transition select-none">
                    <input
                      type="checkbox"
                      checked={autoVercel}
                      onChange={(e) => setAutoVercel(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-0"
                    />
                    <CloudUpload className="w-3.5 h-3.5 text-amber-500" />
                    <span>Vercel Global Edge Deploy</span>
                  </label>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isGenerating || (!platforms.web && !platforms.ios && !platforms.android)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>
                      {isUrdu 
                        ? `30 ایجنٹس خودکار کوڈ تیار کر رہے ہیں... (${elapsedSeconds}s)` 
                        : `30 Agents Synthesizing... (${elapsedSeconds}s)`}
                    </span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>
                      {isUrdu 
                        ? 'خودکار تعمیر شروع کریں (24 گھنٹے کا کام 1 سے 2 منٹ میں)' 
                        : 'Launch Autonomous Generation (24h in 1-2 Minutes)'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-emerald-200" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Inspirations */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              {isUrdu ? 'تیار شدہ آئیڈیاز (ایک کلک پر لوڈ کریں):' : 'Ready-Made Templates (1-Click Load):'}
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className="px-3 py-1.5 rounded-xl bg-white/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:border-indigo-400 text-xs font-medium transition shadow-sm"
                >
                  {isUrdu ? sample.titleUrdu : sample.titleEn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live 3D Interactive Device Stage Showcase! */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-2xl bg-gradient-to-br from-slate-900 to-indigo-950">
            {/* Header tag */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-white">
              <span className="font-bold flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                <Rotate3d className="w-3.5 h-3.5 text-indigo-400" />
                {isUrdu ? 'لائیو 3D ملٹی پلیٹ فارم اسٹیج' : 'Live 3D Hardware Stage'}
              </span>
              {onView3DNexus && (
                <button
                  type="button"
                  onClick={onView3DNexus}
                  className="px-3 py-1 rounded-full bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold backdrop-blur-md transition flex items-center gap-1 shadow"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>3D Nexus</span>
                </button>
              )}
            </div>

            {/* Render ThreeDeviceShowcase directly */}
            {lastGeneratedProject ? (
              <ThreeDeviceShowcase project={lastGeneratedProject} language={language} />
            ) : (
              <div className="h-[460px] flex items-center justify-center text-slate-400 text-xs">
                Generating 3D Models...
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/06 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {isUrdu ? '360 ڈگری گھما کر آئی او ایس، اینڈرائیڈ اور ویب دیکھیں' : 'Rotate 360° to inspect SwiftUI, Kotlin and Web targets'}
            </span>
            <button
              onClick={onViewDeliverables}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              {isUrdu ? 'کوڈ اور لائیو ایپس →' : 'View Code & Apps →'}
            </button>
          </div>
        </div>

      </div>

      {/* Live Pipeline Stepper (Active when generating or completed) */}
      {(isGenerating || lastGeneratedProject) && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0c0e1a]/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {isGenerating 
                    ? (isUrdu ? '30 خصوصی ایجنٹس کا متوازی سنسز جاری ہے...' : 'Multi-Agent Autonomous Pipeline Active')
                    : (isUrdu ? 'پراجیکٹ کامیابی سے لائیو اور تیار ہے!' : 'Autonomous Build Complete & Live')}
                </h4>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">
                  {isGenerating ? (isUrdu ? activeAgentTaskUrdu : activeAgentTask) : `${lastGeneratedProject?.name} • Live in ${lastGeneratedProject?.durationSeconds}s`}
                </p>
              </div>
            </div>

            <div className="sm:text-right font-mono">
              <span className="text-2xl font-black text-emerald-500">
                {isGenerating ? `${Math.round(generationProgress)}%` : '100%'}
              </span>
              <div className="text-xs text-slate-500">
                {isGenerating ? `${elapsedSeconds}s elapsed` : `Delivered in ${lastGeneratedProject?.durationSeconds}s`}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-white/[0.06] overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${isGenerating ? Math.max(8, generationProgress) : 100}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { label: isUrdu ? 'منصوبہ' : 'Spec', at: 6 },
              { label: 'Web', at: 16 },
              { label: 'iOS / Android', at: 40 },
              { label: isUrdu ? 'بیک اینڈ' : 'Backend', at: 62 },
              { label: isUrdu ? 'تصدیق' : 'Verify', at: 88 },
            ].map((stage, i) => {
              const current = isGenerating ? generationProgress : 100;
              const active = current >= stage.at;
              return (
                <span
                  key={stage.label}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition ${
                    active
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-white/[0.06] text-slate-400'
                  }`}
                >
                  {i + 1}. {stage.label}
                </span>
              );
            })}
            {isGenerating && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="ml-auto px-3 py-1 rounded-lg border border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-300 text-[10px] font-bold flex items-center gap-1"
              >
                <span className="w-2 h-2 rounded-sm bg-rose-500" />
                {isUrdu ? 'روکیں' : 'Stop build'}
              </button>
            )}
          </div>

          {/* Deliverables Link Button */}
          {!isGenerating && lastGeneratedProject && (
            <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-white/[0.06]">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {isUrdu ? 'تمام کوڈ فائلز، سوئفٹ یو آئی، اینڈرائیڈ، سپا بیس اور ورسل لائیو ہیں:' : 'All source files, SwiftUI, Jetpack Compose, Supabase SQL and Vercel are ready:'}
              </span>
              <button
                onClick={onViewDeliverables}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-indigo-600/20"
              >
                <span>{isUrdu ? 'ایپس اور لائیو کوڈ دیکھیں' : 'Inspect Generated Deliverables'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3 Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white/70 dark:bg-[#0c0e1a]/70 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            {isUrdu ? '24 گھنٹے کا کام 90 سیکنڈ میں' : '24 Hours in 90 Seconds'}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
            {isUrdu
              ? '30 ماہر ایجنٹس بغیر توقف متوازی کام کرتے ہیں تاکہ روایتی ہفتوں کی کوڈنگ محض ایک سے دو منٹ میں تیار ہو سکے۔'
              : 'Parallel execution across 30 specialized roles collapses weeks of engineering into instant 90-second deliveries.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/70 dark:bg-[#0c0e1a]/70 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            {isUrdu ? 'سپا بیس اور زیرو ٹرسٹ RLS' : 'Supabase PostgreSQL & RLS'}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
            {isUrdu
              ? 'خودکار سیکیورٹی رولز، ٹیبلز، ریلیشنز اور ریئل ٹائم ڈیٹا بیس ہر ایپ کے لیے بغیر غلطی کے تیار ہوتے ہیں۔'
              : 'Every build generates hardened PostgreSQL migrations with auth.uid() Row-Level Security policies.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/70 dark:bg-[#0c0e1a]/70 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <CloudUpload className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            {isUrdu ? 'ورسل گلوبل ایج نیٹ ورک' : 'Vercel Global Edge Deploy'}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
            {isUrdu
              ? 'عالمی سرورز پر لائیو پبلشنگ، خودکار ایس ایس ایل سرٹیفکیٹ اور تیز ترین لوڈنگ اسپیڈ فوری دستیاب ہوتی ہے۔'
              : 'Zero-config edge deployment with Anycast routing and automated Let’s Encrypt wildcard certificates.'}
          </p>
        </div>
      </div>
    </div>
  );
};
