import React, { useState } from 'react';
import { GeneratedFile, Platform } from '../lib/types';
import { FileCode, Copy, Check, Download, Folder, Code2, Globe, Smartphone, Database, Server } from 'lucide-react';

interface FileExplorerProps {
  files: GeneratedFile[];
  appName: string;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ files, appName }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [activePlatformFilter, setActivePlatformFilter] = useState<Platform | 'all'>('all');

  const filteredFiles = activePlatformFilter === 'all'
    ? files
    : files.filter(f => f.platform === activePlatformFilter);

  const activeFile = filteredFiles[selectedFileIndex] || files[0];

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'web': return <Globe className="w-3.5 h-3.5 text-cyan-400" />;
      case 'ios': return <Smartphone className="w-3.5 h-3.5 text-orange-400" />;
      case 'android': return <Smartphone className="w-3.5 h-3.5 text-emerald-400" />;
      case 'backend': return <Database className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  if (!files.length) {
    return (
      <div className="bg-slate-900/60 rounded-3xl p-8 border border-slate-800 text-center text-slate-400">
        No files generated yet. Type a prompt above and click "Assemble Multi-Platform App".
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden flex flex-col lg:flex-row h-[560px]">
      {/* Left Sidebar: File List */}
      <div className="w-full lg:w-72 bg-slate-950/70 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col shrink-0">
        {/* Platform Filter Tabs */}
        <div className="p-3 border-b border-slate-800/80 grid grid-cols-4 gap-1 text-[11px] font-mono">
          {(['all', 'web', 'ios', 'android'] as const).map(p => (
            <button
              key={p}
              onClick={() => {
                setActivePlatformFilter(p);
                setSelectedFileIndex(0);
              }}
              className={`py-1.5 rounded-lg font-bold uppercase text-center transition-all ${
                activePlatformFilter === p
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Files Tree */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredFiles.map((file, idx) => {
            const isSelected = activeFile.path === file.path;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between text-xs ${
                  isSelected
                    ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {getPlatformIcon(file.platform)}
                  <span className="truncate font-mono">{file.path}</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 shrink-0">
                  {file.language}
                </span>
              </button>
            );
          })}
        </div>

        {/* Summary Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
          <span>{files.length} Total Files</span>
          <span className="text-cyan-400 font-mono">Ready to Export</span>
        </div>
      </div>

      {/* Right Area: Code Display */}
      <div className="flex-1 flex flex-col bg-slate-950/95 overflow-hidden">
        {/* Code Header */}
        <div className="p-3.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-xs font-bold text-white truncate">{activeFile.path}</span>
            <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-slate-800">
              {activeFile.description}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 leading-relaxed select-text">
          <pre className="overflow-x-auto whitespace-pre font-mono">
            <code>
              {activeFile.content.split('\n').map((line, i) => (
                <div key={i} className="table-row">
                  <span className="table-cell pr-4 text-right select-none text-slate-600 font-mono text-[11px] w-10">
                    {i + 1}
                  </span>
                  <span className="table-cell">{line}</span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
