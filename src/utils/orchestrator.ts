import { 
  SpecializedAgent, 
  GeneratedProject, 
  SelfLearningMetric, 
  SupportTicket, 
  ClusterNode,
  SelfDiagnosticSubsystem,
  SelfUpdatePatch,
  SelfUpdateSettings,
  SelfUpdateCodeDiff
} from '../types/agent';

export const INITIAL_30_AGENTS: SpecializedAgent[] = [
  {
    id: 'agent-1',
    number: 1,
    name: 'H.AI Orchestrator Prime',
    nameUrdu: 'ایچ ڈاٹ اے آئی آرکسٹریٹر پرائم',
    role: 'Autonomous Executive Coordinator & Intent Decomposer',
    roleUrdu: 'خودکار ایگزیکٹو کوآرڈینیٹر اور پرامپٹ تجزیہ کار',
    category: 'orchestration',
    status: 'idle',
    progress: 0,
    tasksCompleted: 4892,
    currentTask: 'Supervising 30 concurrent agent worker pipelines',
    currentTaskUrdu: 'تمام 30 ایجنٹس کی خودکار نگرانی اور کمانڈ',
    throughputTps: 1850,
    latencyMs: 14,
    icon: 'Cpu'
  },
  {
    id: 'agent-2',
    number: 2,
    name: 'Prompt & Specification Architect',
    nameUrdu: 'پرامپٹ اور سسٹم اسپیک آرکیٹیکٹ',
    role: 'Deconstructs user prompt into multi-target technical blueprints',
    roleUrdu: 'صارف کے پرامپٹ کو تکنیکی نقشے میں تبدیل کرنا',
    category: 'architecture',
    status: 'idle',
    progress: 0,
    tasksCompleted: 4810,
    currentTask: 'Generating domain entity graph and functional spec',
    currentTaskUrdu: 'سسٹم فنکشنل ماڈل کی تیاری',
    throughputTps: 1420,
    latencyMs: 18,
    icon: 'FileText'
  },
  {
    id: 'agent-3',
    number: 3,
    name: 'Design System & UX Journey Agent',
    nameUrdu: 'ڈیزائن سسٹم اور یو ایکس جرنی ایجنٹ',
    role: 'Synthesizes atomic design tokens, palettes, and UX journeys',
    roleUrdu: 'کلر پیلیٹ، UI کمپوننٹس اور یوزر جرنی ڈیزائن',
    category: 'frontend',
    status: 'idle',
    progress: 0,
    tasksCompleted: 4790,
    currentTask: 'Formulating responsive tokens and micro-interactions',
    currentTaskUrdu: 'جدید رسپانسو ٹوکنز اور متحرک اثرات',
    throughputTps: 1100,
    latencyMs: 22,
    icon: 'Palette'
  },
  {
    id: 'agent-4',
    number: 4,
    name: 'React 19 & Tailwind Web Core Agent',
    nameUrdu: 'ری ایکٹ اور ٹیل ونڈ ویب کور ایجنٹ',
    role: 'Writes high-performance responsive web components & SPA logic',
    roleUrdu: 'ویب ایپلیکیشن کا مکمل جدید کوڈ تحریر کرنا',
    category: 'frontend',
    status: 'idle',
    progress: 0,
    tasksCompleted: 5120,
    currentTask: 'Compiling React modern component tree',
    currentTaskUrdu: 'ری ایکٹ کمپوننٹس کی تیاری',
    throughputTps: 2200,
    latencyMs: 12,
    icon: 'Globe'
  },
  {
    id: 'agent-5',
    number: 5,
    name: 'Next.js App Router & SSR Agent',
    nameUrdu: 'نیکسٹ جے ایس اور ایس ایس آر ایجنٹ',
    role: 'Generates server actions, metadata, and routing hierarchy',
    roleUrdu: 'سرور ایکشنز اور روٹنگ ہائیرارکی کی تخلیق',
    category: 'frontend',
    status: 'idle',
    progress: 0,
    tasksCompleted: 4320,
    currentTask: 'Constructing edge-compatible page layouts',
    currentTaskUrdu: 'ایج کمپیٹیبل لے آؤٹ بنانا',
    throughputTps: 1650,
    latencyMs: 19,
    icon: 'Layers'
  },
  {
    id: 'agent-6',
    number: 6,
    name: 'SwiftUI iOS Native Engineer',
    nameUrdu: 'سوئفٹ یو آئی آئی او ایس انجینئر',
    role: 'Generates native Apple iOS views, StateObjects, and navigation',
    roleUrdu: 'آئی فون اور آئی پیڈ کے لیے اصلی سوئفٹ کوڈ بنانا',
    category: 'mobile',
    status: 'idle',
    progress: 0,
    tasksCompleted: 4610,
    currentTask: 'Synthesizing SwiftUI View structs with iOS 18 idioms',
    currentTaskUrdu: 'سوئفٹ ویوز اور نیویگیشن اسٹیک جنریشن',
    throughputTps: 1780,
    latencyMs: 16,
    icon: 'Smartphone'
  },
  {
    id: 'agent-7',
    number: 7,
    name: 'Xcode Bundle & Scheme Packager',
    nameUrdu: 'ایکس کوڈ بنڈل اور اسکیم پیکیجر',
    role: 'Structures Info.plist, Podfile, assets, and project configurations',
    roleUrdu: 'ایپل ایپ اسٹور کے لیے پراجیکٹ کنفیگریشن اور سرٹیفکیٹس',
    category: 'mobile',
    status: 'idle',
    progress: 0,
    tasksCompleted: 3990,
    currentTask: 'Validating entitlements and provisioning schemes',
    currentTaskUrdu: 'ایپل ایپ اسٹور انٹائٹلمنٹس چیکنگ',
    throughputTps: 980,
    latencyMs: 28,
    icon: 'Box'
  },
  {
    id: 'agent-8',
    number: 8,
    name: 'Jetpack Compose Android Engineer',
    nameUrdu: 'جیٹ پیک کمپوز اینڈرائیڈ انجینئر',
    role: 'Constructs modern Kotlin Jetpack Compose screens and ViewModels',
    roleUrdu: 'اینڈرائیڈ ایپس کے لیے جدید کوٹلن کمپوز اسکرینز',
    category: 'mobile',
    status: 'idle',
    progress: 0,
    tasksCompleted: 4540,
    currentTask: 'Generating Material 3 composables and Coroutine scopes',
    currentTaskUrdu: 'مٹیریل 3 ڈیزائن اور کوٹلن روٹینز',
    throughputTps: 1820,
    latencyMs: 15,
    icon: 'Tablet'
  },
  {
    id: 'agent-9',
    number: 9,
    name: 'Android Gradle & Manifest Builder',
    nameUrdu: 'اینڈرائیڈ گریڈل اور مینی فیسٹ بلڈر',
    role: 'Generates AndroidManifest.xml, build.gradle.kts, and dependencies',
    roleUrdu: 'گوگل پلے کے لیے اینڈرائیڈ گریڈل اور پرمیشنز',
    category: 'mobile',
    status: 'idle',
    progress: 0,
    tasksCompleted: 4110,
    currentTask: 'Configuring SDK 35 build target and multi-dex options',
    currentTaskUrdu: 'اینڈرائیڈ SDK 35 سیٹ اپ',
    throughputTps: 1250,
    latencyMs: 24,
    icon: 'Code'
  },
  {
    id: 'agent-10',
    number: 10,
    name: 'Cross-Platform State Synchronization',
    nameUrdu: 'کراس پلیٹ فارم اسٹیٹ سنکرونائزر',
    role: 'Ensures unified data models across Web, iOS, and Android layers',
    roleUrdu: 'ویب، آئی او ایس اور اینڈرائیڈ کے ڈیٹا ماڈل کو یکساں رکھنا',
    category: 'architecture',
    status: 'idle',
    progress: 0,
    tasksCompleted: 3950,
    currentTask: 'Reconciling universal DTO types across TypeScript & Kotlin',
    currentTaskUrdu: 'تمام پلیٹ فارمز میں ڈیٹا سنک ماڈل کی تصدیق',
    throughputTps: 1400,
    latencyMs: 20,
    icon: 'Repeat'
  },
  {
    id: 'agent-11',
    number: 11,
    name: 'Supabase PostgreSQL Schema Architect',
    nameUrdu: 'سپا بیس پوسٹگریس اسکیما آرکیٹیکٹ',
    role: 'Generates relational tables, foreign keys, triggers, and migrations',
    roleUrdu: 'سپا بیس ڈیٹا بیس ٹیبلز، ریلیشنز اور مائیگریشنز',
    category: 'backend',
    status: 'idle',
    progress: 0,
    tasksCompleted: 4980,
    currentTask: 'Drafting DDL SQL schema with UUID primary keys & indexes',
    currentTaskUrdu: 'پوسٹگریس ڈیٹا بیس اسکیما تحریر کرنا',
    throughputTps: 2100,
    latencyMs: 11,
    icon: 'Database'
  },
  {
    id: 'agent-12',
    number: 12,
    name: 'Supabase Row-Level Security (RLS) Guardian',
    nameUrdu: 'سپا بیس رو لیول سیکیورٹی گارڈین',
    role: 'Synthesizes enterprise RLS security policies per table',
    roleUrdu: 'ڈیٹا چوری سے بچاؤ کے لیے RLS سیکیورٹی پالیسیز',
    category: 'backend',
    status: 'idle',
    progress: 0,
    tasksCompleted: 4860,
    currentTask: 'Applying auth.uid() RLS policies to sensitive records',
    currentTaskUrdu: 'سیکیورٹی پالیسی کو نافذ کرنا',
    throughputTps: 1950,
    latencyMs: 13,
    icon: 'ShieldCheck'
  },
  {
    id: 'agent-13',
    number: 13,
    name: 'Supabase Realtime & Edge Functions Agent',
    nameUrdu: 'سپا بیس ریئل ٹائم اور ایج فنکشنز ایجنٹ',
    role: 'Implements Deno TypeScript edge functions & realtime broadcast',
    roleUrdu: 'تیز ترین سرور لیس فنکشنز اور لائیو ڈیٹا براڈکاسٹ',
    category: 'backend',
    status: 'idle',
    progress: 0,
    tasksCompleted: 4420,
    currentTask: 'Configuring websocket broadcast channels for instant sync',
    currentTaskUrdu: 'ویب ساکٹس ریئل ٹائم براڈکاسٹ سیٹ اپ',
    throughputTps: 1620,
    latencyMs: 17,
    icon: 'Zap'
  },
  {
    id: 'agent-14',
    number: 14,
    name: 'Supabase Auth & OAuth Specialist',
    nameUrdu: 'سپا بیس آتھینٹیکیشن اور لاگ ان ایجنٹ',
    role: 'Configures Email/Password, Magic Links, and Social OAuth',
    roleUrdu: 'یوزر سائن اپ، لاگ ان، پاس ورڈ اور گوگل آتھ سیٹ اپ',
    category: 'backend',
    status: 'idle',
    progress: 0,
    tasksCompleted: 4670,
    currentTask: 'Setting up JWT token refresh flow and session handlers',
    currentTaskUrdu: 'ٹوکن اور سیشن ہینڈلرز کی تشکیل',
    throughputTps: 1740,
    latencyMs: 15,
    icon: 'Lock'
  },
  {
    id: 'agent-15',
    number: 15,
    name: 'Vercel Edge Pipeline Deployer',
    nameUrdu: 'ورسل ایج پائپ لائن ڈیپلائر',
    role: 'Automates zero-config edge deployment, env secrets & routing',
    roleUrdu: 'ورسل پر ایک منٹ میں خودکار لائیو ڈیپلائمنٹ',
    category: 'devops',
    status: 'idle',
    progress: 0,
    tasksCompleted: 5310,
    currentTask: 'Spinning up worldwide CDN edge caches on Vercel',
    currentTaskUrdu: 'گلوبل ایج نیٹ ورک پر ایپلیکیشن لائیو کرنا',
    throughputTps: 2400,
    latencyMs: 9,
    icon: 'CloudUpload'
  },
  {
    id: 'agent-16',
    number: 16,
    name: 'Vercel Serverless & Build Optimizer',
    nameUrdu: 'ورسل سرور لیس اور بلڈ آپٹیمائزر',
    role: 'Minimizes bundle sizes, tree-shakes assets, and sets edge cache headers',
    roleUrdu: 'ویب سائٹ کی رفتار تیز اور بنڈل سائز کم کرنا',
    category: 'devops',
    status: 'idle',
    progress: 0,
    tasksCompleted: 4720,
    currentTask: 'Compacting JS chunks and applying stale-while-revalidate',
    currentTaskUrdu: 'بلڈ بنڈل سائز کو کم ترین سطح پر لانا',
    throughputTps: 1890,
    latencyMs: 14,
    icon: 'CheckCircle2'
  },
  {
    id: 'agent-17',
    number: 17,
    name: 'DNS & Automated SSL Provisioner',
    nameUrdu: 'ڈی این ایس اور خودکار ایس ایس ایل ایجنٹ',
    role: 'Configures Let’s Encrypt wildcard certificates and DNS Anycast',
    roleUrdu: 'سیکیور HTTPS سرٹیفکیٹ اور ڈومین اینی کاسٹ سیٹ اپ',
    category: 'devops',
    status: 'idle',
    progress: 0,
    tasksCompleted: 4180,
    currentTask: 'Verifying TLS 1.3 handshakes on global edge points',
    currentTaskUrdu: 'ایس ایس ایل سیکیورٹی کی خودکار تصدیق',
    throughputTps: 1350,
    latencyMs: 21,
    icon: 'Globe'
  },
  {
    id: 'agent-18',
    number: 18,
    name: 'Autonomous Test Runner & QA Agent',
    nameUrdu: 'خودکار ٹیسٹ رنر اور کیو اے ایجنٹ',
    role: 'Synthesizes unit tests, e2e smoke tests, and verifies zero regression',
    roleUrdu: 'خودکار ٹیسٹنگ اور کوالٹی اشورینس چیکس',
    category: 'qa_security',
    status: 'idle',
    progress: 0,
    tasksCompleted: 5080,
    currentTask: 'Running synthetic end-to-end user checkout flows',
    currentTaskUrdu: 'تمام فنکشنز کی خودکار ٹیسٹنگ',
    throughputTps: 2050,
    latencyMs: 12,
    icon: 'Shield'
  },
  {
    id: 'agent-19',
    number: 19,
    name: 'Security Auditing & OWASP Scanner',
    nameUrdu: 'سیکیورٹی آڈٹ اور OWASP اسکینر',
    role: 'Checks for SQL injection, XSS vulnerabilities, and CORS restrictions',
    roleUrdu: 'ہیکنگ سے حفاظت اور سیکیورٹی کمزوریوں کی جانچ',
    category: 'qa_security',
    status: 'idle',
    progress: 0,
    tasksCompleted: 4920,
    currentTask: 'Static analysis check: Zero vulnerable third-party modules',
    currentTaskUrdu: 'کوڈ سیکیورٹی اور ولنر ایبیلیٹی اسکین',
    throughputTps: 1920,
    latencyMs: 13,
    icon: 'KeyRound'
  },
  {
    id: 'agent-20',
    number: 20,
    name: 'Core Web Vitals & Asset Compactor',
    nameUrdu: 'کور ویب وائٹلز اور پرفارمنس ایجنٹ',
    role: 'Enforces sub-second LCP, 0 CLS, and instant FID scores',
    roleUrdu: 'انتہائی تیز رفتار لوڈنگ اور گوگل اسکور 99+',
    category: 'qa_security',
    status: 'idle',
    progress: 0,
    tasksCompleted: 4610,
    currentTask: 'Generating next-gen WebP images and preloading key fonts',
    currentTaskUrdu: 'پرفارمنس اسپیڈ اور ایسٹس کمپریشن',
    throughputTps: 1710,
    latencyMs: 16,
    icon: 'Activity'
  },
  {
    id: 'agent-21',
    number: 21,
    name: 'Urdu & RTL Localization Engine',
    nameUrdu: 'اردو اور آر ٹی ایل لوکلائزیشن ایجنٹ',
    role: 'Provides bi-directional text layout, Nastaliq typography and locale strings',
    roleUrdu: 'اردو، عربی اور انگلش کے مکمل ترجمے اور فونٹ سپورٹ',
    category: 'frontend',
    status: 'idle',
    progress: 0,
    tasksCompleted: 4830,
    currentTask: 'Aligning CSS flex directions and Noto Nastaliq fonts',
    currentTaskUrdu: 'دائیں سے بائیں (RTL) لے آؤٹ کی خودکار ترتیب',
    throughputTps: 1800,
    latencyMs: 15,
    icon: 'Languages'
  },
  {
    id: 'agent-22',
    number: 22,
    name: 'Accessibility (a11y) Compliance Agent',
    nameUrdu: 'ایکسیسیبلٹی اور رسائی کا ایجنٹ',
    role: 'Injects ARIA labels, semantic landmark nodes, and keyboard focus traps',
    roleUrdu: 'معذور افراد اور اسکرین ریڈرز کے لیے مکمل رسائی',
    category: 'qa_security',
    status: 'idle',
    progress: 0,
    tasksCompleted: 4490,
    currentTask: 'Validating WCAG 2.1 AAA color contrast ratios',
    currentTaskUrdu: 'تمام بٹنز اور لنکس پر ARIA لیبلز کا نفاذ',
    throughputTps: 1610,
    latencyMs: 17,
    icon: 'UserCheck'
  },
  {
    id: 'agent-23',
    number: 23,
    name: 'Vector Embeddings & RAG Synthesizer',
    nameUrdu: 'ویکٹر ایمبیڈنگز اور آر اے جی ایجنٹ',
    role: 'Generates vector search indices in Supabase pgvector for smart search',
    roleUrdu: 'سمارٹ سرچ کے لیے ویکٹر ایمبیڈنگز کا قیام',
    category: 'backend',
    status: 'idle',
    progress: 0,
    tasksCompleted: 4210,
    currentTask: 'Indexing product catalog semantic tokens',
    currentTaskUrdu: 'کیٹلاگ کا سیمینٹک ویکٹر انڈیکس تیار کرنا',
    throughputTps: 1450,
    latencyMs: 19,
    icon: 'Binary'
  },
  {
    id: 'agent-24',
    number: 24,
    name: 'Self-Learning Autonomous Weights Tuner',
    nameUrdu: 'خودکار لرننگ اور ویٹس ٹیونر ایجنٹ',
    role: 'Continuously updates model prompt weights based on user feedback',
    roleUrdu: 'لوگوں کی ان پٹ اور فیڈ بیک سے سسٹم کو خودکار اپ گریڈ کرنا',
    category: 'learning',
    status: 'idle',
    progress: 0,
    tasksCompleted: 5490,
    currentTask: 'Gradient descent recalculation on user prompt ratings',
    currentTaskUrdu: 'ماڈل کی خودکار بہتری اور سیکھنے کا عمل',
    throughputTps: 2600,
    latencyMs: 8,
    icon: 'BrainCircuit'
  },
  {
    id: 'agent-25',
    number: 25,
    name: 'Knowledge Graph & Memory Engine',
    nameUrdu: 'نالج گراف اور سسٹم میموری ایجنٹ',
    role: 'Stores historical architecture patterns to accelerate future 1-minute builds',
    roleUrdu: 'پچھلے کامیاب تجربات کو محفوظ رکھ کر اگلی بار کام مزید تیز کرنا',
    category: 'learning',
    status: 'idle',
    progress: 0,
    tasksCompleted: 5120,
    currentTask: 'Synthesizing graph relations from 4,800 past successful builds',
    currentTaskUrdu: 'میموری بینک میں نئے پیٹرنز کا اضافہ',
    throughputTps: 2350,
    latencyMs: 10,
    icon: 'Network'
  },
  {
    id: 'agent-26',
    number: 26,
    name: 'Customer Support API & Webhook Gateway',
    nameUrdu: 'کسٹمر سپورٹ اے پی آئی اور ویب ہک گیٹ وے',
    role: 'Exposes REST / Webhook endpoints for external customer queries',
    roleUrdu: 'ایپ کے باہر سے آنے والے سوالات اور چیٹ کا فوری جواب',
    category: 'support',
    status: 'idle',
    progress: 0,
    tasksCompleted: 6200,
    currentTask: 'Listening on /api/v1/support/webhook with 99.99% uptime',
    currentTaskUrdu: 'کسٹمر سپورٹ کے لیے 24 گھنٹے الرٹ رہنا',
    throughputTps: 2900,
    latencyMs: 7,
    icon: 'Headphones'
  },
  {
    id: 'agent-27',
    number: 27,
    name: 'Ticket Telemetry & Admin Escalation Agent',
    nameUrdu: 'ٹکٹ ٹیلی میٹری اور ایڈمن ڈیش بورڈ ایجنٹ',
    role: 'Feeds live customer issues and telemetry straight to Admin Cockpit',
    roleUrdu: 'کسٹمرز کے مسائل کو فوراً ایڈمن ڈیش بورڈ میں دکھانا',
    category: 'support',
    status: 'idle',
    progress: 0,
    tasksCompleted: 5800,
    currentTask: 'Streaming unresolved issues to dashboard with priority flags',
    currentTaskUrdu: 'ایڈمن اسکرین پر لائیو ٹکٹس کا بہاؤ',
    throughputTps: 2550,
    latencyMs: 9,
    icon: 'Bell'
  },
  {
    id: 'agent-28',
    number: 28,
    name: 'Autonomous Error Healer & Patch Synthesizer',
    nameUrdu: 'خودکار ایرر ہیلر اور پیچ سنسائزر',
    role: 'Detects build or runtime anomalies and automatically pushes hotfixes',
    roleUrdu: 'غلطیوں کو بغیر انسانی دخل کے خود ٹھیک کرنا',
    category: 'qa_security',
    status: 'idle',
    progress: 0,
    tasksCompleted: 4760,
    currentTask: 'Monitoring zero-unhandled-rejection safety thresholds',
    currentTaskUrdu: 'خودکار مرمت اور پیچز کی تیاری',
    throughputTps: 1980,
    latencyMs: 13,
    icon: 'Wrench'
  },
  {
    id: 'agent-29',
    number: 29,
    name: '100,000 Cluster Autoscaler & Sharder',
    nameUrdu: 'ایک لاکھ ایجنٹس کلسٹر اسکیلر اور شارڈر',
    role: 'Spins up to 100,000 concurrent agent pods with dynamic load distribution',
    roleUrdu: 'ایک لاکھ ایجنٹس تک کی صلاحیت اور لوڈ شیئرنگ کا کنٹرول',
    category: 'devops',
    status: 'idle',
    progress: 0,
    tasksCompleted: 6540,
    currentTask: 'Orchestrating 100,000 virtual agent threads across 6 global regions',
    currentTaskUrdu: 'ایک لاکھ ایجنٹس کے کلسٹر کو متحرک رکھنا',
    throughputTps: 3400,
    latencyMs: 5,
    icon: 'Server'
  },
  {
    id: 'agent-30',
    number: 30,
    name: 'Executive Sign-Off & Verification Seal',
    nameUrdu: 'ایگزیکٹو سائن آف اور فائنل تصدیق',
    role: 'Performs final autonomous audit, seals release, and produces live URL',
    roleUrdu: 'فائنل منظوری دے کر کسٹمر کو تیار ایپس اور ویب سائٹ حوالے کرنا',
    category: 'orchestration',
    status: 'idle',
    progress: 0,
    tasksCompleted: 5210,
    currentTask: 'Validating zero defects and stamping SHA-256 production seal',
    currentTaskUrdu: 'حتمی تصدیق اور لائیو ریلیز مہر',
    throughputTps: 2150,
    latencyMs: 11,
    icon: 'Award'
  }
];

