import React, { useMemo, useState } from 'react';
import { Boxes, Download, Rocket, Search, Sparkles, Store } from 'lucide-react';
import { useApp } from '../../state/app';
import { Btn, EmptyState, Panel, Pill, SectionHead, cx } from '../../ui/Toon';
import { ProjectCard } from '../shared/ProjectCard';
import { exportProjectZip } from '../../utils/zipExport';
import { toast } from '../../components/Toast';

type Filter = 'all' | 'live' | 'ready' | 'failed';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'ready', label: 'Ready' },
  { id: 'failed', label: 'Failed' },
];

export const BuildsPage: React.FC = () => {
  const { projects, openProject, setMode, deleteProject } = useApp();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (filter !== 'all' && (p.status || 'ready') !== filter) return false;
      if (!q) return true;
      return `${p.name} ${p.prompt} ${p.spec?.category || ''}`.toLowerCase().includes(q);
    });
  }, [projects, filter, query]);

  const open = (id: string) => {
    openProject(id);
    setMode('customer');
  };

  const live = projects.filter((p) => p.status === 'live').length;
  const files = projects.reduce((s, p) => s + (p.files?.length || 0), 0);

  return (
    <div className="space-y-4 sm:space-y-5">
      <SectionHead
        light
        eyebrow="Build registry"
        title="Every app the factory made"
        sub="Search build history, download source ZIPs and jump straight into a customer's project."
        right={
          <div className="flex flex-wrap gap-1.5">
            <Pill tone="dark"><Rocket className="w-3 h-3" /> {projects.length} builds</Pill>
            <Pill tone="dark"><Sparkles className="w-3 h-3" /> {live} live</Pill>
            <Pill tone="dark">{files} files</Pill>
          </div>
        }
      />

      <Panel className="p-3 flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by app name, prompt or category"
            className="field pl-9 py-2 text-xs"
            aria-label="Search builds"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cx(
                'px-3 py-1.5 rounded-full border text-[11px] font-extrabold transition shrink-0',
                filter === f.id
                  ? 'bg-aqua/15 border-aqua/50 text-aqua'
                  : 'bg-white/[0.04] border-white/10 text-ink-soft hover:border-aqua/35 hover:text-ink',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Panel>

      {visible.length ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onOpen={() => open(project.id)}
              onZip={() => {
                exportProjectZip(project).catch(() => toast.error('ZIP export failed'));
              }}
              onDelete={() => {
                if (window.confirm(`Delete "${project.name}" from this workspace?`)) {
                  deleteProject(project.id);
                  toast.success('Build deleted');
                }
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Boxes className="w-6 h-6" />}
          title={projects.length ? 'No builds match that filter' : 'The factory is quiet'}
          sub={projects.length ? 'Try another status or clear the search.' : 'When a customer ships their first app it will land here.'}
          action={
            <Btn tone="coral" size="sm" onClick={() => setMode('customer')}>
              <Store className="w-3.5 h-3.5" /> Open customer studio
            </Btn>
          }
        />
      )}

      {projects.length > 0 && (
        <p className="text-[10px] font-bold text-ink/45 flex items-center gap-1.5">
          <Download className="w-3 h-3" /> ZIP export includes web, iOS, Android and SQL files. Keys are never included.
        </p>
      )}
    </div>
  );
};
