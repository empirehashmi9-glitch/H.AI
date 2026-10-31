import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Send, Sparkles, Bot, User, Loader2, Square, Trash2, ArrowRight,
  Globe, Smartphone, Database, Settings2, Lightbulb, CheckCircle2
} from 'lucide-react';
import { AppSettings, BuildSpec, ChatMessage, Language, LearningFeedback } from '../types/agent';
import { hasAI, streamChat, aiErrorMessage } from '../services/ai';
import { createPlan } from '../services/buildPipeline';
import { analyzePrompt, SAMPLE_PROMPTS } from '../utils/orchestrator';
import { newId, usePersistedState } from '../utils/storage';
import { toast } from './Toast';

interface OrchestratorChatViewProps {
  settings: AppSettings;
  language: Language;
  feedback: LearningFeedback[];
  isBuilding: boolean;
  onBuild: (prompt: string, platforms: { web: boolean; ios: boolean; android: boolean }) => void;
  onOpenSettings: () => void;
  onOpenWorkspace: () => void;
  hasProject: boolean;
}

const welcome = (isUrdu: boolean): ChatMessage => ({
  id: newId('msg'),
  role: 'assistant',
  at: new Date().toISOString(),
  content: isUrdu
    ? 'میں H.AI آرکسٹریٹر پرائم ہوں۔ مجھے بتائیں کیا بنانا ہے — ویب سائٹ، iOS، اینڈرائیڈ ایپ یا تینوں۔ میں ضروریات کو اسپیک میں بدل کر 30 ایجنٹس کو ہدایات دوں گا۔'
    : 'I am H.AI Orchestrator Prime. Tell me what you want to build — a website, an iOS app, an Android app, or all three. I will turn your requirements into a spec and dispatch 30 specialized agents.',
});

const offlineReply = (prompt: string, isUrdu: boolean): string => {
  const { projectName, category } = analyzePrompt(prompt);
  const domain =
    category === 'ecommerce' ? 'catalog, cart and checkout'
    : category === 'health' ? 'doctor profiles, slots and booking'
    : category === 'food' ? 'menu, cart and delivery tracking'
    : category === 'realestate' ? 'listings, filters and enquiries'
    : category === 'ride' ? 'ride requests, driver matching and fare estimate'
    : category === 'education' ? 'courses, lessons and progress'
    : category === 'social' ? 'feed, posts and profiles'
    : 'catalog, transactions and accounts';
  return isUrdu
    ? `ڈیمو موڈ میں، میں "${projectName}" کے لیے ${domain} کا مکمل خاکہ تیار کر سکتا ہوں اور ٹیمپلیٹ کوڈ بنا سکتا ہوں۔\n\nحقیقی Gemini سے ہر پرامپٹ کے مطابق نیا React، SwiftUI، Kotlin اور SQL کوڈ بنانے کے لیے سیٹنگز میں اپنی API کلید شامل کریں۔\n\nاگلا قدم: "Plan this build" دبائیں اور میں 30 ایجنٹس کو ہدایات دے دوں گا۔`
    : `In demo mode I can draft the full ${domain} architecture for "${projectName}" and produce template code.\n\nTo synthesize genuinely prompt-specific React, SwiftUI, Kotlin and SQL with Gemini, add your API key in Settings.\n\nNext: press "Plan this build" and I will brief the 30 agents.`;
};

const SYSTEM_PROMPT = [
  'You are H.AI Orchestrator Prime, the lead agent of a 30-agent autonomous product foundry.',
  'You help customers define web, iOS and Android products that deploy to Supabase + Vercel.',
  'Be concise (max 180 words), concrete and friendly. Ask at most 2 clarifying questions at a time.',
  'Mirror the user language: Urdu script for Urdu, English for English, Roman Urdu for Roman Urdu.',
  'Focus on users, core flows, data entities, monetization and platform differences.',
  'Never claim something was deployed or built when it was not; the UI handles builds.',
  'When requirements are clear, tell the user to press “Plan this build” to generate the spec.',
].join(' ');

