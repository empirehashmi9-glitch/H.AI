import { AppSettings } from '../types/agent';
import { analyzePrompt, getDomainItems } from '../utils/orchestrator';
import { generateJSON, hasAI } from './ai';

const MARK = '\n\nProduct scope:';

interface DomainPlan {
  audience: string;
  screens: string;
  flows: string;
  data: string;
  style: string;
}

const DOMAINS: Record<string, DomainPlan> = {
  ecommerce: {
    audience: 'style-conscious shoppers and independent boutique owners',
    screens: 'storefront, catalog with filters, product detail, cart, checkout, order history, seller dashboard',
    flows: 'browse → filter → cart → checkout → order tracking, plus an operator view for stock and orders',
    data: 'products, variants, customers, carts, orders, order items, reviews',
    style: 'premium editorial layout, warm neutrals with one bold accent, large product imagery',
  },
  health: {
    audience: 'patients booking care and clinic staff managing appointments',
    screens: 'doctor discovery, appointment booking, video consult room, prescriptions, records, staff schedule',
    flows: 'find a specialist → pick a slot → consult → receive prescription, with a staff calendar view',
    data: 'patients, doctors, specialties, appointments, prescriptions, medical records',
    style: 'calm clinical palette, high legibility, generous spacing, trust-first tone',
  },
  food: {
    audience: 'hungry customers ordering delivery and restaurant operators',
    screens: 'menu, item detail, cart, live order tracking, offers, restaurant order board',
    flows: 'browse menu → customise items → checkout → live delivery status, plus a kitchen order queue',
    data: 'menu items, categories, carts, orders, delivery addresses, riders',
    style: 'appetising food photography, warm accent colour, fast one-thumb ordering',
  },
  realestate: {
    audience: 'buyers, renters and property agents',
    screens: 'search with map filters, listing detail, gallery, mortgage estimate, enquiry, agent dashboard',
    flows: 'search → filter by budget and area → view gallery → book a viewing → agent follow-up',
    data: 'properties, media, agents, enquiries, viewings, saved searches',
    style: 'architectural photography, quiet luxury palette, data-rich listing cards',
  },
  ride: {
    audience: 'riders booking trips and drivers accepting them',
    screens: 'trip planner, fare estimate, driver matching, live map, trip history, driver console',
    flows: 'set pickup and drop-off → see fare → confirm → track driver → rate the trip',
    data: 'riders, drivers, vehicles, trips, fares, ratings, payment methods',
    style: 'high-contrast map-first UI, bold status colours, large tap targets',
  },
  education: {
    audience: 'students learning at their own pace and instructors publishing courses',
    screens: 'course catalog, lesson player, quiz, progress dashboard, certificates, instructor studio',
    flows: 'choose a course → follow lessons → take quizzes → track progress → earn a certificate',
    data: 'courses, modules, lessons, quizzes, attempts, enrollments, certificates',
    style: 'friendly academic palette, clear typographic hierarchy, progress feedback everywhere',
  },
  social: {
    audience: 'readers, listeners and creators sharing content',
    screens: 'feed, article or episode detail, comments, creator profile, saved items, moderation queue',
    flows: 'discover → read or listen → comment → save → follow creators, with a moderation view',
    data: 'posts, media, comments, reactions, follows, saved items, reports',
    style: 'editorial typography, bilingual (English + Urdu RTL) layout, distraction-free reading',
  },
  saas: {
    audience: 'small teams that need a focused daily workflow',
    screens: 'dashboard, workspace list, detail view, activity feed, billing, settings, team management',
    flows: 'sign in → create workspace → invite teammates → complete the core task → review activity',
    data: 'users, workspaces, members, items, activity events, subscriptions',
    style: 'clean dark dashboard, data-dense but breathable, one accent for actions',
  },
};

export function enhancePromptLocal(prompt: string): string {
  const idea = prompt.split(MARK)[0].trim();
  if (!idea) return prompt;
  const { projectName, category } = analyzePrompt(idea);
  const plan = DOMAINS[category] || DOMAINS.saas;
  const items = getDomainItems(category)
    .slice(0, 3)
    .map((i) => i.titleEn)
    .join(', ');
  return `${idea}${MARK}
Product: ${projectName}
Target users: ${plan.audience}
Screens: ${plan.screens}
Core flows: ${plan.flows}
Data (Supabase + RLS): ${plan.data}
Sample content: ${items || 'realistic seed data for the main workflow'}
Visual direction: ${plan.style}
Quality bar: responsive web, native iOS and Android clients, sample data, empty and error states, secure auth and role-based access. Ship a production-ready MVP.`;
}

const BRIEF_SCHEMA: Record<string, unknown> = {
  type: 'object',
  additionalProperties: false,
  properties: { brief: { type: 'string' } },
  required: ['brief'],
};

export async function enhancePrompt(prompt: string, settings: AppSettings): Promise<string> {
  const local = enhancePromptLocal(prompt);
  if (!hasAI(settings)) return local;

  try {
    const res = await generateJSON<{ brief: string }>({
      settings,
      system: [
        'You are Hala, H.AI product strategist.',
        'Rewrite the customer idea into one vivid build brief of 90-140 words, plain English, no markdown and no bullet points.',
        "Cover target users, the key screens and flows, data needs and visual direction. Never invent prices, SLAs or credentials.",
        'Return only JSON per schema.',
      ].join(' '),
      prompt: `Customer idea:\n${prompt.split(MARK)[0].trim()}`,
      schema: BRIEF_SCHEMA,
      temperature: 0.7,
      maxOutputTokens: 700,
    });
    const brief = (res.brief || '').trim();
    return brief.length > 60 ? brief : local;
  } catch {
    return local;
  }
}
