import React, { useEffect, useRef, useState } from 'react';
import {
  Sparkles, Bot, Smartphone, BrainCircuit, Headphones, Server,
  Zap, Rotate3d, Sun, Moon, RefreshCw, UserCheck, MessageSquare, FolderCode,
  Layers, Settings2, Search, ChevronDown, Command, Building2
} from 'lucide-react';
import { HaiBrandIcon } from './HaiBrandIcon';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  clusterScale: number;
  isGenerating: boolean;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  systemVersion?: string;
  aiLive?: boolean;
  onOpenSettings?: () => void;
  onOpenPalette?: () => void;
  hasProject?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab, setCurrentTab, clusterScale, isGenerating,
  theme, setTheme, systemVersion = 'v5.0.0', aiLive = false, onOpenSettings,
  onOpenPalette, hasProject = false,
}) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const primary = [
    { id: 'orchestrator', label: 'Forge', icon: Sparkles },
    { id: 'chat', label: 'Orchestrator', icon: MessageSquare },
    { id: 'workspace', label: 'Workspace', icon: FolderCode, needsProject: true },
    { id: 'office', label: 'Office', icon: Building2 },
    { id: 'projects', label: 'Projects', icon: Layers },
    { id: 'support', label: 'Support', icon: Headphones },
    { id: 'admin', label: 'Admin', icon: Server },
  ];

  const more = [
    { id: 'agents', label: '30 Agents', icon: Bot },
    { id: 'nexus3d', label: '3D Nexus', icon: Rotate3d },
    { id: 'output', label: 'Deliverables', icon: Smartphone },
    { id: 'customer', label: 'Customer Portal', icon: UserCheck },
    { id: 'selfupdate', label: 'Self-Update', icon: RefreshCw, badge: systemVersion },
    { id: 'learning', label: 'Self-Learning', icon: BrainCircuit },
  ];

  const moreActive = more.some((m) => m.id === currentTab);

  const NavButton: React.FC<{ item: (typeof primary)[number]; compact?: boolean }> = ({ item, compact }) => {
    const active = currentTab === item.id;
    const Icon = item.icon;
    return (
      <button
        onClick={() => setCurrentTab(item.id)}
        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
          active
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05]'
        } ${compact ? 'px-2 py-1 text-[10px]' : ''}`}
        aria-current={active ? 'page' : undefined}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{item.label}</span>
        {item.id === 'workspace' && hasProject && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />}
      </button>
    );
  };

  return (
    <header className="sticky top-2 sm:top-3 z-40 px-3 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200/70 dark:border-white/10 bg-white/85 dark:bg-[#0c0e1a]/85 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-indigo-500/5 transition-all">
        <div className="flex items-center justify-between h-16 px-3 sm:px-5 gap-2">
          <div
            onClick={() => setCurrentTab('orchestrator')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 group select-none"
          >
            <HaiBrandIcon size={38} glow animated />
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                H.AI
                <span className={`w-1.5 h-1.5 rounded-full ${isGenerating ? 'bg-indigo-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
              </span>
              <span className="text-[10px] text-slate-500 font-medium hidden xl:block">
                Autonomous Agent Foundry
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Primary">
            {primary.map((item) => <NavButton key={item.id} item={item} />)}
            <div ref={moreRef} className="relative">
              <button
                onClick={() => setMoreOpen((o) => !o)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition flex items-center gap-1 ${
                  moreActive || moreOpen
                    ? 'bg-slate-200 dark:bg-white/[0.1] text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                }`}
                aria-expanded={moreOpen}
              >
                More <ChevronDown className={`w-3 h-3 transition ${moreOpen ? 'rotate-180' : ''}`} />
              </button>
              {moreOpen && (
                <div className="absolute top-10 right-0 w-56 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1020] shadow-2xl space-y-0.5">
                  {more.map(({ id, label, icon: Icon, badge }) => (
                    <button
                      key={id}
                      onClick={() => { setCurrentTab(id); setMoreOpen(false); }}
                      className={`w-full px-2.5 py-2 rounded-xl text-[11px] font-medium flex items-center gap-2 transition ${
                        currentTab === id
                          ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-200'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="flex-1 text-left">{label}</span>
                      {badge && <span className="text-[9px] font-mono text-emerald-500">{badge}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onOpenSettings}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition ${
                aiLive
                  ? 'border-emerald-300/60 dark:border-emerald-500/25 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  : 'border-amber-300/60 dark:border-amber-500/25 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300'
              }`}
              title={aiLive ? 'Gemini connected' : 'Demo mode — connect Gemini'}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${aiLive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              {aiLive ? 'AI LIVE' : 'DEMO'}
            </button>

            <button
              onClick={onOpenPalette}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 text-[10px] text-slate-500 font-mono hover:border-indigo-400/50 transition"
              aria-label="Open command palette"
            >
              <Search className="w-3 h-3" />
              <span className="flex items-center gap-0.5"><Command className="w-2.5 h-2.5" />K</span>
            </button>

            <button
              onClick={() => setCurrentTab('admin')}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 hover:border-indigo-400/50 transition text-[10px] font-mono text-slate-700 dark:text-slate-300"
              title="Cluster scale"
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>{clusterScale.toLocaleString()}</span>
            </button>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
            </button>

            <button
              onClick={onOpenSettings}
              className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-indigo-500 transition flex items-center justify-center"
              aria-label="Settings"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex lg:hidden overflow-x-auto py-2 px-3 gap-1.5 border-t border-slate-200/50 dark:border-white/[0.06] no-scrollbar">
          {[...primary, ...more].map((item) => (
            <NavButton key={item.id} item={item as (typeof primary)[number]} compact />
          ))}
          <button
            onClick={onOpenSettings}
            className="shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap flex items-center gap-1.5 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/[0.03]"
          >
            <Settings2 className="w-3 h-3" /> Settings
          </button>
        </div>
      </div>
    </header>
  );
};
