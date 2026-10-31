import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type ToastKind = 'success' | 'error' | 'info';

export interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

type Listener = (t: ToastItem) => void;
const listeners = new Set<Listener>();
let counter = 0;

export const toast = {
  success: (message: string) => emit('success', message),
  error: (message: string) => emit('error', message),
  info: (message: string) => emit('info', message),
};

function emit(kind: ToastKind, message: string) {
  counter += 1;
  listeners.forEach((l) => l({ id: counter, kind, message }));
}

export const ToastHost: React.FC = () => {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener: Listener = (t) => {
      setItems((prev) => [...prev.slice(-3), t]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== t.id));
      }, t.kind === 'error' ? 7000 : 4200);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-[90] flex flex-col gap-2 sm:w-96 pointer-events-none" role="status" aria-live="polite">
      {items.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border border-aqua/20 bg-[#04161f]/95 text-ink shadow-[0_18px_40px_rgba(0,0,0,0.5)] backdrop-blur-md animate-[toastIn_.22s_ease-out]"
        >
          <span
            className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
              t.kind === 'success' ? 'bg-mint/15 border-mint/40 text-mint' : t.kind === 'error' ? 'bg-coral/15 border-coral/40 text-coral' : 'bg-aqua/15 border-aqua/40 text-aqua'
            }`}
          >
            {t.kind === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : t.kind === 'error' ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <Info className="w-4 h-4" />
            )}
          </span>
          <span className="flex-1 text-xs font-bold leading-relaxed pt-1">{t.message}</span>
          <button
            onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
            className="opacity-50 hover:opacity-100 mt-1"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
