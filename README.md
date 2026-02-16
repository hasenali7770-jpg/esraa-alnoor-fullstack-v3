# Esraa Al-Noor - Fullstack v2 (Supabase + Vercel + Django)

This repo contains:
- `frontend/` Next.js (App Router) + Tailwind + Supabase Auth + GrapesJS Admin Builder
- `backend/` Django + DRF API connected to Supabase Postgres

## Included features (complete MVP)
- Arabic/English (routes `/ar` and `/en`) + RTL/LTR
- Dark/Light mode toggle
- Currency toggle (USD/IQD) + IQD rounding + manual override
- Courses (sections/lessons), Featured courses, Preview lessons gating
- Comments on course pages (requires login)
- WhatsApp floating button (from settings)
- Admin dashboard (only admin emails) to manage pages, media, courses, pricing, settings, translations, activation codes
- Activation codes: generate for user email + course/plan, redeem by logged-in user

> Note: Very large videos: prefer external video hosting and paste URL in admin (still supported). Supabase Storage works for smaller files.

## Deploy overview
- Frontend -> Vercel (Root directory: `frontend`)
- Backend -> Render (Root directory: `backend`)
- Database -> Supabase (Postgres + Storage)

## IMPORTANT SECRETS
- Frontend uses `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`
- Backend uses `DATABASE_URL`, `SUPABASE_JWT_SECRET`, `ADMIN_EMAILS`

See `frontend/.env.example` and `backend/.env.example`.
