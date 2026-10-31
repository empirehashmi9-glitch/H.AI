import React, { useState } from 'react';
import { Check, Copy, Star } from 'lucide-react';
import { toast } from '../components/Toast';

export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

/* ------------------------------------------------------------------ */
/* Surfaces                                                            */
/* ------------------------------------------------------------------ */

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export const Panel: React.FC<DivProps> = ({ className, children, ...rest }) => (
  <div className={cx('toon-card', className)} {...rest}>
    {children}
  </div>
);

export const PanelSm: React.FC<DivProps> = ({ className, children, ...rest }) => (
  <div className={cx('toon-card-sm', className)} {...rest}>
    {children}
  </div>
);

export const DarkPanel: React.FC<DivProps> = ({ className, children, ...rest }) => (
  <div className={cx('toon-card-dark', className)} {...rest}>
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

export type BtnTone = 'coral' | 'mint' | 'grape' | 'sun' | 'cream' | 'ink' | 'aqua' | 'berry';

const TONES: Record<BtnTone, string> = {
  coral: 'bg-coral text-[#04121a]',
  mint: 'bg-mint text-[#04121a]',
  grape: 'bg-grape text-[#04121a]',
  sun: 'bg-sun text-[#04121a]',
  cream: 'bg-white/5 text-aqua',
  ink: 'bg-ink text-[#04121a]',
  aqua: 'bg-aqua text-[#04121a]',
  berry: 'bg-berry text-[#04121a]',
};

const TONE_TEXT: Record<BtnTone, string> = {
  coral: 'border-coral/60 text-coral bg-[#1c0409]/60',
  mint: 'border-mint/60 text-mint bg-[#02150f]/60',
  grape: 'border-aqua/60 text-aqua bg-[#031820]/60',
  sun: 'border-sun/60 text-sun bg-[#1a1002]/60',
  cream: 'border-white/25 text-ink-soft bg-white/[0.03]',
  ink: 'border-white/40 text-ink bg-white/[0.06]',
  aqua: 'border-aqua/60 text-aqua bg-[#031820]/60',
  berry: 'border-berry/60 text-berry bg-[#1a0215]/60',
};

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: BtnTone;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  block?: boolean;
  ghost?: boolean;
}

