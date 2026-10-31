import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Terminal, 
  ArrowUpRight, 
  History, 
  FileCode2, 
  RotateCcw,
  Sliders,
  Zap,
  Activity,
  GitBranch,
  Layers
} from 'lucide-react';
import { 
  Language, 
  SelfDiagnosticSubsystem, 
  SelfUpdatePatch, 
  SelfUpdateSettings 
} from '../types/agent';
import { 
  INITIAL_DIAGNOSTIC_SUBSYSTEMS,
  INITIAL_SELF_UPDATE_HISTORY,
  AVAILABLE_SELF_UPDATE_CANDIDATES,
  runSelfDiagnosticScan,
  applySelfUpdatePatch,
  rollbackSelfUpdatePatch
} from '../utils/orchestrator';
import { HaiBrandIcon } from './HaiBrandIcon';

interface SelfUpdateViewProps {
  language: Language;
  currentSystemVersion: string;
  onVersionChange: (newVersion: string) => void;
}

export const SelfUpdateView: React.FC<SelfUpdateViewProps> = ({
  language,
  currentSystemVersion,
  onVersionChange
}) => {
  const isUrdu = language === 'ur';

  // Subsystems & Patch History State
  const [subsystems, setSubsystems] = useState<SelfDiagnosticSubsystem[]>(INITIAL_DIAGNOSTIC_SUBSYSTEMS);
  const [history, setHistory] = useState<SelfUpdatePatch[]>(INITIAL_SELF_UPDATE_HISTORY);
  const [selectedPatch, setSelectedPatch] = useState<SelfUpdatePatch>(INITIAL_SELF_UPDATE_HISTORY[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'diff' | 'settings'>('overview');

  // Diagnostic scan state
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // Self-update simulation state
  const [isUpdatingSelf, setIsUpdatingSelf] = useState<boolean>(false);
  const [updatePhase, setUpdatePhase] = useState<number>(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[INIT] H.AI Autonomous Self-Evolution Engine v4.8.4 initialized',
    '[WATCHDOG] Subsystem telemetry verified — 6/6 pods nominal',
    '[HOT_PATCH] Zero-downtime hot-patching daemon active on port 3000'
  ]);

  // Settings state
  const [settings, setSettings] = useState<SelfUpdateSettings>({
    autoUpdateEnabled: true,
    updateFrequency: 'continuous',
    requireHumanApproval: false,
    canaryRolloutPct: 100,
    autoRollbackOnFailure: true
  });

  // Calculate overall health score
  const avgIntegrity = +(
    subsystems.reduce((acc, curr) => acc + curr.integrityPct, 0) / subsystems.length
  ).toFixed(1);

  // Trigger self-diagnostic scan
  const handleRunDiagnostic = () => {
    setIsScanning(true);
    setScanMessage(isUrdu ? 'تمام 6 اندرونی سسٹمز کا خودکار معائنہ جاری ہے...' : 'Diagnosing 6 internal subsystems...');

    setTimeout(() => {
      const refreshed = runSelfDiagnosticScan(subsystems);
      setSubsystems(refreshed);
      setIsScanning(false);
      setScanMessage(
        isUrdu 
          ? 'خودکار تشخیصی چیک مکمل: تمام سسٹمز نارمل اور محفوظ ہیں۔' 
          : 'Diagnostic complete: All subsystems operational. 0 regressions detected.'
      );
    }, 900);
  };

  // Run autonomous 4-stage self-update
  const handleTriggerAutonomousUpdate = (patchCandidateId?: string) => {
    const targetId = patchCandidateId || AVAILABLE_SELF_UPDATE_CANDIDATES[0].id;
    const candidate = AVAILABLE_SELF_UPDATE_CANDIDATES.find(p => p.id === targetId) || AVAILABLE_SELF_UPDATE_CANDIDATES[0];

    setIsUpdatingSelf(true);
    setUpdatePhase(1);

    const phases = [
      {
        phase: 1,
        log: `[PHASE 1] Static analysis on H.AI core AST: Generating diff for ${candidate.version}`,
        urduLog: `مرحلہ 1: سسٹم سورس کوڈ کا تجزیہ اور پیچ کی تیاری (${candidate.version})`
      },
      {
        phase: 2,
        log: `[PHASE 2] Synthesizing zero-copy memory conduits and tuning 30 agent neural weights`,
        urduLog: `مرحلہ 2: 30 ایجنٹس کے باہمی رابطہ چینلز اور نیورل ویٹس کی اپ گریڈیشن`
      },
      {
        phase: 3,
        log: `[PHASE 3] Compiling mutation sandbox: 18 unit tests passed, 0 regressions, sha256:7f9a1c`,
        urduLog: `مرحلہ 3: سینڈ باکس کمپائلیشن اور خودکار ٹیسٹنگ: 100% پاس`
      },
      {
        phase: 4,
        log: `[PHASE 4] Atomic hot-patch swapped into memory: H.AI is now upgraded to ${candidate.version}!`,
        urduLog: `مرحلہ 4: ہاٹ پیچ کامیابی سے لاگو! H.AI اب ورژن ${candidate.version} پر اپ گریڈ ہو گیا ہے۔`
      }
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < phases.length) {
        const item = phases[current];
        setUpdatePhase(item.phase);
        setTerminalLogs(prev => [
          ...prev, 
          isUrdu ? `[خودکار اپ ڈیٹ] ${item.urduLog}` : item.log
        ]);
        current++;
      } else {
        clearInterval(interval);

        // Apply patch
        const res = applySelfUpdatePatch(candidate.id, history, subsystems);
        setHistory(res.updatedHistory);
        setSubsystems(res.updatedSubsystems);
        if (res.appliedPatch) {
          setSelectedPatch(res.appliedPatch);
        }
        onVersionChange(res.newSystemVersion);
        setIsUpdatingSelf(false);
        setUpdatePhase(0);
      }
    }, 1100);
  };

  // Rollback to prior version
  const handleRollback = (patchId: string) => {
    const res = rollbackSelfUpdatePatch(patchId, history, subsystems);
    setHistory(res.updatedHistory);
    setSubsystems(res.updatedSubsystems);
    onVersionChange(res.currentVersion);
    setTerminalLogs(prev => [
      ...prev,
      `[ROLLBACK] Reverted patch ${patchId} -> System restored to ${res.currentVersion}`
    ]);
  };

  return (
    <div className="space-y-8 py-4 max-w-7xl mx-auto">
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/70 via-[#0a0d18] to-slate-900 border border-indigo-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-transparent blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <HaiBrandIcon size={64} glow={true} animated={true} />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  <span>H.AI</span>
                  <span className="text-indigo-400 font-light">|</span>
                  <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                    {isUrdu ? 'خودکار سیلف اپ ڈیٹ و ارتقائی نظام' : 'Autonomous Self-Updating & Evolution Engine'}
                  </span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {currentSystemVersion}
                </span>
              </div>
              <p className="text-slate-300 dark:text-slate-400 text-sm max-w-2xl leading-relaxed">
                {isUrdu
                  ? 'یہ پلیٹ فارم صرف ایپس نہیں بناتا بلکہ اپنے سورس کوڈ، 30 ایجنٹس کے الگورتھمز، کمپائلرز اور سیکیورٹی شیلڈز کو خود بخود اپ گریڈ، پیچ اور ری فیکٹر کرتا ہے۔'
                  : 'H.AI does not just generate applications—it continuously inspects, recompiles, hot-patches, and evolves its own source code, agent reasoning weights, and infrastructure in real time.'}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={handleRunDiagnostic}
              disabled={isScanning || isUpdatingSelf}
              className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-indigo-400' : ''}`} />
              <span>{isUrdu ? 'سسٹم اسکین کریں' : 'Diagnose Subsystems'}</span>
            </button>

            <button
              onClick={() => handleTriggerAutonomousUpdate()}
              disabled={isUpdatingSelf}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition transform hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {isUpdatingSelf 
                  ? (isUrdu ? 'خودکار اپ ڈیٹ جاری ہے...' : 'Self-Updating Core...') 
                  : (isUrdu ? 'خود کار سسٹم اپ ڈیٹ چلائیں' : 'Trigger Autonomous Self-Update')}
              </span>
            </button>
          </div>
        </div>

        {/* Live Scan Notification if any */}
        {scanMessage && (
          <div className="mt-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center gap-2">
            <Activity className="w-4 h-4 shrink-0 text-indigo-400 animate-pulse" />
            <span>{scanMessage}</span>
          </div>
        )}
      </div>

      {/* KPI Status Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0e1a] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>{isUrdu ? 'اندرونی ہیلتھ انٹیگریٹی' : 'Subsystem Integrity'}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
            {avgIntegrity}%
          </div>
          <span className="text-[11px] text-slate-400 block">
            {isUrdu ? '6/6 سسٹمز مکمل محفوظ' : '6/6 Subsystems Optimal'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0e1a] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>{isUrdu ? 'لاگو شدہ خودکار پیچز' : 'Self-Applied Patches'}</span>
            <GitBranch className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
            {history.filter(h => h.status === 'applied').length}
          </div>
          <span className="text-[11px] text-slate-400 block">
            {isUrdu ? 'زیرو ڈاؤن ٹائم ہاٹ پیچ' : 'Zero-Downtime Hot Swapped'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0e1a] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>{isUrdu ? 'رفتار میں خودکار اضافہ' : 'Aggregate Speedup'}</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
            +48.6%
          </div>
          <span className="text-[11px] text-slate-400 block">
            {isUrdu ? 'پرامپٹ سے ایپ تک کا وقت' : 'Synthesis latency reduced'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0e1a] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>{isUrdu ? 'خودکار شیڈول' : 'Auto-Evolution'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white capitalize">
            {settings.autoUpdateEnabled ? (isUrdu ? 'فعال (لائیو)' : 'Continuous') : 'Paused'}
          </div>
          <span className="text-[11px] text-slate-400 block">
            {isUrdu ? 'بیک گراؤنڈ سیلف ہیلنگ' : 'Autonomous Background Daemon'}
          </span>
        </div>
      </div>

      {/* Realtime Self-Update In-Progress Tracker (when active) */}
      {isUpdatingSelf && (
        <div className="p-6 rounded-3xl bg-indigo-950/40 border border-indigo-500/30 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center animate-spin">
                <RefreshCw className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">
                  {isUrdu ? 'خودکار سیلف اپ ڈیٹ کا عمل جاری ہے...' : 'Autonomous Self-Evolution in Progress...'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isUrdu ? `مرحلہ ${updatePhase} / 4 مکمل ہو رہا ہے` : `Executing Stage ${updatePhase} of 4`}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-400">
              {updatePhase * 25}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${updatePhase * 25}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <span className={updatePhase >= 1 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              1. {isUrdu ? 'سسٹم آڈٹ' : 'Subsystem Audit'}
            </span>
            <span className={updatePhase >= 2 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              2. {isUrdu ? 'نیورل ری ویٹنگ' : 'Neural Re-weight'}
            </span>
            <span className={updatePhase >= 3 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              3. {isUrdu ? 'سینڈ باکس ٹیسٹنگ' : 'Sandbox Verification'}
            </span>
            <span className={updatePhase >= 4 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              4. {isUrdu ? 'ہاٹ پیچ لاگو' : 'Hot-Patch Deployed'}
            </span>
          </div>
        </div>
      )}

      {/* Main Grid: Subsystems & Terminal vs Patch Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Col: 6 Subsystems Diagnostic Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>{isUrdu ? 'H.AI کے 6 بنیادی اندرونی سسٹمز' : '6 Core Internal Subsystems'}</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">
              {subsystems.length} {isUrdu ? 'ماڈیولز' : 'modules'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {subsystems.map((sub) => {
              const hasPatch = sub.status === 'patch_available';
              const isUpdated = sub.status === 'updated';

              return (
                <div 
                  key={sub.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    hasPatch
                      ? 'bg-amber-500/[0.04] dark:bg-amber-500/[0.06] border-amber-500/30'
                      : isUpdated
                      ? 'bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06] border-emerald-500/30'
                      : 'bg-white dark:bg-[#0c0e1a] border-slate-200/80 dark:border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {isUrdu ? sub.nameUrdu : sub.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300">
                          {sub.currentVersion}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {isUrdu ? sub.detailsUrdu : sub.detailsEn}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-emerald-500 block">
                        {sub.integrityPct}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {sub.lastScanned}
                      </span>
                    </div>
                  </div>

                  {hasPatch && (
                    <div className="mt-3 pt-2.5 border-t border-amber-500/20 flex items-center justify-between">
                      <span className="text-[11px] text-amber-500 font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {isUrdu ? 'خودکار اصلاح و پیچ دستیاب ہے' : 'Autonomous upgrade available'}
                      </span>
                      <button
                        onClick={() => handleTriggerAutonomousUpdate('patch-v490')}
                        disabled={isUpdatingSelf}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-semibold text-[11px] transition"
                      >
                        {isUrdu ? 'فوری پیچ لاگو کریں' : 'Install Patch'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Live System Terminal Log */}
          <div className="p-4 rounded-2xl bg-black/80 border border-white/10 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-white/10">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <Terminal className="w-3.5 h-3.5" />
                <span>H.AI Core Self-Evolution Terminal</span>
              </span>
              <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Feed
              </span>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1.5 text-slate-300 pr-1 no-scrollbar text-[11px]">
              {terminalLogs.slice(-6).map((log, i) => (
                <div key={i} className="leading-snug">
                  <span className="text-slate-500 select-none mr-2">&gt;</span>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Patch Candidates, Source Diff Inspector & History */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0c0e1a] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
            
            {/* View Tab Selector */}
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-3">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'overview'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  {isUrdu ? 'پیچ امیدوار' : 'Candidates'}
                </button>
                <button
                  onClick={() => setActiveTab('diff')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                    activeTab === 'diff'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'کوڈ ڈیف' : 'Code Diff'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                    activeTab === 'settings'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'سیٹنگز' : 'Policies'}</span>
                </button>
              </div>

              <span className="text-[11px] font-mono text-slate-500">
                {selectedPatch.version}
              </span>
            </div>

            {/* TAB 1: OVERVIEW & CANDIDATES */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs text-slate-500 font-mono block">
                    {isUrdu ? 'دستیاب خودکار اپ گریڈز' : 'Available Upgrade Candidates'}
                  </span>

                  {AVAILABLE_SELF_UPDATE_CANDIDATES.map((cand) => (
                    <div 
                      key={cand.id}
                      onClick={() => setSelectedPatch(cand)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                        selectedPatch.id === cand.id
                          ? 'border-indigo-500 bg-indigo-500/[0.08]'
                          : 'border-slate-200/80 dark:border-white/10 hover:border-indigo-400/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-indigo-400 font-mono">
                          {cand.version}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">
                          +{cand.impactMetrics.speedupPct}% Speed
                        </span>
                      </div>
                      <h4 className="font-semibold text-xs text-slate-900 dark:text-white mt-1">
                        {isUrdu ? cand.titleUrdu : cand.titleEn}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {isUrdu ? cand.descriptionUrdu : cand.descriptionEn}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Selected Patch Detailed Metrics */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {isUrdu ? 'پیچ کا اثر اور کارکردگی' : 'Patch Performance Metrics'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {selectedPatch.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-xl bg-white dark:bg-[#070913] border border-slate-200/50 dark:border-white/10">
                      <span className="text-[10px] text-slate-500 block">Latency Gain</span>
                      <span className="font-bold text-emerald-500">{selectedPatch.impactMetrics.latencyMsDelta}ms</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-[#070913] border border-slate-200/50 dark:border-white/10">
                      <span className="text-[10px] text-slate-500 block">Memory Saved</span>
                      <span className="font-bold text-indigo-400">-{selectedPatch.impactMetrics.memoryReductionPct}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTriggerAutonomousUpdate(selectedPatch.id)}
                    disabled={isUpdatingSelf}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isUrdu ? `یہ پیچ لاگو کریں (${selectedPatch.version})` : `Apply Hot-Patch (${selectedPatch.version})`}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: CODE DIFF INSPECTOR */}
            {activeTab === 'diff' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>{selectedPatch.codeDiffs[0]?.file}</span>
                  <span>{selectedPatch.codeDiffs[0]?.oldVersion} &rarr; {selectedPatch.codeDiffs[0]?.newVersion}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#070913] border border-white/10 font-mono text-[11px] overflow-x-auto no-scrollbar space-y-1">
                  {selectedPatch.codeDiffs[0]?.diffLines.map((line, idx) => (
                    <div 
                      key={idx}
                      className={`px-2 py-0.5 rounded leading-relaxed whitespace-pre font-mono ${
                        line.type === 'add'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : line.type === 'remove'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'text-slate-400'
                      }`}
                    >
                      {line.code}
                    </div>
                  ))}
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-xs text-slate-500 font-mono block">
                    {isUrdu ? 'خودکار تبدیلیاں' : 'Autonomous Improvements'}:
                  </span>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                    {(isUrdu ? selectedPatch.changelogUrdu : selectedPatch.changelogEn).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 3: SELF-UPDATE POLICIES */}
            {activeTab === 'settings' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/10">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {isUrdu ? 'خودکار بیک گراؤنڈ اپ ڈیٹس' : 'Continuous Auto-Evolution'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {isUrdu ? 'بغیر کسی دستی مداخلت کے خودکار پیچ' : 'Automatically patch on detected performance gain'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoUpdateEnabled}
                    onChange={(e) => setSettings({ ...settings, autoUpdateEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/10">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {isUrdu ? 'ناکامی پر خودکار واپسی (Rollback)' : 'Auto-Rollback Protection'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {isUrdu ? 'کوئی خرابی ہونے پر پرانے مستحکم ورژن پر واپسی' : 'Instant fallback to previous stable release if tests fail'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoRollbackOnFailure}
                    onChange={(e) => setSettings({ ...settings, autoRollbackOnFailure: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {isUrdu ? 'اپ ڈیٹ فریکوئنسی' : 'Evolution Cadence'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['continuous', 'hourly', 'daily', 'on_vulnerability'] as const).map((freq) => (
                      <button
                        key={freq}
                        onClick={() => setSettings({ ...settings, updateFrequency: freq })}
                        className={`p-2 rounded-xl border text-center capitalize font-mono text-[11px] transition ${
                          settings.updateFrequency === freq
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-slate-200/80 dark:border-white/10 hover:border-indigo-400 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {freq.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Past History & Rollback Panel */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#0c0e1a] border border-slate-200/80 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isUrdu ? 'گزشتہ خودکار اپ ڈیٹس' : 'Patch Deployment History'}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {history.length} records
              </span>
            </div>

            <div className="space-y-2">
              {history.map((patch) => (
                <div 
                  key={patch.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/10 flex items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                        {patch.version}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        patch.status === 'applied' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {patch.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block truncate max-w-[200px]">
                      {isUrdu ? patch.titleUrdu : patch.titleEn}
                    </span>
                  </div>

                  {patch.status === 'applied' && (
                    <button
                      onClick={() => handleRollback(patch.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[11px] font-semibold flex items-center gap-1 transition"
                      title="Rollback this patch"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{isUrdu ? 'واپسی' : 'Rollback'}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