export const INITIAL_NODES: ClusterNode[] = [
  { id: 'node-ap-south', name: 'AP-South-1 (Karachi / Mumbai)', region: 'South Asia', status: 'healthy', agentsRunning: 18400, capacityMax: 25000, cpuPercent: 38, memoryGb: 96 },
  { id: 'node-me-central', name: 'ME-Central-1 (Dubai / Riyadh)', region: 'Middle East', status: 'healthy', agentsRunning: 16200, capacityMax: 25000, cpuPercent: 32, memoryGb: 88 },
  { id: 'node-eu-west', name: 'EU-West-1 (Frankfurt / London)', region: 'Europe', status: 'healthy', agentsRunning: 21500, capacityMax: 25000, cpuPercent: 44, memoryGb: 112 },
  { id: 'node-us-east', name: 'US-East-1 (N. Virginia)', region: 'North America East', status: 'healthy', agentsRunning: 24100, capacityMax: 25000, cpuPercent: 51, memoryGb: 128 },
  { id: 'node-us-west', name: 'US-West-2 (Oregon)', region: 'North America West', status: 'healthy', agentsRunning: 14800, capacityMax: 25000, cpuPercent: 29, memoryGb: 74 },
  { id: 'node-ap-east', name: 'AP-East-1 (Singapore / Tokyo)', region: 'Asia Pacific', status: 'healthy', agentsRunning: 5000, capacityMax: 25000, cpuPercent: 19, memoryGb: 48 },
];

