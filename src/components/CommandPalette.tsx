import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, CornerDownLeft, Command } from 'lucide-react';

export interface PaletteAction {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon?: React.ComponentType<{ className?: string }>;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  actions: PaletteAction[];
  placeholder?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose, actions, placeholder = 'Search commands…' }) => {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => `${a.label} ${a.hint || ''} ${a.group}`.toLowerCase().includes(q));
  }, [actions, query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setIndex(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    setIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIndex((i) => Math.min(filtered.length - 1, i + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const action = filtered[index];
        if (action) {
          onClose();
          window.setTimeout(action.run, 10);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered, index, onClose]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${index}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [index]);

  if (!open) return null;

  let lastGroup = '';

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center pt-[12vh] px-4" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-2xl border border-white/15 bg-white dark:bg-[#0c0f1c] shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-200 dark:border-white/10">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-300 dark:border-white/15 text-[10px] font-mono text-slate-500">
            ESC
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <div className="px-3 py-8 text-center text-xs text-slate-500">No matching command.</div>
          )}
          {filtered.map((action, i) => {
            const Icon = action.icon;
            const showGroup = action.group !== lastGroup;
            lastGroup = action.group;
            return (
              <React.Fragment key={action.id}>
                {showGroup && (
                  <div className="px-2 pt-2 pb-1 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{action.group}</div>
                )}
                <button
                  data-idx={i}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => {
                    onClose();
                    window.setTimeout(action.run, 10);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition ${
                    i === index
                      ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-200'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {Icon ? <Icon className="w-4 h-4 shrink-0 opacity-70" /> : <Command className="w-4 h-4 shrink-0 opacity-50" />}
                  <span className="flex-1 font-medium">{action.label}</span>
                  {action.hint && <span className="text-[10px] font-mono text-slate-400">{action.hint}</span>}
                  {i === index && <CornerDownLeft className="w-3.5 h-3.5 opacity-60" />}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <div className="px-4 py-2 border-t border-slate-200 dark:border-white/10 text-[10px] text-slate-400 flex items-center justify-between font-mono">
          <span>↑ ↓ navigate · ↵ run</span>
          <span>{filtered.length} commands</span>
        </div>
      </div>
    </div>
  );
};
