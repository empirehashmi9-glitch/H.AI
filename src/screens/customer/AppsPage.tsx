import React, { useMemo, useState } from 'react';
import { Layers, Plus, Search } from 'lucide-react';
import { useApp } from '../../state/app';
import { Btn, EmptyState, SectionHead, cx } from '../../ui/Toon';
import { ProjectCard } from '../shared/ProjectCard';
import { exportProjectZip } from '../../utils/zipExport';
import { toast } from '../../components/Toast';

type Filter = 'all' | 'live' | 'ready' | 'failed';

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'ready', label: 'Ready' },
  { id: 'failed', label: 'Failed' },
];

export const AppsPage: React.FC<{ onBuild: () => void }> = ({ onBuild }) => {
  const { projects, openProject, deleteProject } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesFilter = filter === 'all' || (p.status || 'ready') === filter;
      const matchesQuery =
        !q || p.name.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [projects, query, filter]);

  return (
    <div className="space-y-5">
      <SectionHead
        eyebrow="Your shelf"
        title="My apps"
        sub="Every build lives in this browser. Open one to preview its screens, read the real source, or publish it live."
        right={
          <Btn tone="coral" onClick={onBuild}>
            <Plus className="w-4 h-4" /> New build
          </Btn>
        }
      />

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apps…"
            className="field pl-9 py-2 text-xs"
            aria-label="Search apps"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cx(
                'rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide transition',
                filter === f.id
                  ? 'bg-aqua/15 border-aqua/50 text-aqua'
                  : 'bg-white/[0.04] border-white/10 text-ink-soft hover:text-ink hover:border-aqua/35',
              )}
              aria-pressed={filter === f.id}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {visible.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onOpen={() => openProject(project.id)}
              onZip={() => {
                exportProjectZip(project).catch(() => toast.error('ZIP export failed'));
              }}
              onDelete={() => {
                if (window.confirm(`Delete "${project.name}"? The generated files will be removed from this browser.`)) {
                  deleteProject(project.id);
                  toast.success('Build deleted');
                }
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Layers className="w-6 h-6" />}
          title={projects.length ? 'No apps match that filter' : 'Your shelf is empty'}
          sub={
            projects.length
              ? 'Try a different search or filter.'
              : 'Describe an idea in the Studio and the crew will fill this shelf in about a minute.'
          }
          action={
            <Btn tone="coral" size="sm" onClick={onBuild}>
              <Plus className="w-3.5 h-3.5" /> Start a build
            </Btn>
          }
        />
      )}
    </div>
  );
};