export const SAMPLE_PROMPTS = [
  {
    titleEn: 'Multi-Vendor E-Commerce Platform with Realtime Checkout',
    titleUrdu: 'ملٹی وینڈر ای کامرس پلیٹ فارم (لائیو شاپنگ اور آرڈرز)',
    promptEn: 'Create a full-stack eCommerce application for boutique clothing brands. Includes Web shop with product filter & cart, iOS SwiftUI checkout with Apple Pay simulation, Android Jetpack Compose buyer portal, Supabase database with RLS policies, and Vercel one-click edge deployment.',
    promptUrdu: 'کپڑوں کے برانڈ کے لیے ایک مکمل ای کامرس پلیٹ فارم بنائیں جس میں ویب سائٹ، آئی او ایس ایپ اور اینڈرائیڈ ایپ تینوں شامل ہوں۔ سپا بیس ڈیٹا بیس میں تمام آرڈرز اور سیکیورٹی پالیسیز ہوں اور ورسل پر لائیو ڈیپلائے ہو۔'
  },
  {
    titleEn: 'Telemedicine & Doctor Appointment Suite with Supabase Realtime',
    titleUrdu: 'ڈاکٹر اپائنٹمنٹ اور ٹیلی میڈیسن ہیلتھ کیئر سسٹم',
    promptEn: 'Build an autonomous Telemedicine platform for hospital clinics. Features patient booking on Web, doctor schedule view on iOS SwiftUI, prescription tracker on Android Kotlin, Supabase HIPAA-compliant RLS database, and instant Vercel global deployment.',
    promptUrdu: 'مریضوں اور ڈاکٹروں کے لیے ٹیلی میڈیسن پلیٹ فارم بنائیں جہاں مریض ویب اور موبائل ایپ سے وقت بک کر سکیں، سپا بیس میں ان کا میڈیکل ریکارڈ محفوظ ہو اور ورسل پر لائیو چلے۔'
  },
  {
    titleEn: 'Urdu & English Community Hub & Digital Media Portal',
    titleUrdu: 'اردو اور انگریزی ڈیجیٹل میڈیا اور نیوز پورٹل',
    promptEn: 'Design an ultra-fast news and podcast portal with native Urdu RTL Nastaliq layout and English toggle, native iOS audio player, Android offline-first reader, Supabase user comments with instant realtime push, deployed seamlessly to Vercel.',
    promptUrdu: 'ایک جدید ڈیجیٹل نیوز پورٹل جو خوبصورت اردو نستعلیق اور انگلش دونوں میں چلے، آئی او ایس اور اینڈرائیڈ ایپس کے ساتھ، سپا بیس میں لائیو کمنٹس ہوں اور ورسل پر فوری لائیو ہو۔'
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TICK-1092',
    customerName: 'Zahid Khan',
    customerEmail: 'zahid@techcraft.pk',
    promptTopic: 'Supabase RLS Policy Configuration',
    message: 'Can I add multi-tenant role-based access for store managers in the generated Supabase schema?',
    response: 'H.AI Support Agent automatically injected tenant_id constraints and created a custom "store_manager" role with restricted SELECT/UPDATE RLS in your database.sql file.',
    responseUrdu: 'ایچ ڈاٹ اے آئی سپورٹ ایجنٹ نے آپ کے سپا بیس ڈیٹا بیس میں ملٹی ٹیننٹ RLS پالیسی اور اسٹور منیجر کا رول خود بخود شامل کر دیا ہے۔',
    status: 'resolved',
    priority: 'medium',
    createdAt: '12 minutes ago',
    viaApiWebhook: true,
    origin: 'demo'
  },
  {
    id: 'TICK-1093',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah@fintechlab.io',
    promptTopic: 'SwiftUI iOS Apple Pay Integration',
    message: 'Does the generated iOS app support sandbox PassKit Apple Pay tokens?',
    response: 'Yes! The iOS Native Engineer agent included PassKit PKPaymentAuthorizationController stubs in PaymentSheet.swift ready for your merchant identifier.',
    responseUrdu: 'جی ہاں! آئی او ایس انجینئر ایجنٹ نے ایپل پے کے لیے مکمل PassKit فریم ورک کوڈ PaymentSheet.swift میں تیار کر دیا ہے۔',
    status: 'resolved',
    priority: 'high',
    createdAt: '34 minutes ago',
    viaApiWebhook: true,
    origin: 'demo'
  },
  {
    id: 'TICK-1094',
    customerName: 'Muhammad Bilal',
    customerEmail: 'm.bilal@appsol.com',
    promptTopic: 'Vercel Custom Domain DNS',
    message: 'How do I point my custom Godaddy domain to the generated Vercel edge deployment?',
    response: 'H.AI DNS provisioner has emitted CNAME cname.vercel-dns.com and A record 76.76.21.21. Once added, SSL will verify within 90 seconds automatically.',
    responseUrdu: 'ایچ ڈاٹ اے آئی ڈی این ایس ایجنٹ نے ضروری CNAME اور A ریکارڈز فراہم کر دیے ہیں، ڈومین شامل کرتے ہی ایس ایس ایل 90 سیکنڈ میں خودکار فعال ہو جائے گا۔',
    status: 'resolved',
    priority: 'low',
    createdAt: '1 hour ago',
    viaApiWebhook: false,
    origin: 'demo'
  }
];

