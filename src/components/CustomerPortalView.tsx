import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Smartphone, 
  Globe, 
  Database, 
  CloudUpload, 
  ExternalLink, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  RefreshCw, 
  Layers, 
  Play, 
  Plus, 
  Share2, 
  ThumbsUp, 
  ThumbsDown, 
  Sliders, 
  PanelLeftClose, 
  PanelLeft, 
  Clock, 
  Code2, 
  ShieldCheck, 
  ArrowUpRight,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import { Language, GeneratedProject } from '../types/agent';
import { HaiBrandIcon } from './HaiBrandIcon';
import { MicrophoneInput } from './MicrophoneInput';

interface CustomerPortalViewProps {
  language: Language;
  project: GeneratedProject | null;
  onOpenEngineeringFoundry: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  urduText?: string;
  timestamp: string;
  thinkingSteps?: string[];
  thinkingStepsUrdu?: string[];
  hasArtifact?: boolean;
  artifactTitle?: string;
  artifactTitleUrdu?: string;
  artifactType?: 'ecommerce' | 'health' | 'saas';
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  language,
  project,
  onOpenEngineeringFoundry
}) => {
  const isUrdu = language === 'ur';

  // Input prompt and thinking state
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [selectedModel, setSelectedModel] = useState('H.AI Neural Ultra (30 Agents)');
  const [showThinkingId, setShowThinkingId] = useState<string | null>('msg-welcome');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Active targets in pill
  const [activeTargets, setActiveTargets] = useState({
    web: true,
    ios: true,
    android: true,
    supabase: true,
    vercel: true
  });

  // Interactive cart simulation state for Canvas
  const [canvasCartCount, setCanvasCartCount] = useState(2);
  const [canvasCheckoutSuccess, setCanvasCheckoutSuccess] = useState(false);

  // Chat conversation state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'gemini',
      text: "Hello! I am H.AI, your autonomous app-building intelligence. I orchestrate 30 specialized agents to build, design, code, and deploy complete Web, iOS, and Android applications with Supabase and Vercel in 1-2 minutes. What would you like to build or update today?",
      urduText: "السلام علیکم! میں ایچ ڈاٹ اے آئی ہوں، آپ کا خودکار ایپ بلڈر۔ میں 30 اسپیشلسٹ ایجنٹس کے ذریعے آپ کے لیے ویب، آئی او ایس اور اینڈرائیڈ ایپس تیار کر کے سپابیس اور ورسل پر 1 سے 2 منٹ میں لائیو ڈیپلائے کرتا ہوں۔ آج آپ کیا بنوانا چاہتے ہیں؟",
      timestamp: 'Just now',
      thinkingSteps: [
        'Initialized 30 autonomous specialist agent workers',
        'Supabase PostgreSQL RLS policies ready for tenant isolation',
        'Vercel Anycast edge network SSL certificates active',
        'Self-evolution engine v4.8.4 continuous learning active'
      ],
      thinkingStepsUrdu: [
        'تمام 30 ماہر ایجنٹس خودکار اسٹینڈ بائی پر فعال',
        'سپابیس ڈیٹا بیس سیکیورٹی قوانین تیار',
        'ورسل گلوبل ایج نیٹ ورک لائیو اور محفوظ',
        'خودکار سیلف اپ ڈیٹ و لرننگ انجن v4.8.4 فعال'
      ],
      hasArtifact: true,
      artifactTitle: 'Live Production Storefront (Vercel & Supabase Live)',
      artifactTitleUrdu: 'لائیو پروڈکشن ایپ اور اسٹور (ورسل اور سپابیس پر لائیو)',
      artifactType: 'ecommerce'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Handle submit from user (text or voice)
  const handleSendMessage = (textToSend?: string) => {
    const prompt = (textToSend || inputValue).trim();
    if (!prompt || isThinking) return;

    const userMsgId = `user-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    setIsThinking(true);

    // Simulate Gemini 30-agent synthesis
    setTimeout(() => {
      const geminiMsgId = `gemini-${Date.now()}`;
      const isUrduQuery = /[\u0600-\u06FF]/.test(prompt) || isUrdu;

      const aiResponse: ChatMessage = {
        id: geminiMsgId,
        sender: 'gemini',
        text: `I've analyzed your prompt "${prompt}" and deployed the solution! The 30 agents generated the complete React 19 web frontend, native iOS SwiftUI 6 views, Android Jetpack Compose screens, PostgreSQL schema on Supabase, and deployed it live to Vercel. You can test the live application directly in the canvas below:`,
        urduText: `میں نے آپ کے پرامپٹ "${prompt}" کا مکمل تجزیہ کر کے حل تیار کر دیا ہے! ہمارے 30 ایجنٹس نے ری ایکٹ 19 ویب کوڈ، آئی او ایس سوئفٹ یو آئی، اینڈرائیڈ جیٹ پیک کمپوز، سپابیس ڈیٹا بیس اسکیما اور ورسل لائیو ڈیپلائمنٹ مکمل کر لی ہے۔ آپ نیچے دیے گئے انٹرایکٹو کینوس میں ایپ ٹیسٹ کر سکتے ہیں:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        thinkingSteps: [
          'Deconstructed prompt intent into entity-relationship model',
          'Agent #4 & #6 concurrently generated responsive React 19 & SwiftUI codebases',
          'Agent #11 applied Supabase Row-Level Security (RLS) tables and triggers',
          'Agent #15 provisioned Vercel edge deployment with HTTPS certificate'
        ],
        thinkingStepsUrdu: [
          'پرامپٹ کی تقسیم اور آرکیٹیکچر کا خاکہ تیار کیا گیا',
          'ایجنٹ #4 اور #6 نے ری ایکٹ 19 اور سوئفٹ یو آئی کا کوڈ بیک وقت تیار کیا',
          'سپابیس ڈیٹا بیس میں RLS سیکیورٹی قوانین لاگو کیے گئے',
          'ورسل کے گلوبل ایج سرورز پر لائیو ڈیپلائمنٹ مکمل کی گئی'
        ],
        hasArtifact: true,
        artifactTitle: prompt.slice(0, 45) + '... (Production Ready)',
        artifactTitleUrdu: prompt.slice(0, 45) + '... (مکمل لائیو تیار)',
        artifactType: prompt.toLowerCase().includes('health') || prompt.toLowerCase().includes('doctor') ? 'health' : 'ecommerce'
      };

      setMessages(prev => [...prev, aiResponse]);
      setShowThinkingId(geminiMsgId);
      setIsThinking(false);
    }, 1400);
  };

  // Gemini Inspiration Prompts
  const inspirationChips = [
    {
      titleEn: 'Create Online E-Commerce Store',
      titleUrdu: 'آن لائن شاپنگ اسٹور بنائیں',
      descEn: 'With JazzCash, cart, iOS SwiftUI & Supabase',
      descUrdu: 'جاز کیش، شاپنگ کارٹ اور سوئفٹ یو آئی ایپ کے ساتھ',
      promptEn: 'Build a modern e-commerce mobile & web app with product filters, shopping cart, and Supabase checkout.',
      promptUrdu: 'ایک جدید ای کامرس ویب اور موبائل ایپ بنائیں جس میں پروڈکٹ فلٹرز، شاپنگ کارٹ اور سپابیس ڈیٹا بیس شامل ہو۔'
    },
    {
      titleEn: 'Doctor & Telehealth Clinic',
      titleUrdu: 'ڈاکٹر اپوائنٹمنٹ اور کلینک ایپ',
      descEn: 'Patient records, video visit & appointment scheduler',
      descUrdu: 'مریضوں کا ریکارڈ اور ویڈیو مشاورت کی سہولت',
      promptEn: 'Create a telehealth doctor appointment booking application with patient records and instant consultation.',
      promptUrdu: 'ڈاکٹر اپوائنٹمنٹ اور ٹیلی ہیلتھ بکنگ ایپ بنائیں جس میں مریضوں کا ریکارڈ اور کنسلٹیشن کا نظام ہو۔'
    },
    {
      titleEn: 'Real Estate & Property Portal',
      titleUrdu: 'رئیل اسٹیٹ پراپرٹی پورٹل',
      descEn: 'Listings, virtual map tours & agent contact',
      descUrdu: 'پراپرٹی لسٹنگز اور ایجنٹ سے رابطہ کی سہولت',
      promptEn: 'Build a luxury real estate property marketplace with interactive photo gallery, smart filters, and inquiries.',
      promptUrdu: 'ایک جدید رئیل اسٹیٹ پراپرٹی پورٹل بنائیں جس میں تصاویر، فلٹرز اور خودکار انکوائری فارم ہوں۔'
    },
    {
      titleEn: 'Modify Live Application',
      titleUrdu: 'لائیو ایپ میں فوری تبدیلی',
      descEn: 'Add dark mode theme & push notifications',
      descUrdu: 'ڈارک تھیم اور خودکار نوٹیفیکیشنز شامل کروائیں',
      promptEn: 'Update my deployed production application: Add smooth dark mode toggle and WhatsApp customer support button.',
      promptUrdu: 'میری لائیو ایپ کو اپ ڈیٹ کرو: ڈارک موڈ اور واٹس ایپ سپورٹ بٹن کا اضافہ کرو۔'
    }
  ];

  const recentChats = [
    { id: '1', titleEn: 'E-Commerce Marketplace App', titleUrdu: 'فیشن ای کامرس اسٹور', time: '10m ago' },
    { id: '2', titleEn: 'Telehealth Doctor Portal', titleUrdu: 'ٹیلی ہیلتھ کلینک پورٹل', time: '2h ago' },
    { id: '3', titleEn: 'Real Estate Smart Listings', titleUrdu: 'رئیل اسٹیٹ لسٹنگز', time: 'Yesterday' }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[620px] max-w-7xl mx-auto rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#080a13]/90 backdrop-blur-2xl shadow-2xl relative">
      
      {/* Ambient Glow in Canvas */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 overflow-hidden -z-10"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-indigo-500/10 via-purple-500/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full" />
      </div>

      {/* Top App Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 h-14 border-b border-slate-200/70 dark:border-white/[0.08] bg-white/50 dark:bg-[#0a0d18]/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle for App History */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-600 dark:text-slate-300 transition"
            title="Toggle recent app chats"
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>

          {/* Brand Logo & Model Picker */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[1.5px] shadow-sm shadow-indigo-500/20">
              <div className="w-full h-full bg-white dark:bg-[#070913] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-500" />
              </div>
            </div>

            <div className="flex items-center gap-1.5 cursor-pointer group">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1">
                H.AI <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Studio</span>
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hidden sm:inline">
                {selectedModel}
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions: Switch to Full Foundry, Live indicator */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[11px] font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>30 Agents Active</span>
          </span>

          <button
            onClick={onOpenEngineeringFoundry}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">{isUrdu ? 'انجینئرنگ موڈ' : 'Foundry Mode'}</span>
          </button>
        </div>
      </div>

      {/* Main Body: Left Sidebar (Collapsible) + Conversational Chat Canvas */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Gemini Left History Sidebar */}
        {isSidebarOpen && (
          <aside className="w-64 border-r border-slate-200/70 dark:border-white/[0.08] bg-slate-50/80 dark:bg-[#070913]/95 backdrop-blur-xl p-4 flex flex-col justify-between shrink-0 z-30 transition-all">
            <div className="space-y-4">
              <button
                onClick={() => {
                  setMessages([messages[0]]);
                  setIsSidebarOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>{isUrdu ? 'نیا پرامپٹ شروع کریں' : 'New App Prompt'}</span>
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block px-2">
                  {isUrdu ? 'آپ کے تیار شدہ ایپس' : 'Your Generated Apps'}
                </span>

                {recentChats.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      handleSendMessage(isUrdu ? c.titleUrdu : c.titleEn);
                      setIsSidebarOpen(false);
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-200/70 dark:hover:bg-white/[0.06] text-slate-700 dark:text-slate-300 text-xs cursor-pointer flex items-center justify-between transition group"
                  >
                    <span className="truncate group-hover:text-indigo-400">
                      {isUrdu ? c.titleUrdu : c.titleEn}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {c.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-white/10 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Tasleem Sultan</span>
              <span className="text-emerald-400 font-mono">Pro Client</span>
            </div>
          </aside>
        )}

        {/* Gemini Central Column: Scrollable Messages + Bottom Floating Dock */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Scrollable Chat Feed */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
            {/* Welcome Hero when only 1 message exists */}
            {messages.length === 1 && (
            <div className="my-auto max-w-3xl mx-auto w-full space-y-6 pt-4 text-center">
              
              <div className="inline-flex items-center gap-2 p-1.5 px-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200/70 dark:border-indigo-500/20 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isUrdu ? 'خودکار کسٹمر اسٹوڈیو' : 'Autonomous Multi-Agent Studio'}</span>
              </div>

              {/* Iconic Gemini Gradient Heading */}
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  {isUrdu ? 'السلام علیکم، تسلیم' : 'Hello, Tasleem'}
                </span>
                <br />
                <span className="text-slate-900 dark:text-slate-100 font-bold text-2xl sm:text-4xl">
                  {isUrdu ? 'آج کیا ایپ تیار کرنی ہے؟' : 'What would you like to build?'}
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                {isUrdu
                  ? 'مائیک سے بولیں یا نیچے پرامپٹ منتخب کریں۔ H.AI کے 30 اسپیشلسٹ ایجنٹس فورا ویب، آئی او ایس اور اینڈرائیڈ ایپس لائیو بنا دیں گے۔'
                  : 'Speak via microphone or pick an inspiration card below. 30 autonomous agents will code, test, and deploy it live.'}
              </p>

              {/* Gemini 4 Inspiration Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left rtl:text-right pt-2">
                {inspirationChips.map((chip, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSendMessage(isUrdu ? chip.promptUrdu : chip.promptEn)}
                    className="p-4 rounded-2xl bg-white dark:bg-[#0c0f1c] border border-slate-200/80 dark:border-white/10 hover:border-indigo-500/50 hover:shadow-lg dark:hover:shadow-indigo-500/5 cursor-pointer transition-all group flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-indigo-400 transition">
                        {isUrdu ? chip.titleUrdu : chip.titleEn}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                        {isUrdu ? chip.descUrdu : chip.descEn}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-indigo-500 font-semibold pt-2 border-t border-slate-100 dark:border-white/[0.05]">
                      <span>{isUrdu ? 'ابھی شروع کریں' : 'Build this now'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conversation Feed */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col space-y-2 max-w-3xl w-full mx-auto ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {/* User Bubble */}
              {msg.sender === 'user' && (
                <div className="px-5 py-3 rounded-3xl bg-slate-100 dark:bg-white/[0.08] text-slate-900 dark:text-slate-100 text-sm max-w-xl font-normal leading-relaxed rounded-br-sm shadow-sm">
                  {msg.text}
                </div>
              )}

              {/* Gemini AI Response Bubble */}
              {msg.sender === 'gemini' && (
                <div className="space-y-4 w-full">
                  <div className="flex items-start gap-3">
                    {/* Gemini Sparkle Icon */}
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[1px] shrink-0 mt-0.5">
                      <div className="w-full h-full bg-[#0a0d18] rounded-[11px] flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      {/* Collapsible Gemini Thinking Accordion */}
                      {msg.thinkingSteps && (
                        <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.08] bg-slate-50/70 dark:bg-white/[0.03] overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setShowThinkingId(showThinkingId === msg.id ? null : msg.id)}
                            className="w-full px-3.5 py-2 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                          >
                            <span className="flex items-center gap-2">
                              <Sparkles className="w-3 h-3 text-indigo-400 animate-spin" />
                              <span>
                                {isUrdu
                                  ? 'سوچنے کا عمل (30 ایجنٹس سنکرونائزیشن مکمل)'
                                  : 'Thought for 8 seconds • 30 Specialized Agents Synchronized'}
                              </span>
                            </span>
                            {showThinkingId === msg.id ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {showThinkingId === msg.id && (
                            <div className="px-3.5 pb-3 pt-1 border-t border-slate-200/40 dark:border-white/[0.05] space-y-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                              {(isUrdu ? msg.thinkingStepsUrdu : msg.thinkingSteps)?.map((step, sIdx) => (
                                <div key={sIdx} className="flex items-center gap-2">
                                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Main Message Text */}
                      <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
                        {isUrdu && msg.urduText ? msg.urduText : msg.text}
                      </p>

                      {/* Gemini Canvas Artifact Card */}
                      {msg.hasArtifact && (
                        <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-[#0a0d18] to-slate-900/90 p-5 sm:p-6 shadow-xl space-y-4">
                          
                          {/* Artifact Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                            <div>
                              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">
                                Interactive Live Canvas Artifact
                              </span>
                              <h4 className="font-extrabold text-sm sm:text-base text-white">
                                {isUrdu ? msg.artifactTitleUrdu : msg.artifactTitle}
                              </h4>
                            </div>

                            <div className="flex items-center gap-2">
                              <a
                                href={project ? project.vercel.deployUrl : 'https://h-ai-storefront.vercel.app'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition"
                              >
                                <span>{isUrdu ? 'لائیو کھولیں' : 'Open Live'}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>

                          {/* Live App Sandbox Inside Response */}
                          <div className="rounded-2xl bg-black/60 border border-white/10 p-4 space-y-3">
                            <div className="flex items-center justify-between text-xs text-slate-400">
                              <span className="flex items-center gap-1.5 text-white font-semibold">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                {isUrdu ? 'لائیو کسٹمر اسٹور ڈیمو' : 'Live Interactive Demo'}
                              </span>
                              <span className="font-mono text-emerald-400 text-[11px]">
                                Cart: ({canvasCartCount} items)
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                                <div className="h-20 rounded-lg bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 flex items-center justify-center font-bold text-xs text-indigo-200">
                                  Neural Noise-Cancelling Headphones
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                    {isUrdu ? 'دستیاب' : 'In Stock'}
                                  </span>
                                  <button
                                    onClick={() => setCanvasCartCount(c => c + 1)}
                                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px]"
                                  >
                                    + Add
                                  </button>
                                </div>
                              </div>

                              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                                <div className="h-20 rounded-lg bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 flex items-center justify-center font-bold text-xs text-emerald-200">
                                  Quantum OLED Smartwatch 2
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-[11px] text-indigo-400 font-mono flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                    {isUrdu ? 'پریمیئم فیچر' : 'Featured'}
                                  </span>
                                  <button
                                    onClick={() => setCanvasCartCount(c => c + 1)}
                                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px]"
                                  >
                                    + Add
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Live Checkout trigger */}
                            <div className="pt-2 flex items-center justify-between border-t border-white/10">
                              <span className="text-[11px] text-slate-400">
                                {isUrdu ? 'سپابیس اور ورسل ایج کنیکٹڈ' : 'Connected to Supabase Realtime & Vercel'}
                              </span>
                              <button
                                onClick={() => {
                                  setCanvasCheckoutSuccess(true);
                                  setTimeout(() => setCanvasCheckoutSuccess(false), 2000);
                                }}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>{canvasCheckoutSuccess ? 'Payment Processed!' : 'Instant Live Checkout'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Quick Export Chips */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 font-mono text-[11px]">
                                React 19 + SwiftUI + Compose
                              </span>
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono text-[11px]">
                                0 Vulnerabilities
                              </span>
                            </div>

                            <button
                              onClick={() => onOpenEngineeringFoundry()}
                              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                            >
                              <span>{isUrdu ? 'مکمل سورس کوڈ معائنہ' : 'Inspect Source Code in Foundry'}</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </div>

                        </div>
                      )}

                      {/* Gemini Bottom Feedback Action Bar */}
                      <div className="flex items-center gap-3 pt-1 text-slate-400 text-xs">
                        <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-white transition">
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-white transition">
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => {
                            setCopiedCode(true);
                            setTimeout(() => setCopiedCode(false), 2000);
                          }}
                          className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-white transition flex items-center gap-1 text-[11px]"
                        >
                          {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCode ? 'Copied' : 'Share'}</span>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Realtime Thinking Spinner */}
          {isThinking && (
            <div className="flex items-start gap-3 max-w-3xl w-full mx-auto">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[1px] shrink-0 mt-0.5">
                <div className="w-full h-full bg-[#0a0d18] rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 max-w-md">
                <span className="text-xs font-mono text-indigo-400 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  {isUrdu ? '30 ایجنٹس کام کر رہے ہیں...' : '30-Agent Supercluster Synthesizing...'}
                </span>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 animate-pulse w-3/4 rounded-full" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Floating Prompt Bar (Bottom Luxury Dock) */}
        <div className="p-4 sm:p-6 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-[#080a13] dark:via-[#080a13]/95 dark:to-transparent shrink-0">
          <div className="max-w-3xl mx-auto space-y-2">
            
            {/* The Luxury Rounded Console */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-md opacity-60 group-focus-within:opacity-100 transition duration-300 pointer-events-none" />

              <div className="relative bg-white dark:bg-[#0f1322] border border-slate-200 dark:border-white/10 rounded-3xl p-3 shadow-xl transition-all">
                
                {/* Input Textarea */}
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    isUrdu
                      ? 'ایچ ڈاٹ اے آئی سے پوچھیں یا پرامپٹ بولیں/لکھیں...'
                      : 'Ask H.AI to build, update, or deploy an application...'
                  }
                  rows={2}
                  disabled={isThinking}
                  className="w-full px-3 py-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm leading-relaxed outline-none resize-none"
                />

                {/* Bottom Controls inside the Gemini Pill */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                  
                  {/* Platform Target Toggles */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <button
                      type="button"
                      onClick={() => setActiveTargets(t => ({ ...t, web: !t.web }))}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition ${
                        activeTargets.web
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-white/[0.05] text-slate-500'
                      }`}
                    >
                      Web
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTargets(t => ({ ...t, ios: !t.ios }))}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition ${
                        activeTargets.ios
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 dark:bg-white/[0.05] text-slate-500'
                      }`}
                    >
                      iOS
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTargets(t => ({ ...t, android: !t.android }))}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition ${
                        activeTargets.android
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-white/[0.05] text-slate-500'
                      }`}
                    >
                      Android
                    </button>
                  </div>

                  {/* Mic and Send Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Embedded Microphone for Gemini voice input */}
                    <MicrophoneInput
                      language={language}
                      disabled={isThinking}
                      onTranscript={(transcript) => {
                        setInputValue(transcript);
                      }}
                    />

                    {/* Send Button */}
                    <button
                      type="button"
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim() || isThinking}
                      aria-label="Send prompt"
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center transition shadow-md ${
                        inputValue.trim() && !isThinking
                          ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white hover:scale-105 shadow-indigo-600/30 cursor-pointer'
                          : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            </div>

            <p className="text-[10px] text-center text-slate-500 dark:text-slate-400">
              {isUrdu
                ? 'ایچ ڈاٹ اے آئی • 30 اسپیشلسٹ ایجنٹس کی خودکار نگرانی • سپا بیس اور ورسل لائیو ڈیپلائمنٹ'
                : 'H.AI • 30 Autonomous Specialist Agents • Instant Supabase & Vercel Production Cloud'}
            </p>
          </div>
        </div>

        </div>
      </div>
    </div>
  );
};
