# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**গরুকই (GoruKoi)** — a Bangladesh-focused, mobile-first community platform for discovering Eid-ul-Adha cattle markets (গরুর হাট), live prices, crowd levels, and reviews. UI strings are primarily Bengali.

Monorepo with **no root package.json** — `backend/` and `frontend/` are independent npm projects. All commands run inside one of those directories.

## Tech at a glance

- **Backend** — NestJS 10, Prisma 5 (PostgreSQL), Redis (ioredis), JWT (passport-jwt), class-validator. Global `/api` prefix. Images stored on **Cloudinary** (no local disk).
- **Frontend** — React 19, Vite, Tailwind, ShadCN-style primitives (hand-rolled in `src/components/ui/*`, no shadcn CLI), TanStack Query, Zustand (persisted via `localStorage`), React Hook Form + Zod, `react-leaflet` + OpenStreetMap tiles (no map API key).
- **Infra** — Docker Compose orchestrates redis + backend + frontend. Postgres is hosted on **Neon** (managed); `DATABASE_URL` lives in `backend/.env` and is consumed by both the host `prisma` CLI and the backend container (via `env_file`). The compose `backend` service overrides only the values that differ inside the container (`REDIS_URL=redis://redis:6379`). Backend container runs `prisma migrate deploy` on startup — so migrations must already exist in `prisma/migrations/` before the container can start cleanly (run `npx prisma migrate dev --name init` on the host once).

## Common commands

### Whole stack
```bash
docker compose up --build      # everything; web→5173, api→3000
```

### Backend (`cd backend`)
```bash
npm run start:dev              # watch-mode Nest on :3000
npm run build && npm run start:prod
npm test                       # jest
npx prisma migrate dev         # create+apply migration after editing schema.prisma
npx prisma generate            # regenerate client (run after pulling schema changes)
npx prisma studio
npm run seed                   # prisma/seed.ts — demo user + 3 markets
```

### Frontend (`cd frontend`)
```bash
npm run dev                    # Vite on :5173
npm run build                  # tsc -b + vite build
npm run lint
```

Run a single backend test file: `npx jest path/to/file.spec.ts` (from `backend/`).

## Architecture — the load-bearing parts

### Backend module graph
`AppModule` wires global infra (`ConfigModule`, `ThrottlerModule`, `CacheModule` backed by Redis, `PrismaModule`, `RedisModule`) and registers feature modules. A global `ThrottlerGuard` rate-limits every endpoint; per-route `@Throttle({...})` overrides exist on `auth/register`, `auth/login`, and `uploads`.

Auth uses **JWT in `Authorization: Bearer`**. There is **no global JWT guard** — protected routes opt in with `@UseGuards(JwtAuthGuard)`. The `@Public()` decorator exists but is only consulted by `JwtAuthGuard` itself; public endpoints simply omit the guard. Resolved user shape is `{ id, email, role }`, exposed via `@CurrentUser()`.