export const INITIAL_LEARNING_METRICS: SelfLearningMetric[] = [
  { step: 101, timestamp: '10:00', lossRate: 0.142, accuracyRate: 98.2, rlhfScore: 4.88, knowledgeNodes: 14200, adaptationSummary: 'Optimized SwiftUI NavigationStack bindings for iOS 18', adaptationSummaryUrdu: 'آئی او ایس 18 کے لیے نیویگیشن بائنڈنگز کو خودکار بہتر بنایا گیا' },
  { step: 102, timestamp: '10:15', lossRate: 0.128, accuracyRate: 98.6, rlhfScore: 4.91, knowledgeNodes: 14500, adaptationSummary: 'Refined Supabase RLS generator to auto-guard private tables', adaptationSummaryUrdu: 'سپا بیس رو لیول سیکیورٹی رولز کو خودکار محفوظ ترین بنایا گیا' },
  { step: 103, timestamp: '10:30', lossRate: 0.115, accuracyRate: 98.9, rlhfScore: 4.93, knowledgeNodes: 14850, adaptationSummary: 'Accelerated Vercel Edge build bundling by 34%', adaptationSummaryUrdu: 'ورسل ایج بنڈلنگ کی رفتار 34 فیصد مزید تیز کر دی گئی' },
  { step: 104, timestamp: '10:45', lossRate: 0.098, accuracyRate: 99.2, rlhfScore: 4.96, knowledgeNodes: 15300, adaptationSummary: 'Ingested 420 customer prompts to enhance Urdu RTL typography', adaptationSummaryUrdu: 'صارفین کی 420 ان پٹس سے اردو نستعلیق ٹائپوگرافی کا خودکار اپ گریڈ' },
];

/**
 * Pure helper function to analyze prompt and extract title & entities
 */
export function analyzePrompt(prompt: string) {
  const p = prompt.toLowerCase();
  const isEcommerce = p.includes('shop') || p.includes('store') || p.includes('cart') || p.includes('commerce') || p.includes('دکان') || p.includes('خریداری') || p.includes('کپڑوں');
  const isHealthcare = p.includes('doctor') || p.includes('hospital') || p.includes('health') || p.includes('clinic') || p.includes('ڈاکٹر') || p.includes('ہسپتال') || p.includes('مریض');
  const isSocial = p.includes('chat') || p.includes('social') || p.includes('community') || p.includes('news') || p.includes('نیوز') || p.includes('خبریں') || p.includes('میڈیا');
  const isFood = p.includes('food') || p.includes('restaurant') || p.includes('burger') || p.includes('pizza') || p.includes('کھانا') || p.includes('پیزا') || p.includes('برگر');
  const isRealEstate = p.includes('property') || p.includes('estate') || p.includes('rent') || p.includes('house') || p.includes('پراپرٹی') || p.includes('مکان') || p.includes('زمین');
  const isRide = p.includes('ride') || p.includes('taxi') || p.includes('driver') || p.includes('uber') || p.includes('گاڑی') || p.includes('ٹیکسی') || p.includes('سفر');
  const isEducation = p.includes('course') || p.includes('school') || p.includes('academy') || p.includes('learn') || p.includes('تعلیم') || p.includes('کورس') || p.includes('اسکول');

  let projectName = 'H.AI Autonomous Cloud Suite';
  let category: 'ecommerce' | 'health' | 'social' | 'food' | 'realestate' | 'ride' | 'education' | 'saas' = 'saas';

  if (isEcommerce) {
    projectName = 'Boutique Luxe Multi-Store App';
    category = 'ecommerce';
  } else if (isHealthcare) {
    projectName = 'OmniCare Telehealth & Clinic Portal';
    category = 'health';
  } else if (isFood) {
    projectName = 'Craver Express Food & Delivery App';
    category = 'food';
  } else if (isRealEstate) {
    projectName = 'EstatePrime Luxury Properties Portal';
    category = 'realestate';
  } else if (isRide) {
    projectName = 'GoRide Swift Mobility & Taxi Suite';
    category = 'ride';
  } else if (isEducation) {
    projectName = 'EduVerse Interactive Learning Portal';
    category = 'education';
  } else if (isSocial) {
    projectName = 'NexusPulse Digital News & Social Feed';
    category = 'social';
  }

  return { projectName, category, isEcommerce, isHealthcare, isSocial, isFood, isRealEstate, isRide, isEducation };
}

export function getDomainItems(category: string) {
  switch (category) {
    case 'food':
      return [
        { id: 'item-1', title: 'اسپیشل کرسپی زنگر برگر', titleEn: 'Special Crispy Zinger Burger', price: 'Rs. 750', priceNum: 750, rating: 4.9, badge: 'Hot & Spicy', description: 'Freshly fried tender fillet with secret herb mayonnaise', descriptionUrdu: 'تازہ اور لذیذ کرسپی چکن برگر' },
        { id: 'item-2', title: 'اطالوی پاستا اور چیز پیزا', titleEn: 'Italian Creamy Cheese Pizza', price: 'Rs. 1,600', priceNum: 1600, rating: 5.0, badge: 'Chef Special', description: 'Wood-fired crust loaded with rich mozzarella', descriptionUrdu: 'اصلی اٹالین چیز اور لذیذ ٹاپنگز' },
        { id: 'item-3', title: 'شاہی مٹن دم بریانی', titleEn: 'Royal Shahi Mutton Dum Biryani', price: 'Rs. 950', priceNum: 950, rating: 4.8, badge: 'Traditional', description: 'Aromatic basmati rice cooked with saffron and spices', descriptionUrdu: 'زعفران اور خاص مصالحوں سے تیار شدہ بریانی' },
      ];
    case 'health':
      return [
        { id: 'item-1', title: 'ماہر امراض قلب سے ویڈیو مشاورت', titleEn: 'Cardiologist Video Consult', price: 'Rs. 3,500', priceNum: 3500, rating: 4.9, badge: 'Verified MD', description: '30-minute private telehealth session with HD video', descriptionUrdu: '30 منٹ کی آن لائن براہ راست ویڈیو کال' },
        { id: 'item-2', title: 'جنرل فزیشن چیک اپ بکنگ', titleEn: 'General Physician Booking', price: 'Rs. 1,500', priceNum: 1500, rating: 5.0, badge: 'Instant Slot', description: 'Comprehensive diagnostic review & digital prescription', descriptionUrdu: 'ڈیجیٹل نسخہ اور جامع معائنہ' },
        { id: 'item-3', title: 'ڈینٹل اور اورل کیئر اپائنٹمنٹ', titleEn: 'Dental & Oral Care Checkup', price: 'Rs. 2,000', priceNum: 2000, rating: 4.8, badge: 'Clinic Visit', description: 'Thorough teeth screening & digital X-ray scan', descriptionUrdu: 'دانتوں کا معائنہ اور صفائی' },
      ];
    case 'realestate':
      return [
        { id: 'item-1', title: '3 بیڈ لگژری پینٹ ہاؤس اپارٹمنٹ', titleEn: '3-Bed Luxury Penthouse Suite', price: 'Rs. 38,000,000', priceNum: 38000000, rating: 4.9, badge: 'Prime Location', description: 'Panoramic skyline view with modern smart automation', descriptionUrdu: 'شہر کے سب سے پرائم مقام پر جدید ترین اپارٹمنٹ' },
        { id: 'item-2', title: 'کمرشل شاپ اور آفس اسپیس', titleEn: 'Commercial High-Yield Office', price: 'Rs. 18,500,000', priceNum: 18500000, rating: 5.0, badge: 'High ROI', description: 'Turnkey executive floor ready for business lease', descriptionUrdu: 'کاروبار کے لیے بہترین منافع بخش جگہ' },
        { id: 'item-3', title: '1 کنال لگژری ڈیزائنر ولا', titleEn: '1-Kanal Designer Modern Villa', price: 'Rs. 65,000,000', priceNum: 65000000, rating: 4.9, badge: 'Exclusive', description: 'Spacious green lawn with private heated swimming pool', descriptionUrdu: 'خوبصورت لان اور پرائیویٹ پول کے ساتھ شاندار ولا' },
      ];
    case 'ride':
      return [
        { id: 'item-1', title: 'شہر کے اندر کوئیک رائیڈ (Mini)', titleEn: 'City Swift Mini Ride', price: 'Rs. 380', priceNum: 380, rating: 4.9, badge: '3 mins away', description: 'Fast and economical air-conditioned ride in town', descriptionUrdu: 'تیز ترین اور کم خرچ آرام دہ سفر' },
        { id: 'item-2', title: 'پریمیئم سیڈان (Business)', titleEn: 'Executive Comfort Sedan', price: 'Rs. 850', priceNum: 850, rating: 5.0, badge: 'Top Rated', description: 'Spacious luxury car with professional top driver', descriptionUrdu: 'اعلیٰ پائے کی پرتعیش گاڑی' },
        { id: 'item-3', title: 'ایئرپورٹ ایکسپریس ڈراپ', titleEn: 'Airport Express Transfer', price: 'Rs. 1,600', priceNum: 1600, rating: 4.8, badge: 'Scheduled', description: 'Guaranteed on-time pickup with large luggage space', descriptionUrdu: 'سامان کی گنجائش کے ساتھ وقت پر روانگی' },
      ];
    default:
      return [
        { id: 'item-1', title: 'پریمیئم رائل ایمبرائیڈرڈ سوٹ', titleEn: 'Royal Embroidered Silk Attire', price: 'Rs. 8,500', priceNum: 8500, rating: 4.9, badge: 'Best Seller', description: 'Handcrafted pure raw silk with intricate zardozi needlework', descriptionUrdu: 'خالص را سلک پر ہاتھ سے کی گئی زردوزی کڑھائی' },
        { id: 'item-2', title: 'کلاسک ہینڈ کرافٹڈ پشمینہ شال', titleEn: 'Handcrafted Heritage Pashmina', price: 'Rs. 12,000', priceNum: 12000, rating: 5.0, badge: 'Luxury', description: 'Pure authentic cashmere weave, ultra-soft and warm', descriptionUrdu: 'خالص کشمیری پشمینہ شال، نرم اور گرم' },
        { id: 'item-3', title: 'ماڈرن کیژول ڈیزائنر کُرتا', titleEn: 'Modern Casual Designer Kurta', price: 'Rs. 4,200', priceNum: 4200, rating: 4.8, badge: 'Trending', description: 'Breathable combed cotton tailored for festive elegance', descriptionUrdu: 'گرمیوں کے لیے انتہائی آرام دہ ڈیزائنر کُرتا' },
      ];
  }
}

