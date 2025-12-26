# WaveSprint.ai

**Transmit your idea. Receive a working app in 24 hours.**

WaveSprint.ai is a landing page + intake system where users describe the business app they want, and the system asks clarifying questions until it has enough detail. Then it generates a final "MVP BUILD PROMPT" that can be used to build a 24-hour MVP.

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** TailwindCSS
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod
- **Database:** Supabase (PostgreSQL)
- **Email:** Resend
- **AI:** OpenAI API (abstraction layer ready for integration)
- **Hosting:** Vercel (optimized for deployment)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- (Optional) Resend account for email notifications
- (Optional) OpenAI API key for AI integration

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key

# AI Service (OpenAI - for future use)
OPENAI_API_KEY=your_openai_api_key

# Admin Authentication
ADMIN_KEY=your_secure_admin_key_here
```

3. **Set up Supabase database:**

- Create a new Supabase project at [supabase.com](https://supabase.com)
- Go to the SQL Editor
- Run the SQL schema from `db/schema.sql`
- Copy your project URL and anon key from Settings > API

4. **Update database client:**

Open `lib/db.ts` and uncomment the Supabase client initialization:

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Then replace all the mock implementations with actual Supabase calls (see TODO comments in the file).

5. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

1. **Push your code to GitHub**

2. **Import project to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Add environment variables:**
   - In Vercel project settings, add all variables from `.env.local`
   - Update `NEXT_PUBLIC_SITE_URL` to your Vercel domain

4. **Deploy:**
   - Vercel will automatically deploy on push
   - Or click "Deploy" in the dashboard

## Connecting Supabase

1. **Create a Supabase project:**
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project (choose a region close to your users)

2. **Run the database schema:**
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste the contents of `db/schema.sql`
   - Click "Run"

3. **Get your credentials:**
   - Go to Settings > API
   - Copy "Project URL" → `SUPABASE_URL`
   - Copy "anon public" key → `SUPABASE_ANON_KEY`

4. **Update the code:**
   - Open `lib/db.ts`
   - Uncomment the Supabase client initialization
   - Replace all mock functions with actual Supabase queries (see TODO comments)

## Setting Up Email (Resend)

1. **Create a Resend account:**
   - Sign up at [resend.com](https://resend.com)
   - Verify your domain (or use the test domain for development)

2. **Get your API key:**
   - Go to API Keys in Resend dashboard
   - Create a new API key
   - Copy it to `RESEND_API_KEY` in your `.env.local`

3. **Update the contact API:**
   - Open `app/api/contact/route.ts`
   - Uncomment the Resend email sending code
   - Update the `from` email address to match your verified domain

## Integrating OpenAI (AI Assistant)

1. **Get an OpenAI API key:**
   - Sign up at [platform.openai.com](https://platform.openai.com)
   - Go to API Keys section
   - Create a new secret key
   - Copy it to `OPENAI_API_KEY` in your `.env.local`

2. **Update the AI assistant:**
   - Open `lib/ai/assistant.ts`
   - Follow the TODO comments to:
     - Import OpenAI client
     - Build conversation messages from session state
     - Call OpenAI API with proper system prompts
     - Parse and return structured responses

3. **Create the system prompt:**
   - The AI should ask clarifying questions to fill intake categories
   - Once all categories are high confidence, generate the MVP BUILD PROMPT
   - See the TODO comments in `lib/ai/assistant.ts` for guidance

## Project Structure

```
/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── intake/        # Intake conversation handler
│   │   ├── contact/       # Contact form handler
│   │   └── admin/         # Admin API routes
│   ├── admin/             # Admin dashboard pages
│   ├── thanks/            # Thank you page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── WaveSprintConsole.tsx
│   ├── AnimatedBackground.tsx
│   └── ContactForm.tsx
├── lib/                   # Utility functions
│   ├── db.ts             # Database helpers (Supabase)
│   ├── ai/               # AI abstraction layer
│   │   └── assistant.ts
│   └── utils.ts          # General utilities
├── types/                 # TypeScript types
│   ├── database.ts       # Database types
│   └── intake.ts         # Intake system types
├── db/                    # Database schema
│   └── schema.sql        # Supabase SQL schema
└── README.md
```

## Key Features

### WaveSprint Console
- Interactive intake interface with chat-like UI
- Real-time conversation with AI assistant
- Generates final MVP BUILD PROMPT when complete

### Admin Dashboard
- View all leads and intake sessions
- Access full conversation history
- Copy MVP prompts for development
- Protected with admin key authentication

### Landing Page
- Modern, futuristic design with animated backgrounds
- Responsive and mobile-first
- All marketing sections included

## TODO: Integration Checklist

- [ ] Set up Supabase project and run schema
- [ ] Replace mock database functions in `lib/db.ts` with Supabase calls
- [ ] Add OpenAI API key and implement `generateNextIntakeTurn` in `lib/ai/assistant.ts`
- [ ] Set up Resend and uncomment email code in `app/api/contact/route.ts`
- [ ] Configure domain and deploy to Vercel
- [ ] Test the full intake flow end-to-end
- [ ] Customize branding/colors if needed
- [ ] Add analytics (optional)

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SITE_URL` | Your site URL (for links/redirects) | Yes |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anon/public key | Yes |
| `RESEND_API_KEY` | Resend API key for emails | Optional |
| `OPENAI_API_KEY` | OpenAI API key for AI assistant | Optional (for now) |
| `ADMIN_KEY` | Secret key for admin dashboard access | Yes |

## Support

For issues or questions, check the TODO comments in the code for integration guidance.

---

Built with ❤️ for rapid MVP development.

