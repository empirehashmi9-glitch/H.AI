import { AICompetitor } from './types';

export const AI_COMPETITORS: AICompetitor[] = [
  {
    id: 'industry-gpu',
    name: 'Traditional Cloud GPU Cluster',
    provider: 'Standard Open Foundation Model on H100',
    hardware: 'Nvidia H100 Tensor Core GPU (SXM5 80GB HBM3)',
    tagline: 'Standard baseline GPU single-stream cloud inference',
    tokensPerSec: 150,
    ttftMs: 380,
    appBuildTimeSec: 180,
    multiPlatformSupport: false,
    autonomousAgents: 1,
    costPerMillionTokens: 0.90,
    sweBenchScore: 37.5,
    pros: [
      'Standard industry baseline for cloud-hosted open models',
      'Reliable single-token output'
    ],
    cons: [
      'Sequential single-stream bottleneck (~150 tps)',
      'Takes 3+ minutes to generate multi-platform code'
    ],
    color: '#64748B'
  },
  {
    id: 'cerebras-cs3',
    name: 'Wafer-Scale Silicon Engine CS-3',
    provider: 'Cerebras Systems',
    hardware: 'Wafer-Scale Engine 3 (900,000 cores, 44GB on-chip SRAM)',
    tagline: 'World champion in single silicon chip speed (~2,000 tps)',
    tokensPerSec: 2000,
    ttftMs: 65,
    appBuildTimeSec: 45,
    multiPlatformSupport: false,
    autonomousAgents: 1,
    costPerMillionTokens: 0.60,
    sweBenchScore: 41.2,
    pros: [
      'Fastest single silicon chip inference (2,000 tps peak)',
      'Sub-100ms response start',
      'Massive 21 PB/s on-chip SRAM bandwidth'
    ],
    cons: [
      'Raw single-stream API only; no self-healing multi-platform factory',
      'Cannot execute 30 specialist roles in parallel'
    ],
    color: '#EC4899'
  },
  {
    id: 'groq-lpu',
    name: 'Groq LPU™ Engine',
    provider: 'Groq Inc.',
    hardware: 'LPU™ Tensor Streaming Processor (SRAM Architecture)',
    tagline: 'Single-stream LPU acceleration champion (~750 tps)',
    tokensPerSec: 750,
    ttftMs: 80,
    appBuildTimeSec: 70,
    multiPlatformSupport: false,
    autonomousAgents: 1,
    costPerMillionTokens: 0.59,
    sweBenchScore: 39.5,
    pros: [
      'Fast single-prompt generation speed (750 tps)',
      'Instant Time-to-First-Token (~80ms)'
    ],
    cons: [
      'Single-model streaming; cannot orchestrate 100,000 parallel sub-tasks',
      'No simultaneous iOS (SwiftUI) and Android (Compose) output'
    ],
    color: '#F97316'
  },
  {
    id: 'claude-35-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    hardware: 'Hyperscale GPU Cluster (H100 / Trainium)',
    tagline: 'Software engineering intelligence & deep reasoning',
    tokensPerSec: 85,
    ttftMs: 420,
    appBuildTimeSec: 145,
    multiPlatformSupport: true,
    autonomousAgents: 1,
    costPerMillionTokens: 3.00,
    sweBenchScore: 49.2,
    pros: [
      'High software reasoning benchmark (SWE-bench leader ~49%)',
      'Huge 200k context window'
    ],
    cons: [
      'Slow sequential throughput (75-90 tokens/sec)',
      'High operational cost ($15/1M output tokens)'
    ],
    color: '#D97706'
  },
  {
    id: 'h-ai-jarvis',
    name: 'H.AI · J.A.R.V.I.S. (10,000x Quantum Multiplier)',
    provider: 'H.AI Sovereign Autonomous Cluster',
    hardware: 'Recursive Self-Evolving Swarm (10,000x Industry Peak = 20,000,000 TPS)',
    tagline: '10,000x Faster Than Traditional Hardware (20,000,000 TPS) · Sub-Second Assembly',
    tokensPerSec: 20000000, // 20 Million Tokens/Sec (10,000x baseline peak of 2,000 tps)
    ttftMs: 5,
    appBuildTimeSec: 0.5, // 0.5s sub-second full-stack assembly
    multiPlatformSupport: true,
    autonomousAgents: 100000,
    costPerMillionTokens: 0.05,
    sweBenchScore: 56.8,
    pros: [
      '10,000x Faster than industry peak hardware (20,000,000 tokens/sec aggregate throughput)',
      'Sub-second 0.5s full-stack assembly across Web (React 19), iOS (SwiftUI), Android (Compose), and Supabase SQL',
      'Recursive Self-Evolution Engine: app continuously upgrades and optimizes its own neural agents',
      '30 Next-Gen God-Tier Specialist Agents working concurrently with zero context thrashing',
      'Zero external dependencies: 100% sovereign autonomous architecture'
    ],
    cons: [
      'Instantaneous compilation requires modern browser WebGL to render UI speed'
    ],
    color: '#06B6D4'
  }
];

