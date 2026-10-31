import { useCallback, useEffect, useRef, useState } from 'react';

const PREFIX = 'hai.v5.';

function storageAvailable(): boolean {
  try {
    const probe = '__hai_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined' || !storageAvailable()) return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined' || !storageAvailable()) return false;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string) {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}

export function clearAppData() {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}

/**
 * State that survives reloads. Writes are debounced so streaming updates
 * (token-by-token chat) do not hammer localStorage.
 */
export function usePersistedState<T>(key: string, initial: T | (() => T)) {
  const [value, setValue] = useState<T>(() =>
    loadJSON<T>(key, typeof initial === 'function' ? (initial as () => T)() : initial),
  );
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => saveJSON(key, value), 250);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [key, value]);

  const update = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) => (typeof next === 'function' ? (next as (p: T) => T)(prev) : next));
  }, []);

  return [value, update] as const;
}

export function newId(prefix = 'hai'): string {
  const rand = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${rand}`;
}

export function timeAgo(iso: string, isUrdu: boolean): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(diff) || diff < 0) return isUrdu ? 'ابھی' : 'just now';
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return isUrdu ? 'ابھی' : 'just now';
  if (mins < 60) return isUrdu ? `${mins} منٹ پہلے` : `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return isUrdu ? `${hours} گھنٹے پہلے` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return isUrdu ? `${days} دن پہلے` : `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