export function generateAgentChatter(prompt: string) {
  const { projectName } = analyzePrompt(prompt);
  return [
    {
      id: 'chat-1',
      fromAgent: 'H.AI Orchestrator Prime (#1)',
      fromAgentUrdu: 'آرکسٹریٹر پرائم (#1)',
      toAgent: 'Prompt & Spec Architect (#2)',
      messageEn: `Parsed user requirements for "${projectName}". Dispatching blueprint schemas.`,
      messageUrdu: `صارف کے پرامپٹ کا جائزہ مکمل۔ ٹیکنیکل بلیو پرنٹ تیار کرنے کا حکم۔`,
      timestamp: '00:03',
      channel: 'spec' as const
    },
    {
      id: 'chat-2',
      fromAgent: 'Supabase Schema Architect (#11)',
      fromAgentUrdu: 'سپا بیس اسکیما آرکیٹیکٹ (#11)',
      toAgent: 'RLS Guardian (#12)',
      messageEn: 'Generated public.profiles and domain tables. Please apply auth.uid() zero-trust policies.',
      messageUrdu: 'ڈیٹا بیس ٹیبلز تیار ہیں۔ رو لیول سیکیورٹی (RLS) رولز نافذ کریں۔',
      timestamp: '00:18',
      channel: 'db' as const
    },
    {
      id: 'chat-3',
      fromAgent: 'SwiftUI Native Engineer (#6)',
      fromAgentUrdu: 'سوئفٹ یو آئی انجینئر (#6)',
      toAgent: 'Jetpack Compose Engineer (#8)',
      messageEn: 'Synchronized shared state DTOs with Supabase realtime broadcast channel.',
      messageUrdu: 'آئی او ایس اور اینڈرائیڈ دونوں کے لائیو سنک ماڈلز یکساں ہم آہنگ کر دیے گئے۔',
      timestamp: '00:34',
      channel: 'code' as const
    },
    {
      id: 'chat-4',
      fromAgent: 'Vercel Edge Deployer (#15)',
      fromAgentUrdu: 'ورسل ایج ڈیپلائر (#15)',
      toAgent: 'DNS & SSL Provisioner (#17)',
      messageEn: 'Edge bundles compiled. Initializing TLS 1.3 certificate across 34 global regions.',
      messageUrdu: 'ورسل پر بنڈلز تیار ہیں۔ عالمی سرورز پر SSL سرٹیفکیٹ ایکٹو کیا جا رہا ہے۔',
      timestamp: '00:52',
      channel: 'deploy' as const
    },
    {
      id: 'chat-5',
      fromAgent: 'Executive Sign-Off & Seal (#30)',
      fromAgentUrdu: 'ایگزیکٹو سائن آف (#30)',
      toAgent: 'All 30 Agents',
      messageEn: '0 flaws detected in automated smoke tests. Production seal approved and released live!',
      messageUrdu: 'تمام 30 ایجنٹس کے ٹیسٹ 100٪ کامیاب۔ پراجیکٹ لائیو ریلیز کے لیے منظور!',
      timestamp: '01:14',
      channel: 'audit' as const
    }
  ];
}

/**
 * Pure generator for synthetic project code deliverables across Web, iOS, Android, Supabase, Vercel
 */
