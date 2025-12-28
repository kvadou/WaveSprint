# WaveSprint.ai - Complete Application Overview

> **Tagline:** "Transmit your idea. Receive a working app in 24 hours."

---

## What Is WaveSprint?

WaveSprint.ai is an **AI-powered MVP (Minimum Viable Product) intake and build platform**. It helps entrepreneurs and businesses submit their app ideas through an intelligent AI-powered conversation, which gathers detailed requirements for building their MVP.

---

## Core Features & Functionality

### 1. Landing Page & Marketing Hub
A futuristic, animated website showcasing the service with sections for:
- Hero with animated console
- How it works / Process demo
- Portfolio of past projects
- Live examples
- Testimonials
- Pricing tiers
- Meet the builder
- FAQ
- Contact form

### 2. Interactive Requirements Intake Wizard
A multi-step form (`IntakeWizard.tsx`) where users submit their project idea:
- Idea description
- Industry selection
- Timeline preferences
- Budget range
- Name, email, company

### 3. AI-Powered Requirements Chat
Uses Anthropic's Claude AI to conduct natural conversational interviews with clients:
- Asks focused, contextual questions
- Gathers 20+ categories of requirements:
  - Problem definition
  - Primary users
  - Business workflow
  - Core features
  - Data requirements
  - Integrations needed
  - Mobile requirements
  - UI/UX preferences
  - Security & compliance
  - Performance requirements
  - Success metrics
  - Timeline & budget
- Tracks confidence levels for each category (low, medium, high)
- Generates final "MVP BUILD PROMPT" once enough information is collected

### 4. Admin CRM Dashboard
Protected dashboard for managing the sales pipeline:
- **Dashboard View**: Overall statistics, recent leads, upcoming follow-ups
- **Pipeline Board**: Kanban-style lead management across sales stages
- **All Leads View**: Grid view of all leads
- **Lead Management**:
  - Move leads between pipeline stages
  - Add tags, notes, and scores
  - Schedule follow-ups
  - View conversation history
  - Track activity timeline

---

## Tech Stack

| Category | Technologies |
|----------|--------------|
| **Framework** | Next.js 14 with App Router |
| **Language** | TypeScript 5.4 |
| **Styling** | TailwindCSS 3.4 + Custom animations |
| **UI Components** | shadcn/ui (Radix UI based) |
| **Animations** | Framer Motion 11.0 |
| **Forms** | React Hook Form + Zod validation |
| **Database** | Supabase (PostgreSQL) |
| **AI APIs** | Anthropic Claude (Haiku for chat, Sonnet for complex tasks) |
| **Email Service** | Resend |
| **Hosting** | Vercel (optimized) |
| **Icons** | Lucide React |
| **Fonts** | Outfit (display), DM Sans (body) |

---

## Application Architecture

### Database Schema
```
leads              → Contact info (name, email, company, industry, problem)
intake_sessions    → Conversation state and category tracking
intake_messages    → Chat history (role, content, timestamps)
mvp_prompts        → Generated build specifications
projects           → Project tracking
pipeline_stages    → Sales pipeline stages
activities         → Audit trail (emails, calls, notes, stage changes)
templates          → Email/SMS templates
scheduled_messages → Outbound communication queue
ai_agents          → Configurable AI assistants
agent_runs         → Execution logs for AI operations
```

### API Routes
```
/api/chat/requirements         → Claude-powered requirements gathering
/api/intake                    → Main intake conversation handler
/api/contact                   → Contact form submissions
/api/admin/pipeline            → Pipeline data for dashboard
/api/admin/stats               → Dashboard statistics
/api/admin/leads               → Lead list, details, updates
/api/admin/leads/[id]/activities → Activity logs
/api/admin/sessions            → Intake session management
```

### Key Pages
```
/                              → Landing page with intake wizard
/admin                         → CRM dashboard (auth protected)
/admin/sessions/[sessionId]    → Intake session details
/admin/leads/[id]              → Lead detail view
/thanks                        → Thank you page after submission
```

