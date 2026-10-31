import React from 'react';
import { ArrowRight, Boxes, Hammer, MessageSquareText, Rocket, Wand2 } from 'lucide-react';
import { useApp } from '../../state/app';
import { Btn, EmptyState, IconTile, Panel, Pill, Sticker } from '../../ui/Toon';
import { BuildComposer } from '../shared/BuildComposer';
import { ProjectCard } from '../shared/ProjectCard';
import { exportProjectZip } from '../../utils/zipExport';
import { toast } from '../../components/Toast';

const STEPS = [
  {
    icon: MessageSquareText,
    tone: 'sun' as const,
    title: 'Describe it',
    copy: 'One sentence in plain English or Roman Urdu. Add platforms if you like.',
  },
  {
    icon: Hammer,
    tone: 'coral' as const,
    title: 'Watch the crew',
    copy: '30 agents split the work — architecture, web, iOS, Android, database and deploy.',
  },
  {
    icon: Rocket,
    tone: 'mint' as const,
    title: 'Ship it',
    copy: 'Preview the real app, download the source ZIP, then publish to Vercel & Supabase.',
  },
];

export const StudioPage: React.FC<{ onOpenApps: () => void }> = ({ onOpenApps }) => {
  const { projects, openProject, aiLive } = useApp();
  const live = projects.filter((p) => p.status === 'live').length;

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="space-y-3">
        <Sticker tone="coral">Hi, builder</Sticker>
        <h1 className="text-[2.1rem] leading-[1.04] sm:text-5xl text-ink">
          What should we <span className="text-coral">make</span> today?
        </h1>
        <p className="text-sm text-ink-soft leading-relaxed max-w-xl">
          Drop an idea below. H.AI Studio turns it into a real web app, an iOS app and an Android
          app — then helps you put it live.
        </p>
        <div className="flex flex-wrap gap-1.5">
          <Pill tone={aiLive ? 'mint' : 'sun'} dot={aiLive ? '#159570' : '#B07800'}>
            {aiLive ? 'Gemini live' : 'Demo engine'}
          </Pill>
          <Pill tone="cream">{projects.length} {projects.length === 1 ? 'build' : 'builds'}</Pill>
          <Pill tone="cream">{live} live</Pill>
        </div>
      </section>

      <BuildComposer />

      {!projects.length && (
        <Panel className="p-4 sm:p-5 border-aqua/15">
          <div className="flex items-center gap-2 mb-3">
            <IconTile tone="aqua" className="w-8 h-8 rounded-lg">
              <Wand2 className="w-4 h-4" />
            </IconTile>
            <h2 className="text-lg leading-none">From idea to live in three hops</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-2.5">
            {STEPS.map(({ icon: Icon, tone, title, copy }, i) => (
              <div key={title} className="rounded-xl border border-aqua/15 bg-white/[0.03] p-3 flex gap-2.5">
                <IconTile tone={tone} className="w-9 h-9 rounded-lg">
                  <Icon className="w-4 h-4" />
                </IconTile>
                <div className="min-w-0">
                  <div className="font-display text-sm leading-none">{i + 1}. {title}</div>
                  <p className="text-[10px] font-semibold text-ink-soft mt-1 leading-relaxed">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl text-ink leading-none">Recent builds</h2>
            <p className="text-[11px] font-bold text-ink-soft mt-1">Saved in this browser</p>
          </div>
          <Btn tone="cream" size="sm" onClick={onOpenApps}>
            All apps <ArrowRight className="w-3.5 h-3.5" />
          </Btn>
        </div>

        {projects.length ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {projects.slice(0, 2).map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onOpen={() => openProject(project.id)}
                onZip={() => {
                  exportProjectZip(project).catch(() => toast.error('ZIP export failed'));
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Boxes className="w-6 h-6" />}
            title="No apps yet"
            sub="Your first build will appear here. One sentence is all it takes."
          />
        )}
      </section>
    </div>
  );
};
