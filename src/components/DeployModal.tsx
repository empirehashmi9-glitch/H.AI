import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Database, Globe, Rocket, Shield } from 'lucide-react';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName: string;
  supabaseSql: string;
}

export const DeployModal: React.FC<DeployModalProps> = ({
  isOpen,
  onClose,
  appName,
  supabaseSql
}) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedVercel, setCopiedVercel] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(supabaseSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleSimulateDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setDeployedUrl(`https://${appName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.vercel.app`);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-600 flex items-center justify-center font-bold text-slate-950">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Autonomous Deployment Hub</div>
            <h2 className="text-2xl font-bold text-white font-orbitron">Deploy {appName}</h2>
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1: Vercel */}
          <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Vercel Frontend & Edge Hosting</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">ONE-CLICK</span>
            </div>
            <p className="text-xs text-slate-400">
              Vite React SPA and edge rewrites are pre-configured in <code>vercel.json</code>.
            </p>

            {deployedUrl ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-300 truncate">{deployedUrl}</span>
                <a
                  href={deployedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5"
                >
                  Visit <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <button
                onClick={handleSimulateDeploy}
                disabled={isDeploying}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <Rocket className="w-4 h-4" />
                {isDeploying ? 'Deploying to Vercel...' : 'Deploy to Vercel Production'}
              </button>
            )}
          </div>

          {/* Step 2: Supabase */}
          <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Supabase PostgreSQL & Auth</h3>
              </div>
              <button
                onClick={handleCopySql}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5"
              >
                {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedSql ? 'Copied' : 'Copy SQL'}
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Auto-generated relational schema with Row Level Security (RLS) policies. Paste into Supabase SQL Editor:
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-400 max-h-32 overflow-y-auto">
              <pre className="whitespace-pre">{supabaseSql.slice(0, 400)}...</pre>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
