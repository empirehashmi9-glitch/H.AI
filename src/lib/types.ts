export type Platform = 'web' | 'ios' | 'android' | 'backend';

export interface SpecialistAgent {
  id: string;
  codename: string;
  name: string;
  role: string;
  squad: 'Strategy & Spec' | 'UI & UX Design' | 'Full-Stack Code' | 'Database & API' | 'QA & DevOps';
  avatarColor: string;
  status: 'idle' | 'analyzing' | 'coding' | 'verifying' | 'complete' | 'failed' | 'evolving';
  currentTask: string;
  progress: number;
  outputSummary?: string;
  logs: string[];
  evolutionLevel: string; // e.g. "Gen-5 Singularity"
  selfLearningScore: number; // e.g. 99.8
  autonomousCapabilities: string[];
}

export interface GeneratedFile {
  path: string;
  language: string;
  content: string;
  platform: Platform;
  description: string;
}

export interface GeneratedApp {
  id: string;
  name: string;
  prompt: string;
  description: string;
  createdAt: number;
  platforms: Platform[];
  files: GeneratedFile[];
  previewHtml: string;
  supabaseSql: string;
  deploymentUrl?: string;
  stats: {
    totalTokens: number;
    generationTimeMs: number;
    agentsUsed: number;
    linesOfCode: number;
    evolutionEpoch?: string;
  };
}

export interface AICompetitor {
  id: string;
  name: string;
  provider: string;
  hardware: string;
  tagline: string;
  tokensPerSec: number;
  ttftMs: number;
  appBuildTimeSec: number;
  multiPlatformSupport: boolean;
  autonomousAgents: number;
  costPerMillionTokens: number;
  sweBenchScore: number;
  pros: string[];
  cons: string[];
  color: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timestamp: string;
  actionSuggested?: string;
}

export interface EvolutionCycle {
  epoch: number;
  name: string;
  iqMultiplier: string;
  mutationType: string;
  optimizationsApplied: string[];
  timestamp: string;
}
