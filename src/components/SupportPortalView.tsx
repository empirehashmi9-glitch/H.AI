import React, { useState } from 'react';
import {
  Headphones, Send, Bot, Copy, Check, Loader2, Sparkles, Settings2,
  CheckCircle2, AlertTriangle, Clock, Zap
} from 'lucide-react';
import { AppSettings, GeneratedProject, Language, SupportTicket } from '../types/agent';
import { handleSupportQuery } from '../utils/orchestrator';
import { generateJSON, hasAI, aiErrorMessage } from '../services/ai';
import { newId, timeAgo } from '../utils/storage';
import { toast } from './Toast';

interface SupportPortalViewProps {
  tickets: SupportTicket[];
  onAddTicket: (ticket: SupportTicket) => void;
  language: Language;
  settings: AppSettings;
  project: GeneratedProject | null;
  onOpenSettings: () => void;
}

const SCHEMA: Record<string, unknown> = {
  type: 'object',
  additionalProperties: false,
  properties: {
    response: { type: 'string' },
    responseUrdu: { type: 'string' },
    category: { type: 'string' },
    priority: { type: 'string', enum: ['low', 'medium', 'high'] },
    escalate: { type: 'boolean' },
  },
  required: ['response', 'responseUrdu', 'category', 'priority', 'escalate'],
};

