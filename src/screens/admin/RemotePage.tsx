import React, { useCallback, useEffect, useState } from 'react';
import {
  Apple, ArrowUpRight, Check, CircleAlert, Copy, Download, KeyRound, Laptop, Lock, MonitorSmartphone,
  Play, Radio, RefreshCw, Router, ShieldCheck, Smartphone, Terminal, Wifi,
} from 'lucide-react';
import { Btn, IconTile, Panel, Pill, SectionHead, cx } from '../../ui/Toon';

type Address = { name: string; address: string; kind: 'lan' | 'tailscale' };
type ToolInfo = { id: string; label: string; installed: boolean };

type Status = {
  version: string;
  hostname: string;
  user: string;
  platform: string;
  os: string;
  uptime: number;
  addresses: Address[];
  rdp: {
    enabled: boolean;
    listening: boolean;
    known: boolean;
    port: number;
    lanAddress: string | null;
  };
  tools: ToolInfo[];
  time: number;
};

const BASE_KEY = 'hai.remote.base';
const CODE_KEY = 'hai.remote.code';

const defaultBase = () => {
  if (typeof window === 'undefined') return 'http://127.0.0.1:4321';
  const { protocol, hostname, port } = window.location;
  if (port === '4321') return `${protocol}//${hostname}:4321`;
  return `${protocol}//${hostname || '127.0.0.1'}:4321`;
};

const readSaved = (key: string, fallback = '') => {
  try {
    return window.localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

const save = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage blocked */
  }
};

const normalise = (value: string) => value.trim().replace(/\/+$/, '');

const prettyUptime = (seconds: number) => {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

const RDP_CMD =
  "Set-ItemProperty -Path 'HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server' -Name fDenyTSConnections -Value 0; Enable-NetFirewallRule -DisplayGroup 'Remote Desktop'";

const CopyChip: React.FC<{ value: string; label?: string; className?: string }> = ({
  value,
  label = 'Copy',
  className,
}) => {
  const [done, setDone] = useState(false);
  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(value);
      ok = true;
    } catch {
      ok = false;
    }
    if (!ok) {
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand('copy');
      } catch {
        ok = false;
      }
      ta.remove();
    }
    setDone(ok);
    if (ok) window.setTimeout(() => setDone(false), 1600);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={cx(
        'shrink-0 inline-flex items-center gap-1 rounded-lg border border-aqua/30 bg-aqua/10 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-aqua hover:bg-aqua/20 transition',
        className,
      )}
      aria-label={`${label} ${value}`}
    >
      {done ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {done ? 'Copied' : label}
    </button>
  );
};

const Row: React.FC<{ label: string; value: string; copy?: boolean; mono?: boolean }> = ({
  label,
  value,
  copy = true,
  mono = true,
}) => (
  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2">
    <span className="text-[8.5px] font-extrabold uppercase tracking-[0.16em] text-ink-soft w-[74px] shrink-0">{label}</span>
    <span className={cx('flex-1 min-w-0 truncate text-[11px] font-bold', mono && 'font-mono')}>{value}</span>
    {copy && <CopyChip value={value} />}
  </div>
);

const Step: React.FC<{ n: number; title: string; children: React.ReactNode }> = ({ n, title, children }) => (
  <div className="flex gap-2.5">
    <span className="w-6 h-6 shrink-0 rounded-full bg-aqua/15 border border-aqua/40 text-aqua grid place-items-center font-mono text-[10px] font-extrabold">
      {n}
    </span>
    <div className="min-w-0 space-y-1">
      <div className="text-[11.5px] font-extrabold leading-tight">{title}</div>
      <div className="text-[10.5px] font-semibold text-ink-soft leading-relaxed">{children}</div>
    </div>
  </div>
);

const LinkChip: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center gap-1.5 rounded-lg border border-aqua/25 bg-aqua/[0.06] px-2.5 py-1.5 text-[10px] font-extrabold text-aqua hover:bg-aqua/15 transition"
  >
    {children}
    <ArrowUpRight className="w-3 h-3" />
  </a>
);

