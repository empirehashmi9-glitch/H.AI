import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json({ limit: '1mb' }));

const PORT = Number(process.env.PORT || 3001);
const GEMINI_KEY = process.env.GEMINI_API_KEY || '';

app.get('/health', (_req, res) => res.json({ ok: true, hasKey: Boolean(GEMINI_KEY) }));

// POST /api/gemini  { prompt, platform } -> { plan }
// Browser se direct key expose kiye baghair server-side Gemini call.
app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt = '', platform = 'web' } = req.body ?? {};
    if (!GEMINI_KEY) return res.status(400).json({ error: 'GEMINI_API_KEY missing on server (.env). Mock mode use karein.' });
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });
    const out = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Build plan for ${platform} app: "${prompt}". 8 bullets: screens, data model, APIs, auth, tests, deploy.`,
    });
    const text = out.text ?? '';
    res.json({ plan: text });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.listen(PORT, () => console.log(`H.AI proxy live → http://localhost:${PORT} (key: ${GEMINI_KEY ? 'set ✓' : 'missing ✗'})`));
