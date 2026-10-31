import React, { useMemo, useState } from 'react';
import {
  ArrowDownRight, ArrowUpRight, CheckCircle2, Headphones, Inbox, Mail, RotateCcw,
  Search, Send, ShieldAlert, Sparkles,
} from 'lucide-react';
import { useApp } from '../../state/app';
import { ChibiRobot } from '../../ui/Chibi';
import { Btn, EmptyState, Panel, Pill, SectionHead, cx } from '../../ui/Toon';
import { toast } from '../../components/Toast';
import { timeAgo } from '../../utils/storage';

const when = (stamp: string) => (Number.isNaN(new Date(stamp).getTime()) ? stamp : timeAgo(stamp, false));

type Filter = 'all' | 'pending' | 'escalated' | 'resolved';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Open' },
  { id: 'escalated', label: 'Escalated' },
  { id: 'resolved', label: 'Resolved' },
];

const priorityTone = (p: string) => (p === 'high' ? 'coral' : p === 'medium' ? 'sun' : 'cream');
const statusTone = (s: string) => (s === 'escalated' ? 'coral' : s === 'resolved' ? 'mint' : 'sun');

export const SupportPage: React.FC = () => {
  const { tickets, updateTicket } = useApp();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const counts = useMemo(
    () => ({
      open: tickets.filter((t) => t.status === 'pending').length,
      escalated: tickets.filter((t) => t.status === 'escalated').length,
      resolved: tickets.filter((t) => t.status === 'resolved').length,
    }),
    [tickets],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter((t) => {
      if (filter !== 'all' && t.status !== filter) return false;
      if (!q) return true;
      return `${t.id} ${t.customerName} ${t.customerEmail} ${t.promptTopic} ${t.message}`.toLowerCase().includes(q);
    });
  }, [tickets, filter, query]);

  const act = (id: string, status: 'resolved' | 'pending' | 'escalated', label: string) => {
    updateTicket(id, { status });
    toast.success(label);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <SectionHead
        light
        eyebrow="Support desk"
        title="Agent #26 hands you the hard ones"
        sub="The API gateway answers every customer automatically. Anything it cannot settle lands here for a human decision."
        right={
          <div className="flex flex-wrap gap-1.5">
            <Pill tone="dark"><Headphones className="w-3 h-3" /> {counts.open} open</Pill>
            <Pill tone="dark"><ShieldAlert className="w-3 h-3" /> {counts.escalated} escalated</Pill>
            <Pill tone="dark"><CheckCircle2 className="w-3 h-3" /> {counts.resolved} resolved</Pill>
          </div>
        }
      />

      <div className="grid lg:grid-cols-[1fr_280px] gap-4 items-start">
        <div className="space-y-3 min-w-0">
          <Panel className="p-3 flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="relative flex-1 min-w-0">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ticket, customer or topic"
                className="field pl-9 py-2 text-xs"
                aria-label="Search tickets"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cx(
                    'px-3 py-1.5 rounded-full border text-[11px] font-extrabold transition shrink-0',
                    filter === f.id
                      ? 'bg-aqua/15 border-aqua/50 text-aqua'
                      : 'bg-white/[0.04] border-white/10 text-ink-soft hover:border-aqua/35 hover:text-ink',
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Panel>

          {visible.length ? (
            <div className="space-y-3">
              {visible.map((t) => (
                <Panel key={t.id} className="p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Pill tone={statusTone(t.status) as any}>{t.status}</Pill>
                    <Pill tone={priorityTone(t.priority) as any}>{t.priority} priority</Pill>
                    {t.viaApiWebhook && <Pill tone="cream"><Sparkles className="w-3 h-3" /> API webhook</Pill>}
                    <span className="ml-auto font-mono text-[10px] font-bold text-ink-soft">{t.id} · {when(t.createdAt)}</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-9 h-9 shrink-0 rounded-xl bg-aqua/[0.08] border border-aqua/20 text-aqua grid place-items-center font-display text-sm">
                      {t.customerName.slice(0, 1)}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold leading-tight">{t.customerName}</div>
                      <a
                        href={`mailto:${t.customerEmail}`}
                        className="text-[10px] font-bold text-ink-soft inline-flex items-center gap-1 hover:text-ink"
                      >
                        <Mail className="w-3 h-3" /> {t.customerEmail}
                      </a>
                    </div>
                    <div className="ml-auto hidden sm:block max-w-[46%]">
                      <div className="text-[9px] font-extrabold uppercase tracking-wider text-ink-soft">Topic</div>
                      <div className="text-[11px] font-bold text-right leading-snug">{t.promptTopic}</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-aqua/15 bg-white/[0.03] p-2.5">
                    <p className="text-xs font-semibold text-ink leading-relaxed">{t.message}</p>
                  </div>

                  <div className="rounded-xl border border-mint/25 bg-mint/[0.07] p-2.5 flex gap-2">
                    <span className="w-6 h-6 shrink-0 rounded-lg bg-mint/15 border border-mint/40 text-mint grid place-items-center">
                      <Send className="w-3 h-3" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[9px] font-extrabold uppercase tracking-wider text-ink-soft">Agent #26 replied</div>
                      <p className="text-[11px] font-semibold text-ink leading-relaxed">{t.response}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {t.status !== 'resolved' && (
                      <Btn tone="mint" size="sm" onClick={() => act(t.id, 'resolved', `Ticket ${t.id} resolved`)}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                      </Btn>
                    )}
                    {t.status !== 'escalated' && (
                      <Btn tone="coral" size="sm" onClick={() => act(t.id, 'escalated', `Ticket ${t.id} escalated`)}>
                        <ArrowUpRight className="w-3.5 h-3.5" /> Escalate
                      </Btn>
                    )}
                    {t.status !== 'pending' && (
                      <Btn tone="cream" size="sm" onClick={() => act(t.id, 'pending', `Ticket ${t.id} reopened`)}>
                        <RotateCcw className="w-3.5 h-3.5" /> Reopen
                      </Btn>
                    )}
                    <a href={`mailto:${t.customerEmail}?subject=${encodeURIComponent(`Re: ${t.promptTopic} (${t.id})`)}`} className="ml-auto">
                      <Btn tone="cream" size="sm">
                        <ArrowDownRight className="w-3.5 h-3.5" /> Email customer
                      </Btn>
                    </a>
                  </div>
                </Panel>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Inbox className="w-6 h-6" />}
              title={tickets.length ? 'Nothing in this queue' : 'No tickets yet'}
              sub={tickets.length ? 'Switch the filter or clear the search.' : 'Customer questions from the Support tab appear here instantly.'}
            />
          )}
        </div>

        <div className="space-y-3">
          <Panel className="p-4 space-y-2.5 text-center">
            <div className="w-20 mx-auto">
              <ChibiRobot size={78} color="#3DD9B3" accent="#FFF7EC" mood="focus" float />
            </div>
            <h3 className="text-base leading-none">Agent #26</h3>
            <p className="text-[10px] font-semibold text-ink-soft leading-relaxed">
              Customer Support API & Webhook Gateway. Answers in 7ms on average and tags every ticket with a category and priority.
            </p>
            <div className="flex justify-center gap-1.5 flex-wrap">
              <Pill tone="mint">99.99% uptime</Pill>
              <Pill tone="cream">6,200 handled</Pill>
            </div>
          </Panel>

          <Panel className="p-4 space-y-2">
            <h3 className="text-base leading-none">Load</h3>
            {[
              { label: 'Open', value: counts.open, tone: '#FFC93C' },
              { label: 'Escalated', value: counts.escalated, tone: '#FF7A8A' },
              { label: 'Resolved', value: counts.resolved, tone: '#3DD9B3' },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-2 text-[11px] font-bold text-ink-soft">
                <span className="status-dot" style={{ background: row.tone }} />
                <span className="flex-1">{row.label}</span>
                <span className="font-mono text-ink">{row.value}</span>
              </div>
            ))}
            <p className="text-[9px] font-bold text-ink-soft pt-1.5 border-t-2 border-ink/10 leading-relaxed">
              Escalations appear on the command deck until resolved.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
};
