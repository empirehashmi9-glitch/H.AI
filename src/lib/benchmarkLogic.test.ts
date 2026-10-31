import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateThroughputRatio,
  calculateTimeSavingsPercent,
  computeOverallScore,
  simulateRaceTick,
  AI_COMPETITORS
} from './benchmarkLogic';

test('AI_COMPETITORS contains required market leaders and H.AI 10,000x Quantum Multiplier', () => {
  const ids = AI_COMPETITORS.map(c => c.id);
  assert.ok(ids.includes('industry-gpu'), 'Should include standard GPU');
  assert.ok(ids.includes('cerebras-cs3'), 'Should include Cerebras CS-3');
  assert.ok(ids.includes('h-ai-jarvis'), 'Should include H.AI J.A.R.V.I.S.');

  const hAi = AI_COMPETITORS.find(c => c.id === 'h-ai-jarvis')!;
  assert.equal(hAi.tokensPerSec, 20000000, 'H.AI tokens per sec should be 20,000,000 TPS (10,000x Quantum Multiplier)');
});

test('calculateThroughputRatio returns exact 10,000x multiplier against 2,000 tps baseline', () => {
  // 20,000,000 / 2,000 = 10,000.0x!
  assert.equal(calculateThroughputRatio(20000000, 2000), 10000.0);
  assert.equal(calculateThroughputRatio(20000000, 150), 133333.3);
});

test('calculateTimeSavingsPercent handles sub-second 0.5s time reductions', () => {
  assert.equal(calculateTimeSavingsPercent(0.5, 45), 99);
  assert.equal(calculateTimeSavingsPercent(0.5, 180), 100);
});

test('computeOverallScore returns valid 0-100 score for 10,000x mode', () => {
  const hAi = AI_COMPETITORS.find(c => c.id === 'h-ai-jarvis')!;
  const score = computeOverallScore(hAi);
  assert.ok(score >= 90 && score <= 100, `H.AI score should be top tier, got ${score}`);
});

test('simulateRaceTick advances sub-second percentage and platforms correctly', () => {
  const initial = {
    toolId: 'test',
    name: 'Test Tool',
    elapsedSec: 0,
    tokensGenerated: 0,
    currentPhase: 'Init',
    percentage: 0,
    completed: false,
    color: '#000',
    platformsCompleted: 0
  };

  const tick1 = simulateRaceTick(initial, 0.5, 20000000, 0.2, 3);
  assert.equal(tick1.elapsedSec, 0.2);
  assert.equal(tick1.percentage, 40);
  assert.equal(tick1.completed, false);
  assert.equal(tick1.tokensGenerated, 4000000);

  const tickDone = simulateRaceTick(tick1, 0.5, 20000000, 0.4, 3);
  assert.equal(tickDone.percentage, 100);
  assert.equal(tickDone.completed, true);
  assert.equal(tickDone.platformsCompleted, 3);
});