export const SupportPortalView: React.FC<SupportPortalViewProps> = ({
  tickets, onAddTicket, language, settings, project, onOpenSettings,
}) => {
  const isUrdu = language === 'ur';
  const [customerName, setCustomerName] = useState('Ali Raza');
  const [customerEmail, setCustomerEmail] = useState('ali.raza@example.pk');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'api'>('chat');
  const aiLive = hasAI(settings);
  const appName = project?.name || 'our product';
  const endpoint = 'https://YOUR_DEPLOYMENT.vercel.app/api/support';

  const curlExample = `curl -X POST ${endpoint} \\
  -H "Authorization: Bearer $SUPPORT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customer_name": "${customerName}",
    "customer_email": "${customerEmail}",
    "query": "${(message || 'How do I connect Supabase realtime?').replace(/"/g, '\\"').slice(0, 120)}"
  }'`;

  const askAgent = async (query: string): Promise<{
    responseEn: string; responseUrdu: string; category: string;
    priority: 'low' | 'medium' | 'high'; escalate: boolean;
  }> => {
    if (!aiLive) {
      const base = handleSupportQuery(query);
      return { ...base, priority: 'medium', escalate: false };
    }
    const context = project?.spec
      ? `Product: ${project.spec.name} — ${project.spec.tagline}. Features: ${project.spec.features.map((f) => f.title).join(', ')}. Tables: ${project.spec.dataModels.map((m) => m.name).join(', ')}. Platforms: ${Object.entries(project.platforms).filter(([, v]) => v).map(([k]) => k).join(', ')}. Deploy URL: ${project.vercel.deployUrl}.`
      : 'No project generated yet in this session.';
    try {
      const res = await generateJSON<{
        response: string; responseUrdu: string; category: string;
        priority: 'low' | 'medium' | 'high'; escalate: boolean;
      }>({
        settings,
        system: [
          'You are H.AI Support Agent #26. You answer customers about the product built on this platform.',
          'Be empathetic, specific and under 120 words. Never invent credentials, refunds or SLAs.',
          'If the question needs account access or a bug fix you cannot perform, set escalate=true and say the human team will follow up.',
          'Write response in English and responseUrdu in natural Urdu script. category is a 1-3 word tag.',
          'Return only JSON per schema.',
        ].join(' '),
        prompt: `Product context:\n${context}\n\nCustomer question:\n${query}`,
        schema: SCHEMA,
        maxOutputTokens: 1200,
        temperature: 0.4,
      });
      return {
        responseEn: res.response,
        responseUrdu: res.responseUrdu || res.response,
        category: res.category || 'general',
        priority: res.priority || 'medium',
        escalate: Boolean(res.escalate),
      };
    } catch (err) {
      toast.error(aiErrorMessage(err));
      const base = handleSupportQuery(query);
      return { ...base, priority: 'medium', escalate: false };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;
    setIsSending(true);

    const answer = await askAgent(message);
    const ticket: SupportTicket = {
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName || 'Valued Customer',
      customerEmail: customerEmail || 'customer@cloud.io',
      promptTopic: answer.category,
      message,
      response: answer.responseEn,
      responseUrdu: answer.responseUrdu,
      status: answer.escalate ? 'escalated' : 'resolved',
      priority: answer.priority,
      createdAt: new Date().toISOString(),
      viaApiWebhook: true,
    };
    onAddTicket(ticket);
    setMessage('');
    setIsSending(false);
    toast.success(isUrdu ? 'ٹکٹ حل ہو گیا' : 'Ticket answered by Agent #26');
  };

  const displayTime = (value: string) => {
    const parsed = new Date(value);
    return Number.isFinite(parsed.getTime()) ? timeAgo(value, isUrdu) : value;
  };

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/[0.06]">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isUrdu ? 'خودکار کسٹمر سپورٹ ایجنٹ (24/7)' : 'Autonomous Customer Support Agent'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl">
            {isUrdu
              ? `${appName} کے بارے میں سوالات کا خودکار جواب، مکمل گفتگو کے ساتھ جو ایڈمن ڈیش بورڈ میں فوراً دکھائی دیتی ہے۔`
              : `Agent #26 answers questions about ${appName} using your product spec. Every conversation is persisted and appears in the Admin cockpit instantly.`}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenSettings}
            className={`px-3 py-2 rounded-xl border text-[10px] font-bold flex items-center gap-1.5 ${
              aiLive
                ? 'border-emerald-300/60 dark:border-emerald-500/25 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                : 'border-amber-300/60 dark:border-amber-500/25 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${aiLive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            {aiLive ? 'Gemini live' : 'Demo replies'}
          </button>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/[0.04] p-1 rounded-xl border border-slate-200 dark:border-white/[0.06]">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'chat' ? 'bg-white dark:bg-white/[0.12] text-slate-900 dark:text-white font-semibold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {isUrdu ? 'لائیو چیٹ' : 'Live Chat'}
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'api' ? 'bg-white dark:bg-white/[0.12] text-slate-900 dark:text-white font-semibold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {isUrdu ? 'اے پی آئی' : 'API'}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'chat' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white/80 dark:bg-[#0d0f17] border border-slate-200 dark:border-white/[0.08] space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Headphones className="w-4 h-4 text-indigo-500" />
                {isUrdu ? 'کسٹمر انکوائری بھیجیں' : 'Submit Customer Query'}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Email</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">
                  {isUrdu ? 'سوال یا پیغام:' : 'Message:'}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isUrdu ? `مثال: ${appName} میں آرڈر کیسے ٹریک کروں؟` : `E.g., How do I track my order in ${appName}?`}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">{isUrdu ? 'تجویز کردہ سوالات' : 'Suggested questions'}</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    project?.spec?.features[0] ? `How does "${project.spec.features[0].title}" work?` : 'How does Supabase RLS work?',
                    isUrdu ? 'میرا اکاؤنٹ کیسے محفوظ ہے؟' : 'How is my account secured?',
                    isUrdu ? 'رسید یا ریفنڈ کی پالیسی کیا ہے؟' : 'What is the refund policy?',
                  ].map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMessage(q)}
                      className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.04] text-[11px] transition text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSending || !message.trim()}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{isUrdu ? 'ایجنٹ #26 جواب دے رہا ہے…' : 'Agent #26 is responding…'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'سوال بھیجیں' : 'Submit Query'}</span>
                  </>
                )}
              </button>
              {!aiLive && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400">
                  {isUrdu ? 'ڈیمو جوابات — حقیقی AI کے لیے Settings میں کلید شامل کریں۔' : 'Demo answers — add a Gemini key for live, product-specific replies.'}
                </p>
              )}
            </form>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 sm:p-6 rounded-3xl bg-white/80 dark:bg-[#0d0f17] border border-slate-200 dark:border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200 dark:border-white/[0.06]">
                <span className="font-bold text-slate-900 dark:text-white">{isUrdu ? 'حالیہ گفتگو' : 'Dispatched Inquiries'}</span>
                <span className="text-slate-500 font-mono">{tickets.length} logged</span>
              </div>

              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] space-y-3">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white">{ticket.customerName}</span>
                        <span className="text-slate-500 text-[11px] ml-2">({ticket.promptTopic})</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                        {ticket.priority === 'high' && <span className="text-rose-500 flex items-center gap-0.5"><AlertTriangle className="w-3 h-3" />high</span>}
                        <span className={ticket.status === 'escalated' ? 'text-amber-500' : 'text-emerald-500'}>{ticket.status}</span>
                        <span className="text-slate-400 flex items-center gap-0.5"><Clock className="w-3 h-3" />{displayTime(ticket.createdAt)}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-black/40 text-xs text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-transparent">
                      “{ticket.message}”
                    </div>

                    <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/20 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]">
                        <Bot className="w-3.5 h-3.5" />
                        <span>H.AI Support Agent #26</span>
                        {ticket.viaApiWebhook && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">API</span>}
                      </div>
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                        {isUrdu ? ticket.responseUrdu : ticket.response}
                      </p>
                    </div>
                  </div>
                ))}
                {tickets.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-8">{isUrdu ? 'ابھی کوئی سوال نہیں' : 'No inquiries yet — send the first one.'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0d0f17] border border-slate-200 dark:border-white/[0.08] space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">REST & Webhook Integration</h3>
            <p className="text-slate-500 text-xs">
              {isUrdu
                ? 'ہر بلڈ کے ساتھ api/support.ts سرور لیس فنکشن تیار ہوتا ہے — اسی endpoint کو اپنی ایپ میں استعمال کریں۔'
                : 'Every build ships api/support.ts — a Vercel serverless function that answers with Gemini. Deploy it with your web app and call this endpoint from iOS, Android or a CRM.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
              <div className="font-mono text-indigo-500 font-bold">POST</div>
              <div className="text-slate-500 mt-1 break-all">/api/support</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
              <div className="font-mono text-indigo-500 font-bold">AUTH</div>
              <div className="text-slate-500 mt-1">Bearer SUPPORT_API_KEY</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
              <div className="font-mono text-indigo-500 font-bold">MODEL</div>
              <div className="text-slate-500 mt-1">{aiLive ? settings.model : 'gemini-2.5-flash'}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">cURL example</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(curlExample);
                  setCopiedCurl(true);
                  window.setTimeout(() => setCopiedCurl(false), 2000);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-xs text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5"
              >
                {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCurl ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre dir="ltr" className="p-5 rounded-2xl bg-slate-50 dark:bg-[#08090d] border border-slate-200 dark:border-white/[0.08] text-emerald-700 dark:text-emerald-400 font-mono text-[11px] overflow-x-auto text-left leading-relaxed">
              {curlExample}
            </pre>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/[0.06] border border-indigo-200 dark:border-indigo-500/20 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
            <p className="font-semibold flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300"><Zap className="w-3.5 h-3.5" /> {isUrdu ? 'کیسے لائیو کریں' : 'How to go live'}</p>
            <p>{isUrdu ? 'ورک اسپیس میں فائل api/support.ts کھولیں، اسے اپنے ورسل پروجیکٹ میں شامل کریں اور GEMINI_API_KEY + SUPPORT_API_KEY انوائرنمنٹ ویریبلز سیٹ کریں۔' : 'Open api/support.ts in the Workspace, include it in your Vercel project, and set GEMINI_API_KEY + SUPPORT_API_KEY environment variables. Then point your app at /api/support.'}</p>
          </div>
        </div>
      )}
    </div>
  );
};
