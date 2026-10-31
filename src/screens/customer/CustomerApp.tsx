import React, { useEffect, useState } from 'react';
import {
  Globe2, Headphones, Layers, Settings2, Wand2,
} from 'lucide-react';
import { useApp } from '../../state/app';
import { CustomerBackdrop } from '../../ui/Backdrop';
import { ChibiRobot } from '../../ui/Chibi';
import { Pill, cx } from '../../ui/Toon';
import { APP_VERSION } from '../../config/app';
import { StudioPage } from './StudioPage';
import { AppsPage } from './AppsPage';
import { AppDetailPage } from './AppDetailPage';
import { SupportPage } from './SupportPage';
import { AccountPage } from './AccountPage';

export type CustomerPage = 'studio' | 'apps' | 'app' | 'support' | 'account';

const NAV = [
  { id: 'studio' as const, label: 'Studio', icon: Wand2 },
  { id: 'apps' as const, label: 'My apps', icon: Layers },
  { id: 'support' as const, label: 'Support', icon: Headphones },
  { id: 'account' as const, label: 'Account', icon: Settings2 },
];

export const CustomerApp: React.FC = () => {
  const { setMode, aiLive, pendingOpen, consumeOpen } = useApp();
  const [page, setPage] = useState<CustomerPage>('studio');

  useEffect(() => {
    if (pendingOpen) {
      consumeOpen();
      setPage('app');
    }
  }, [pendingOpen, consumeOpen]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const navActive = page === 'app' ? 'apps' : page;

  return (
    <div className="relative min-h-screen flex flex-col">
      <CustomerBackdrop />

      <header className="sticky top-2 sm:top-3 z-40 px-3 sm:px-5 w-full max-w-6xl mx-auto">
        <div className="toon-card rounded-[22px] sm:rounded-full px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
          <button
            onClick={() => setPage('studio')}
            className="flex items-center gap-2.5 min-w-0 text-left"
            aria-label="H.AI Studio home"
          >
            <span className="w-9 h-9 shrink-0 rounded-xl bg-aqua/10 border border-aqua/60 text-aqua shadow-[0_0_16px_rgba(34,211,238,0.35)] grid place-items-center font-display text-base font-bold">
              H
            </span>
            <span className="min-w-0">
              <span className="block font-display text-base leading-none">H.AI Studio</span>
              <span className="block text-[10px] font-bold text-ink-soft truncate">J.A.R.V.I.S. console · prompt → app → live</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-0.5" aria-label="Studio">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setPage(id)}
                className={cx(
                  'px-3 py-1.5 rounded-full text-xs font-extrabold transition flex items-center gap-1.5 border',
                  navActive === id
                    ? 'bg-coral/15 border-coral/50 text-coral shadow-[0_0_16px_rgba(255,122,138,0.15)]'
                    : 'border-transparent text-ink-soft hover:bg-white/10 hover:text-ink',
                )}
                aria-current={navActive === id ? 'page' : undefined}
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

      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-3 sm:px-5 pt-4 sm:pt-6 pb-28 md:pb-10">
        <div key={page} className="anim-rise">
          {page === 'studio' && <StudioPage onOpenApps={() => setPage('apps')} />}
          {page === 'apps' && <AppsPage onBuild={() => setPage('studio')} />}
          {page === 'app' && (
            <AppDetailPage
              onBack={() => setPage('apps')}
              onGoAccount={() => setPage('account')}
              onNewBuild={() => setPage('studio')}
            />
          )}
          {page === 'support' && <SupportPage />}
          {page === 'account' && <AccountPage />}
        </div>
      </main>

      <footer className="relative z-10 hidden md:block border-t border-aqua/10 pb-6">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between text-[11px] font-bold text-ink-soft">
          <span className="flex items-center gap-2">
            <ChibiRobot size={26} color="#6FD6FF" mood="happy" /> H.AI Studio · {APP_VERSION}
          </span>
          <span>Built and stored in this browser</span>
        </div>
      </footer>

      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-1"
        aria-label="Studio mobile"
      >
        <div className="toon-card rounded-[22px] px-1.5 py-1.5 flex items-center justify-between">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={cx(
                'flex-1 flex flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[9px] font-extrabold transition',
                navActive === id ? 'bg-aqua/15 border border-aqua/50 text-aqua' : 'text-ink-soft',
              )}
              aria-current={navActive === id ? 'page' : undefined}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
