import { GoogleGenAI } from '@google/genai';
import { AppSettings } from '../types/agent';

export type AIErrorCode = 'no_key' | 'auth' | 'quota' | 'blocked' | 'network' | 'parse' | 'aborted' | 'unknown';

export class AIError extends Error {
  code: AIErrorCode;
  retryable: boolean;
  constructor(code: AIErrorCode, message: string, retryable = false) {
    super(message);
    this.name = 'AIError';
    this.code = code;
    this.retryable = retryable;
  }
}

const ENV = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};
const PROC_ENV = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

/**
 * Key resolution order:
 * 1. key saved in this browser (Settings)
 * 2. build-time Vite env
 * 3. injected process env (AI Studio / Cloud Run)
 */
export function resolveGeminiKey(settingsKey?: string): string {
  const key =
    (settingsKey || '').trim() ||
    (ENV.VITE_GEMINI_API_KEY || '').trim() ||
    (ENV.GEMINI_API_KEY || '').trim() ||
    (ENV.API_KEY || '').trim() ||
    (PROC_ENV.GEMINI_API_KEY || '').trim() ||
    (PROC_ENV.API_KEY || '').trim();
  return key;
}

export function hasAI(settings?: AppSettings): boolean {
  return resolveGeminiKey(settings?.geminiKey).length > 8;
}

const clients = new Map<string, GoogleGenAI>();

export function getClient(key: string): GoogleGenAI {
  if (!key) throw new AIError('no_key', 'No Gemini API key configured.');
  let client = clients.get(key);
  if (!client) {
    client = new GoogleGenAI({ apiKey: key });
    clients.set(key, client);
  }
  return client;
}

function normalizeError(err: unknown): AIError {
  if (err instanceof AIError) return err;
  const e = err as { message?: string; status?: number; code?: number | string; name?: string };
  const msg = (e?.message || String(err)).toLowerCase();
  if (e?.name === 'AbortError' || msg.includes('aborted')) {
    return new AIError('aborted', 'Generation cancelled.', false);
  }
  if (msg.includes('api key') || msg.includes('unauthenticated') || e?.status === 401 || e?.status === 403) {
    return new AIError('auth', 'Gemini rejected the API key. Check it in Settings.', false);
  }
  if (msg.includes('quota') || msg.includes('resource_exhausted') || e?.status === 429) {
    return new AIError('quota', 'Gemini rate limit or quota reached. Try again shortly or switch model.', true);
  }
  if (msg.includes('safety') || msg.includes('blocked') || msg.includes('prohibited')) {
    return new AIError('blocked', 'Gemini blocked this prompt. Rephrase the request.', false);
  }
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('failed to load') || msg.includes('connection')) {
    return new AIError('network', 'Could not reach the Gemini API. Check your internet connection.', true);
  }
  return new AIError('unknown', e?.message || 'Unexpected AI error.', true);
}

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

interface GenerateJSONOptions<T> {
  settings: AppSettings;
  system: string;
  prompt: string;
  schema: Record<string, unknown>;
  signal?: AbortSignal;
  temperature?: number;
  maxOutputTokens?: number;
  retries?: number;
  validate?: (data: unknown) => T;
}

export async function generateJSON<T>(opts: GenerateJSONOptions<T>): Promise<T> {
  const key = resolveGeminiKey(opts.settings.geminiKey);
  if (!key) throw new AIError('no_key', 'No Gemini API key configured.');
  const client = getClient(key);
  const retries = opts.retries ?? 2;
  let lastErr: AIError | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (opts.signal?.aborted) throw new AIError('aborted', 'Generation cancelled.');
    try {
      const response = await client.models.generateContent({
        model: opts.settings.model,
        contents: opts.prompt,
        config: {
          systemInstruction: opts.system,
          responseMimeType: 'application/json',
          responseJsonSchema: opts.schema,
          temperature: opts.temperature ?? 0.75,
          maxOutputTokens: opts.maxOutputTokens ?? 32768,
          abortSignal: opts.signal,
          // Flash models think by default; keep build latency low.
          thinkingConfig: { thinkingBudget: 0 },
        },
      });

      const text = response.text;
      if (!text) throw new AIError('parse', 'Gemini returned an empty response.', true);

      let parsed: unknown;
      try {
        parsed = JSON.parse(stripFences(text));
      } catch {
        throw new AIError('parse', 'Gemini returned malformed JSON.', true);
      }
      return opts.validate ? opts.validate(parsed) : (parsed as T);
    } catch (err) {
      lastErr = normalizeError(err);
      if (lastErr.code === 'aborted' || lastErr.code === 'auth' || lastErr.code === 'blocked') throw lastErr;
      if (!lastErr.retryable || attempt === retries) throw lastErr;
      await sleep(700 * (attempt + 1));
    }
  }
  throw lastErr ?? new AIError('unknown', 'AI generation failed.');
}

function stripFences(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const body = fenced ? fenced[1] : trimmed;
  const start = body.indexOf('{');
  const end = body.lastIndexOf('}');
  if (start >= 0 && end > start) return body.slice(start, end + 1);
  return body;
}

export interface StreamOptions {
  settings: AppSettings;
  system: string;
  history: { role: 'user' | 'assistant'; content: string }[];
  message: string;
  signal?: AbortSignal;
  onChunk: (text: string) => void;
  temperature?: number;
}

export async function streamChat(opts: StreamOptions): Promise<string> {
  const key = resolveGeminiKey(opts.settings.geminiKey);
  if (!key) throw new AIError('no_key', 'No Gemini API key configured.');
  const client = getClient(key);

  const contents = [
    ...opts.history.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: opts.message }] },
  ];

  let full = '';
  let streamed: AsyncGenerator<{ text?: string }> | null = null;
  try {
    streamed = await client.models.generateContentStream({
      model: opts.settings.model,
      contents,
      config: {
        systemInstruction: opts.system,
        temperature: opts.temperature ?? 0.8,
        maxOutputTokens: 2048,
        abortSignal: opts.signal,
      },
    });
    for await (const chunk of streamed) {
      if (opts.signal?.aborted) throw new AIError('aborted', 'Cancelled.');
      const piece = chunk.text || '';
      if (piece) {
        full += piece;
        opts.onChunk(piece);
      }
    }
    return full;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function testGeminiConnection(settings: AppSettings): Promise<{ ok: boolean; message: string }> {
  const key = resolveGeminiKey(settings.geminiKey);
  if (!key) return { ok: false, message: 'No API key set.' };
  try {
    const client = getClient(key);
    const res = await client.models.generateContent({
      model: settings.model,
      contents: 'Reply with exactly: HAI_OK',
      config: { temperature: 0, maxOutputTokens: 16 },
    });
    const text = (res.text || '').trim();
    return { ok: true, message: `Connected · ${settings.model} responded "${text.slice(0, 40)}"` };
  } catch (err) {
    return { ok: false, message: normalizeError(err).message };
  }
}

export function aiErrorMessage(err: unknown): string {
  return normalizeError(err).message;
}