export function generateProjectDeliverables(prompt: string): GeneratedProject {
  const { projectName, category } = analyzePrompt(prompt);
  const timestamp = new Date().toISOString();
  const slug = projectName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const deployUrl = `https://${slug}-hai.vercel.app`;
  const supabaseUrl = `https://${slug}.supabase.co`;

  // Supabase SQL DDL
  const databaseSql = `-- ========================================================
-- H.AI Autonomous Supabase Database Migration
-- Project: ${projectName}
-- Generated by: H.AI 30-Agent Autonomous Supercluster
-- Date: ${new Date().toLocaleDateString()}
-- Target: Supabase PostgreSQL 15+ with pgvector & RLS
-- ========================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Core Profiles Table linked to Supabase Auth
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'vendor', 'admin', 'doctor', 'patient')),
  preferred_locale TEXT DEFAULT 'ur',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Domain Specific Main Entities Table
CREATE TABLE IF NOT EXISTS public.app_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT '${category}',
  price_cents INTEGER DEFAULT 2500,
  currency TEXT DEFAULT 'PKR',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Transactions / Interactions / Orders Table
CREATE TABLE IF NOT EXISTS public.app_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.app_items(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 1200.00,
  platform_source TEXT DEFAULT 'web' CHECK (platform_source IN ('web', 'ios', 'android')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Enterprise Row-Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated can view public profiles; owners can update
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Items: Public catalog read access
CREATE POLICY "Anyone can view active items" ON public.app_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins or creators can insert items" ON public.app_items
  FOR ALL USING (auth.uid() = created_by OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'vendor')
  ));

-- Transactions: Strict Privacy (Users see only their transactions)
CREATE POLICY "Users view own transactions" ON public.app_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions" ON public.app_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.app_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.app_transactions;
`;

  // Web Code (React 19 + Tailwind CSS)
  const webComponent = `import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, Sparkles, Check, Shield, Globe } from 'lucide-react';

export default function GeneratedWebPortal() {
  const [locale, setLocale] = useState<'ur' | 'en'>('ur');
  const [cartCount, setCartCount] = useState(1);
  const [activeTab, setActiveTab] = useState('catalog');

  const items = [
    { id: 1, title: 'پریمیئم رائل ایمبرائیڈرڈ سوٹ', titleEn: 'Royal Embroidered Silk Attire', price: 'Rs. 8,500', tag: 'Best Seller', rating: 4.9 },
    { id: 2, title: 'کلاسک ہینڈ کرافٹڈ شال', titleEn: 'Handcrafted Heritage Pashmina', price: 'Rs. 12,000', tag: 'Luxury', rating: 5.0 },
    { id: 3, title: 'ماڈرن کیژول ڈیزائنر کُرتا', titleEn: 'Modern Casual Designer Kurta', price: 'Rs. 4,200', tag: 'Trending', rating: 4.8 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans" dir={locale === 'ur' ? 'rtl' : 'ltr'}>
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            H
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">${projectName}</h1>
            <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live on Vercel & Supabase
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setLocale(locale === 'ur' ? 'en' : 'ur')}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-medium hover:bg-slate-700 transition flex items-center gap-2"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            {locale === 'ur' ? 'English' : 'اردو'}
          </button>

          <button 
            onClick={() => setCartCount(c => c + 1)}
            className="relative px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{locale === 'ur' ? 'ٹوکری' : 'Cart'}</span>
            <span className="ml-1 px-1.5 py-0.2 bg-white text-indigo-900 rounded-full text-xs font-bold">{cartCount}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              {locale === 'ur' ? 'خودکار AI سے تیار کردہ ویب پورٹل' : 'Autonomously Generated Web Portal'}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {locale === 'ur' ? 'خوش آمدید! آپ کا پلیٹ فارم ایک منٹ میں لائیو ہو چکا ہے' : 'Welcome! Your Multiplatform App is Live in 1-2 Minutes'}
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              {locale === 'ur'
                ? 'ایچ ڈاٹ اے آئی کے 30 پروفیشنل ایجنٹس نے آپ کے پرامپٹ کو سمجھ کر ویب، آئی او ایس، اینڈرائیڈ ایپس اور سپا بیس ڈیٹا بیس مکمل تیار کر دی ہے۔'
                : 'H.AI 30 specialized agents decomposed your prompt into high-performance web and native mobile codebases with zero-config Supabase backend.'}
            </p>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition group space-y-4">
              <div className="h-44 rounded-xl bg-gradient-to-br from-slate-800 to-indigo-950/40 flex items-center justify-center p-4 relative">
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {item.tag}
                </span>
                <span className="text-slate-500 text-xs font-mono group-hover:scale-105 transition">Supabase Asset Storage</span>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {item.rating}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">Instant Sync</span>
                </div>
                <h3 className="font-semibold text-white text-base">
                  {locale === 'ur' ? item.title : item.titleEn}
                </h3>
                <p className="text-lg font-bold text-indigo-400 mt-2">{item.price}</p>
              </div>

              <button 
                onClick={() => setCartCount(c => c + 1)}
                className="w-full py-2.5 rounded-xl bg-slate-800 group-hover:bg-indigo-600 text-white font-medium text-sm transition flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{locale === 'ur' ? 'آرڈر کریں' : 'Quick Order'}</span>
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}`;

  // iOS Native SwiftUI Code
  const contentViewSwift = `// ========================================================
// H.AI 30-Agent Supercluster: iOS Native SwiftUI Code
// Generated for: ${projectName}
// Target: iOS 17+, iPadOS, visionOS
// ========================================================

import SwiftUI

@main
struct ${projectName.replace(/[^a-zA-Z0-9]/g, '')}App: App {
    @StateObject private var authViewModel = SupabaseAuthViewModel()

    var body: some Scene {
        WindowGroup {
            MainContentView()
                .environmentObject(authViewModel)
                .preferredColorScheme(.dark)
        }
    }
}

struct MainContentView: View {
    @State private var selectedTab = 0
    @State private var cartItemsCount = 1

    var body: some View {
        TabView(selection: $selectedTab) {
            HomeCatalogView(cartCount: $cartItemsCount)
                .tabItem {
                    Label("Explore", systemImage: "sparkles")
                }
                .tag(0)

            OrdersLiveView()
                .tabItem {
                    Label("Live Orders", systemImage: "bag.fill")
                }
                .tag(1)

            ProfileSecurityView()
                .tabItem {
                    Label("Account", systemImage: "person.crop.circle")
                }
                .tag(2)
        }
        .tint(.indigo)
    }
}

struct HomeCatalogView: View {
    @Binding var cartCount: Int
    @State private var items = [
        AppEntity(id: UUID(), title: "پریمیئم رائل سوٹ", price: "Rs. 8,500", category: "Apparel"),
        AppEntity(id: UUID(), title: "کلاسک پشمینہ شال", price: "Rs. 12,000", category: "Heritage"),
        AppEntity(id: UUID(), title: "ڈیزائنر کُرتا", price: "Rs. 4,200", category: "Casual")
    ]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // Hero Banner
                    ZStack(alignment: .bottomLeading) {
                        RoundedRectangle(cornerRadius: 24)
                            .fill(LinearGradient(colors: [.indigo.opacity(0.8), .black], startPoint: .topLeading, endPoint: .bottomTrailing))
                            .frame(height: 180)

                        VStack(alignment: .leading, spacing: 8) {
                            Text("H.AI Autonomous Engine")
                                .font(.caption.bold())
                                .padding(.horizontal, 10)
                                .padding(.vertical, 4)
                                .background(.ultraThinMaterial, in: Capsule())

                            Text("${projectName}")
                                .font(.title2.bold())
                                .foregroundColor(.white)

                            Text("Supabase Cloud Sync Active • 12ms Latency")
                                .font(.footnote)
                                .foregroundColor(.white.opacity(0.8))
                        }
                        .padding(20)
                    }

                    Text("Featured Collection")
                        .font(.headline)
                        .padding(.horizontal)

                    ForEach(items) { item in
                        HStack(spacing: 16) {
                            RoundedRectangle(cornerRadius: 16)
                                .fill(Color.gray.opacity(0.2))
                                .frame(width: 70, height: 70)
                                .overlay(
                                    Image(systemName: "app.fill")
                                        .foregroundColor(.indigo)
                                )

                            VStack(alignment: .leading, spacing: 4) {
                                Text(item.title)
                                    .font(.subheadline.bold())
                                Text(item.price)
                                    .font(.callout)
                                    .foregroundColor(.indigo)
                            }

                            Spacer()

                            Button(action: { cartCount += 1 }) {
                                Image(systemName: "plus.circle.fill")
                                    .font(.title2)
                                    .foregroundColor(.indigo)
                            }
                        }
                        .padding()
                        .background(Color(.secondarySystemBackground))
                        .cornerRadius(18)
                        .padding(.horizontal)
                    }
                }
                .padding(.vertical)
            }
            .navigationTitle("Storefront")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Text("\(cartCount)")
                        .font(.caption.bold())
                        .foregroundColor(.white)
                        .padding(8)
                        .background(Circle().fill(Color.indigo))
                }
            }
        }
    }
}

struct AppEntity: Identifiable {
    let id: UUID
    let title: String
    let price: String
    let category: String
}

class SupabaseAuthViewModel: ObservableObject {
    @Published var isAuthenticated = true
    @Published var userEmail = "customer@hai-platform.com"
}
`;

  // Android Jetpack Compose Code
  const mainActivityKt = `// ========================================================
// H.AI 30-Agent Supercluster: Android Kotlin Jetpack Compose
// Generated for: ${projectName}
// Target: Android SDK 35, Material 3, Coroutine StateFlow
// ========================================================

package com.hai.platform.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Star

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme(colorScheme = darkColorScheme(
                primary = Color(0xFF6366F1),
                background = Color(0xFF0F172A),
                surface = Color(0xFF1E293B)
            )) {
                Surface(modifier = Modifier.fillMaxSize()) {
                    AutonomousAppScreen()
                }
            }
        }
    }
}

data class ProductItem(val id: Int, val title: String, val price: String, val rating: Double)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AutonomousAppScreen() {
    var cartCount by remember { mutableStateOf(1) }
    val productList = remember {
        listOf(
            ProductItem(1, "پریمیئم رائل سوٹ", "Rs. 8,500", 4.9),
            ProductItem(2, "کلاسک پشمینہ شال", "Rs. 12,000", 5.0),
            ProductItem(3, "ڈیزائنر کُرتا", "Rs. 4,200", 4.8)
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("${projectName}", fontSize = 18.sp) },
                actions = {
                    BadgedBox(badge = { Badge { Text("$cartCount") } }) {
                        IconButton(onClick = { cartCount++ }) {
                            Icon(Icons.Filled.ShoppingCart, contentDescription = "Cart")
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF0B0F19),
                    titleContentColor = Color.White
                )
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                // Header Banner
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(140.dp)
                        .background(
                            brush = Brush.linearGradient(
                                colors = listOf(Color(0xFF4338CA), Color(0xFF0F172A))
                            ),
                            shape = RoundedCornerShape(20.dp)
                        )
                        .padding(16.dp),
                    contentAlignment = Alignment.CenterStart
                ) {
                    Column {
                        Text(
                            text = "H.AI Generated Android Suite",
                            color = Color(0xFF818CF8),
                            fontSize = 12.sp
                        )
                        Text(
                            text = "Supabase Realtime Synced",
                            color = Color.White,
                            fontSize = 20.sp,
                            style = MaterialTheme.typography.titleLarge
                        )
                        Text(
                            text = "Automatic RLS & Jetpack Compose MVVM",
                            color = Color(0xFF94A3B8),
                            fontSize = 12.sp
                        )
                    }
                }
            }

            items(productList) { item ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B))
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(text = item.title, color = Color.White, fontSize = 16.sp)
                            Text(text = item.price, color = Color(0xFF818CF8), fontSize = 14.sp)
                        }
                        Button(
                            onClick = { cartCount++ },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4F46E5))
                        ) {
                            Text("شامل کریں")
                        }
                    }
                }
            }
        }
    }
}
`;

  return {
    id: `hai-build-${Date.now()}`,
    name: projectName,
    prompt,
    timestamp,
    durationSeconds: 78, // Under 1.5 minutes! "1-2 minutes"
    platforms: {
      web: true,
      ios: true,
      android: true
    },
    supabase: {
      deployed: true,
      projectUrl: supabaseUrl,
      anonKey: `sbp_live_anon_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 10)}`,
      databaseSql,
      tables: [
        { name: 'profiles', rows: 1420, rlsEnabled: true },
        { name: 'app_items', rows: 840, rlsEnabled: true },
        { name: 'app_transactions', rows: 3200, rlsEnabled: true }
      ],
      edgeFunctions: ['process-checkout', 'sync-realtime-notifications', 'customer-ticket-ingest']
    },
    vercel: {
      deployed: true,
      deployUrl,
      buildTime: '1m 18s',
      region: 'iad1, hkg1, fra1 (Anycast)',
      sslActive: true,
      dnsRecords: ['A 76.76.21.21', 'CNAME cname.vercel-dns.com'],
      logs: [
        '[H.AI Vercel Deployer] Cloning repository synthetic AST...',
        '[H.AI Vercel Deployer] Installing React 19, Tailwind, Motion...',
        '[H.AI Vercel Deployer] Running static compilation & tree shaking: 48.2kb gzipped',
        '[H.AI Vercel Deployer] Connecting to Supabase project environment secrets...',
        '[H.AI Vercel Deployer] Edge functions deployed across 34 global regions',
        '[H.AI Vercel Deployer] Deployment completed in 78.4s. Status: Ready & Production Live'
      ]
    },
    code: {
      web: {
        framework: 'React 19 + Tailwind CSS + Vite',
        mainComponent: webComponent,
        appCss: '@import "tailwindcss";',
        packageJson: JSON.stringify({
          name: slug,
          version: '1.0.0',
          dependencies: {
            react: '^19.0.0',
            'react-dom': '^19.0.0',
            '@supabase/supabase-js': '^2.42.0',
            'lucide-react': '^0.450.0'
          }
        }, null, 2)
      },
      ios: {
        framework: 'SwiftUI 6 + Swift 6.0 (iOS 17+)',
        contentViewSwift,
        appSwift: `import SwiftUI\n\n// Entry point for ${projectName}`,
        podfile: `platform :ios, '17.0'\ntarget '${projectName.replace(/[^a-zA-Z0-9]/g, '')}' do\n  use_frameworks!\n  pod 'Supabase', '~> 2.0'\nend`
      },
      android: {
        framework: 'Kotlin 2.0 + Jetpack Compose (Material 3)',
        mainActivityKt,
        buildGradle: `plugins {\n    alias(libs.plugins.android.application)\n    alias(libs.plugins.kotlin.android)\n}\n\ndependencies {\n    implementation("io.github.jan-tennert.supabase:postgrest-kt:2.5.0")\n    implementation("androidx.compose.material3:material3:1.3.0")\n}`
      }
    },
    executiveDecisions: [
      {
        agentName: 'H.AI Orchestrator Prime',
        decision: 'Split execution into 6 concurrent pipelines: Web React, iOS SwiftUI, Android Compose, Supabase SQL, Vercel Edge, and QA Security scanner.',
        decisionUrdu: 'پورے کام کو 6 متوازی پائپ لائنز میں تقسیم کیا تاکہ 24 گھنٹے کا کام محض 1 سے 2 منٹ میں مکمل ہو سکے۔',
        timestamp: 'T+0.8s'
      },
      {
        agentName: 'Supabase RLS Guardian',
        decision: 'Enforced Zero-Trust Row-Level Security on public.app_transactions using auth.uid() scoping.',
        decisionUrdu: 'صارفین کے ذاتی ڈیٹا اور پیسوں کی حفاظت کے لیے سپا بیس پر زیرو ٹرسٹ RLS پالیسی نافذ کی گئی۔',
        timestamp: 'T+14.2s'
      },
      {
        agentName: 'SwiftUI & Jetpack Compose Agents',
        decision: 'Generated synchronized state representations so mobile apps share identical schema with Supabase realtime broadcast.',
        decisionUrdu: 'آئی او ایس اور اینڈرائیڈ دونوں ایپس میں لائیو ڈیٹا سنک کے ماڈلز کو یکساں مربوط کیا گیا۔',
        timestamp: 'T+38.6s'
      },
      {
        agentName: 'Vercel Edge Pipeline Deployer',
        decision: 'Provisioned instant Anycast edge routing with Let’s Encrypt wildcard certificate and enabled stale-while-revalidate headers.',
        decisionUrdu: 'ورسل کے گلوبل ایج نیٹ ورک پر محفوظ کنکشن کے ساتھ ایپ کو لائیو پبلش کر دیا گیا۔',
        timestamp: 'T+64.0s'
      },
      {
        agentName: 'Executive Sign-Off & Verification Seal',
        decision: 'Final integration audit passed: 0 vulnerabilities, 100% test coverage, SHA-256 seal verified.',
        decisionUrdu: 'تمام 30 ایجنٹس کی حتمی جانچ مکمل، ایپ مکمل لائیو اور کسٹمر کے حوالے کے لیے تیار ہے۔',
        timestamp: 'T+78.4s'
      }
    ]
  };
}

/**
 * Pure function to simulate customer support query processing
 */
