import React, { useEffect, useState } from 'react';
import {
  BrainCircuit, Globe2, Headphones, LayoutDashboard, Rocket, Settings2, Store, Boxes, Smartphone,
} from 'lucide-react';
import { useApp } from '../../state/app';
import { AdminBackdrop } from '../../ui/Backdrop';
import { ChibiRobot } from '../../ui/Chibi';
import { Pill, cx } from '../../ui/Toon';
import { APP_VERSION } from '../../config/app';
import { DashboardPage } from './DashboardPage';
import { OfficePage } from './OfficePage';
import { BuildsPage } from './BuildsPage';
import { SupportPage } from './SupportPage';
import { LearningPage } from './LearningPage';
import { SettingsPage } from './SettingsPage';
import { RemotePage } from './RemotePage';

export type AdminPage = 'dashboard' | 'office' | 'remote' | 'builds' | 'support' | 'learning' | 'settings';

const NAV = [
  { id: 'dashboard' as const, label: 'Command', icon: LayoutDashboard },
  { id: 'office' as const, label: 'Office', icon: Boxes },
  { id: 'remote' as const, label: 'Remote', icon: Smartphone },
  { id: 'builds' as const, label: 'Builds', icon: Rocket },
  { id: 'support' as const, label: 'Support', icon: Headphones },
  { id: 'learning' as const, label: 'Learning', icon: BrainCircuit },
  { id: 'settings' as const, label: 'Settings', icon: Settings2 },
];

export const AdminApp: React.FC = () => {
  const { setMode, aiLive, tickets } = useApp();
  const [page, setPage] = useState<AdminPage>('dashboard');
  const [focusAgent, setFocusAgent] = useState<string | null>(null);
  const open = tickets.filter((t) => t.status !== 'resolved').length;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const goOffice = (agentId?: string) => {
    if (agentId) setFocusAgent(agentId);
    setPage('office');
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <AdminBackdrop />

      <header className="sticky top-2 sm:top-3 z-40 px-3 sm:px-5 w-full max-w-6xl mx-auto">
        <div className="toon-card-dark rounded-[22px] sm:rounded-full px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
          <button
            onClick={() => setPage('dashboard')}
            className="flex items-center gap-2.5 min-w-0 text-left"
            aria-label="H.AI HQ home"
          >
            <span className="w-9 h-9 shrink-0 rounded-xl bg-aqua/10 border border-aqua/60 text-aqua shadow-[0_0_16px_rgba(34,211,238,0.35)] grid place-items-center font-display text-base font-bold">
              H
            </span>
            <span className="min-w-0">
              <span className="block font-display text-base leading-none text-ink">H.AI HQ</span>
              <span className="block text-[10px] font-bold text-ink/50 truncate">J.A.R.V.I.S. control room</span>
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Admin">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setPage(id)}
                className={cx(
                  'px-2.5 py-1.5 rounded-full text-xs font-extrabold transition flex items-center gap-1.5 border',
                  page === id
                    ? 'bg-sun/15 border-sun/50 text-sun shadow-[0_0_16px_rgba(255,179,71,0.18)]'
                    : 'border-transparent text-ink/65 hover:bg-white/10 hover:text-ink',
                )}
                aria-current={page === id ? 'page' : undefined}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 shrink-0">
            <Pill tone={aiLive ? 'mint' : 'sun'} dot={aiLive ? '#159570' : '#B07800'} className="hidden sm:inline-flex">
              {aiLive ? 'AI live' : 'Demo'}
            </Pill>
            <button
              onClick={() => setMode('customer')}
              className="h-9 px-2.5 rounded-xl bg-aqua/10 border border-aqua/35 text-aqua hover:bg-aqua/20 transition grid place-items-center"
              aria-label="Switch to customer studio"
              title="Open customer studio"
            >
              <Store className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMode('landing')}
              className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/15 text-ink-soft hover:text-ink hover:bg-white/10 transition grid place-items-center"
              aria-label="Back to worlds"
              title="Back to worlds"
            >
              <Globe2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-3 sm:px-5 pt-4 sm:pt-6 pb-28 lg:pb-10">
        <div key={page} className="anim-rise">
          {page === 'dashboard' && (
            <DashboardPage onOpenOffice={goOffice} onOpenBuilds={() => setPage('builds')} onOpenSupport={() => setPage('support')} />
          )}
          {page === 'office' && (
            <OfficePage focusAgent={focusAgent} onFocusHandled={() => setFocusAgent(null)} />
          )}
          {page === 'remote' && <RemotePage />}
          {page === 'builds' && <BuildsPage />}
          {page === 'support' && <SupportPage />}
          {page === 'learning' && <LearningPage />}
          {page === 'settings' && <SettingsPage />}
        </div>
      </main>

      <footer className="relative z-10 hidden lg:block pb-6">
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between text-[11px] font-bold text-ink/45">
          <span className="flex items-center gap-2">
            <ChibiRobot size={26} color="#FFC93C" accent="#1A1440" mood="happy" /> H.AI HQ · {APP_VERSION}
          </span>
          <span className="flex items-center gap-3">
            <span>30 agents · orchestrated</span>
            <span aria-hidden="true">·</span>
            <span>{aiLive ? 'Gemini connected' : 'demo engine'}</span>
          </span>
        </div>
      </footer>

      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-1"
        aria-label="Admin mobile"
      >
        <div className="toon-card-dark rounded-[20px] px-1 py-1.5 flex items-center justify-between gap-0.5">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={cx(
                'relative flex-1 flex flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[8.5px] font-extrabold transition',
                page === id ? 'bg-sun/15 text-sun border border-sun/40' : 'text-ink/60 border border-transparent',
              )}
              aria-current={page === id ? 'page' : undefined}
            >
              <Icon className="w-4 h-4" />
              {label}
              {id === 'support' && open > 0 && (
                <span className="absolute top-0.5 right-1.5 min-w-[14px] h-[14px] px-1 rounded-full bg-coral border border-white/25 text-[8px] leading-[11px] text-[#04121a] font-extrabold">
                  {open}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
