import { AppSettings } from '../types/agent';

export const APP_NAME = 'H.AI';
export const APP_VERSION = 'v6.0.0';

export const GEMINI_MODELS = [
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', note: 'Fastest · recommended for full-stack builds' },
  { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', note: 'Deepest reasoning · slower, higher quality' },
  { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite', note: 'Cheapest · good for chat + support' },
];

export const DEFAULT_SETTINGS: AppSettings = {
  geminiKey: '',
  model: 'gemini-2.5-flash',
  vercelToken: '',
  supabaseToken: '',
  supabaseProjectRef: '',
  autoDeploy: false,
  learningEnabled: true,
};

export const STORAGE_KEYS = {
  settings: 'settings',
  projects: 'projects',
  tickets: 'tickets',
  feedback: 'feedback',
  chat: 'chat',
  activeProject: 'active-project',
  theme: 'theme',
  language: 'language',
  clusterScale: 'cluster-scale',
  learningMetrics: 'learning-metrics',
  mode: 'world-mode',
} as const;