export function handleSupportQuery(message: string): { responseEn: string; responseUrdu: string; category: string } {
  const m = message.toLowerCase();

  if (m.includes('supabase') || m.includes('database') || m.includes('ڈاؤن لوڈ') || m.includes('ڈیٹا بیس')) {
    return {
      responseEn: 'H.AI Support Agent: Your Supabase database is active with full Row-Level Security. You can copy the generated SQL migration directly into your Supabase SQL Editor, or test the anonKey connection.',
      responseUrdu: 'ایچ ڈاٹ اے آئی سپورٹ ایجنٹ: آپ کا سپا بیس ڈیٹا بیس مکمل تیار اور محفوظ ہے۔ آپ فراہم کردہ SQL مائیگریشن کوڈ کو براہ راست اپنے سپا بیس پر چلا سکتے ہیں۔',
      category: 'Supabase Database'
    };
  }

  if (m.includes('vercel') || m.includes('deploy') || m.includes('domain') || m.includes('لائیو') || m.includes('ڈومین')) {
    return {
      responseEn: 'H.AI Support Agent: The Vercel deployment pipeline finishes in under 2 minutes. Your edge URL is instantly accessible with automatic HTTPS and global caching.',
      responseUrdu: 'ایچ ڈاٹ اے آئی سپورٹ ایجنٹ: ورسل ڈیپلائمنٹ کا عمل 2 منٹ سے کم وقت میں مکمل ہو جاتا ہے اور آپ کی ویب سائٹ گلوبل فاسٹ سرورز پر لائیو ہو جاتی ہے۔',
      category: 'Vercel Deployment'
    };
  }

  if (m.includes('ios') || m.includes('swift') || m.includes('apple') || m.includes('آئی او ایس')) {
    return {
      responseEn: 'H.AI Support Agent: Native iOS SwiftUI files (ContentView.swift, App.swift, Podfile) have been packaged. You can open them directly in Xcode or build for TestFlight.',
      responseUrdu: 'ایچ ڈاٹ اے آئی سپورٹ ایجنٹ: آئی او ایس کے اصلی سوئفٹ یو آئی کوڈ فائلز مکمل تیار ہیں۔ آپ انہیں براہ راست ایکس کوڈ میں اوپن کر سکتے ہیں۔',
      category: 'iOS Mobile'
    };
  }

  if (m.includes('android') || m.includes('kotlin') || m.includes('اینڈرائیڈ')) {
    return {
      responseEn: 'H.AI Support Agent: Android Jetpack Compose code with Material 3 and Gradle configurations are generated and ready to compile into an APK or AAB bundle.',
      responseUrdu: 'ایچ ڈاٹ اے آئی سپورٹ ایجنٹ: اینڈرائیڈ کے لیے جیٹ پیک کمپوز اور کوٹلن فائلز تیار ہیں جنہیں آپ اینڈرائیڈ اسٹوڈیو میں براہ راست کمپائل کر سکتے ہیں۔',
      category: 'Android Mobile'
    };
  }

  return {
    responseEn: 'H.AI Support Agent: Thanks for reaching out — your question is saved. Share the app name and the step where you got stuck (build, files, deploy or preview) and a specialist will pick it up. For billing or account changes, ask for a human teammate.',
    responseUrdu: 'ایچ ڈاٹ اے آئی سپورٹ ایجنٹ: آپ کا سوال محفوظ کر لیا گیا ہے۔ ایپ کا نام اور وہ مرحلہ بتائیں جہاں مسئلہ آیا تاکہ سپیشلسٹ فوراً مدد کر سکے۔ بلنگ یا اکاؤنٹ کی تبدیلی کے لیے ہیومن ٹیم ممبر سے رابطہ کریں۔',
    category: 'General Support'
  };
}

/**
 * Pure calculation for 100k scaling cluster distribution
 */
export function calculateClusterMetrics(desiredAgentScale: number) {
  // desiredAgentScale can be from 30 up to 100,000
  const normalizedScale = Math.min(Math.max(desiredAgentScale, 30), 100000);
  const nodesCount = Math.max(6, Math.ceil(normalizedScale / 16000));
  const avgCpuPercent = Math.min(92, Math.round(15 + (normalizedScale / 100000) * 65));
  const totalMemoryGb = Math.round(32 + (normalizedScale / 100000) * 960);
  const aggregateThroughputTps = Math.round(normalizedScale * 35.8);
  const tasksPerMinute = Math.round(normalizedScale * 14.2);

  return {
    normalizedScale,
    nodesCount,
    avgCpuPercent,
    totalMemoryGb,
    aggregateThroughputTps,
    tasksPerMinute
  };
}

/**
 * 6 Core Subsystems of H.AI for Autonomous Self-Inspection and Self-Evolution
 */
export const INITIAL_DIAGNOSTIC_SUBSYSTEMS: SelfDiagnosticSubsystem[] = [
  {
    id: 'subsys-1',
    name: '30-Agent Synaptic Reasoning Matrix',
    nameUrdu: '30 خود مختار ایجنٹس کا سیناپٹک کور نیٹ ورک',
    status: 'healthy',
    integrityPct: 99.4,
    currentVersion: 'v4.8.4',
    lastScanned: 'Just now',
    detailsEn: 'Zero memory leaks detected across 30 concurrent agent worker pipelines. Latency: 14ms.',
    detailsUrdu: 'تمام 30 ایجنٹس میں میموری کے کوئی لیکیج نہیں، اوسط لیٹنسی 14 ملی سیکنڈ ہے۔'
  },
  {
    id: 'subsys-2',
    name: 'Multiplatform Code Compilers (React 19 / SwiftUI / Compose)',
    nameUrdu: 'ملٹی پلیٹ فارم کوڈ جنریٹرز اور کمپائلرز',
    status: 'patch_available',
    integrityPct: 97.8,
    currentVersion: 'v4.8.4',
    lastScanned: '2 mins ago',
    detailsEn: 'Patch candidate v4.9.0 available: +42% parallel build speedup for Swift 6 & Jetpack Compose AST synthesis.',
    detailsUrdu: 'نیا خودکار پیچ تیار: سوئفٹ 6 اور اینڈرائیڈ کمپوز کی تیاری میں 42 فیصد رفتار کا اضافہ۔'
  },
  {
    id: 'subsys-3',
    name: 'Supabase Vector & PostgreSQL RLS Engine',
    nameUrdu: 'سپابیس پوسٹگریس اور سیکیورٹی RLS انجن',
    status: 'healthy',
    integrityPct: 99.9,
    currentVersion: 'v4.8.4',
    lastScanned: '1 min ago',
    detailsEn: 'Row-Level Security rules verified against OWASP Top 10 API Security standard. 0 vulnerabilities.',
    detailsUrdu: 'ڈیٹا بیس کے سیکیورٹی قوانین OWASP معیار پر 100% پورا اترتے ہیں۔'
  },
  {
    id: 'subsys-4',
    name: 'Vercel Edge Global Routing & Let\'s Encrypt SSL',
    nameUrdu: 'ورسل ایج راؤٹنگ و گلوبل SSL ہینڈ شیک',
    status: 'healthy',
    integrityPct: 99.7,
    currentVersion: 'v4.8.4',
    lastScanned: '4 mins ago',
    detailsEn: 'Global Anycast edge nodes responding in <28ms worldwide. Dynamic TLS 1.3 encryption active.',
    detailsUrdu: 'دنیا بھر کے ورسل ایج سرورز پر لیٹنسی 28 ملی سیکنڈ سے کم ہے۔'
  },
  {
    id: 'subsys-5',
    name: 'Three.js 3D WebGL Multiplatform Hardware Stage',
    nameUrdu: '3D ویب جی ایل ہارڈویئر ڈسپلے انجن',
    status: 'patch_available',
    integrityPct: 96.5,
    currentVersion: 'v4.8.4',
    lastScanned: '3 mins ago',
    detailsEn: 'Buffer geometry optimization available: will reduce draw calls by 35% on mobile GPUs.',
    detailsUrdu: 'موبائل سکرینز پر 3D ماڈلز کی روانی اور پرفارمنس کے لیے گرافکس اپ گریڈ دستیاب ہے۔'
  },
  {
    id: 'subsys-6',
    name: 'Zero-Day Vulnerability & Self-Healing Sentinel',
    nameUrdu: 'خودکار سیکیورٹی سینٹینل و زیرو ڈے شیلڈ',
    status: 'healthy',
    integrityPct: 100,
    currentVersion: 'v4.8.4',
    lastScanned: 'Just now',
    detailsEn: 'Autonomous code mutation sandbox isolated. Realtime dependency integrity checksums: PASSED.',
    detailsUrdu: 'سسٹم کے اندرونی کوڈ کا خودکار سیکیورٹی چیک مکمل محفوظ ہے۔'
  }
];

/**
 * Historical record of self-applied autonomous updates to H.AI
 */
export const INITIAL_SELF_UPDATE_HISTORY: SelfUpdatePatch[] = [
  {
    id: 'patch-v484',
    version: 'v4.8.4',
    titleEn: 'Dynamic Supabase Tenant Isolation & Vector Indexing',
    titleUrdu: 'سپابیس ٹیننٹ آئسولیشن اور ویکٹر انڈیکسنگ اپ ڈیٹ',
    descriptionEn: 'H.AI autonomously patched its database generator to enforce stricter multi-tenant isolation policies and pgvector HNSW indexing.',
    descriptionUrdu: 'ایچ ڈاٹ اے آئی نے اپنے ڈیٹا بیس جنریٹر کو ملٹی ٹیننٹ RLS پالیسیوں کے ساتھ خودکار اپ ڈیٹ کیا۔',
    category: 'kernel',
    subsystem: 'Supabase Vector & PostgreSQL RLS Engine',
    timestamp: '2 hours ago',
    status: 'applied',
    impactMetrics: {
      speedupPct: 24,
      memoryReductionPct: 14,
      accuracyDelta: 0.18,
      latencyMsDelta: -6
    },
    codeDiffs: [
      {
        file: 'src/utils/orchestrator.ts',
        oldVersion: 'v4.8.3',
        newVersion: 'v4.8.4',
        diffLines: [
          { type: 'context', code: '  create policy "Users can only read own data" on public.profiles', lineNum: 112 },
          { type: 'remove', code: '-   for select using ( auth.role() = \'authenticated\' );', lineNum: 113 },
          { type: 'add', code: '+   for select using ( (select auth.uid()) = id );', lineNum: 113 },
          { type: 'add', code: '+   create index if not exists idx_hnsw_embedding on public.vectors using hnsw (embedding vector_cosine_ops);', lineNum: 114 },
          { type: 'context', code: '  alter table public.profiles force row level security;', lineNum: 115 }
        ]
      }
    ],
    changelogEn: [
      'Enforced row-level security policy with explicit UID validation',
      'Integrated HNSW pgvector indexing for sub-millisecond semantic search',
      'Automated schema migration dry-runs before deployment'
    ],
    changelogUrdu: [
      'ڈیٹا بیس کے RLS قوانین میں صارف کی خودکار تصدیق کا اضافہ',
      'فاسٹ سیمنٹک سرچ کے لیے HNSW انڈیکسنگ فعال',
      'ڈیپلائمنٹ سے قبل اسکیما کی خودکار ویلیڈیشن'
    ]
  },
  {
    id: 'patch-v483',
    version: 'v4.8.3',
    titleEn: 'Three.js 3D WebGL Instanced Buffering & Orbit Throttle',
    titleUrdu: '3D ویب جی ایل ہارڈویئر بفرز کی اصلاح اور اسپیڈ بوسٹ',
    descriptionEn: 'Autonomously optimized Three.js vertex shaders and device render loops to maintain stable 60 FPS on low-power devices.',
    descriptionUrdu: 'سسٹم نے اپنے 3D ویو پورٹ کے شیڈرز اور بفرز کو کم طاقت والے موبائلز کے لیے خودکار بہتر بنایا۔',
    category: 'infrastructure',
    subsystem: 'Three.js 3D WebGL Multiplatform Hardware Stage',
    timestamp: '6 hours ago',
    status: 'applied',
    impactMetrics: {
      speedupPct: 35,
      memoryReductionPct: 28,
      accuracyDelta: 0.05,
      latencyMsDelta: -11
    },
    codeDiffs: [
      {
        file: 'src/components/ThreeDeviceShowcase.tsx',
        oldVersion: 'v4.8.2',
        newVersion: 'v4.8.3',
        diffLines: [
          { type: 'context', code: '  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });', lineNum: 48 },
          { type: 'remove', code: '- renderer.setPixelRatio(window.devicePixelRatio);', lineNum: 49 },
          { type: 'add', code: '+ renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));', lineNum: 49 },
          { type: 'add', code: '+ renderer.powerPreference = "high-performance";', lineNum: 50 },
          { type: 'context', code: '  renderer.shadowMap.enabled = true;', lineNum: 51 }
        ]
      }
    ],
    changelogEn: [
      'Clamped pixel ratio to 2.0 to eliminate GPU thermal throttling',
      'Added high-performance power preference for discrete GPUs',
      'Pruned redundant Three.js ambient light passes'
    ],
    changelogUrdu: [
      'موبائل بیٹری بچانے اور حرارت روکنے کے لیے پکسل ریشو کو بہترین حد پر رکھا گیا',
      'طاقتور جی پی یو پر ڈسپلے کی رفتار کو دوگنا کیا گیا',
      'غیر ضروری لائٹ رینڈرنگ کو ہٹا کر رفتار بڑھائی گئی'
    ]
  }
];

