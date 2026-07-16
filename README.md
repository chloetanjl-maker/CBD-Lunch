# CBD Caifan & Salad Tracker

Track the cheapest caifan (economy/mixed rice) and salad spots in the
Singapore CBD, with a list view and a map view.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Prisma](https://www.prisma.io) + SQLite for storage

## Getting started

```bash
npm install
cp .env.example .env
npx prisma migrate dev   # creates prisma/dev.db and applies the schema
npm run db:seed          # loads 10 real starter deals (5 caifan, 5 salad)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- Browse all deals, sorted cheapest-first by default
- Filter by category (Caifan / Salad) and search by name/restaurant/address
- Toggle between list view and a map view (one pin per address, click a pin
  to see the deals there)
- Add, edit, and delete deals through a form (`+ Add a deal`), including
  optional map coordinates

### Map view setup

The map view needs a Google Maps API key with the "Maps JavaScript API"
enabled. Create one at
[console.cloud.google.com/google/maps-apis](https://console.cloud.google.com/google/maps-apis),
then set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env` and restart the dev
server. Without a key, the map view shows a setup message instead of a
broken map — everything else still works.

## Data

Deals are stored in a local SQLite database (`prisma/dev.db`, gitignored).
The seed script (`prisma/seed.ts`) has 10 real caifan and salad spots
researched from public sources (Eatbook.sg, TheSmartLocal, food blogs) as of
July 2026 — prices, hours, and coordinates may have changed since, so verify
before relying on them, and edit/add entries through the app as you go.

## Project structure

- `src/app/page.tsx` — homepage, fetches deals and renders `DealsBrowser`
- `src/app/deals/new`, `src/app/deals/[id]/edit` — add/edit deal forms
- `src/app/api/deals` — REST API (GET/POST, PATCH/DELETE by id)
- `src/components` — `DealsBrowser`, `DealCard`, `DealForm`, `DealsMap`, `DeleteDealButton`
- `src/lib/categories.ts` — category constants (caifan/salad) and map center
- `prisma/schema.prisma` — `Deal` model
