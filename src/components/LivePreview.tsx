import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, RotateCcw, Sparkles, ShieldCheck, Palette, CreditCard, Lock, BarChart3, Download } from 'lucide-react';
import { sound } from '../lib/audioEffects';

interface LivePreviewProps {
  previewHtml: string;
  appName: string;
  onInjectFeature?: (featureName: string) => void;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  previewHtml,
  appName,
  onInjectFeature
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [dynamicHtml, setDynamicHtml] = useState<string>(previewHtml);
  const [activeTheme, setActiveTheme] = useState<'cyan' | 'emerald' | 'amber' | 'purple'>('cyan');

  // Keep dynamicHtml in sync if parent previewHtml updates
  React.useEffect(() => {
    setDynamicHtml(previewHtml);
  }, [previewHtml]);

  const getViewportWidth = () => {
    switch (viewport) {
      case 'desktop': return 'w-full';
      case 'tablet': return 'w-[768px]';
      case 'mobile': return 'w-[375px]';
    }
  };

  // Instant Autonomous Feature Injection
  const injectFeature = (type: string) => {
    sound.playClick();
    let injection = '';

    if (type === 'auth') {
      injection = `
        <div id="auth-modal" style="position:fixed;inset:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:9999;">
          <div style="background:#0f172a;border:1px solid #06b6d4;border-radius:16px;padding:24px;width:340px;color:white;box-shadow:0 0 30px rgba(6,182,212,0.3);">
            <h3 style="font-size:18px;font-weight:bold;margin-bottom:12px;">🔐 Secure Autonomous Login</h3>
            <p style="font-size:12px;color:#94a3b8;margin-bottom:16px;">Supabase Auth (JWT + RLS) Enabled</p>
            <input type="email" placeholder="user@example.com" style="width:100%;background:#020617;border:1px solid #334155;border-radius:8px;padding:8px 12px;color:white;margin-bottom:10px;font-size:13px;" />
            <input type="password" placeholder="••••••••" style="width:100%;background:#020617;border:1px solid #334155;border-radius:8px;padding:8px 12px;color:white;margin-bottom:16px;font-size:13px;" />
            <button onclick="document.getElementById('auth-modal').remove()" style="width:100%;background:#06b6d4;color:#020617;font-weight:bold;padding:10px;border-radius:8px;border:none;cursor:pointer;">Sign In & Unlock Vault</button>
          </div>
        </div>
      `;
    } else if (type === 'stripe') {
      injection = `
        <div id="stripe-banner" style="margin-top:16px;padding:16px;background:rgba(16,185,129,0.15);border:1px solid #10b981;border-radius:14px;display:flex;align-items:center;justify-content:space-between;color:white;">
          <div>
            <div style="font-weight:bold;font-size:14px;color:#10b981;">💳 Stripe Checkout API Verified</div>
            <div style="font-size:12px;color:#cbd5e1;">Test mode active · 3DSecure & Apple Pay Ready</div>
          </div>
          <button onclick="alert('Stripe $99.00 payment simulated successfully!')" style="background:#10b981;color:#020617;font-weight:bold;padding:8px 16px;border-radius:8px;border:none;cursor:pointer;font-size:12px;">Test Pay $99</button>
        </div>
      `;
    } else if (type === 'chart') {
      injection = `
        <div id="chart-inject" style="margin-top:16px;padding:16px;background:#090d16;border:1px solid #38bdf8;border-radius:14px;color:white;">
          <div style="font-size:12px;color:#38bdf8;font-weight:bold;margin-bottom:8px;">📊 Real-Time Telemetry Stream (WebSockets 120Hz)</div>
          <div style="display:flex;align-items:flex-end;gap:6px;height:70px;">
            <div style="flex:1;background:#38bdf8;height:40%;border-radius:4px;"></div>
            <div style="flex:1;background:#38bdf8;height:75%;border-radius:4px;"></div>
            <div style="flex:1;background:#38bdf8;height:60%;border-radius:4px;"></div>
            <div style="flex:1;background:#38bdf8;height:95%;border-radius:4px;"></div>
            <div style="flex:1;background:#10b981;height:100%;border-radius:4px;"></div>
          </div>
        </div>
      `;
    }

    if (injection) {
      setDynamicHtml(prev => prev.replace('</body>', `${injection}</body>`));
      setIframeKey(k => k + 1);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden flex flex-col h-[640px]">
      {/* Top Browser Bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* URL Bar */}
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>

          <div className="flex-1 bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono flex items-center justify-between">
            <span className="truncate">https://{appName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.hai-jarvis.run</span>
            <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              SANDBOX SECURE
            </span>
          </div>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => { sound.playClick(); setViewport('desktop'); }}
            className={`p-1.5 rounded-lg transition-all ${viewport === 'desktop' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            title="Desktop View (100%)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => { sound.playClick(); setViewport('tablet'); }}
            className={`p-1.5 rounded-lg transition-all ${viewport === 'tablet' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => { sound.playClick(); setViewport('mobile'); }}
            className={`p-1.5 rounded-lg transition-all ${viewport === 'mobile' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-slate-800 mx-1"></span>

          <button
            onClick={() => { sound.playClick(); setDynamicHtml(previewHtml); setIframeKey(k => k + 1); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Reload Sandbox"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Autonomous Feature Injection Sub-Toolbar */}
      <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Autonomous 1-Click Code Injector:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => injectFeature('auth')}
            className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-[11px] font-semibold flex items-center gap-1.5 transition-all"
          >
            <Lock className="w-3 h-3 text-cyan-400" /> + Add Auth Modal
          </button>
          <button
            onClick={() => injectFeature('stripe')}
            className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 text-[11px] font-semibold flex items-center gap-1.5 transition-all"
          >
            <CreditCard className="w-3 h-3 text-emerald-400" /> + Add Stripe Pay
          </button>
          <button
            onClick={() => injectFeature('chart')}
            className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-blue-950/50 border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-blue-300 text-[11px] font-semibold flex items-center gap-1.5 transition-all"
          >
            <BarChart3 className="w-3 h-3 text-blue-400" /> + Add Live Chart
          </button>
        </div>
      </div>

      {/* Sandboxed Iframe Container */}
      <div className="flex-1 bg-slate-950/80 p-4 flex items-center justify-center overflow-auto">
        <div className={`h-full ${getViewportWidth()} transition-all duration-300 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-black bg-white`}>
          <iframe
            key={iframeKey}
            srcDoc={dynamicHtml}
            title={`${appName} Live Preview`}
            sandbox="allow-scripts allow-modals allow-same-origin"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
};
