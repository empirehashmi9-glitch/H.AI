import React from 'react';
import { Cpu, Database, ShieldCheck, KeyRound, Server, Sparkles } from 'lucide-react';
import { useApp } from '../../state/app';
import { Btn, IconTile, Panel, Pill, SectionHead } from '../../ui/Toon';
import { SettingsPanel } from '../shared/SettingsPanel';
import { APP_VERSION } from '../../config/app';
import { toast } from '../../components/Toast';

export const SettingsPage: React.FC = () => {
  const { settings, aiLive, clusterScale, setClusterScale, setMode } = useApp();

  return (
    <div className="space-y-4 sm:space-y-5">
      <SectionHead
        light
        eyebrow="Platform settings"
        title="Keys, cluster and local data"
        sub="The same workspace settings customers use, plus factory controls. Nothing is sent anywhere except to the provider you call."
        right={
          <div className="flex flex-wrap gap-1.5">
            <Pill tone="dark">{APP_VERSION}</Pill>
            <Pill tone="dark" dot={aiLive ? '#3DD9B3' : '#FFC93C'}>{aiLive ? 'Gemini live' : 'demo mode'}</Pill>
          </div>
        }
      />

      <div className="grid sm:grid-cols-3 gap-3">
        <Panel className="p-3.5 flex items-center gap-2.5">
          <IconTile tone="grape" className="w-9 h-9 rounded-lg">
            <KeyRound className="w-4 h-4" />
          </IconTile>
          <div className="min-w-0">
            <div className="text-[9px] font-extrabold uppercase tracking-wider text-ink-soft">Gemini key</div>
            <div className="text-xs font-extrabold truncate">{settings.geminiKey ? 'saved locally' : 'not set'}</div>
          </div>
        </Panel>
        <Panel className="p-3.5 flex items-center gap-2.5">
          <IconTile tone="coral" className="w-9 h-9 rounded-lg">
            <Server className="w-4 h-4" />
          </IconTile>
          <div className="min-w-0">
            <div className="text-[9px] font-extrabold uppercase tracking-wider text-ink-soft">Cluster</div>
            <div className="text-xs font-extrabold truncate">{clusterScale.toLocaleString()} agents</div>
          </div>
        </Panel>
        <Panel className="p-3.5 flex items-center gap-2.5">
          <IconTile tone="mint" className="w-9 h-9 rounded-lg">
            <Database className="w-4 h-4" />
          </IconTile>
          <div className="min-w-0">
            <div className="text-[9px] font-extrabold uppercase tracking-wider text-ink-soft">Deploys</div>
            <div className="text-xs font-extrabold truncate">
              {settings.vercelToken ? 'Vercel ready' : 'Vercel off'} · {settings.supabaseToken ? 'Supabase ready' : 'Supabase off'}
            </div>
          </div>
        </Panel>
      </div>

      <SettingsPanel />

      <div className="grid sm:grid-cols-2 gap-3">
        <Panel className="p-4 space-y-2.5">
          <h3 className="text-base leading-none flex items-center gap-1.5">
            <Cpu className="w-4 h-4" /> Factory controls
          </h3>
          <p className="text-[10px] font-semibold text-ink-soft leading-relaxed">
            Reset the autoscaler to its 30-agent baseline. Cost, CPU and memory estimates update instantly on the command deck.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Btn tone="cream" size="sm" onClick={() => { setClusterScale(30); toast.success('Cluster reset to baseline'); }}>
              Reset to 30
            </Btn>
            <Btn tone="grape" size="sm" onClick={() => setMode('customer')}>
              <Sparkles className="w-3.5 h-3.5" /> Customer view
            </Btn>
          </div>
        </Panel>

        <Panel className="p-4 space-y-2">
          <h3 className="text-base leading-none flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Security posture
          </h3>
          <ul className="space-y-1.5 text-[10px] font-semibold text-ink-soft leading-relaxed">
            <li>· Keys live in this browser's localStorage only.</li>
            <li>· Backups strip every key and secret.</li>
            <li>· Generated SQL enforces RLS on every table.</li>
            <li>· Previews run in sandboxed iframes.</li>
          </ul>
        </Panel>
      </div>
    </div>
  );
};
