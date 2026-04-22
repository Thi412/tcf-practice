# 🎤 TCF Practice — Daily Speaking Trainer

A mobile-first web app for TCF Canada speaking exam preparation.

## ✨ Features

- **Daily practice** with rotating questions (Tâche 2 & 3)
- **SOS Ideas button** — instant unblocking when you run out of ideas (DB-first, AI fallback)
- **Ideas bank** — structured POUR/CONTRE ideas per topic
- **Templates** — ready-made speech structures
- **Phrase Upgrade** — AI rewrites your sentence at B1/B2/C1 level
- **Recording timer** — 4m15s (Tâche 3) / 5m (Tâche 2)
- **AI Feedback** — 3 mistakes + improved version + level estimate
- **Cost-optimized** — AI only called for upgrade/feedback, everything else from DB
- **Response caching** — identical AI inputs never cost twice
- **Daily limits** — free: 2 feedback/day, pro: 20/day

---

## 🗂 Project Structure

```
tcf-practice/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── daily/route.ts          # Load today's question + ideas
│   │   │   ├── feedback/route.ts       # AI feedback (cached, rate-limited)
│   │   │   ├── upgrade/route.ts        # AI phrase upgrade (cached, rate-limited)
│   │   │   └── sos-ideas/route.ts      # SOS ideas (DB-first, AI fallback)
│   │   ├── daily/page.tsx              # Daily tab
│   │   ├── tache2/page.tsx             # Tâche 2 tab
│   │   ├── tache3/page.tsx             # Tâche 3 tab
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── BottomNav.tsx               # 3-tab navigation
│   │   ├── TaskScreen.tsx              # Full task view (shared)
│   │   ├── SosIdeas.tsx                # 😵 SOS button
│   │   ├── IdeasSection.tsx            # 💡 POUR/CONTRE ideas
│   │   ├── TemplateSection.tsx         # 🧩 Speech structure
│   │   ├── UpgradeSection.tsx          # ✨ Phrase upgrader
│   │   ├── RecordingSection.tsx        # 🎙 Timer + recorder
│   │   └── FeedbackSection.tsx         # 📊 AI feedback
│   └── lib/
│       ├── supabase.ts                 # DB client
│       ├── openai.ts                   # AI client (gpt-4o-mini)
│       ├── cache.ts                    # Input hash → cache lookup
│       ├── usage.ts                    # Daily limits tracking
│       └── types.ts                    # TypeScript types
├── supabase/
│   ├── schema.sql                      # All tables + RLS policies
│   └── seed.sql                        # 10 topics + ideas + templates
└── public/
    └── manifest.json                   # PWA manifest
```

---

## 🚀 Setup Instructions

### 1. Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)
- An [OpenAI](https://platform.openai.com) API key

### 2. Install dependencies

```bash
cd tcf-practice
npm install
```

### 3. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → New project
2. Open **SQL Editor**
3. Run `supabase/schema.sql` (creates all tables + RLS)
4. Run `supabase/seed.sql` (adds 10 topics, ideas, templates)
5. Get your project URL and keys from **Settings → API**

### 4. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
OPENAI_API_KEY=sk-...
```

### 5. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 💰 Cost Optimization

| Action | AI Call? | Cost per use |
|--------|----------|-------------|
| Load question | ❌ DB only | $0 |
| SOS Ideas (first) | ❌ DB only | $0 |
| SOS Ideas (all used) | ✅ gpt-4o-mini, cached | ~$0.0002 |
| Upgrade phrase | ✅ gpt-4o-mini, cached | ~$0.0005 |
| Feedback | ✅ gpt-4o-mini, cached | ~$0.0003 |
| Ideas bank | ❌ DB only | $0 |
| Templates | ❌ DB only | $0 |

**Estimated monthly cost for 100 active users (free tier): < $5/month**

### Caching strategy
All AI responses are hashed (SHA-256) by input. Identical inputs return cached results instantly at zero cost. Cache lives in the `cache_ai` table.

### Daily limits
| Plan | Feedback/day | Upgrade/day |
|------|-------------|-------------|
| Free | 2 | 2 |
| Pro | 20 | 20 |

---

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `topics` | Questions for Tâche 2 & 3, rotates daily |
| `ideas_bank` | POUR/CONTRE ideas + ready sentences per topic |
| `templates` | Speech structure blocks (intro, args, conclusion) |
| `cache_ai` | Input hash → AI output cache |
| `usage_tracking` | Per-user daily usage limits |

---

## 📱 Progressive Web App

The app is PWA-ready. Users can install it on their phone:
- iOS: Safari → Share → "Add to Home Screen"
- Android: Chrome → Menu → "Add to Home Screen"

---

## 🔮 Future Improvements

- [ ] Supabase Auth for real user accounts + pro tier
- [ ] Audio recording upload + Whisper transcription
- [ ] Streak tracking (days in a row practiced)
- [ ] More topics (aim for 30+ per task type)
- [ ] Spaced repetition for weak areas
- [ ] Push notifications for daily reminders
- [ ] Admin panel to add topics without SQL

---

## 🏗️ Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Set the same environment variables in Vercel dashboard under **Settings → Environment Variables**.
"# tcf-practice" 