export const RemotePage: React.FC = () => {
  const [base, setBase] = useState(() => normalise(readSaved(BASE_KEY, defaultBase())));
  const [code, setCode] = useState(() => readSaved(CODE_KEY));
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [syncedAt, setSyncedAt] = useState<number | null>(null);
  const [locking, setLocking] = useState(false);
  const [locked, setLocked] = useState(false);

  const fetchStatus = useCallback(async (baseUrl: string, pairing: string, quiet = false) => {
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), 7000);
    try {
      const res = await fetch(`${baseUrl}/api/status`, {
        headers: { Authorization: `Bearer ${pairing}` },
        signal: ctrl.signal,
        cache: 'no-store',
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) throw new Error('Pairing code ghalat hai. Terminal par dikhaya gaya code daalen.');
        if (res.status === 429) throw new Error('Bohat zyada attempts. 5 minute baad try karen.');
        throw new Error(body.error || `Beacon error ${res.status}`);
      }
      setStatus(body as Status);
      setSyncedAt(Date.now());
      setError('');
    } catch (err) {
      const message =
        err instanceof Error && err.name === 'AbortError'
          ? 'Beacon jawab nahi de raha. PC par "npm run remote" chal raha hai?'
          : err instanceof Error
            ? err.message
            : 'Beacon se connect nahi ho saka.';
      setError(message);
    } finally {
      window.clearTimeout(timer);
    }
  }, []);

  const connect = async () => {
    const baseUrl = normalise(base);
    const pairing = code.trim();
    if (!baseUrl || !pairing) {
      setError('Dono fields bharain: beacon address aur pairing code.');
      return;
    }
    setBusy(true);
    setError('');
    setBase(baseUrl);
    save(BASE_KEY, baseUrl);
    save(CODE_KEY, pairing);
    await fetchStatus(baseUrl, pairing);
    setBusy(false);
  };

  useEffect(() => {
    if (!code) return;
    fetchStatus(normalise(base), code, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!status) return;
    const id = window.setInterval(() => fetchStatus(normalise(base), code, true), 15000);
    return () => window.clearInterval(id);
  }, [status, base, code, fetchStatus]);

  const lockPc = async () => {
    setLocking(true);
    try {
      const res = await fetch(`${normalise(base)}/api/lock`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${code.trim()}` },
      });
      if (!res.ok) throw new Error('Lock request reject ho gayi.');
      setLocked(true);
      window.setTimeout(() => setLocked(false), 3200);
    } catch {
      setError('Lock nahi ho saka. Beacon check karen.');
    } finally {
      setLocking(false);
    }
  };

  const address = status?.rdp.lanAddress;
  const rdpReady = !!status && status.rdp.enabled && status.rdp.listening;
  const uptime = status ? prettyUptime(status.uptime) : '';

  return (
    <div className="space-y-4 sm:space-y-5">
      <SectionHead
        light
        eyebrow="Admin · Remote"
        title="Your PC, in your pocket"
        sub="Phone se is computer ka status dekhen aur poora desktop chalayen. Control Microsoft Remote Desktop (signed RDP) se hota hai — koi unsigned screen-capture script nahi, is liye antivirus block nahi karega."
        right={
          <div className="flex flex-wrap gap-1.5">
            <Pill tone="dark" dot={status ? '#3DD9B3' : '#FF7A8A'}>
              {status ? 'beacon online' : 'beacon offline'}
            </Pill>
            <Pill tone="dark">
              <MonitorSmartphone className="w-3 h-3" /> RDP
            </Pill>
          </div>
        }
      />

      <div className="grid xl:grid-cols-[1fr_340px] gap-4 items-start">
        <div className="space-y-3 min-w-0">
          <Panel className="overflow-hidden">
            <div className="bg-black/40 px-3.5 py-2.5 flex items-center justify-between gap-2 border-b border-aqua/15">
              <span className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-aqua">
                <Radio className="w-3.5 h-3.5" /> Remote beacon
              </span>
              <span className="font-mono text-[9px] font-bold text-ink/55">
                {syncedAt ? `synced ${new Date(syncedAt).toLocaleTimeString()}` : 'not paired'}
              </span>
            </div>

            <div className="p-3.5 space-y-3">
              <div className="grid sm:grid-cols-[1fr_170px] gap-2">
                <label className="block">
                  <span className="block text-[9px] font-extrabold uppercase tracking-[0.18em] text-ink-soft mb-1">
                    Beacon address
                  </span>
                  <input
                    value={base}
                    onChange={(e) => setBase(e.target.value)}
                    placeholder="http://192.168.1.6:4321"
                    inputMode="url"
                    autoComplete="off"
                    spellCheck={false}
                    className="field field-mono"
                  />
                </label>
                <label className="block">
                  <span className="block text-[9px] font-extrabold uppercase tracking-[0.18em] text-ink-soft mb-1">
                    Pairing code
                  </span>
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 8))}
                    onKeyDown={(e) => e.key === 'Enter' && connect()}
                    placeholder="6 digits"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    className="field field-mono tracking-[0.3em]"
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Btn tone="aqua" size="sm" onClick={connect} disabled={busy}>
                  {busy ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                  {busy ? 'Connecting' : status ? 'Reconnect' : 'Connect'}
                </Btn>
                {status && (
                  <Btn tone="cream" size="sm" onClick={() => fetchStatus(normalise(base), code.trim())}>
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                  </Btn>
                )}
                <span className="text-[9.5px] font-bold text-ink-soft">
                  PC par <span className="font-mono text-ink">npm run remote</span> chalain — terminal me address aur code milta hai.
                </span>
              </div>

              {error && (
                <p className="flex items-start gap-1.5 rounded-xl border-2 border-coral/40 bg-coral/10 px-2.5 py-2 text-[10.5px] font-bold text-coral">
                  <CircleAlert className="w-3.5 h-3.5 mt-[1px] shrink-0" /> {error}
                </p>
              )}
            </div>
          </Panel>

          {status && (
            <>
              <Panel className="p-3.5 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <IconTile tone="aqua" className="w-9 h-9 rounded-lg">
                      <Laptop className="w-4 h-4" />
                    </IconTile>
                    <div className="min-w-0">
                      <div className="font-display text-base leading-none truncate">{status.hostname}</div>
                      <div className="text-[9.5px] font-bold text-ink-soft truncate">
                        {status.os || status.platform} · user {status.user}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Pill tone={status.rdp.listening ? 'mint' : 'dark'} dot={status.rdp.listening ? '#159570' : '#FF7A8A'}>
                      port {status.rdp.port} {status.rdp.listening ? 'open' : 'closed'}
                    </Pill>
                    <Pill tone="dark">uptime {uptime}</Pill>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {status.addresses.map((ip) => (
                    <Row
                      key={ip.address}
                      label={ip.kind === 'tailscale' ? 'Tailscale' : 'LAN'}
                      value={ip.address}
                    />
                  ))}
                  {status.addresses.length === 0 && (
                    <p className="text-[10.5px] font-bold text-ink-soft">Koi LAN/Tailscale address nahi mila.</p>
                  )}
                  {address && <Row label="RDP host" value={`${address}:${status.rdp.port}`} />}
                </div>

                {rdpReady ? (
                  <div className="rounded-xl border-2 border-mint/50 bg-mint/15 px-2.5 py-2 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 mt-[1px] shrink-0 text-mint" />
                    <div className="text-[10.5px] font-bold leading-relaxed">
                      RDP ready hai. Phone par Microsoft Remote Desktop kholen, naya PC add karen, address{' '}
                      <span className="font-mono text-ink">{address}</span> daalen, phir Windows account ka password.
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border-2 border-sun/60 bg-sun/15 px-2.5 py-2 flex items-start gap-2">
                    <CircleAlert className="w-4 h-4 mt-[1px] shrink-0 text-[#B07800]" />
                    <div className="text-[10.5px] font-bold leading-relaxed">
                      RDP abhi {status.rdp.known && !status.rdp.enabled ? 'band' : 'listening nahi'} hai. Neeche step 1 follow
                      karen — Wi-Fi par hote hue phone turant connect ho jayega.
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <Btn tone="coral" size="sm" onClick={lockPc} disabled={locking || locked}>
                    <Lock className="w-3.5 h-3.5" />
                    {locked ? 'PC locked' : locking ? 'Locking' : 'Lock my PC'}
                  </Btn>
                  <LinkChip href="https://play.google.com/store/apps/details?id=com.microsoft.rdc.androidx">
                    <Play className="w-3 h-3" /> Android app
                  </LinkChip>
                  <LinkChip href="https://apps.apple.com/app/microsoft-remote-desktop/id714664990">
                    <Apple className="w-3 h-3" /> iPhone / iPad
                  </LinkChip>
                </div>
              </Panel>

              <Panel className="p-3.5 space-y-3">
                <h3 className="text-sm leading-none flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" /> One-time setup (PC par)
                </h3>

                <Step n={1} title="Windows Remote Desktop on karen">
                  Settings → System → Remote Desktop → switch On. Windows 10/11 Pro ya Enterprise chahiye (Home support nahi
                  karta). Ya admin PowerShell me ye command chalain:
                  <span className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-black/45 border border-aqua/20 px-2 py-1.5">
                    <code className="flex-1 min-w-0 text-[9px] font-mono text-aqua leading-snug break-all">{RDP_CMD}</code>
                    <CopyChip value={RDP_CMD} />
                  </span>
                </Step>

                <Step n={2} title="Account par password rakhen">
                  RDP sirf password wale account me sign-in karta hai. Microsoft account ho to email + Microsoft password
                  (PIN nahi) use karen.
                </Step>

                <Step n={3} title="Phone par Microsoft Remote Desktop install karen">
                  Upar diye store buttons se install karen. PC aur phone same Wi-Fi par hon — ya dono par Tailscale laga
                  dein, phir ghar se bahar bhi kaam karega.
                </Step>

                <Step n={4} title="PC add karen">
                  App me + → Add PC → address me <span className="font-mono text-ink">{address || 'LAN IP'}</span> daalen →
                  user name aur password. Poora desktop phone par aa jayega.
                </Step>

                <div className="rounded-xl border border-aqua/25 bg-aqua/[0.06] px-2.5 py-2 text-[10px] font-semibold text-ink-soft leading-relaxed">
                  Windows Home ho to RustDesk ya Chrome Remote Desktop use karen — dono free aur signed hain. Beacon unki
                  installation bhi detect kar leta hai.
                </div>
              </Panel>
            </>
          )}

          {!status && (
            <Panel className="p-4 space-y-2.5">
              <h3 className="text-sm leading-none flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" /> Kaise kaam karta hai
              </h3>
              <Step n={1} title="PC par beacon start karen">
                Desktop par <span className="font-mono text-ink">npm run remote</span> chalain. Terminal phone ke liye link
                aur ek 6-digit pairing code dikhata hai.
              </Step>
              <Step n={2} title="Yahan address aur code daalen">
                Phone isi Wi-Fi par ho to beacon address khud bhar jata hai. Code sirf pairing ke liye hai — har request
                verify hoti hai.
              </Step>
              <Step n={3} title="RDP se poora control">
                Beacon sirf status deta hai. Asli screen aur mouse Microsoft Remote Desktop app se chalti hai, jo Windows
                ka signed feature hai.
              </Step>
            </Panel>
          )}
        </div>

        <div className="space-y-3">
          <Panel className="p-3.5 space-y-2.5">
            <h3 className="text-sm leading-none flex items-center gap-1.5">
              <Router className="w-4 h-4" /> Network
            </h3>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-[10px] font-bold">
                <span className="flex items-center gap-1.5 text-ink-soft"><Wifi className="w-3 h-3" /> LAN</span>
                <span className="font-mono">{address || '—'}</span>
              </div>
              <div className="flex items-center justify-between gap-2 text-[10px] font-bold">
                <span className="flex items-center gap-1.5 text-ink-soft"><ShieldCheck className="w-3 h-3" /> Tailscale</span>
                <span className="font-mono">
                  {status?.addresses.find((a) => a.kind === 'tailscale')?.address || 'not installed'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 text-[10px] font-bold">
                <span className="flex items-center gap-1.5 text-ink-soft"><Radio className="w-3 h-3" /> Beacon</span>
                <span className="font-mono">{status ? `v${status.version}` : 'offline'}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1 border-t-2 border-ink/10">
              <LinkChip href="https://tailscale.com/download">
                <Download className="w-3 h-3" /> Tailscale
              </LinkChip>
              <LinkChip href="https://rustdesk.com/download">
                <Download className="w-3 h-3" /> RustDesk
              </LinkChip>
            </div>
            <p className="text-[9.5px] font-semibold text-ink-soft leading-relaxed">
              Same Wi-Fi par LAN IP kaafi hai. Bahar se control ke liye dono devices par Tailscale lagain — public port
              forward ki zaroorat nahi.
            </p>
          </Panel>

          {status && (
            <Panel className="p-3.5 space-y-2">
              <h3 className="text-sm leading-none flex items-center gap-1.5">
                <Download className="w-4 h-4" /> Detected tools
              </h3>
              <div className="space-y-1">
                {status.tools.map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5"
                  >
                    <span className="text-[10.5px] font-extrabold truncate">{tool.label}</span>
                    <Pill tone={tool.installed ? 'mint' : 'dark'}>
                      {tool.installed ? 'installed' : 'missing'}
                    </Pill>
                  </div>
                ))}
              </div>
              <p className="text-[9.5px] font-semibold text-ink-soft leading-relaxed">
                RDP ke ilawa koi bhi signed tool install karen — beacon khud detect kar lega, dashboard me dikhega.
              </p>
            </Panel>
          )}

          <Panel className="p-3.5 space-y-2">
            <h3 className="text-sm leading-none flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Security
            </h3>
            <ul className="space-y-1.5 text-[10px] font-semibold text-ink-soft leading-relaxed">
              <li className="flex gap-1.5"><Check className="w-3 h-3 mt-[2px] shrink-0 text-mint" /> Beacon sirf aapke LAN/Tailscale par khulta hai; code har request check karta hai.</li>
              <li className="flex gap-1.5"><Check className="w-3 h-3 mt-[2px] shrink-0 text-mint" /> Code sirf is device me save hota hai, server par nahi.</li>
              <li className="flex gap-1.5"><Check className="w-3 h-3 mt-[2px] shrink-0 text-mint" /> Screen aur keyboard access Windows ke signed RDP se hota hai, custom script se nahi.</li>
              <li className="flex gap-1.5"><Check className="w-3 h-3 mt-[2px] shrink-0 text-mint" /> 6 ghalat codes par 5 minute lock, taake guessing na ho.</li>
            </ul>
            <p className="text-[9px] font-bold text-ink-soft pt-1 border-t-2 border-ink/10">
              Sirf apni machine ke liye — doosron ka PC access karna allowed nahi.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
};
