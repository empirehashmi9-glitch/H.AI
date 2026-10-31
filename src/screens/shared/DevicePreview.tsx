import React from 'react';
import { Apple, Smartphone } from 'lucide-react';
import { GeneratedProject } from '../../types/agent';
import { paletteFor } from './ProjectCard';
import { cx } from '../../ui/Toon';

export const BrowserFrame: React.FC<{
  project: GeneratedProject;
  className?: string;
  height?: string;
}> = ({ project, className, height = 'h-[360px] sm:h-[520px]' }) => {
  const url = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.app`;
  return (
    <div className={cx('rounded-2xl border border-aqua/20 bg-[#03101a] shadow-[0_18px_40px_rgba(0,0,0,0.5)] overflow-hidden', className)}>
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-aqua/15 bg-[#04161f]">
        <span className="w-2.5 h-2.5 rounded-full bg-coral/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-sun/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-mint/80" />
        <div className="ml-2 flex-1 min-w-0 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-mono text-aqua/70 truncate">
          https://{url}
        </div>
      </div>
      {project.previewHtml ? (
        <iframe
          title={`${project.name} live preview`}
          srcDoc={project.previewHtml}
          sandbox="allow-scripts allow-forms allow-modals"
          className={cx('w-full bg-white/5 block', height)}
        />
      ) : (
        <div className={cx('grid place-items-center bg-white/5 text-center p-8', height)}>
          <div>
            <div className="font-display text-lg">No preview yet</div>
            <p className="text-xs text-ink-soft mt-1">Build with the Studio to generate a live preview.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const PhoneMockup: React.FC<{
  project: GeneratedProject;
  platform: 'ios' | 'android';
  className?: string;
}> = ({ project, platform, className }) => {
  const [primary, accent] = paletteFor(project, platform === 'ios' ? 1 : 2);
  const features = project.spec?.features?.slice(0, 3) ?? [];
  const fallback = [
    { title: 'Realtime core', description: 'Live data synced with Supabase' },
    { title: 'Native screens', description: platform === 'ios' ? 'SwiftUI 6 stack' : 'Jetpack Compose M3' },
    { title: 'Cloud sync', description: 'Edge deploy on Vercel' },
  ];
  const list = features.length ? features : fallback;
  const isIos = platform === 'ios';

  return (
    <div className={cx('mx-auto w-[240px] sm:w-[260px]', className)}>
      <div className="rounded-[38px] border border-aqua/25 bg-[#03101a] p-2 shadow-[0_22px_45px_rgba(0,0,0,0.55)]">
        <div className="relative rounded-[28px] overflow-hidden bg-[#02101a]">
          {isIos ? (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-[#03101a] border border-white/10 z-10" />
          ) : (
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#03101a] border border-white/10 z-10" />
          )}
          <div
            className="px-3 pt-7 pb-3 min-h-[420px] flex flex-col gap-2.5"
            style={{
              background: isIos
                ? `linear-gradient(180deg, ${primary}26 0%, #02101a 55%)`
                : `linear-gradient(180deg, ${accent}26 0%, #02101a 55%)`,
            }}
          >
            <div className="flex items-center justify-between text-[9px] font-extrabold text-ink/70">
              <span>{isIos ? '9:41' : '10:00'}</span>
              <span className="flex items-center gap-1">
                {isIos ? <Apple className="w-2.5 h-2.5" /> : <Smartphone className="w-2.5 h-2.5" />}
                {isIos ? 'iOS 18' : 'Android 15'}
              </span>
            </div>

            <div
              className="rounded-xl border border-white/10 p-3 shadow-[0_12px_24px_rgba(0,0,0,0.45)]"
              style={{ background: `linear-gradient(135deg, ${primary}3d, ${accent}1f)` }}
            >
              <div className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-aqua/70">
                {project.spec?.category || 'H.AI app'}
              </div>
              <div className="font-display text-base leading-tight mt-0.5 text-ink">{project.name}</div>
              <div className="text-[9px] font-bold text-ink-soft line-clamp-2">
                {project.spec?.tagline || project.prompt}
              </div>
            </div>

            {list.map((f, i) => (
              <div
                key={`${f.title}-${i}`}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 flex items-center gap-2"
              >
                <span
                  className="w-6 h-6 rounded-lg border border-white/15 shrink-0 grid place-items-center text-[9px] font-display font-bold text-ink"
                  style={{ background: i % 2 === 0 ? `${accent}40` : `${primary}40` }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="text-[10px] font-extrabold truncate text-ink">{f.title}</div>
                  <div className="text-[8px] text-ink-soft line-clamp-1">{f.description}</div>
                </div>
              </div>
            ))}

            <div
              className="mt-auto rounded-xl border border-white/15 py-2 text-center text-[10px] font-extrabold uppercase tracking-wide text-ink"
              style={{ background: `linear-gradient(90deg, ${primary}40, ${accent}33)` }}
            >
              {isIos ? 'Continue with Face ID' : 'Continue with Play'}
            </div>

            <div className="flex items-center justify-around pt-1 text-ink/45">
              <span className="w-2.5 h-2.5 rounded-full bg-current" />
              <span className="w-2.5 h-2.5 rounded-full bg-current" />
              <span className="w-2.5 h-2.5 rounded-full bg-current" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 text-center text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-soft">
        {isIos ? 'SwiftUI 6 preview' : 'Compose M3 preview'}
      </div>
    </div>
  );
};