export const OrchestratorChatView: React.FC<OrchestratorChatViewProps> = ({
  settings, language, feedback, isBuilding, onBuild, onOpenSettings, onOpenWorkspace, hasProject,
}) => {
  const isUrdu = language === 'ur';
  const [messages, setMessages] = usePersistedState<ChatMessage[]>('chat-messages', [welcome(isUrdu)]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [platforms, setPlatforms] = useState({ web: true, ios: true, android: true });
  const [plan, setPlan] = useState<{ spec: BuildSpec; source: 'ai' | 'demo'; prompt: string } | null>(null);
  const [planning, setPlanning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const aiLive = hasAI(settings);
  const lastUserMessage = useMemo(() => [...messages].reverse().find((m) => m.role === 'user')?.content || '', [messages]);
  const buildPrompt = lastUserMessage || input.trim();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, plan]);

  const append = (msg: ChatMessage) => setMessages((prev) => [...prev, msg].slice(-60));
  const patchMessage = (id: string, patch: Partial<ChatMessage>) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const stop = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
  };

  const send = async (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || streaming || isBuilding) return;
    if (!platforms.web && !platforms.ios && !platforms.android) {
      toast.error(isUrdu ? 'کم از کم ایک پلیٹ فارم منتخب کریں' : 'Select at least one platform');
      return;
    }
    setInput('');
    setPlan(null);
    const userMsg: ChatMessage = { id: newId('msg'), role: 'user', content: text, at: new Date().toISOString() };
    append(userMsg);

    if (!aiLive) {
      const reply = offlineReply(text, isUrdu);
      const id = newId('msg');
      append({ id, role: 'assistant', content: '', at: new Date().toISOString(), pending: true });
      window.setTimeout(() => patchMessage(id, { content: reply, pending: false }), 650);
      return;
    }

    const assistantId = newId('msg');
    append({ id: assistantId, role: 'assistant', content: '', at: new Date().toISOString(), pending: true });
    setStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;

    const history = messages.filter((m) => !m.pending).slice(-10);
    try {
      let acc = '';
      await streamChat({
        settings,
        system: SYSTEM_PROMPT,
        history: history.map((m) => ({ role: m.role, content: m.content })),
        message: text,
        signal: controller.signal,
        onChunk: (chunk) => {
          acc += chunk;
          patchMessage(assistantId, { content: acc, pending: true });
        },
      });
      patchMessage(assistantId, { pending: false });
    } catch (err) {
      const msg = aiErrorMessage(err);
      patchMessage(assistantId, {
        pending: false,
        error: true,
        content: isUrdu ? `معذرت، جواب نہیں آ سکا: ${msg}` : `Sorry, I could not respond: ${msg}`,
      });
    } finally {
      abortRef.current = null;
      setStreaming(false);
    }
  };

  const runPlan = async () => {
    const prompt = buildPrompt;
    if (!prompt || planning) {
      if (!prompt) toast.error(isUrdu ? 'پہلے اپنی ضرورت لکھیں' : 'Type your product idea first');
      return;
    }
    setPlanning(true);
    try {
      const result = await createPlan(prompt, settings, feedback, platforms);
      setPlan({ spec: result.spec, source: result.source, prompt });
      toast.success(result.source === 'ai' ? (isUrdu ? 'اسپیک تیار ہے' : 'AI spec ready') : (isUrdu ? 'ڈیمو اسپیک تیار ہے' : 'Demo spec ready'));
    } catch (err) {
      toast.error(aiErrorMessage(err));
    } finally {
      setPlanning(false);
    }
  };

  const clearChat = () => {
    if (streaming) stop();
    setPlan(null);
    setMessages([welcome(isUrdu)]);
  };

  const toggle = (key: 'web' | 'ios' | 'android') => setPlatforms((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="py-4 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
              {isUrdu ? 'آرکسٹریٹر کے ساتھ بات چیت' : 'Talk to the Orchestrator'}
            </h2>
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${aiLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {aiLive ? `${settings.model} · live` : isUrdu ? 'ڈیمو موڈ' : 'demo mode'}
              <span className="text-slate-400">·</span>
              {isUrdu ? 'ضروریات → اسپیک → 30 ایجنٹس' : 'requirements → spec → 30 agents'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!aiLive && (
            <button onClick={onOpenSettings} className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5" />
              {isUrdu ? 'کلید لگائیں' : 'Connect Gemini'}
            </button>
          )}
          <button onClick={clearChat} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-rose-400 hover:text-rose-500 text-[11px] font-semibold flex items-center gap-1.5 transition">
            <Trash2 className="w-3.5 h-3.5" />
            {isUrdu ? 'صاف کریں' : 'Clear'}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0a0c15]/90 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-240px)] min-h-[520px]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5">
          {messages.length <= 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SAMPLE_PROMPTS.slice(0, 3).map((s, i) => (
                <button
                  key={i}
                  onClick={() => send(isUrdu ? s.promptUrdu : s.promptEn)}
                  className="text-left p-3 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] hover:border-indigo-400 transition group"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 mb-1.5" />
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{isUrdu ? s.titleUrdu : s.titleEn}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{isUrdu ? s.promptUrdu : s.promptEn}</div>
                </button>
              ))}
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200' : 'bg-gradient-to-tr from-indigo-500 to-purple-600 text-white'}`}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>
              <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-md'
                  : m.error
                  ? 'bg-rose-50 dark:bg-rose-500/10 border border-rose-300/50 dark:border-rose-500/25 text-rose-700 dark:text-rose-200 rounded-tl-md'
                  : 'bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-slate-800 dark:text-slate-200 rounded-tl-md'
              }`}>
                {m.content || (m.pending ? <span className="inline-flex gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" /><span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:120ms]" /><span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:240ms]" /></span> : null)}
                {m.pending && m.content && <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-indigo-400 align-middle animate-pulse" />}
              </div>
            </div>
          ))}

          {plan && (
            <div className="rounded-2xl border border-indigo-300/60 dark:border-indigo-500/30 bg-indigo-50/70 dark:bg-indigo-500/[0.07] p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {plan.source === 'ai' ? 'Gemini build spec' : 'Demo build spec'}
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">{plan.spec.name}</h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">{plan.spec.tagline}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-white/70 dark:bg-white/10 text-slate-600 dark:text-slate-300 shrink-0">
                  ~{plan.spec.estimatedWeeks}w scope
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                {plan.spec.features.slice(0, 4).map((f, i) => (
                  <div key={i} className="p-2 rounded-xl bg-white/70 dark:bg-white/[0.04] border border-white/60 dark:border-white/[0.06]">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{f.title}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{f.description}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {plan.spec.stack.web}</span>
                <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> {plan.spec.stack.ios.split('+')[0]}</span>
                <span className="flex items-center gap-1"><Database className="w-3 h-3" /> {plan.spec.dataModels.length} tables</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  onClick={() => onBuild(plan.prompt, platforms)}
                  disabled={isBuilding}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isBuilding ? (isUrdu ? 'ایجنٹس کام کر رہے ہیں…' : 'Agents running…') : isUrdu ? '30 ایجنٹس کو ہدایات دیں' : 'Dispatch 30 agents'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {hasProject && (
                  <button onClick={onOpenWorkspace} className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {isUrdu ? 'ورک اسپیس' : 'Workspace'}
                  </button>
                )}
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        <div className="border-t border-slate-200 dark:border-white/[0.08] p-3 sm:p-4 space-y-2.5 bg-white/60 dark:bg-white/[0.015]">
          <div className="flex flex-wrap items-center gap-1.5">
            {([
              { key: 'web' as const, label: 'Web', icon: Globe, color: 'blue' },
              { key: 'ios' as const, label: 'iOS', icon: Smartphone, color: 'purple' },
              { key: 'android' as const, label: 'Android', icon: Smartphone, color: 'emerald' },
            ]).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => toggle(key)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition flex items-center gap-1 ${
                  platforms[key]
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'border-slate-200 dark:border-white/10 text-slate-500'
                }`}
              >
                <Icon className="w-3 h-3" /> {label}
              </button>
            ))}
            <span className="text-[10px] text-slate-400 ml-auto hidden sm:inline">
              {isUrdu ? '⌘K کمانڈ پالیٹ · چیٹ براؤزر میں محفوظ' : '⌘K palette · chat saved locally'}
            </span>
          </div>

          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={2}
              placeholder={isUrdu ? 'اپنے پروڈکٹ کے بارے میں لکھیں… (Enter بھیجیں، Shift+Enter نئی لائن)' : 'Describe your product… (Enter to send, Shift+Enter for newline)'}
              className="flex-1 resize-none px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex flex-col gap-1.5">
              {streaming ? (
                <button onClick={stop} className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center" aria-label="Stop response">
                  <Square className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || isBuilding}
                  className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={runPlan}
                disabled={planning || isBuilding || !buildPrompt}
                className="h-8 px-2 rounded-lg border border-indigo-300 dark:border-indigo-500/30 text-[9px] font-bold text-indigo-600 dark:text-indigo-300 flex items-center justify-center gap-1 disabled:opacity-40 whitespace-nowrap"
              >
                {planning ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
