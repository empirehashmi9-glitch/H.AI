import React, { useState } from 'react';
import { 
  Globe, 
  Smartphone, 
  Database, 
  CloudUpload, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Code2, 
  Eye, 
  Terminal,
  Rotate3d,
  ShoppingBag,
  Star,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { GeneratedProject, Language } from '../types/agent';
import { exportProjectZip } from '../utils/zipExport';
import { ThreeDeviceShowcase } from './ThreeDeviceShowcase';

interface MultiplatformOutputViewProps {
  project: GeneratedProject | null;
  language: Language;
}

export const MultiplatformOutputView: React.FC<MultiplatformOutputViewProps> = ({ project, language }) => {
  const isUrdu = language === 'ur';
  const [activePlatform, setActivePlatform] = useState<'web' | 'ios' | 'android' | 'supabase' | 'vercel'>('web');
  const [activeViewMode, setActiveViewMode] = useState<'preview' | '3d' | 'code'>('preview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!project) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-white/[0.04] border border-white/[0.08] text-slate-400 flex items-center justify-center">
          <Code2 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">
          {isUrdu ? 'کوئی پراجیکٹ تیار نہیں ہوا' : 'No Generated Project Found'}
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed">
          {isUrdu 
            ? 'پرامپٹ فورج ٹیب میں جائیں اور کسی بھی پرامپٹ کے ذریعے خودکار تعمیر شروع کریں۔'
            : 'Navigate to the Forge tab and launch autonomous build to see live Web, iOS, Android, Supabase and Vercel artifacts.'}
        </p>
      </div>
    );
  }

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      await exportProjectZip(project);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto">
      {/* Project Banner */}
      <div className="p-6 rounded-3xl bg-[#0d0f17] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Production Live
            </span>
            <span>·</span>
            <span>Build in {project.durationSeconds}s</span>
            <span>·</span>
            <span className="text-slate-500">{project.id}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{project.name}</h2>
          <p className="text-xs text-slate-400 max-w-2xl line-clamp-1">{project.prompt}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDownloadZip}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-200 font-bold text-xs transition flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting...' : (isUrdu ? 'مکمل ZIP ڈاؤن لوڈ کریں' : 'Download Full Source ZIP')}</span>
          </button>
        </div>
      </div>

      {/* Platform & View Mode Nav Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        {/* Platform Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActivePlatform('web')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activePlatform === 'web'
                ? 'bg-white text-slate-900 font-semibold'
                : 'text-slate-400 hover:text-white bg-white/[0.02]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Web (React 19)</span>
          </button>

          <button
            onClick={() => setActivePlatform('ios')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activePlatform === 'ios'
                ? 'bg-white text-slate-900 font-semibold'
                : 'text-slate-400 hover:text-white bg-white/[0.02]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iOS (SwiftUI 6)</span>
          </button>

          <button
            onClick={() => setActivePlatform('android')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activePlatform === 'android'
                ? 'bg-white text-slate-900 font-semibold'
                : 'text-slate-400 hover:text-white bg-white/[0.02]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android (Compose)</span>
          </button>

          <button
            onClick={() => setActivePlatform('supabase')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activePlatform === 'supabase'
                ? 'bg-white text-slate-900 font-semibold'
                : 'text-slate-400 hover:text-white bg-white/[0.02]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Database & RLS</span>
          </button>

          <button
            onClick={() => setActivePlatform('vercel')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activePlatform === 'vercel'
                ? 'bg-white text-slate-900 font-semibold'
                : 'text-slate-400 hover:text-white bg-white/[0.02]'
            }`}
          >
            <CloudUpload className="w-3.5 h-3.5" />
            <span>Vercel Edge Live</span>
          </button>
        </div>

        {/* View Mode (Preview, 3D Stage, Code) */}
        {(activePlatform === 'web' || activePlatform === 'ios' || activePlatform === 'android') && (
          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/[0.06] shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setActiveViewMode('preview')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                activeViewMode === 'preview'
                  ? 'bg-white/[0.12] text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'پریویو' : 'Visual Preview'}</span>
            </button>

            <button
              onClick={() => setActiveViewMode('3d')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                activeViewMode === '3d'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Rotate3d className="w-3.5 h-3.5" />
              <span>{isUrdu ? '3D اسٹیج' : '3D Stage'}</span>
            </button>

            <button
              onClick={() => setActiveViewMode('code')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                activeViewMode === 'code'
                  ? 'bg-white/[0.12] text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'کوڈ' : 'Source Code'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 3D Stage View */}
      {activeViewMode === '3d' && (activePlatform === 'web' || activePlatform === 'ios' || activePlatform === 'android') && (
        <ThreeDeviceShowcase project={project} language={language} />
      )}

      {/* 1. WEB PLATFORM */}
      {activePlatform === 'web' && activeViewMode !== '3d' && (
        <div className="space-y-4">
          {activeViewMode === 'preview' ? (
            <div className="rounded-3xl border border-white/[0.08] overflow-hidden shadow-2xl bg-[#0b0d14]">
              {/* Browser Address Bar */}
              <div className="px-5 py-3 bg-[#08090d] border-b border-white/[0.06] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20"></span>
                </div>
                <div className="px-4 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-300 font-mono text-[11px] flex items-center gap-2">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>{project.vercel.deployUrl}</span>
                </div>
                <a
                  href={project.vercel.deployUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-indigo-300 flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>Open Edge URL</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Web Portal Preview */}
              <div className="p-8 space-y-8 min-h-[460px]">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center">
                      H
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">{project.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">React 19 · Tailwind CSS · Supabase Connected</p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold flex items-center gap-1.5 transition">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Cart (1)</span>
                  </button>
                </div>

                <div className="p-8 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-transparent border border-white/[0.06] space-y-3">
                  <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block">
                    Synthesized Web Architecture
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    {isUrdu ? 'خودکار AI پلیٹ فارم لائیو ہے' : 'Autonomous Web Portal Deployed'}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
                    {isUrdu
                      ? 'یہ ویب ایپلیکیشن بغیر کسی دستی کوڈنگ کے آپ کے پرامپٹ سے تیار کی گئی ہے اور براہ راست ورسل پر لائیو ہے۔'
                      : 'Rendered directly from synthesized React AST components with full responsive Tailwind styling and instant Supabase auth.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { title: isUrdu ? 'پریمیئم رائل سوٹ' : 'Royal Embroidered Attire', tag: isUrdu ? 'پریمیئم' : 'Premium' },
                    { title: isUrdu ? 'کلاسک پشمینہ شال' : 'Handcrafted Pashmina', tag: isUrdu ? 'لگژری' : 'Luxury' },
                    { title: isUrdu ? 'ماڈرن کیژول کُرتا' : 'Modern Designer Kurta', tag: isUrdu ? 'ٹرینڈنگ' : 'Trending' },
                  ].map((p, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                      <div className="h-32 rounded-xl bg-white/[0.03] flex items-center justify-center text-xs text-slate-500 font-mono">
                        Asset Storage Item #{i + 1}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{p.title}</span>
                        <span className="text-indigo-400 text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">{p.tag}</span>
                      </div>
                      <button className="w-full py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-medium transition">
                        {isUrdu ? 'آرڈر کریں' : 'Instant Checkout'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">src/App.tsx</span>
                <button
                  onClick={() => handleCopy(project.code.web.mainComponent, 'web_code')}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 transition flex items-center gap-1.5"
                >
                  {copiedKey === 'web_code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'web_code' ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre dir="ltr" className="p-5 rounded-2xl bg-[#08090d] border border-white/[0.08] text-slate-300 font-mono text-xs overflow-x-auto max-h-[500px] text-left leading-relaxed">
                {project.code.web.mainComponent}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* 2. iOS PLATFORM */}
      {activePlatform === 'ios' && activeViewMode !== '3d' && (
        <div className="space-y-4">
          {activeViewMode === 'preview' ? (
            <div className="flex justify-center p-8 bg-[#0b0d14] rounded-3xl border border-white/[0.08]">
              {/* iPhone Mockup */}
              <div className="w-[320px] h-[600px] rounded-[48px] bg-black border-4 border-slate-700 shadow-2xl relative overflow-hidden flex flex-col p-3">
                <div className="w-20 h-4 rounded-full bg-black mx-auto mb-2 shrink-0"></div>
                <div className="flex-1 bg-[#090b10] rounded-[36px] p-4 flex flex-col justify-between overflow-y-auto no-scrollbar space-y-4">
                  <div className="flex items-center justify-between text-xs text-white">
                    <span className="font-bold">{project.name}</span>
                    <span className="text-[10px] text-indigo-400 font-mono">iOS 18 Native</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-white space-y-1">
                    <span className="text-[10px] text-indigo-300 uppercase font-mono">SwiftUI 6</span>
                    <h5 className="font-bold text-sm">Realtime Storefront</h5>
                    <p className="text-[11px] text-slate-400">Supabase StateObject synced</p>
                  </div>

                  <div className="space-y-2">
                    {[
                      { name: 'Royal Embroidered Attire', tag: 'Premium' },
                      { name: 'Handcrafted Pashmina', tag: 'Luxury' },
                      { name: 'Designer Kurta', tag: 'Trending' },
                    ].map((item, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-white">{item.name}</div>
                          <div className="text-[11px] text-indigo-400 font-mono">{item.tag}</div>
                        </div>
                        <button className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                          +
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-around text-slate-500 text-[10px]">
                    <span className="text-indigo-400 font-bold">Catalog</span>
                    <span>Orders</span>
                    <span>Account</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">ContentView.swift</span>
                <button
                  onClick={() => handleCopy(project.code.ios.contentViewSwift, 'ios_code')}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 transition flex items-center gap-1.5"
                >
                  {copiedKey === 'ios_code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'ios_code' ? 'Copied' : 'Copy Swift'}</span>
                </button>
              </div>
              <pre dir="ltr" className="p-5 rounded-2xl bg-[#08090d] border border-white/[0.08] text-slate-300 font-mono text-xs overflow-x-auto max-h-[500px] text-left leading-relaxed">
                {project.code.ios.contentViewSwift}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* 3. ANDROID PLATFORM */}
      {activePlatform === 'android' && activeViewMode !== '3d' && (
        <div className="space-y-4">
          {activeViewMode === 'preview' ? (
            <div className="flex justify-center p-8 bg-[#0b0d14] rounded-3xl border border-white/[0.08]">
              {/* Android Mockup */}
              <div className="w-[320px] h-[600px] rounded-[38px] bg-black border-4 border-slate-700 shadow-2xl relative overflow-hidden flex flex-col p-3">
                <div className="w-3 h-3 rounded-full bg-black mx-auto mb-2 shrink-0"></div>
                <div className="flex-1 bg-[#090b10] rounded-[28px] p-4 flex flex-col justify-between overflow-y-auto no-scrollbar space-y-4">
                  <div className="flex items-center justify-between text-xs text-white pb-2 border-b border-white/[0.06]">
                    <span className="font-bold">{project.name}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Compose M3</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-white space-y-1">
                    <span className="text-[10px] text-emerald-400 font-mono">Kotlin Coroutines</span>
                    <h5 className="font-bold text-sm">Material 3 UI</h5>
                    <p className="text-[11px] text-slate-400">Android SDK 35</p>
                  </div>

                  <div className="space-y-2">
                    {[
                      { name: 'Royal Embroidered Attire', tag: 'Premium' },
                      { name: 'Handcrafted Pashmina', tag: 'Luxury' },
                      { name: 'Designer Kurta', tag: 'Trending' },
                    ].map((item, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-white">{item.name}</div>
                          <div className="text-[11px] text-emerald-400 font-mono">{item.tag}</div>
                        </div>
                        <button className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-xs font-semibold">
                          Add
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="w-24 h-1 rounded-full bg-slate-700 mx-auto mt-2"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">MainActivity.kt</span>
                <button
                  onClick={() => handleCopy(project.code.android.mainActivityKt, 'android_code')}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 transition flex items-center gap-1.5"
                >
                  {copiedKey === 'android_code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'android_code' ? 'Copied' : 'Copy Kotlin'}</span>
                </button>
              </div>
              <pre dir="ltr" className="p-5 rounded-2xl bg-[#08090d] border border-white/[0.08] text-slate-300 font-mono text-xs overflow-x-auto max-h-[500px] text-left leading-relaxed">
                {project.code.android.mainActivityKt}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* 4. SUPABASE PLATFORM */}
      {activePlatform === 'supabase' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
              <span className="text-xs text-slate-500 font-mono">Project URL</span>
              <div className="text-sm font-bold text-white font-mono truncate">{project.supabase.projectUrl}</div>
              <span className="text-[11px] text-emerald-400 font-mono">PostgreSQL 15.4</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
              <span className="text-xs text-slate-500 font-mono">Row-Level Security</span>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Zero-Trust Policies Active
              </div>
              <span className="text-[11px] text-indigo-400 font-mono">auth.uid() scoped</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-1">
              <span className="text-xs text-slate-500 font-mono">Database Schema</span>
              <div className="text-sm font-bold text-white font-mono">
                {project.supabase.tables.length} Tables · Realtime
              </div>
              <span className="text-[11px] text-purple-400 font-mono">pgvector Ready</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">supabase/schema.sql</span>
              <button
                onClick={() => handleCopy(project.supabase.databaseSql, 'sql_code')}
                className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 transition flex items-center gap-1.5"
              >
                {copiedKey === 'sql_code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'sql_code' ? 'Copied' : 'Copy SQL Schema'}</span>
              </button>
            </div>
            <pre dir="ltr" className="p-5 rounded-2xl bg-[#08090d] border border-white/[0.08] text-slate-300 font-mono text-xs overflow-x-auto max-h-[460px] text-left leading-relaxed">
              {project.supabase.databaseSql}
            </pre>
          </div>
        </div>
      )}

      {/* 5. VERCEL PLATFORM */}
      {activePlatform === 'vercel' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0d0f17] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 font-semibold">Live Production Deployment</span>
              <h3 className="text-xl font-bold text-white">{project.vercel.deployUrl}</h3>
              <p className="text-xs text-slate-400">Deployed across global Anycast edge network with TLS 1.3 wildcard certificates.</p>
            </div>

            <a
              href={project.vercel.deployUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-200 font-bold text-xs transition flex items-center gap-2 shadow self-start sm:self-auto"
            >
              <span>Visit Production</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              Build Logs
            </span>
            <div className="p-5 rounded-2xl bg-[#08090d] border border-white/[0.08] font-mono text-xs text-emerald-400/90 space-y-1.5 overflow-x-auto">
              {project.vercel.logs.map((log, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-slate-600 select-none">›</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
