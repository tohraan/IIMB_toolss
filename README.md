# IIMB | TRIAXON - AI Tools Platform

A modern Next.js 14 (App Router) + React 18 web app with 20+ AI tools across Cloud Dev, Marketing, Productivity & Design, and AI General.

## Tech Stack
- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS + Radix UI (shadcn/ui components)
- Supabase (Auth/DB)
- Vercel Analytics

## Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` (see Environment Variables below)
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`

## Environment Variables
Create `.env.local` with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Build & Production
- Build:
  ```bash
  npm run build
  ```
- Start production server (Node runtime):
  ```bash
  npm run start
  ```

## Deploy to Vercel
1. Push to GitHub
2. Import repo on Vercel
3. Framework: auto-detected (Next.js)
4. Set Env Vars in Vercel (same as `.env.local`)
5. Build Command: `npm run build`
6. Output Directory: `.next`

A `vercel.json` is included to help framework detection.

## Project Structure
```
app/                       # App Router routes
components/                # Reusable UI components (shadcn/ui)
lib/                       # Utility modules (incl. Supabase)
public/                    # Static assets
styles/                    # Global styles
next.config.mjs            # Next.js config
vercel.json                # Vercel config
package.json               # Scripts & deps
```

## Notes
- Middleware is configured in `middleware.ts`
- Title set in `app/layout.tsx` to "IIMB | TRIAXON"
- ESLint/TS checks are skipped during build per `next.config.mjs`
# IIMB
