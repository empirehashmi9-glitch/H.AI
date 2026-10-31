import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_30_AGENTS,
  analyzePrompt,
  generateProjectDeliverables,
  handleSupportQuery,
  calculateClusterMetrics,
  INITIAL_DIAGNOSTIC_SUBSYSTEMS,
  INITIAL_SELF_UPDATE_HISTORY,
  AVAILABLE_SELF_UPDATE_CANDIDATES,
  runSelfDiagnosticScan,
  applySelfUpdatePatch,
  rollbackSelfUpdatePatch
} from './orchestrator';

test('orchestrator initializes exactly 30 specialized agents', () => {
  assert.equal(INITIAL_30_AGENTS.length, 30);
  assert.equal(INITIAL_30_AGENTS[0].name, 'H.AI Orchestrator Prime');
  assert.equal(INITIAL_30_AGENTS[29].name, 'Executive Sign-Off & Verification Seal');
  
  // Verify all have Urdu names
  INITIAL_30_AGENTS.forEach((agent, idx) => {
    assert.ok(agent.nameUrdu.length > 0, `Agent ${idx + 1} must have an Urdu name`);
    assert.ok(agent.roleUrdu.length > 0, `Agent ${idx + 1} must have an Urdu role`);
    assert.equal(agent.number, idx + 1);
  });
});

test('analyzePrompt accurately detects domains in English and Urdu', () => {
  const ecom = analyzePrompt('ایک آن لائن کپڑوں کی دکان کے لیے ویب اور موبائل ایپ');
  assert.equal(ecom.category, 'ecommerce');

  const health = analyzePrompt('Doctor telemedicine portal with patient records');
  assert.equal(health.category, 'health');

  const generic = analyzePrompt('Modern enterprise SaaS CRM platform');
  assert.equal(generic.category, 'saas');
});

test('generateProjectDeliverables generates code for Web, iOS, Android, Supabase and Vercel', () => {
  const deliverables = generateProjectDeliverables('Build an e-commerce platform with live checkout');
  assert.ok(deliverables.platforms.web);
  assert.ok(deliverables.platforms.ios);
  assert.ok(deliverables.platforms.android);
  assert.ok(deliverables.supabase.deployed);
  assert.ok(deliverables.vercel.deployed);

  // Check Supabase SQL
  assert.ok(deliverables.supabase.databaseSql.includes('ROW LEVEL SECURITY'));
  assert.ok(deliverables.supabase.databaseSql.includes('CREATE TABLE IF NOT EXISTS public.profiles'));

  // Check iOS SwiftUI
  assert.ok(deliverables.code.ios.contentViewSwift.includes('import SwiftUI'));
  assert.ok(deliverables.code.ios.contentViewSwift.includes('AppEntity'));

  // Check Android Compose
  assert.ok(deliverables.code.android.mainActivityKt.includes('package com.hai.platform.app'));
  assert.ok(deliverables.code.android.mainActivityKt.includes('AutonomousAppScreen'));

  // Check Vercel
  assert.ok(deliverables.vercel.deployUrl.includes('.vercel.app'));

  // Check Duration is in 1-2 minute range
  assert.ok(deliverables.durationSeconds >= 60 && deliverables.durationSeconds <= 120);
});

test('handleSupportQuery returns intelligent English and Urdu responses', () => {
  const supRes = handleSupportQuery('How is Supabase database secured with RLS?');
  assert.equal(supRes.category, 'Supabase Database');
  assert.ok(supRes.responseUrdu.includes('سپا بیس'));

  const verRes = handleSupportQuery('How fast is the Vercel deploy?');
  assert.equal(verRes.category, 'Vercel Deployment');
  assert.ok(verRes.responseUrdu.includes('ورسل'));
});

test('calculateClusterMetrics supports scaling from 30 up to 100,000 agents', () => {
  const small = calculateClusterMetrics(30);
  assert.equal(small.normalizedScale, 30);
  assert.ok(small.nodesCount >= 6);

  const massive = calculateClusterMetrics(100000);
  assert.equal(massive.normalizedScale, 100000);
  assert.ok(massive.totalMemoryGb > 900);
  assert.ok(massive.aggregateThroughputTps > 3000000);
});

test('self-updating engine diagnoses subsystems and applies patches autonomously', () => {
  // Test subsystem integrity
  assert.equal(INITIAL_DIAGNOSTIC_SUBSYSTEMS.length, 6);
  INITIAL_DIAGNOSTIC_SUBSYSTEMS.forEach(sub => {
    assert.ok(sub.integrityPct >= 90);
    assert.ok(sub.nameUrdu.length > 0);
  });

  // Run diagnostic scan
  const scanned = runSelfDiagnosticScan(INITIAL_DIAGNOSTIC_SUBSYSTEMS);
  assert.equal(scanned.length, 6);
  assert.equal(scanned[0].lastScanned, 'Just now');

  // Apply candidate patch
  const candidateId = AVAILABLE_SELF_UPDATE_CANDIDATES[0].id;
  const result = applySelfUpdatePatch(candidateId, INITIAL_SELF_UPDATE_HISTORY, INITIAL_DIAGNOSTIC_SUBSYSTEMS);
  
  assert.equal(result.newSystemVersion, AVAILABLE_SELF_UPDATE_CANDIDATES[0].version);
  assert.equal(result.updatedHistory[0].status, 'applied');
  assert.ok(result.updatedHistory.length > INITIAL_SELF_UPDATE_HISTORY.length);

  // Test rollback capability
  const rollbackResult = rollbackSelfUpdatePatch(candidateId, result.updatedHistory, result.updatedSubsystems);
  assert.equal(rollbackResult.updatedHistory[0].status, 'rolled_back');
  assert.ok(rollbackResult.currentVersion.length > 0);
});