### Key Components
```
Landing Page Sections:
├── Header.tsx
├── Hero.tsx
├── ProcessDemo.tsx
├── Portfolio.tsx
├── LiveExamples.tsx
├── Testimonials.tsx
├── Pricing.tsx
├── MeetTheBuilder.tsx
├── FAQ.tsx
├── ContactForm.tsx
└── Footer.tsx

Main Features:
├── IntakeWizard.tsx           → Multi-step intake form
├── RequirementsChat.tsx       → Claude AI conversation interface
└── WaveSprintConsole.tsx      → Interactive console view

Admin Dashboard:
├── DashboardStats.tsx         → KPI display
├── PipelineBoard.tsx          → Kanban pipeline
├── LeadCard.tsx               → Lead preview cards
└── ActivityTimeline.tsx       → Activity history
```

---

## User Flow

```
1. User lands on homepage
         ↓
2. Clicks "Start Your MVP"
         ↓
3. Intake Wizard collects basic info
   (idea, industry, timeline, budget, contact)
         ↓
4. AI Requirements Chat begins
   Claude asks clarifying questions
         ↓
5. After 5-6 exchanges, generates MVP BUILD PROMPT
         ↓
6. Lead saved to database
         ↓
7. Admin manages lead in CRM dashboard
   (pipeline stages, follow-ups, notes)
         ↓
8. Team builds MVP within 24 hours
```

---

---

# Current Brand & Design System

---

## Logo

**Type:** CSS/Component-based (no image files)

**Structure:**
```
┌──────────────┐
│              │
│      ⚡      │   +   "Wave" (white) "Sprint" (cyan)
│    (Zap)     │
│              │
└──────────────┘
  Gradient Box
```

**Technical Details:**
- **Icon**: Lucide `Zap` (lightning bolt)
- **Icon Color**: Dark background color (`#030712`)
- **Container**: 40x40px rounded-lg square
- **Container Gradient**: `from-cyan via-purple to-pink`
- **Text "Wave"**: White (`#F8FAFC`)
- **Text "Sprint"**: Cyan (`#22D3EE`)
- **Font**: Outfit (display font, bold)
- **Hover Effect**: Blurred gradient glow behind icon

**Code Reference:** `components/Header.tsx:44-54`

---

## Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Background** | `#030712` | rgb(3, 7, 18) | Main page background |
| **Background Secondary** | `#0a0f1a` | rgb(10, 15, 26) | Cards, sections |
| **Cyan (Primary)** | `#22D3EE` | rgb(34, 211, 238) | CTAs, highlights, accents |
| **Purple (Secondary)** | `#8B5CF6` | rgb(139, 92, 246) | Gradients, secondary elements |
| **Pink (Accent)** | `#EC4899` | rgb(236, 72, 153) | Gradients, accent elements |

### Text Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Text** | `#F8FAFC` | rgb(248, 250, 252) | Primary text, headings |
| **Text Muted** | `#94A3B8` | rgb(148, 163, 184) | Secondary text, labels |

### Extended Palette (Cyan)

| Shade | Hex |
|-------|-----|
| 50 | `#ecfeff` |
| 100 | `#cffafe` |
| 200 | `#a5f3fc` |
| 300 | `#67e8f9` |
| 400 | `#22d3ee` ← Default |
| 500 | `#06b6d4` |
| 600 | `#0891b2` |
| 700 | `#0e7490` |
| 800 | `#155e75` |
| 900 | `#164e63` |

### Extended Palette (Purple)

| Shade | Hex |
|-------|-----|
| 50 | `#f5f3ff` |
| 100 | `#ede9fe` |
| 200 | `#ddd6fe` |
| 300 | `#c4b5fd` |
| 400 | `#a78bfa` |
| 500 | `#8b5cf6` ← Default |
| 600 | `#7c3aed` |
| 700 | `#6d28d9` |
| 800 | `#5b21b6` |
| 900 | `#4c1d95` |