export interface RaceProgress {
  toolId: string;
  name: string;
  elapsedSec: number;
  tokensGenerated: number;
  currentPhase: string;
  percentage: number;
  completed: boolean;
  color: string;
  platformsCompleted: number;
}

export function calculateThroughputRatio(hAiTokensPerSec: number, competitorTokensPerSec: number): number {
  if (competitorTokensPerSec <= 0) return 1;
  return Number((hAiTokensPerSec / competitorTokensPerSec).toFixed(1));
}

export function calculateTimeSavingsPercent(hAiBuildSec: number, competitorBuildSec: number): number {
  if (competitorBuildSec <= 0) return 0;
  if (hAiBuildSec >= competitorBuildSec) return 0;
  return Math.round(((competitorBuildSec - hAiBuildSec) / competitorBuildSec) * 100);
}

export function computeOverallScore(tool: AICompetitor): number {
  const speedScore = Math.min((tool.tokensPerSec / 2000) * 35, 35);
  const platformScore = tool.multiPlatformSupport ? 20 : 12;
  const autonomyScore = Math.min(Math.max(5, (tool.autonomousAgents / 30) * 20), 20);
  const ttftScore = Math.max(2, 15 - (tool.ttftMs / 100));
  const sweScore = Math.min(10, (tool.sweBenchScore / 50) * 10);

  return Math.round(speedScore + platformScore + autonomyScore + ttftScore + sweScore);
}

export function simulateRaceTick(
  current: RaceProgress,
  targetDurationSec: number,
  tokensPerSec: number,
  deltaSec: number,
  maxPlatforms: number
): RaceProgress {
  const newElapsed = current.elapsedSec + deltaSec;
  const rawPercentage = Math.min((newElapsed / targetDurationSec) * 100, 100);
  const isDone = rawPercentage >= 100;
  const tokens = Math.round(newElapsed * tokensPerSec);
  
  let phase = 'Analyzing requirements...';
  let platforms = 0;

  if (rawPercentage < 20) {
    phase = '10,000x Quantum Multiplier Swarm Spec Partitioning';
    platforms = 0;
  } else if (rawPercentage < 45) {
    phase = 'Quantum AST Token Synthesis (20M tps)';
    platforms = 1;
  } else if (rawPercentage < 75) {
    phase = 'Instantaneous Tri-Platform Codebase Emission';
    platforms = Math.min(Math.floor((rawPercentage / 75) * maxPlatforms) + 1, maxPlatforms);
  } else if (rawPercentage < 95) {
    phase = 'Self-Healing AST & RLS Security Verification';
    platforms = maxPlatforms;
  } else {
    phase = 'Complete & Live in Sandbox (0.5s)';
    platforms = maxPlatforms;
  }

  return {
    ...current,
    elapsedSec: Number(newElapsed.toFixed(2)),
    tokensGenerated: isDone ? Math.round(targetDurationSec * tokensPerSec) : tokens,
    percentage: Math.round(rawPercentage),
    currentPhase: isDone ? 'Complete & Live in Sandbox (0.5s)' : phase,
    completed: isDone,
    platformsCompleted: platforms
  };
}
