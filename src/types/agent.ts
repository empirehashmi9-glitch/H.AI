export type Language = 'en' | 'ur';

export type AgentCategory = 
  | 'orchestration'
  | 'architecture'
  | 'frontend'
  | 'mobile'
  | 'backend'
  | 'devops'
  | 'qa_security'
  | 'learning'
  | 'support';

export interface SpecializedAgent {
  id: string;
  number: number;
  name: string;
  nameUrdu: string;
  role: string;
  roleUrdu: string;
  category: AgentCategory;
  status: 'idle' | 'analyzing' | 'synthesizing' | 'reviewing' | 'deployed' | 'optimizing' | 'paused';
  progress: number;
  tasksCompleted: number;
  currentTask: string;
  currentTaskUrdu: string;
  lastResult?: string;
  lastResultAt?: string;
  throughputTps: number;
  latencyMs: number;
  icon: string;
}

export interface GeneratedProject extends GeneratedProjectV5Meta {
  id: string;
  name: string;
  prompt: string;
  timestamp: string;
  durationSeconds: number;
  platforms: {
    web: boolean;
    ios: boolean;
    android: boolean;
  };
  supabase: {
    deployed: boolean;
    projectUrl: string;
    anonKey: string;
    databaseSql: string;
    tables: { name: string; rows: number; rlsEnabled: boolean }[];
    edgeFunctions: string[];
  };
  vercel: {
    deployed: boolean;
    deployUrl: string;
    buildTime: string;
    region: string;
    sslActive: boolean;
    dnsRecords: string[];
    logs: string[];
  };
  code: {
    web: {
      framework: string;
      mainComponent: string;
      appCss: string;
      packageJson: string;
    };
    ios: {
      framework: string;
      contentViewSwift: string;
      appSwift: string;
      podfile: string;
    };
    android: {
      framework: string;
      mainActivityKt: string;
      buildGradle: string;
    };
  };
  executiveDecisions: {
    agentName: string;
    decision: string;
    decisionUrdu: string;
    timestamp: string;
  }[];
}

export interface SelfLearningMetric {
  step: number;
  timestamp: string;
  lossRate: number;
  accuracyRate: number;
  rlhfScore: number;
  knowledgeNodes: number;
  adaptationSummary: string;
  adaptationSummaryUrdu: string;
}

export interface AgentChatterMessage {
  id: string;
  fromAgent: string;
  fromAgentUrdu: string;
  toAgent: string;
  messageEn: string;
  messageUrdu: string;
  timestamp: string;
  channel: 'spec' | 'code' | 'db' | 'deploy' | 'audit';
}

export interface InteractiveItem {
  id: string;
  title: string;
  titleEn: string;
  price: string;
  priceNum: number;
  category: string;
  categoryUrdu: string;
  rating: number;
  badge: string;
  description: string;
  descriptionUrdu: string;
}

export interface SupportTicket {
  id: string;
  customerName: string;
  customerEmail: string;
  promptTopic: string;
  message: string;
  response: string;
  responseUrdu: string;
  status: 'resolved' | 'pending' | 'escalated';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  viaApiWebhook: boolean;
  origin?: 'customer' | 'demo';
}

export interface ClusterNode {
  id: string;
  name: string;
  region: string;
  status: 'healthy' | 'warning' | 'standby';
  agentsRunning: number;
  capacityMax: number;
  cpuPercent: number;
  memoryGb: number;
}

export interface SelfUpdateCodeDiff {
  file: string;
  oldVersion: string;
  newVersion: string;
  diffLines: {
    type: 'add' | 'remove' | 'context';
    code: string;
    lineNum?: number;
  }[];
}

export interface SelfUpdatePatch {
  id: string;
  version: string;
  titleEn: string;
  titleUrdu: string;
  descriptionEn: string;
  descriptionUrdu: string;
  category: 'kernel' | 'agents' | 'compiler' | 'security' | 'neural' | 'infrastructure';
  subsystem: string;
  timestamp: string;
  status: 'applied' | 'pending' | 'staging' | 'rolled_back';
  impactMetrics: {
    speedupPct: number;
    memoryReductionPct: number;
    accuracyDelta: number;
    latencyMsDelta: number;
  };
  codeDiffs: SelfUpdateCodeDiff[];
  changelogEn: string[];
  changelogUrdu: string[];
}

export interface SelfDiagnosticSubsystem {
  id: string;
  name: string;
  nameUrdu: string;
  status: 'healthy' | 'optimizing' | 'patch_available' | 'updated';
  integrityPct: number;
  currentVersion: string;
  lastScanned: string;
  detailsEn: string;
  detailsUrdu: string;
}

export interface SelfUpdateSettings {
  autoUpdateEnabled: boolean;
  updateFrequency: 'continuous' | 'hourly' | 'daily' | 'on_vulnerability';
  requireHumanApproval: boolean;
  canaryRolloutPct: number;
  autoRollbackOnFailure: boolean;
}


/* ------------------------------------------------------------------ */
/* v5 — Real AI build platform types                                   */
/* ------------------------------------------------------------------ */

export type BuildSource = 'ai' | 'demo';
export type ProjectStatus = 'ready' | 'deploying' | 'live' | 'failed';
export type FileLanguage = 'tsx' | 'ts' | 'css' | 'json' | 'html' | 'swift' | 'kotlin' | 'sql' | 'md' | 'gradle' | 'xml' | 'yaml' | 'txt';

export interface GeneratedFile {
  path: string;
  language: FileLanguage;
  content: string;
  bytes: number;
}

export interface BuildSpec {
  name: string;
  tagline: string;
  category: string;
  summary: string;
  targetUsers: string[];
  features: { title: string; description: string }[];
  screens: string[];
  dataModels: {
    name: string;
    description: string;
    columns: { name: string; type: string; note?: string }[];
    rls: string[];
  }[];
  design: { primary: string; accent: string; surface: string; style: string };
  stack: { web: string; ios: string; android: string; backend: string };
  platforms: { web: boolean; ios: boolean; android: boolean };
  estimatedWeeks: number;
  risks: string[];
}

export interface DeployResult {
  provider: 'vercel' | 'supabase';
  status: 'success' | 'failed' | 'skipped' | 'needs_credentials' | 'running';
  url?: string;
  message: string;
  logs: string[];
  at: string;
}

export interface QualityCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface ProjectRevision {
  id: string;
  version: number;
  instruction: string;
  summary: string;
  at: string;
  source?: 'ai' | 'local';
}

export interface GeneratedProjectV5Meta {
  spec?: BuildSpec;
  files?: GeneratedFile[];
  previewHtml?: string;
  source?: BuildSource;
  aiModel?: string;
  status?: ProjectStatus;
  deploys?: Partial<Record<'vercel' | 'supabase', DeployResult>>;
  quality?: QualityCheck[];
  warnings?: string[];
  isSeed?: boolean;
  rating?: number;
  revisions?: ProjectRevision[];
}

export interface AppSettings {
  geminiKey: string;
  model: string;
  vercelToken: string;
  supabaseToken: string;
  supabaseProjectRef: string;
  autoDeploy: boolean;
  learningEnabled: boolean;
}

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  at: string;
  pending?: boolean;
  error?: boolean;
}

export interface LearningFeedback {
  id: string;
  projectId: string;
  projectName: string;
  rating: number;
  category: string;
  comment: string;
  at: string;
}

export interface BuildStageEvent {
  stage: 'plan' | 'web' | 'ios' | 'android' | 'backend' | 'assemble' | 'deploy' | 'done';
  progress: number;
  messageEn: string;
  messageUrdu: string;
  detail?: string;
}
