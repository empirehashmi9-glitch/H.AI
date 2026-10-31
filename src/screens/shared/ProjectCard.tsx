import React from 'react';
import { Apple, Clock3, Download, FileCode2, FolderOpen, Globe, Smartphone, Trash2 } from 'lucide-react';
import { GeneratedProject } from '../../types/agent';
import { timeAgo } from '../../utils/storage';
import { Btn, Panel, Pill, Stars, cx } from '../../ui/Toon';

const PALETTES: Array<[string, string]> = [
  ['#FF7A8A', '#FFC93C'],
  ['#6FD6FF', '#6C4CF1'],
  ['#3DD9B3', '#FFC93C'],
  ['#F45D9C', '#6FD6FF'],
  ['#FFC93C', '#3DD9B3'],
];

export function paletteFor(project: GeneratedProject, index = 0): [string, string] {
  const hash = Array.from(project.name).reduce((acc, ch) => acc + ch.charCodeAt(0), index);
  return PALETTES[Math.abs(hash) % PALETTES.length];
}

export const statusTone = (status?: string) =>
  status === 'live' ? 'mint' : status === 'failed' ? 'coral' : status === 'deploying' ? 'sun' : 'cream';

export const PlatformPills: React.FC<{ project: GeneratedProject; size?: 'sm' | 'md' }> = ({ project }) => (
  <>
    {project.platforms.web && <Pill tone="aqua"><Globe className="w-2.5 h-2.5" /> Web</Pill>}
    {project.platforms.ios && <Pill tone="mint"><Apple className="w-2.5 h-2.5" /> iOS</Pill>}
    {project.platforms.android && <Pill tone="sun"><Smartphone className="w-2.5 h-2.5" /> Android</Pill>}
  </>
);

export const ProjectCard: React.FC<{
  project: GeneratedProject;
  index?: number;
  onOpen: () => void;
  onZip: () => void;
  onDelete?: () => void;
  className?: string;
}> = ({ project, index = 0, onOpen, onZip, onDelete, className }) => {
  const [c1, c2] = paletteFor(project, index);
  const tagline = project.spec?.tagline || project.prompt;
  const files = project.files?.length ?? 0;

  return (
    <Panel className={cx('overflow-hidden flex flex-col group hover:-translate-y-1 transition duration-200', className)}>
      <div
        className="relative h-28 border-b border-aqua/15 p-3 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${c1}2e, ${c2}14), #03101a` }}
      >
        <div className="h-full rounded-lg border border-white/10 bg-[#02101a]/90 p-2 shadow-[0_10px_24px_rgba(0,0,0,0.45)]">
          <div className="flex items-center gap-1 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-coral/80" />
            <span className="w-1.5 h-1.5 rounded-full bg-sun/80" />
            <span className="w-1.5 h-1.5 rounded-full bg-mint/80" />
            <span className="ml-auto font-mono text-[8px] text-aqua/60 truncate max-w-[8rem]">
              {project.name.toLowerCase().replace(/\s+/g, '-')}.app
            </span>
          </div>
          <div className="font-display text-sm leading-none truncate">{project.name}</div>
          <div className="mt-1.5 flex gap-1">
            <span className="h-1 rounded-full flex-1" style={{ background: c1 }} />
            <span className="h-1 rounded-full w-6" style={{ background: c2 }} />
          </div>
          <div className="mt-1 grid grid-cols-3 gap-1">
            {[0, 1, 2].map((n) => (
              <div key={n} className="h-4 rounded bg-white/[0.04] border border-white/[0.06]" />
            ))}
          </div>
        </div>
        <div className="absolute inset-0 hud-scan opacity-20" />
      </div>

      <div className="p-4 flex-1 flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display text-lg leading-tight truncate">{project.name}</h3>
            <p className="text-[11px] text-ink-soft line-clamp-2 leading-relaxed">{tagline}</p>
          </div>
          <Stars value={project.rating || 0} size={12} className={cx('shrink-0 mt-1', !project.rating && 'hidden')} />
        </div>

        <div className="flex flex-wrap gap-1">
          <PlatformPills project={project} />
          <Pill tone={project.source === 'ai' ? 'grape' : 'cream'}>{project.source === 'ai' ? 'AI' : 'Demo'}</Pill>
          <Pill tone={statusTone(project.status) as any}>{project.status || 'ready'}</Pill>
        </div>

        <div className="mt-auto pt-2 border-t border-aqua/10 flex items-center justify-between text-[10px] font-bold text-ink-soft">
          <span className="flex items-center gap-1"><FileCode2 className="w-3 h-3" /> {files} files</span>
          <span className="flex items-center gap-1"><Clock3 className="w-3 h-3" /> {project.durationSeconds}s · {timeAgo(project.timestamp, false)}</span>
        </div>

        <div className="flex gap-1.5">
          <Btn tone="cream" size="sm" onClick={onOpen} className="flex-1">
            <FolderOpen className="w-3.5 h-3.5" /> Open
          </Btn>
          <Btn tone="cream" size="sm" onClick={onZip} aria-label="Download ZIP">
            <Download className="w-3.5 h-3.5" />
          </Btn>
          {onDelete && (
            <Btn tone="cream" size="sm" onClick={onDelete} aria-label="Delete build" title="Delete build">
              <Trash2 className="w-3.5 h-3.5" />
            </Btn>
          )}
        </div>
      </div>
    </Panel>
  );
};
