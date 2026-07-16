# CBD Salad Tracker

Track the cheapest salad spots in the Singapore CBD, browsed on a
full-screen map.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Prisma](https://www.prisma.io) + Postgres for storage
- [Leaflet](https://leafletjs.com) + OpenStreetMap for the map (no API key needed)

## Getting started

1. Get a Postgres database. Easiest options:
   - **Deploying on Vercel**: open your project → **Storage** tab → **Create
     Database** → choose Neon/Postgres. Vercel injects `DATABASE_URL`
     automatically — copy the same value into your local `.env` for step 3.
   - **Local only**: any Postgres works, e.g. a free
     [Neon](https://neon.tech) or [Supabase](https://supabase.com) project,
     or `docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres`.
2. ```bash
   npm install
   cp .env.example .env   # then paste your DATABASE_URL in
   ```
3. ```bash
   npx prisma migrate deploy   # applies the schema
   npm run db:seed             # loads 5 real starter salad deals
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

On Vercel, migrations run automatically on every deploy (`npm run build` runs
`prisma migrate deploy` before `next build`) as long as `DATABASE_URL` is set
in the project's environment variables.

## Features

- Full-screen map as the primary view, with a sidebar (search, sort, and a
  scrollable deal list) beside it on desktop, and a floating list/map toggle
  on mobile
- Deals sorted cheapest-first by default; search by name/restaurant/address
- Add, edit, and delete deals through a form (`Add deal`), including
  optional map coordinates

## Data

Deals are stored in Postgres. The seed script (`prisma/seed.ts`) has 5 real
salad spots researched from public sources (Eatbook.sg, TheSmartLocal, food
blogs) as of July 2026 — prices, hours, and coordinates may have changed
since, so verify before relying on them, and edit/add entries through the
app as you go.

## Project structure

- `src/app/page.tsx` — homepage, fetches deals and renders `DealsBrowser`
- `src/app/deals/new`, `src/app/deals/[id]/edit` — add/edit deal forms
- `src/app/api/deals` — REST API (GET/POST, PATCH/DELETE by id)
- `src/components` — `DealsBrowser`, `DealCard`, `DealForm`, `DealsMap`, `DeleteDealButton`
- `src/lib/constants.ts` — shared constants (map center)
- `prisma/schema.prisma` — `Deal` model