### Markets pipeline (the centerpiece)
`MarketsService.findAll`:
1. Builds a Prisma `where` from filters (division, district, priceLevel, crowdLevel, search).
2. If `lat/lng/radiusKm` is provided, applies a **bounding-box pre-filter** at the DB level (not haversine — that's only done in JS post-step).
3. Pages + sorts at DB. `top-rated` and `nearby` are **post-sorted in JS** after `shape()` enriches each row with `avgRating` (computed from included `reviews.rating`) and `distanceKm` (haversine).
4. Result is **cached in Redis** for 30s under `markets:list:<serialized-query>`. Any write to a market calls `redis.invalidate('markets:list:*')` via the `SCAN`-based helper in `RedisService`.

Because rating/distance sorting happens post-page, `top-rated` / `nearby` results within a page are correct relative to that page, not globally — keep that in mind before adding pagination edge cases.

### Frontend data flow
- `lib/api.ts` is the single axios instance. The request interceptor pulls the token directly from `useAuthStore.getState().token` (no React context). The response interceptor calls `useAuthStore.getState().logout()` on 401 — that's how stale tokens get cleared globally.
- TanStack Query is the **only** server-state store. Zustand stores hold UI/session state (`authStore` persisted, `themeStore` persisted, `filterStore` ephemeral). Don't duplicate API data into Zustand.
- Optimistic updates exist on review reactions (`useReactReview`) — rollback on error, refetch on settle. Mirror this pattern for new mutations on hot read paths.
- Routing uses lazy-loaded page modules under `pages/`; the shell is `AppLayout` (Header + `<Outlet/>` + BottomNav). The `/map` route renders edge-to-edge — `AppLayout` checks `pathname.startsWith('/map')` to drop the container.

### Map integration
`MapView` (`components/map/MapView.tsx`) wraps `react-leaflet` with OpenStreetMap raster tiles — **no API key required**. It accepts `markets[]`, an optional `pinDraft` (the in-progress click point when adding a new market), `onMapClick`, and `selectedId`/`onSelect`.

Implementation notes:
- Markers are `L.divIcon` HTML circles coloured by `PRICE_LEVEL_COLOR` from `lib/constants.ts`. The default Leaflet marker PNG is not used, so the well-known "missing marker icon" Webpack issue doesn't apply.
- `leaflet/dist/leaflet.css` is imported once in `src/main.tsx`. Popup styling overrides live at the bottom of `src/index.css` (under `.leaflet-popup-content-wrapper`) so popups match the app's dark/light theme. Tiles are slightly dimmed in dark mode via `.dark .leaflet-tile`.
- The parent of `<MapView>` **must have an explicit height** — `MapContainer` fills 100% of its container, and Leaflet won't render tiles if the container collapses to 0 height. All current callers (`MapPage`, `MarketDetailsPage` sidebar, `AddMarketPage`) provide one.
- Click handling and recentering use small child components (`ClickHandler`, `Recenter`) because those hooks (`useMapEvents`, `useMap`) must live inside `<MapContainer>`.
- The parent's `selectedId` is informational — Leaflet manages popup open/close natively on marker click. Closing a popup notifies the parent via `popupclose`.

### Bengali UI conventions
- All numbers displayed to users go through `toBengaliNumerals()` from `lib/utils.ts`. Money uses `formatBdt()` (renders ৳ + Bengali digits). Timestamps use `timeAgoBn()` which maps `date-fns` units to Bengali words ("৫ মিনিট আগে").
- Enum-to-Bengali label maps live in `lib/constants.ts` (`PRICE_LEVEL_LABEL`, `CROWD_LEVEL_LABEL`, `MARKET_SIZE_LABEL`, `CATTLE_TYPE_LABEL`). Always import from there rather than hard-coding Bengali strings inline — keeps translations centralised.
- Tailwind has semantic price-tier colours: `cheap` (green), `fair` (amber), `expensive` (red). The `Badge` component has matching variants.
- Body font is `font-bengali` (Noto Sans Bengali) set on `<body>` in `index.html`.

### File uploads
Two-step in the UI: `useUpload` POSTs a multipart `file` to `/api/uploads` and gets back `{ url }`. That URL (a Cloudinary `secure_url`) is then attached to the entity. The backend uses multer `memoryStorage` — no disk writes — and pipes the buffer to Cloudinary via `upload_stream` into the `gorukoi` folder. Allowed MIME: `image/jpeg | png | webp`. Max 5 MB.

### Prisma schema notes
- IDs are `cuid()`. Enums (`PriceLevel`, `CrowdLevel`, `MarketSize`, `CattleType`, `ReactionType`, `Role`) are Postgres enums — adding a value requires a migration.
- `ReviewReaction` has a `@@unique([reviewId, userId])` so re-reacting upserts the type rather than stacking rows.
- Geo queries don't use PostGIS; bounding-box + haversine in JS is the deliberate choice. If that becomes a bottleneck, introduce PostGIS via a migration and update `MarketsService.findAll`.

## Environment variables

The backend reads `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`, `CORS_ORIGIN`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. The frontend reads `VITE_API_BASE_URL`. The map needs no key. Examples in `backend/.env.example` and `frontend/.env.example`.

## What's intentionally not built

These are scoped out — don't assume they exist when reading the code:
- WebSocket / live realtime updates (current "live" feel comes from short Redis cache + relative timestamps).
- AI price estimation.
- Admin dashboard / market verification UI (`Market.verified` exists in schema but has no admin tooling yet).
- Social login (auth is email + password only).
- Spam detection / moderation.
- Heatmap visualisation.
- PWA service worker / offline support.
