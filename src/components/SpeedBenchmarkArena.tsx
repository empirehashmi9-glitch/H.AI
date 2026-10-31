import React, { useState, useEffect } from 'react';
import { Zap, Gauge, Flame, Trophy, Play, RotateCcw, ShieldCheck, Check, Sparkles, TrendingUp, Info } from 'lucide-react';
import { AI_COMPETITORS, RaceProgress, calculateThroughputRatio, calculateTimeSavingsPercent, computeOverallScore, simulateRaceTick } from '../lib/benchmarkLogic';
import { AICompetitor } from '../lib/types';

interface SpeedBenchmarkArenaProps {
  hyperDriveActive: boolean;
  onToggleHyperDrive: () => void;
  onOpenGeminiDialog: () => void;
}

export const SpeedBenchmarkArena: React.FC<SpeedBenchmarkArenaProps> = ({
  hyperDriveActive,
  onToggleHyperDrive,
  onOpenGeminiDialog
}) => {
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string>('groq-lpu');
  const [isRacing, setIsRacing] = useState<boolean>(false);
  const [raceData, setRaceData] = useState<{ [key: string]: RaceProgress }>({});
  const [winner, setWinner] = useState<string | null>(null);

  const hAiTool = AI_COMPETITORS.find(c => c.id === 'h-ai-jarvis')!;
  const effectiveHAiSpeed = hyperDriveActive ? 20000000 : 5000000;
  const effectiveHAiBuildTime = hyperDriveActive ? 0.5 : 1.5;

  const currentCompetitor = AI_COMPETITORS.find(c => c.id === selectedCompetitorId) || AI_COMPETITORS[0];

  // Initialize or reset race state
  const resetRace = () => {
    setIsRacing(false);
    setWinner(null);
    const initial: { [key: string]: RaceProgress } = {};

    [hAiTool, currentCompetitor].forEach(tool => {
      initial[tool.id] = {
        toolId: tool.id,
        name: tool.id === 'h-ai-jarvis' && hyperDriveActive ? 'H.AI · J.A.R.V.I.S. (10,000x QUANTUM WARP)' : tool.name,
        elapsedSec: 0,
        tokensGenerated: 0,
        currentPhase: 'Ready at starting grid',
        percentage: 0,
        completed: false,
        color: tool.color,
        platformsCompleted: 0
      };
    });
    setRaceData(initial);
  };

  useEffect(() => {
    resetRace();
  }, [selectedCompetitorId, hyperDriveActive]);

  // Race simulation loop
  useEffect(() => {
    if (!isRacing) return;

    const interval = setInterval(() => {
      setRaceData(prev => {
        const next = { ...prev };
        let anyCompleted = false;

        // Update H.AI
        const hProgress = next[hAiTool.id];
        if (hProgress && !hProgress.completed) {
          next[hAiTool.id] = simulateRaceTick(
            hProgress,
            effectiveHAiBuildTime,
            effectiveHAiSpeed,
            1.5,
            3 // Web + iOS + Android
          );
          if (next[hAiTool.id].completed && !winner) {
            setWinner(next[hAiTool.id].name);
            anyCompleted = true;
          }
        }

        // Update Competitor
        const compProgress = next[currentCompetitor.id];
        if (compProgress && !compProgress.completed) {
          next[currentCompetitor.id] = simulateRaceTick(
            compProgress,
            currentCompetitor.appBuildTimeSec,
            currentCompetitor.tokensPerSec,
            1.5,
            currentCompetitor.multiPlatformSupport ? 3 : 1
          );
          if (next[currentCompetitor.id].completed && !winner) {
            setWinner(next[currentCompetitor.id].name);
            anyCompleted = true;
          }
        }

        if (next[hAiTool.id]?.completed && next[currentCompetitor.id]?.completed) {
          setIsRacing(false);
        }

        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isRacing, effectiveHAiBuildTime, effectiveHAiSpeed, currentCompetitor, winner]);

  const throughputRatio = calculateThroughputRatio(effectiveHAiSpeed, currentCompetitor.tokensPerSec);
  const timeSavings = calculateTimeSavingsPercent(effectiveHAiBuildTime, currentCompetitor.appBuildTimeSec);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner: Hyper-Drive Turbo Overclock Callout */}
      <div className={`p-6 rounded-3xl border transition-all duration-500 relative overflow-hidden ${
        hyperDriveActive
          ? 'bg-gradient-to-r from-cyan-950 via-blue-950 to-indigo-950 border-cyan-400 shadow-2xl shadow-cyan-500/20'
          : 'bg-slate-900/80 border-slate-800'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 mb-1">
              <Zap className="w-4 h-4 fill-cyan-400" />
              <span>Sovereign Speed Dominance & Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-orbitron">
              H.AI Supremacy: Outperforming All External AI Tools
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              H.AI kisi doosre AI tool par depend nahi karta — ye ek mukammal <b>Sovereign Autonomous Architecture</b> hai.
              Jahan baqi tamam tools (Groq, Claude, Cursor, v0, Devin) sequential ek-ek token likhte hain, H.AI ka
              <b> 30-Agent Parallel Cluster</b> Web, iOS, Android aur Database ko ek sath compile karke un sab se 5x se 10x zyada tez deliver karta hai!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onToggleHyperDrive}
              className={`px-6 py-3.5 rounded-2xl font-orbitron font-bold text-xs uppercase tracking-wider flex items-center gap-3 transition-all shadow-xl ${
                hyperDriveActive
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-amber-500/30 scale-105'
                  : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              <Flame className={`w-5 h-5 ${hyperDriveActive ? 'animate-bounce text-slate-950' : 'text-amber-400'}`} />
              {hyperDriveActive ? 'HYPER-DRIVE 200% (ACTIVE)' : 'TURBO BOOST ACTIVATE'}
            </button>

            <button
              onClick={onOpenGeminiDialog}
              className="px-5 py-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-2"
            >
              <Info className="w-4 h-4" />
              Gemini vs H.AI Tafseel
            </button>
          </div>
        </div>
      </div>

      {/* Live Race Simulator Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" /> Live Parallel App Build Race
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Select Competitor to Race Against H.AI
            </h3>
          </div>

          {/* Competitor Selector Dropdown / Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {AI_COMPETITORS.filter(c => c.id !== 'h-ai-jarvis').map(comp => (
              <button
                key={comp.id}
                onClick={() => setSelectedCompetitorId(comp.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  selectedCompetitorId === comp.id
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {comp.name}
              </button>
            ))}
          </div>
        </div>

        {/* Live Race Tracks */}
        <div className="mt-8 space-y-6">
          {/* Track 1: H.AI */}
          {raceData[hAiTool.id] && (
            <div className="bg-slate-950/70 p-5 rounded-2xl border border-cyan-500/40 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500 text-slate-950 font-black flex items-center justify-center font-orbitron text-xs">
                    H.AI
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm sm:text-base">{raceData[hAiTool.id].name}</span>
                    <span className="ml-2 text-xs font-mono text-cyan-400">
                      ⚡ {effectiveHAiSpeed.toLocaleString()} tokens/sec (30 Agents Parallel)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-slate-400">Elapsed: </span>
                  <span className="font-mono font-bold text-cyan-300">{raceData[hAiTool.id].elapsedSec}s</span>
                  <span className="mx-2 text-slate-600">|</span>
                  <span className="font-mono font-bold text-emerald-400">{raceData[hAiTool.id].percentage}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 relative">
                <div
                  style={{ width: `${raceData[hAiTool.id].percentage}%` }}
                  className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-150 relative"
                >
                  <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/80 rounded-full blur-[1px] animate-pulse"></div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs mt-2 text-slate-400">
                <span className="font-mono text-cyan-300">Phase: {raceData[hAiTool.id].currentPhase}</span>
                <span className="font-mono text-emerald-400">
                  Platforms: {raceData[hAiTool.id].platformsCompleted}/3 (Web + iOS + Android)
                </span>
                <span className="font-mono">Tokens: {raceData[hAiTool.id].tokensGenerated.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Track 2: Selected Competitor */}
          {raceData[currentCompetitor.id] && (
            <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: currentCompetitor.color }}
                    className="w-9 h-9 rounded-xl text-slate-950 font-black flex items-center justify-center font-orbitron text-xs"
                  >
                    VS
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm sm:text-base">{currentCompetitor.name}</span>
                    <span className="ml-2 text-xs font-mono text-slate-400">
                      ({currentCompetitor.hardware.split('(')[0]}) · {currentCompetitor.tokensPerSec} tokens/sec
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-slate-400">Elapsed: </span>
                  <span className="font-mono font-bold text-slate-300">{raceData[currentCompetitor.id].elapsedSec}s</span>
                  <span className="mx-2 text-slate-600">|</span>
                  <span className="font-mono font-bold text-slate-300">{raceData[currentCompetitor.id].percentage}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 relative">
                <div
                  style={{
                    width: `${raceData[currentCompetitor.id].percentage}%`,
                    backgroundColor: currentCompetitor.color
                  }}
                  className="h-full rounded-full transition-all duration-150"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs mt-2 text-slate-400">
                <span className="font-mono text-slate-300">Phase: {raceData[currentCompetitor.id].currentPhase}</span>
                <span className="font-mono">
                  Platforms: {raceData[currentCompetitor.id].platformsCompleted}/{currentCompetitor.multiPlatformSupport ? '3' : '1'}
                </span>
                <span className="font-mono">Tokens: {raceData[currentCompetitor.id].tokensGenerated.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Controls and Winner Announcement */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (raceData[hAiTool.id]?.completed && raceData[currentCompetitor.id]?.completed) {
                  resetRace();
                  setTimeout(() => setIsRacing(true), 100);
                } else {
                  setIsRacing(!isRacing);
                }
              }}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              {isRacing ? 'Pause Race' : (raceData[hAiTool.id]?.completed ? 'Restart Race' : 'Start Live Race')}
            </button>

            <button
              onClick={resetRace}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {winner && (
            <div className="px-5 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono flex items-center gap-2 animate-bounce">
              <Trophy className="w-4 h-4 text-amber-400" />
              WINNER: {winner} finished first!
            </div>
          )}
        </div>
      </div>

      {/* Comparative Metrics Grid: Throughput, Assembly Time, Autonomous Agents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>THROUGHPUT MULTIPLIER</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-orbitron text-cyan-400">
            {throughputRatio}x Faster
          </div>
          <p className="text-xs text-slate-400 mt-2">
            H.AI delivers {effectiveHAiSpeed.toLocaleString()} tokens/sec aggregate via 30 parallel agents vs {currentCompetitor.tokensPerSec} tps on {currentCompetitor.name}.
          </p>
        </div>

        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>FULL-STACK TIME SAVINGS</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-orbitron text-emerald-400">
            {timeSavings > 0 ? `${timeSavings}% Less Time` : 'Par Speed'}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Complete Web + iOS + Android codebase assembled in {effectiveHAiBuildTime}s vs {currentCompetitor.appBuildTimeSec}s.
          </p>
        </div>

        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>AUTONOMOUS AGENTS</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold font-orbitron text-purple-400">
            30 vs {currentCompetitor.autonomousAgents}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            30 dedicated specialized roles (UI, Swift, Kotlin, SQL, QA) working concurrently with zero context thrashing.
          </p>
        </div>
      </div>

      {/* Full Competitor Matrix Table */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 lg:p-8">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          The World's Fastest AI Tools: Full Head-to-Head Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase border-b border-slate-800">
              <tr>
                <th className="p-3.5">AI Engine / Tool</th>
                <th className="p-3.5">Hardware / Core</th>
                <th className="p-3.5">Tokens / Sec</th>
                <th className="p-3.5">Time to 1st Token</th>
                <th className="p-3.5">Full App Time</th>
                <th className="p-3.5">Multi-Platform</th>
                <th className="p-3.5">Overall Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-sans">
              {AI_COMPETITORS.map(tool => {
                const isHAi = tool.id === 'h-ai-jarvis';
                const score = computeOverallScore(tool);
                return (
                  <tr
                    key={tool.id}
                    className={`transition-all ${
                      isHAi
                        ? 'bg-cyan-950/30 font-semibold text-white border-l-4 border-l-cyan-400'
                        : 'hover:bg-slate-800/30 text-slate-300'
                    }`}
                  >
                    <td className="p-3.5">
                      <div className="font-bold flex items-center gap-2">
                        <span style={{ color: tool.color }}>●</span>
                        {tool.name}
                        {isHAi && <span className="text-[10px] bg-cyan-500 text-slate-950 px-1.5 py-0.5 rounded font-mono font-extrabold">YOU ARE HERE</span>}
                      </div>
                      <div className="text-[11px] text-slate-400">{tool.tagline}</div>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-400">{tool.hardware}</td>
                    <td className="p-3.5 font-mono font-bold text-cyan-300">
                      {isHAi && hyperDriveActive ? '4,800' : tool.tokensPerSec.toLocaleString()} tps
                    </td>
                    <td className="p-3.5 font-mono text-emerald-400 font-semibold">{tool.ttftMs}ms</td>
                    <td className="p-3.5 font-mono font-bold">
                      {isHAi && hyperDriveActive ? '35s' : `${tool.appBuildTimeSec}s`}
                    </td>
                    <td className="p-3.5">
                      {tool.multiPlatformSupport ? (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-mono text-[10px] font-bold">
                          Web + iOS + Android
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full font-mono text-[10px]">
                          Single / Web
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${score}%`, backgroundColor: tool.color }}
                            className="h-full rounded-full"
                          />
                        </div>
                        <span className="font-mono font-bold text-white">{score}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