export const Btn = React.forwardRef<HTMLButtonElement, BtnProps>(
  ({ tone = 'grape', size = 'md', block, ghost, className, children, ...rest }, ref) => {
    const sizes = {
      xs: 'px-2.5 py-1 text-[11px]',
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3.5 text-base',
    };
    return (
      <button
        ref={ref}
        className={cx(
          ghost ? 'toy-btn border-transparent bg-transparent shadow-none' : 'toy-btn',
          !ghost && TONES[tone],
          ghost && 'hover:bg-black/5',
          sizes[size],
          block && 'w-full',
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
Btn.displayName = 'Btn';

/* ------------------------------------------------------------------ */
/* Small bits                                                          */
/* ------------------------------------------------------------------ */

type PillTone = 'cream' | 'coral' | 'mint' | 'sun' | 'grape' | 'aqua' | 'ink' | 'dark' | 'berry';

const PILL_TONES: Record<PillTone, string> = {
  cream: 'bg-white/[0.05] text-ink border-white/15',
  coral: 'bg-coral text-[#04121a]',
  mint: 'bg-mint text-[#04121a]',
  sun: 'bg-sun text-[#04121a]',
  grape: 'bg-grape text-[#04121a]',
  aqua: 'bg-aqua text-[#04121a]',
  ink: 'bg-ink text-[#04121a]',
  berry: 'bg-berry text-[#04121a]',
  dark: 'bg-white/[0.06] text-ink border-white/15',
};

export const Pill: React.FC<{
  children: React.ReactNode;
  tone?: PillTone;
  className?: string;
  dot?: string;
}> = ({ children, tone = 'cream', className, dot }) => (
  <span
    className={cx(
      'inline-flex items-center gap-1.5 rounded-full border border-white/20 px-2.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.18em]',
      PILL_TONES[tone],
      className,
    )}
  >
    {dot && <span className="status-dot" style={{ background: dot }} />}
    {children}
  </span>
);

export const Sticker: React.FC<{ children: React.ReactNode; className?: string; tone?: BtnTone }> = ({
  children,
  className,
  tone = 'sun',
}) => (
  <span
    className={cx(
      'inline-flex items-center gap-1.5 rounded-[4px] border px-3 py-1 font-mono text-[9.5px] font-semibold uppercase tracking-[0.2em] shadow-[inset_0_0_16px_rgba(34,211,238,0.12)]',
      TONE_TEXT[tone],
      className,
    )}
  >
    {children}
  </span>
);

export const SectionHead: React.FC<{
  eyebrow?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  right?: React.ReactNode;
  light?: boolean;
  className?: string;
}> = ({ eyebrow, title, sub, right, light, className }) => (
  <div className={cx('flex flex-wrap items-end justify-between gap-4', className)}>
    <div className="space-y-2">
      {eyebrow && <Sticker tone={light ? 'cream' : 'sun'}>{eyebrow}</Sticker>}
      <h2 className={cx('text-2xl sm:text-3xl font-semibold leading-tight', light ? 'text-ink' : 'text-ink')}>
        {title}
      </h2>
      {sub && (
        <p className={cx('text-sm max-w-xl', light ? 'text-ink/65' : 'text-ink-soft')}>{sub}</p>
      )}
    </div>
    {right}
  </div>
);

/* ------------------------------------------------------------------ */
/* Data display                                                        */
/* ------------------------------------------------------------------ */

const ICON_TONES: Record<BtnTone, string> = {
  coral: 'text-coral border-coral/25 bg-coral/10',
  mint: 'text-mint border-mint/25 bg-mint/10',
  grape: 'text-aqua border-aqua/25 bg-aqua/10',
  sun: 'text-sun border-sun/25 bg-sun/10',
  cream: 'text-ink border-white/15 bg-white/[0.06]',
  ink: 'text-ink border-white/20 bg-white/[0.06]',
  aqua: 'text-aqua border-aqua/25 bg-aqua/10',
  berry: 'text-berry border-berry/25 bg-berry/10',
};

export const IconTile: React.FC<{
  children: React.ReactNode;
  tone?: BtnTone;
  className?: string;
}> = ({ children, tone = 'aqua', className }) => {
  const sized = /(^|\s)(w-|h-|size-)/.test(className ?? '');
  const cornered = /(^|\s)rounded-/.test(className ?? '');
  return (
    <span
      className={cx(
        'shrink-0 border grid place-items-center',
        !cornered && 'rounded-xl',
        !sized && 'w-10 h-10',
        ICON_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
};

export const StatCard: React.FC<{
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: BtnTone;
  className?: string;
}> = ({ label, value, sub, icon, tone = 'grape', className }) => (
  <Panel className={cx('p-4 sm:p-5 flex items-start justify-between gap-3', className)}>
    <div className="min-w-0">
      <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-soft">{label}</div>
      <div className="mt-1 font-display text-2xl sm:text-3xl leading-none text-ink truncate">{value}</div>
      {sub && <div className="mt-1.5 text-[11px] font-semibold text-ink-soft">{sub}</div>}
    </div>
    {icon && (
      <IconTile tone={tone} className="w-11 h-11 shadow-[0_0_22px_rgba(34,211,238,0.08)]">
        {icon}
      </IconTile>
    )}
  </Panel>
);

export const ProgressBar: React.FC<{
  value: number;
  tone?: BtnTone;
  striped?: boolean;
  className?: string;
  height?: string;
}> = ({ value, tone = 'mint', striped, className, height = 'h-3.5' }) => (
  <div className={cx('rounded-full border border-aqua/15 bg-white/5 overflow-hidden', height, className)}>
    <div
      className={cx('h-full rounded-full transition-[width] duration-500', TONES[tone], striped && 'stripe-bar')}
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
    />
  </div>
);

export const Toggle: React.FC<{
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  disabled?: boolean;
}> = ({ checked, onChange, label, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={cx(
      'relative w-12 h-7 rounded-full border transition-colors shrink-0',
      checked ? 'bg-mint/80 border-mint/60 shadow-[0_0_16px_rgba(46,230,176,0.3)]' : 'bg-white/[0.06] border-white/15',
      disabled && 'opacity-50',
    )}
  >
    <span
      className={cx(
        'absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#e6f7ff] shadow-[0_2px_6px_rgba(0,0,0,0.45)] transition-all',
        checked ? 'left-[25px]' : 'left-[3px]',
      )}
    />
  </button>
);

export const Stars: React.FC<{
  value: number;
  onChange?: (n: number) => void;
  size?: number;
  className?: string;
}> = ({ value, onChange, size = 16, className }) => (
  <div className={cx('flex items-center gap-0.5', className)}>
    {[1, 2, 3, 4, 5].map((n) =>
      onChange ? (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`Rate ${n} of 5`}
          className="p-0.5"
        >
          <Star
            width={size}
            height={size}
            className={n <= value ? 'text-sun fill-sun stroke-ink' : 'text-ink/25 fill-transparent stroke-ink'}
            strokeWidth={2}
          />
        </button>
      ) : (
        <Star
          key={n}
          width={size}
          height={size}
          className={n <= value ? 'text-sun fill-sun stroke-ink' : 'text-ink/20 fill-transparent stroke-ink'}
          strokeWidth={2}
        />
      ),
    )}
  </div>
);

export const CopyButton: React.FC<{ text: string; label?: string; className?: string }> = ({
  text,
  label = 'Copy',
  className,
}) => {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      toast.success('Copied to clipboard');
      window.setTimeout(() => setDone(false), 1600);
    } catch {
      toast.error('Copy failed — select the text manually');
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={cx(
        'inline-flex items-center gap-1.5 rounded-lg border border-aqua/25 bg-aqua/[0.07] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-aqua hover:bg-aqua/15 transition',
        className,
      )}
    >
      {done ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      {done ? 'Copied' : label}
    </button>
  );
};

export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: React.ReactNode;
  sub?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}> = ({ icon, title, sub, action, className }) => (
  <div
    className={cx(
      'rounded-2xl border border-dashed border-aqua/20 bg-white/[0.02] px-6 py-10 flex flex-col items-center text-center gap-3',
      className,
    )}
  >
    {icon && (
      <div className="w-14 h-14 rounded-2xl border border-aqua/25 bg-aqua/[0.07] flex items-center justify-center">
        {icon}
      </div>
    )}
    <div className="font-display text-lg text-ink">{title}</div>
    {sub && <p className="text-xs text-ink-soft max-w-sm">{sub}</p>}
    {action}
  </div>
);

export const Divider: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cx('h-px w-full bg-aqua/10', className)} />
);

export const ToneBar: React.FC<{ value: number; max: number; tone?: string; label?: string }> = ({
  value,
  max,
  tone = '#6C4CF1',
  label,
}) => (
  <div className="flex items-center gap-2 text-[11px] font-bold text-ink-soft">
    <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{ width: `${max ? Math.min(100, (value / max) * 100) : 0}%`, background: tone }}
      />
    </div>
    {label && <span className="w-8 text-right tabular-nums">{label}</span>}
  </div>
);
