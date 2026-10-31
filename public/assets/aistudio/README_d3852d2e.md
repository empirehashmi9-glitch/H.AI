# H.AI · J.A.R.V.I.S. Factory — Advanced Edition ⚡

> Ek prompt → Web + iOS + Android app. 30 specialist agents, live logs, preview, ZIP export aur one-click deploy.

## Aapke purane project me kya kami thi?

Aapne jo files bhejin (sirf `index.html`, `package.json`, `vite.config.ts`, `tsconfig.json`, `.env.example`), unme:

1. **`src/` folder hi missing tha** — `index.html` `/src/main.tsx` maang raha tha jo tha hi nahi → app run hi nahi hoti.
2. **Koi UI / component nahi tha** — Arc Reactor, agents grid, build console, preview kuch nahi tha.
3. **Gemini API wiring nahi thi** — `@google/genai` dependency thi lekin use karne wala code nahi tha.
4. **`remote-agent/agent.mjs` missing** — `npm run remote` script tuta hua tha.
5. **Tailwind CSS file missing** — plugin laga tha lekin `src/index.css` me `@import "tailwindcss"` nahi tha.
6. **Deploy (Supabase/Vercel) sirf naam me tha** — koi schema, Edge Function ya deploy flow nahi tha.
7. **Voice, chat, history, ZIP export** — koi advanced feature nahi tha.
8. **TypeScript strict + build check** — `tsc` config adhura tha.

Ye sab is update me fix + advanced bana diya gaya hai. ✅ `npm run build` passing.

## Naye Advanced Features

- 💠 **3D Arc Reactor** (Three.js) — build ke time animate hota hai
- 🤖 **30 Agents live grid** — ULTRON, VISION, STARK … JARVIS tak, progress + logs
- 🎙 **Voice input (Web Speech)** + 🔊 **JARVIS voice reply**
- 💬 **JARVIS Chat tab** — Urdu/Hindi/English me sawal-jawab
- 🖥 **Live Build Console** — timestamped agent logs, progress bar
- 📁 **File Explorer + Code Viewer + Live iframe Preview**
- 📦 **Export ZIP** (jszip) — poora generated source download
- 🚀 **Deploy tab** — Vercel URL + Supabase tables/RLS simulation
- 🧠 **Gemini live plan** — `VITE_GEMINI_API_KEY` ho to real AI plan, warna smart mock
- 🕘 **Build history** (localStorage) — pichle 20 builds save
- 📱 **Web / iOS (SwiftUI) / Android (Compose)** — platform tabs se alag code
- 🗄 **Supabase schema.sql + Edge Function stub** auto-generated
- ⚡ Motion animations, Lucide icons, Orbitron/Rajdhani fonts

## Run

```bash
npm install
# dev
npm run dev        # → http://localhost:3000

# prod build
npm run build
npm run preview

# optional Gemini server proxy (key expose kiye baghair)
# .env.local me GEMINI_API_KEY daal kar:
npm run server     # → http://localhost:3001
```

Env:

```bash
cp .env.example .env.local
# VITE_GEMINI_API_KEY=...   (browser direct, dev only)
# GEMINI_API_KEY=...        (server proxy ke liye)
```

## Structure

```
src/
  App.tsx                 # poori factory UI (5 tabs)
  main.tsx
  index.css               # tailwind v4 + glass/scanline theme
  components/ArcReactor.tsx
  lib/agents.ts           # 30 agents definitions
  lib/generator.ts        # prompt → files + preview + gemini
  lib/types.ts
server/index.mjs          # express Gemini proxy
```

## Deploy

- **Vercel:** `npm run build` → `dist/` ko deploy karein
- **Supabase:** `supabase/schema.sql` ko SQL editor me chalaiye, `supabase/functions/app` ko deploy karein
