import { createContext, useContext } from 'react';
import {
  AppSettings,
  BuildStageEvent,
  GeneratedProject,
  LearningFeedback,
  SpecializedAgent,
  SupportTicket,
} from '../types/agent';

export type Mode = 'landing' | 'customer' | 'admin';
export type Platforms = { web: boolean; ios: boolean; android: boolean };
export type Setter<T> = (next: T | ((prev: T) => T)) => void;

export interface AppStore {
  mode: Mode;
  setMode: (mode: Mode) => void;

  settings: AppSettings;
  setSettings: Setter<AppSettings>;
  aiLive: boolean;

  projects: GeneratedProject[];
  tickets: SupportTicket[];
  feedback: LearningFeedback[];
  agents: SpecializedAgent[];

  clusterScale: number;
  setClusterScale: Setter<number>;

  activeProject: GeneratedProject | null;
  activeProjectId: string;
  openProject: (id: string) => void;
  pendingOpen: boolean;
  consumeOpen: () => void;

  generating: boolean;
  progress: number;
  stage: BuildStageEvent['stage'] | 'idle';
  stageMessage: string;
  elapsed: number;
  generate: (prompt: string, platforms: Platforms) => Promise<GeneratedProject | null>;
  cancel: () => void;

  refiningId: string | null;
  refine: (projectId: string, instruction: string) => Promise<GeneratedProject | null>;

  updateProject: (id: string, patch: Partial<GeneratedProject>) => void;
  deleteProject: (id: string) => void;
  updateAgent: (id: string, patch: Partial<SpecializedAgent>) => void;
  assignTask: (agentId: string, task: string) => Promise<void>;
  addFeedback: (fb: LearningFeedback) => void;
  addTicket: (ticket: SupportTicket) => void;
  updateTicket: (id: string, patch: Partial<SupportTicket>) => void;

  clearData: () => void;
  importData: (payload: { projects?: unknown; tickets?: unknown; feedback?: unknown }) => void;
}

export const AppCtx = createContext<AppStore | null>(null);

export function useApp(): AppStore {
  const value = useContext(AppCtx);
  if (!value) throw new Error('useApp must be used inside <AppCtx.Provider>');
  return value;
}
