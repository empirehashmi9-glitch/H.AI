import { GoogleGenAI } from '@google/genai';
import { GeneratedFile } from './types';

export async function generateAppWithGemini(
  prompt: string,
  appName: string,
  apiKey?: string
): Promise<{ files?: GeneratedFile[]; error?: string }> {
  const key = apiKey || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');

  if (!key) {
    return { error: 'NO_API_KEY_CONFIGURED' };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are the lead architect of H.AI J.A.R.V.I.S. Multi-Platform Factory.
Generate a complete working React 19 + Tailwind CSS single-file component for the following request: "${prompt}".
App Name: "${appName}".
Return only clean, production TypeScript/React code without markdown wrappers or codeblocks.`
    });

    const code = response.text || '';
    if (code) {
      return {
        files: [
          {
            path: 'src/App.tsx',
            language: 'typescript',
            platform: 'web',
            description: 'AI Generated React 19 Component via Gemini 2.5 Flash',
            content: code
          }
        ]
      };
    }
  } catch (err: any) {
    console.warn('Gemini live call error, using autonomous pipeline fallback:', err);
    return { error: err.message || 'API_CALL_FAILED' };
  }

  return { error: 'UNKNOWN_FAILURE' };
}
