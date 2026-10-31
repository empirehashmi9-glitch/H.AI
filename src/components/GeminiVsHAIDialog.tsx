import React from 'react';
import { X, Cpu, Zap, Shield, Sparkles, Check, ArrowRight, Layers, Workflow, CheckCircle2 } from 'lucide-react';

interface GeminiVsHAIDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiVsHAIDialog: React.FC<GeminiVsHAIDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Cpu className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="text-xs font-mono text-cyan-400 tracking-widest uppercase">Deep Technical Analysis</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-orbitron">
              Gemini vs H.AI: Kaun Zada Advance Hai?
            </h2>
          </div>
        </div>

        {/* Short Executive Summary / Direct Answer */}
        <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-slate-950 border border-cyan-500/30 rounded-2xl p-5 mb-8">
          <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Asal Sach (The Direct Answer):
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed">
            <b>Gemini aur H.AI aamne-saamne dushman nahi hain — balke H.AI ka dimagh hi Gemini hai!</b>
            <br />
            Aasan misaal: <span className="text-cyan-300 font-semibold">Gemini ek super-intelligent Ferrari ka Engine hai</span>, jabke <span className="text-emerald-300 font-semibold">H.AI poori Ferrari car, uska J.A.R.V.I.S. autopilot, 30 specialist mechanics, aur live factory hai!</span>
          </p>
        </div>

        {/* Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Gemini Box */}
          <div className="bg-slate-950/70 border border-blue-500/30 rounded-2xl p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full font-bold">FOUNDATION MODEL</span>
              <span className="text-xs text-slate-400">Google DeepMind</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Google Gemini 2.5 / Flash</h3>
            <p className="text-xs text-slate-300 mb-4">
              Duniya ka sab se taqatwar multimodal neural network with 1M-2M context window.
            </p>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span><b>Raw Reasoning:</b> Complex logic, algorithms aur deep math me champion.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span><b>Multimodal:</b> Text, Audio, Video aur Images ko aik sath samajhta hai.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span><b>Limitation:</b> Akela Gemini sirf text/code stream karta hai; wo khud se multi-platform project compile, test ya deploy nahi karta.</span>
              </div>
            </div>
          </div>

          {/* H.AI Box */}
          <div className="bg-slate-950/70 border border-cyan-500/40 rounded-2xl p-6 relative shadow-lg shadow-cyan-950/30">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full font-bold">AUTONOMOUS FACTORY</span>
              <span className="text-xs text-emerald-400 font-mono">POWERED BY GEMINI</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">H.AI · J.A.R.V.I.S. Factory</h3>
            <p className="text-xs text-slate-300 mb-4">
              30 autonomous specialist agents ka ecosystem jo ek prompt ko complete working app me convert karta hai.
            </p>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><b>30 Agents in Parallel:</b> UI design, iOS, Android, Database & QA alag alag agents handle karte hain.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><b>Triple Platform Output:</b> Web (React 19) + iOS (SwiftUI) + Android (Compose) ek sath generate hoti hain.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><b>Automated Execution:</b> Supabase SQL RLS rules, automated unit tests, aur live iframe preview run hota hai.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 mb-6">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase border-b border-slate-800">
              <tr>
                <th className="p-3.5">Khususiyat (Feature)</th>
                <th className="p-3.5 text-blue-400">Gemini (Stand-Alone)</th>
                <th className="p-3.5 text-cyan-400">H.AI (Multi-Agent Factory)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-sans">
              <tr>
                <td className="p-3.5 font-semibold text-white">AI Brain & Knowledge</td>
                <td className="p-3.5 text-emerald-400 font-semibold">Super-Intelligent (Google Brain)</td>
                <td className="p-3.5 text-emerald-400 font-semibold">Gemini Brain use karta hai</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-white">30 Specialized Agents</td>
                <td className="p-3.5 text-slate-400">Nahi (Single Assistant)</td>
                <td className="p-3.5 text-cyan-400 font-bold">Haan (30 Parallel Squads)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-white">Simultaneous iOS + Android + Web</td>
                <td className="p-3.5 text-slate-400">Alag alag prompt se mangna parta hai</td>
                <td className="p-3.5 text-cyan-400 font-bold">1 Prompt me teeno ek sath (90s)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-white">Automated Unit Testing</td>
                <td className="p-3.5 text-slate-400">Code likhta hai magar test khud nahi chalata</td>
                <td className="p-3.5 text-cyan-400 font-bold">ULTRON-TEST khud run karta hai</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-white">Live In-Browser Sandbox</td>
                <td className="p-3.5 text-slate-400">Nahi</td>
                <td className="p-3.5 text-cyan-400 font-bold">Haan, Live Iframe Preview</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-white">ZIP Export & One-Click Deploy</td>
                <td className="p-3.5 text-slate-400">Manual copy paste</td>
                <td className="p-3.5 text-cyan-400 font-bold">Instant .ZIP & Vercel/Supabase ready</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Final Conclusion Box */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-300">
            <span className="text-emerald-400 font-bold">Faisla (Conclusion):</span> H.AI Gemini ko replace nahi karta, balke Gemini ko uske aamne-saamne aane wale AI tools (Groq, Claude 3.5, Cursor) ke muqable me 10 guna zyada tez aur multi-agent autonomous banata hai!
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0"
          >
            Samajh Gaya (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
