import React, { useState } from 'react';
import { Headphones, Loader2, Send, ShieldCheck } from 'lucide-react';
import { useApp } from '../../state/app';
import { askSupportAgent } from '../../services/support';
import { timeAgo } from '../../utils/storage';
import { SupportTicket } from '../../types/agent';
import { toast } from '../../components/Toast';
import { Btn, EmptyState, Panel, Pill, SectionHead } from '../../ui/Toon';
import { ChibiRobot } from '../../ui/Chibi';

const statusTone = (status: SupportTicket['status']) =>
  status === 'resolved' ? 'mint' : status === 'escalated' ? 'coral' : 'sun';

export const SupportPage: React.FC = () => {
  const { tickets, addTicket, settings, activeProject, aiLive } = useApp();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const myTickets = tickets.filter((t) => t.origin !== 'demo');

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending) return;
    setSending(true);
    const answer = await askSupportAgent(message, settings, activeProject);
    const ticket: SupportTicket = {
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Studio customer',
      customerEmail: 'customer@h.ai',
      promptTopic: answer.category,
      message,
      response: answer.response,
      responseUrdu: '',
      status: answer.escalate ? 'escalated' : 'resolved',
      priority: answer.priority,
      createdAt: new Date().toISOString(),
      viaApiWebhook: true,
      origin: 'customer',
    };
    addTicket(ticket);
    setMessage('');
    setSending(false);
    toast.success(answer.escalate ? 'A human teammate will follow up' : 'Agent #26 replied');
    if (!answer.usedAI && aiLive) toast.info('AI hiccup — answered with the local playbook');
  };

  return (
    <div className="space-y-5">
      <SectionHead
        eyebrow="Support Agent #26"
        title="Talk to the crew"
        sub="Ask anything about your apps, deployments or accounts. Agent #26 answers with your latest build in mind."
        right={
          <Pill tone={aiLive ? 'mint' : 'sun'} dot={aiLive ? '#159570' : '#B07800'}>
            {aiLive ? 'AI answering' : 'Playbook mode'}
          </Pill>
        }
      />

      <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-4">
        <Panel className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-16 sm:w-20 shrink-0">
              <ChibiRobot size={78} color="#6FD6FF" accent="#04141d" mood="happy" float />
            </div>
            <div>
              <div className="font-display text-lg leading-none">Hi, I'm Agent #26</div>
              <p className="text-[11px] font-bold text-ink-soft mt-1 leading-relaxed">
                I know your latest build{activeProject ? `, ${activeProject.name},` : ''} its stack and
                deploy status. Ask me anything.
              </p>
            </div>
          </div>

          <form onSubmit={send} className="space-y-3">
            <div>
              <label htmlFor="support-message" className="text-[10px] font-extrabold uppercase tracking-wider text-ink-soft">Question</label>
              <textarea
                id="support-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="field mt-1 resize-y text-sm leading-relaxed"
                placeholder="e.g. How do I connect Supabase storage to my generated iOS app?"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-ink-soft flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Stays in this browser
              </span>
              <Btn tone="coral" disabled={!message.trim() || sending} type="submit">
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {sending ? 'Agent is typing…' : 'Send to Agent #26'}
              </Btn>
            </div>
          </form>
        </Panel>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-none flex items-center gap-2"><Headphones className="w-4 h-4" /> Ticket history</h3>
            <Pill tone="cream">{myTickets.length}</Pill>
          </div>

          {myTickets.length ? (
            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {myTickets.slice(0, 12).map((ticket) => (
                <Panel key={ticket.id} className="p-3.5 sm:p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Pill tone={statusTone(ticket.status) as any}>{ticket.status}</Pill>
                        <Pill tone="cream">{ticket.promptTopic}</Pill>
                      </div>
                      <div className="text-[10px] font-bold text-ink-soft mt-1">
                        {ticket.id} · {ticket.customerName} · {timeAgo(ticket.createdAt, false)}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold text-ink/80 leading-relaxed">{ticket.message}</p>
                  <div className="rounded-xl border border-mint/20 bg-mint/[0.06] p-2.5 flex gap-2">
                    <div className="w-7 shrink-0">
                      <ChibiRobot size={28} color="#3DD9B3" accent="#04141d" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] font-extrabold uppercase tracking-wide text-ink-soft">Agent #26</div>
                      <p className="text-[10px] font-semibold leading-relaxed mt-0.5">{ticket.response}</p>
                    </div>
                  </div>
                </Panel>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Headphones className="w-5 h-5" />}
              title="No tickets yet"
              sub="Ask the first question and Agent #26 will answer right here."
            />
          )}
        </div>
      </div>
    </div>
  );
};
