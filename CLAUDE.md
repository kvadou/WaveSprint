# Claude Context – Wavesprint (AI Consulting Lead Capture)

## What This Is
Wavesprint is Doug Kvamme's personal AI consulting venture — a landing page + intelligent intake system for capturing leads from businesses wanting AI/automation consulting.

**Tagline**: "Transmit your idea. Receive a working app in 24 hours."

**Status**: Early development (personal project)
**Stack**: Next.js 14 + Supabase + Tailwind

---

## Business Model

Doug demonstrates AI value at Story Time Chess → potential clients see the results → they hire Doug for consulting.

**Value proposition**:
- Replace expensive SaaS with custom applications
- Rapid MVP development (24-hour turnarounds)
- AI integration and workflow automation
- Proven track record (Story Time Chess as case study)

**Target clients**:
- Small/medium businesses drowning in SaaS costs
- Founders who want custom tools but can't afford agencies
- Companies that see AI potential but don't know where to start

---

## How It Works

1. **User visits landing page** → sees value prop, portfolio, testimonials
2. **User enters "WaveSprint Console"** → interactive intake wizard
3. **AI asks clarifying questions** → builds understanding of their needs
4. **System generates MVP BUILD PROMPT** → ready for development
5. **Lead captured** → Doug reviews and follows up

---

## Architecture

```
~/Wavesprint/
├── app/
│   ├── page.tsx          # Landing page
│   ├── thanks/           # Thank you page
│   ├── admin/            # Lead management dashboard
│   └── api/
│       ├── intake/       # AI conversation handler
│       └── contact/      # Contact form handler
├── components/
│   ├── IntakeWizard.tsx  # Main intake console
│   ├── Header.tsx
│   ├── Portfolio.tsx
│   └── ...
├── lib/
│   ├── db.ts             # Supabase client
│   └── ai/assistant.ts   # AI response generation
├── db/
│   └── schema.sql        # Supabase schema
└── types/
```

---

## Key Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```

**Deployment**: Vercel (planned)
**Database**: Supabase (PostgreSQL)
**Email**: Resend

---

## Current Status

### Done
- Landing page with all sections (hero, process, portfolio, testimonials, pricing, FAQ)
- Contact form
- Admin dashboard structure
- Intake wizard UI

### Needs Integration
- Supabase database connection (schema exists, client is mocked)
- AI assistant (OpenAI/Claude integration)
- Resend email notifications
- Vercel deployment

### Not Started
- Full AI conversation flow
- Lead scoring
- Calendar integration (Calendly)
- Analytics

---

## Design System

### Theme: "Radio Transmission" Aesthetic
Dark background with cyan accents. Tech-forward but approachable.

```
Background:    #0a0a0f (near-black)
Cyan accent:   #00d4ff
Purple:        varies
Text:          white/gray
```

### Visual Elements
- Animated background (particles/waves)
- Grid overlays
- "Signal" metaphors throughout
- Glow effects on CTAs

---

## AI Intake System

### Goal
AI asks clarifying questions until it understands:
- What the user wants to build
- Their budget/timeline
- Technical constraints
- Success criteria

### Output
A structured "MVP BUILD PROMPT" that Doug can use to rapidly build their solution.

### Implementation Notes
- `lib/ai/assistant.ts` has TODO comments for OpenAI integration
- System prompt should extract: problem, users, features, constraints, timeline
- Confidence scoring for each category
- Generate BUILD PROMPT when all categories are high confidence

---

## Admin Dashboard

Protected with `ADMIN_KEY` environment variable.

Features needed:
- View all leads
- See full conversation history
- Copy MVP BUILD PROMPT
- Mark lead status (new, contacted, converted, dead)

---

## Constraints

### Personal Project
- Budget: Minimal (free tiers where possible)
- Time: Stolen hours
- Complexity: Keep it simple

### Must Work
- Fast loading (Vercel + edge)
- Mobile-friendly
- Lead capture must be reliable (can't lose prospects)

### Don't Over-engineer
- No auth system (admin key is fine)
- No complex CRM (Supabase + simple dashboard)
- No fancy CI/CD (Vercel auto-deploy)

---

## Portfolio Content

Showcase Story Time Chess work:
- ATS (replacing Greenhouse)
- Operations Hub (replacing TutorCruncher)
- Play (virtual classroom)
- Analytics dashboards
- Automation systems

Emphasize: "I saved my company $X/year in SaaS costs by building custom tools."

---

## When Working Here

### Do
- Keep the design polished (this is a sales tool)
- Optimize for conversion (every element should drive leads)
- Test the intake flow end-to-end
- Keep dependencies minimal

### Don't
- Over-engineer the backend
- Add features that don't drive conversions
- Make it look like an "AI project" — make it look professional
- Forget mobile users

---

## Environment Variables

```env
NEXT_PUBLIC_SITE_URL=      # Your domain
SUPABASE_URL=              # Supabase project URL
SUPABASE_ANON_KEY=         # Supabase public key
RESEND_API_KEY=            # Email service
OPENAI_API_KEY=            # AI assistant (or ANTHROPIC_API_KEY)
ADMIN_KEY=                 # Admin dashboard access
```

---

## Retrospectives (Claude Learning Log)

*(Add retrospectives here as we build)*

---

## Rules for Future Claude

- `PERSONAL`: This is a personal project — keep it simple
- `CONVERSION`: Every change should support lead capture
- `PORTFOLIO`: Story Time Chess is the main case study
- `INTAKE`: AI should ask questions, not assume
- `ADMIN`: Admin dashboard needs to be useful, not pretty