/**
 * Candidates ready to be autonomously generated and installed by H.AI
 */
export const AVAILABLE_SELF_UPDATE_CANDIDATES: SelfUpdatePatch[] = [
  {
    id: 'patch-v490',
    version: 'v4.9.0-NEURAL',
    titleEn: 'Distributed Synapse Channel for 30-Agent Parallelism',
    titleUrdu: '30 ایجنٹس کے لیے زیرو کاپی ڈسٹری بیوٹڈ سنکرونائزر',
    descriptionEn: 'Replaces synchronous task sequencing with non-blocking zero-copy memory pipelines across all 30 agents, reducing synthesis time to <65 seconds.',
    descriptionUrdu: 'تمام 30 ایجنٹس کے درمیان ڈیٹا کے تبادلے کو بغیر کسی رکاوٹ کے تیز ترین میموری چینل میں تبدیل کر کے مکمل ایپ کی تیاری 65 سیکنڈ تک لاتا ہے۔',
    category: 'agents',
    subsystem: '30-Agent Synaptic Reasoning Matrix',
    timestamp: 'Candidate Ready',
    status: 'staging',
    impactMetrics: {
      speedupPct: 42,
      memoryReductionPct: 22,
      accuracyDelta: 0.25,
      latencyMsDelta: -18
    },
    codeDiffs: [
      {
        file: 'src/utils/orchestrator.ts',
        oldVersion: 'v4.8.4',
        newVersion: 'v4.9.0',
        diffLines: [
          { type: 'context', code: '  // Synchronous agent worker loops', lineNum: 91 },
          { type: 'remove', code: '- const stepResults = await executeSequentialAgentTasks(agents);', lineNum: 92 },
          { type: 'add', code: '+ const synapseBus = new DistributedAgentSynapseChannel(30, { zeroCopy: true });', lineNum: 92 },
          { type: 'add', code: '+ const stepResults = await synapseBus.broadcastParallelFanOut(agents);', lineNum: 93 },
          { type: 'context', code: '  return aggregateArtifacts(stepResults);', lineNum: 94 }
        ]
      }
    ],
    changelogEn: [
      'Upgraded inter-agent message broker from sequential to zero-copy broadcast',
      'Reduced average multiplatform build time from 84s to 62s',
      'Added speculative parallel branch execution for iOS SwiftUI and Android Compose'
    ],
    changelogUrdu: [
      'ایجنٹس کے باہمی رابطے کو سیکوئنشل سے زیرو کاپی براڈکاسٹ پر منتقل کیا گیا',
      'ایپ تیاری کا وقت 84 سیکنڈ سے گھٹا کر 62 سیکنڈ کر دیا گیا',
      'آئی او ایس اور اینڈرائیڈ دونوں کا کوڈ بیک وقت متوازی تیار کرنے کی صلاحیت'
    ]
  },
  {
    id: 'patch-v500',
    version: 'v5.0.0-PRO',
    titleEn: 'Multiplatform Code Engine 5.0 (React 19 RSC + SwiftUI 6 Macros)',
    titleUrdu: 'ملٹی پلیٹ فارم کوڈ انجن 5.0 (ری ایکٹ 19 و سوئفٹ یو آئی 6)',
    descriptionEn: 'Deep architectural upgrade enabling React Server Components and native Swift 6 observation macros in generated artifacts.',
    descriptionUrdu: 'جنریٹ ہونے والے ایپس میں ری ایکٹ 19 سرور کمپوننٹس اور سوئفٹ 6 کے جدید میکروز کی مکمل خودکار سپورٹ۔',
    category: 'compiler',
    subsystem: 'Multiplatform Code Compilers (React 19 / SwiftUI / Compose)',
    timestamp: 'Candidate Ready',
    status: 'staging',
    impactMetrics: {
      speedupPct: 56,
      memoryReductionPct: 31,
      accuracyDelta: 0.42,
      latencyMsDelta: -25
    },
    codeDiffs: [
      {
        file: 'src/utils/orchestrator.ts',
        oldVersion: 'v4.9.0',
        newVersion: 'v5.0.0',
        diffLines: [
          { type: 'context', code: '  // React web artifact compilation', lineNum: 160 },
          { type: 'remove', code: '- const webCode = generateClientOnlyReactTree(spec);', lineNum: 161 },
          { type: 'add', code: '+ const webCode = generateReact19RscWithServerActions(spec, { suspense: true });', lineNum: 161 },
          { type: 'add', code: '+ const swiftCode = generateSwift6ObservableMacros(spec);', lineNum: 162 },
          { type: 'context', code: '  return { webCode, swiftCode };', lineNum: 163 }
        ]
      }
    ],
    changelogEn: [
      'Integrated React 19 RSC generator with seamless streaming boundaries',
      'Swift 6 @Observable macro generation replacing legacy ObservableObject',
      'Android Jetpack Compose 1.7 baseline profile optimizations'
    ],
    changelogUrdu: [
      'ری ایکٹ 19 کے جدید سرور کمپوننٹس کی خودکار کوڈنگ',
      'سوئفٹ 6 کے نئے اور تیز رفتار میکروز کی شمولیت',
      'اینڈرائیڈ ایپس کے لیے کمپوز 1.7 بیس لائن پروفائلز'
    ]
  }
];

/**
 * Pure function: Run simulated or real self-diagnostic scan on H.AI subsystems
 */
export function runSelfDiagnosticScan(currentSubsystems: SelfDiagnosticSubsystem[] = INITIAL_DIAGNOSTIC_SUBSYSTEMS): SelfDiagnosticSubsystem[] {
  return currentSubsystems.map(sub => {
    const isPatchAvailable = sub.status === 'patch_available';
    const randomVariation = +(Math.random() * 0.4 - 0.2).toFixed(2);
    const newIntegrity = Math.min(100, Math.max(94, +(sub.integrityPct + randomVariation).toFixed(1)));
    
    return {
      ...sub,
      integrityPct: newIntegrity,
      lastScanned: 'Just now',
      status: isPatchAvailable ? 'patch_available' : 'healthy'
    };
  });
}

/**
 * Pure function: Apply an autonomous self-update patch to H.AI
 */
export function applySelfUpdatePatch(
  patchId: string, 
  currentHistory: SelfUpdatePatch[],
  subsystems: SelfDiagnosticSubsystem[]
): {
  updatedHistory: SelfUpdatePatch[];
  updatedSubsystems: SelfDiagnosticSubsystem[];
  newSystemVersion: string;
  appliedPatch: SelfUpdatePatch | undefined;
} {
  const candidate = AVAILABLE_SELF_UPDATE_CANDIDATES.find(p => p.id === patchId) || currentHistory.find(p => p.id === patchId);
  
  if (!candidate) {
    return {
      updatedHistory: currentHistory,
      updatedSubsystems: subsystems,
      newSystemVersion: currentHistory[0]?.version || 'v4.8.4',
      appliedPatch: undefined
    };
  }

  const activatedPatch: SelfUpdatePatch = {
    ...candidate,
    status: 'applied',
    timestamp: 'Just now'
  };

  const updatedHistory = [
    activatedPatch,
    ...currentHistory.filter(p => p.id !== patchId)
  ];

  const updatedSubsystems = subsystems.map(sub => {
    if (sub.name.toLowerCase().includes(candidate.category) || sub.name === candidate.subsystem) {
      return {
        ...sub,
        status: 'updated' as const,
        currentVersion: candidate.version,
        integrityPct: 99.9,
        lastScanned: 'Just now'
      };
    }
    return sub;
  });

  return {
    updatedHistory,
    updatedSubsystems,
    newSystemVersion: candidate.version,
    appliedPatch: activatedPatch
  };
}

/**
 * Pure function: Rollback an applied self-update patch
 */
export function rollbackSelfUpdatePatch(
  patchId: string,
  currentHistory: SelfUpdatePatch[],
  subsystems: SelfDiagnosticSubsystem[]
): {
  updatedHistory: SelfUpdatePatch[];
  updatedSubsystems: SelfDiagnosticSubsystem[];
  currentVersion: string;
} {
  const updatedHistory = currentHistory.map(p => {
    if (p.id === patchId) {
      return { ...p, status: 'rolled_back' as const };
    }
    return p;
  });

  const nextActive = updatedHistory.find(p => p.status === 'applied');
  const targetVersion = nextActive ? nextActive.version : 'v4.8.2';

  const updatedSubsystems = subsystems.map(sub => {
    return {
      ...sub,
      status: 'healthy' as const,
      currentVersion: targetVersion,
      lastScanned: 'Just now'
    };
  });

  return {
    updatedHistory,
    updatedSubsystems,
    currentVersion: targetVersion
  };
}
