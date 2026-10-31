import { AppSettings, GeneratedProject } from '../types/agent';
import { handleSupportQuery } from '../utils/orchestrator';
import { generateJSON, hasAI } from './ai';

export interface SupportAnswer {
  response: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  escalate: boolean;
  usedAI: boolean;
}

const SCHEMA: Record<string, unknown> = {
  type: 'object',
  additionalProperties: false,
  properties: {
    response: { type: 'string' },
    category: { type: 'string' },
    priority: { type: 'string', enum: ['low', 'medium', 'high'] },
    escalate: { type: 'boolean' },
  },
  required: ['response', 'category', 'priority', 'escalate'],
};

export async function askSupportAgent(
  query: string,
  settings: AppSettings,
  project: GeneratedProject | null,
): Promise<SupportAnswer> {
  const needsHuman =
    /(refund|billing|invoice|charge[ds]?|payment|subscription|cancel|password|login|log in|sign in|delete (my )?account|account access)/i.test(
      query,
    );

  const localAnswer = (): SupportAnswer => {
    if (needsHuman) {
      return {
        response:
          "I can't issue refunds, change billing or touch account access from this chat. I've escalated your request to a human teammate — your ticket is saved here in Support history and they'll reply in this thread.",
        category: 'Billing & account',
        priority: 'high',
        escalate: true,
        usedAI: false,
      };
    }
    const base = handleSupportQuery(query);
    return {
      response: base.responseEn,
      category: base.category,
      priority: 'medium',
      escalate: false,
      usedAI: false,
    };
  };

  if (needsHuman || !hasAI(settings)) return localAnswer();

  const context = project?.spec
    ? `Product: ${project.spec.name} — ${project.spec.tagline}. Features: ${project.spec.features.map((f) => f.title).join(', ')}. Tables: ${project.spec.dataModels.map((m) => m.name).join(', ')}. Platforms: ${Object.entries(project.platforms).filter(([, v]) => v).map(([k]) => k).join(', ')}. Deploy URL: ${project.vercel.deployUrl}.`
    : 'No project generated yet in this browser.';

  try {
    const res = await generateJSON<{
      response: string;
      category: string;
      priority: 'low' | 'medium' | 'high';
      escalate: boolean;
    }>({
      settings,
      system: [
        'You are H.AI Support Agent #26, a warm and precise product specialist.',
        'Answer questions about apps built on the H.AI platform. Be specific, under 110 words, and never invent credentials, refunds or SLAs.',
        'If the issue needs account access or a change you cannot perform, set escalate=true and say a human teammate will follow up.',
        'category is a 1-3 word tag. Return only JSON per schema.',
      ].join(' '),
      prompt: `Product context:\n${context}\n\nCustomer question:\n${query}`,
      schema: SCHEMA,
      maxOutputTokens: 900,
      temperature: 0.4,
    });
    return {
      response: res.response || localAnswer().response,
      category: res.category || 'general',
      priority: res.priority || 'medium',
      escalate: Boolean(res.escalate),
      usedAI: true,
    };
  } catch {
    return localAnswer();
  }
}