### Extended Palette (Pink)

| Shade | Hex |
|-------|-----|
| 50 | `#fdf2f8` |
| 100 | `#fce7f3` |
| 200 | `#fbcfe8` |
| 300 | `#f9a8d4` |
| 400 | `#f472b6` |
| 500 | `#ec4899` ← Default |
| 600 | `#db2777` |
| 700 | `#be185d` |
| 800 | `#9d174d` |
| 900 | `#831843` |

---

## Typography

### Fonts

| Type | Font Family | Fallbacks |
|------|-------------|-----------|
| **Display** | Outfit | system-ui, sans-serif |
| **Body** | DM Sans | system-ui, sans-serif |

### Usage

- **Headings**: Outfit (font-display), bold weight
- **Body text**: DM Sans (font-sans), regular weight
- **Navigation**: DM Sans, medium weight
- **CTAs**: DM Sans, semibold weight

---

## Design Theme

**Aesthetic:** Cyberpunk / Futuristic / Tech-forward

**Key Characteristics:**
- Dark mode by default
- Neon accent colors (cyan, purple, pink)
- Glowing effects and gradients
- Grid patterns as background textures
- Animated elements (waves, pulses, scans)
- High contrast text on dark backgrounds

---

## Animations & Effects

### Keyframe Animations

| Animation | Description |
|-----------|-------------|
| `wave` | Gentle vertical floating motion |
| `glow` | Pulsing opacity effect |
| `pulse-glow` | Pulsing box-shadow glow |
| `scan-line` | Vertical scanning line effect |
| `float` | Slow floating up and down |
| `signal-pulse` | Expanding ring pulse effect |
| `fade-in-up` | Fade in while sliding up |
| `fade-in-down` | Fade in while sliding down |
| `slide-in-left` | Slide in from left |
| `slide-in-right` | Slide in from right |
| `scale-in` | Scale up while fading in |
| `shimmer` | Moving gradient shimmer |
| `data-stream` | Horizontal data streaming effect |

### Background Effects

- **Grid Pattern**: Subtle cyan grid lines (`rgba(34, 211, 238, 0.03)`)
- **Noise Texture**: SVG-based fractal noise overlay
- **Radial Gradients**: For spotlight effects
- **Conic Gradients**: For rotating effects

---

## UI Component Styling

### Buttons (CTA)
- Background: Cyan (`#22D3EE`)
- Text: Dark background color
- Hover: Lighter cyan gradient overlay
- Border radius: `rounded-lg` (8px)
- Padding: `px-5 py-2.5`

### Cards
- Background: Semi-transparent dark
- Border: `border-white/5` (5% white)
- Blur: `backdrop-blur-xl`
- Shadow: Subtle dark shadow

### Navigation Links
- Default: Muted text color
- Hover: White text with cyan underline
- Underline animation on hover

---

## Visual Swatches

```
BACKGROUNDS
████████████████  #030712  Background (near-black)
████████████████  #0a0f1a  Background Secondary

PRIMARY ACCENT
████████████████  #22D3EE  Cyan (CTAs, highlights)

SECONDARY COLORS
████████████████  #8B5CF6  Purple
████████████████  #EC4899  Pink

TEXT
████████████████  #F8FAFC  Primary Text
████████████████  #94A3B8  Muted Text

GRADIENTS
████████████████  Cyan → Purple → Pink (logo, accents)
```

---

## Design Inspiration Keywords

- Cyberpunk
- Neon noir
- Futuristic tech
- Digital interface
- Command line aesthetic
- Retro-future
- Synthwave influence
- High-tech startup
- AI/ML vibes
- Developer tools aesthetic

---

## Files for Reference

| File | Purpose |
|------|---------|
| `tailwind.config.ts` | Full color palette, animations, fonts |
| `components/Header.tsx` | Logo implementation |
| `app/globals.css` | CSS variables and base styles |
| `components/Hero.tsx` | Hero section styling |

---

*Document generated for design brainstorming purposes.*
