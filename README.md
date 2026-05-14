# গরুকই (GoruKoi)

**Discover and share Eid cattle markets (গরুর হাট) across Bangladesh.**

A community-driven map of temporary Qurbani cattle markets — locations, live price ranges, crowd levels, reviews, and photos. Think Google Maps + Community Reviews + Local Marketplace Insights, tailored for Bangladeshi users during Eid-ul-Adha.

---

## Monorepo layout

```
gorukoto/
├── backend/          NestJS + Prisma + PostgreSQL + Redis REST API
├── frontend/         React 19 + Vite + TypeScript + Tailwind + ShadCN UI
├── uploads/          Local file-upload mount for dev
├── docker-compose.yml
└── README.md
```

## Tech stack

| Layer        | Tech                                                                 |
| ------------ | -------------------------------------------------------------------- |
| Frontend     | React 19, Vite, TypeScript, Tailwind, ShadCN, TanStack Query, Zustand, React Hook Form + Zod, Leaflet + OpenStreetMap, Framer Motion |
| Backend      | NestJS, Prisma, PostgreSQL, Redis, JWT auth, class-validator         |
| Infra        | Docker Compose (Redis + API + Web); Postgres hosted on Neon          |
| Tooling      | ESLint, Prettier, Husky                                              |

## Quick start (Docker)

```bash
cp backend/.env.example backend/.env
# Edit backend/.env — set DATABASE_URL to your Neon connection string
cp frontend/.env.example frontend/.env

# One-time: generate the initial Prisma migration against Neon.
# Run this from your host, not inside Docker, since it needs interactive output.
cd backend && npm install && npx prisma migrate dev --name init && cd ..

docker compose up --build
```

- Web → http://localhost:5173
- API → http://localhost:3000/api
- Redis → localhost:6379
- Postgres → Neon (cloud)

The API container runs `prisma migrate deploy` on startup, so subsequent migrations apply automatically once they exist in `backend/prisma/migrations/`.

## Local development (without Docker)

### Backend

```bash
cd backend
npm install
cp .env.example .env                  # edit DATABASE_URL, REDIS_URL, JWT_SECRET
npx prisma migrate dev
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Common commands

### Backend (`cd backend`)
| Command                  | What it does                                    |
| ------------------------ | ----------------------------------------------- |
| `npm run start:dev`      | Watch-mode dev server (port 3000)               |
| `npm run build`          | Compile to `dist/`                              |
| `npm run start:prod`     | Run compiled build                              |
| `npm run lint`           | ESLint                                          |
| `npm test`               | Jest unit tests                                 |
| `npx prisma migrate dev` | Create + apply a new migration                  |
| `npx prisma studio`      | Browse the DB                                   |
| `npx prisma generate`    | Regenerate Prisma client after schema changes   |

### Frontend (`cd frontend`)
| Command           | What it does                                |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Vite dev server (port 5173)                 |
| `npm run build`   | Type-check + production build to `dist/`    |
| `npm run preview` | Preview the production build                |
| `npm run lint`    | ESLint                                      |

## Core features

- **Authentication** — register / login with JWT, protected routes, profile.
- **Map integration (Leaflet + OpenStreetMap)** — click anywhere on the map to add a market; custom price-tier markers; user’s location is honoured. No API key required.
- **Markets** — name, area, district/division, GPS, price condition (`কম দাম` / `স্বাভাবিক` / `বেশি দাম`), market size, crowd level, photos, description.
- **Community reviews** — 5-star rating, price tag, comment, image, helpful-vote reactions.
- **Live price updates** — users post current cattle prices; UI shows relative timestamps (“৫ মিনিট আগে”).
- **Smart filters** — division, district, price level, crowd level, nearby (geo radius), top-rated, cheapest.
- **Mobile-first UI** — bottom nav, floating add-market FAB, skeleton loaders, optimistic updates, dark/light mode, Bengali labels throughout.

## Environment variables

### `backend/.env`
```
DATABASE_URL=postgresql://<user>:<password>@<neon-host>/<db>?sslmode=require&channel_binding=require
REDIS_URL=redis://localhost:6379
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
PORT=3000
UPLOAD_DIR=./uploads
PUBLIC_UPLOAD_URL=http://localhost:3000/uploads
CORS_ORIGIN=http://localhost:5173
```

> Use the **direct** Neon host (no `-pooler`) so Prisma's own connection pool isn't competing with PgBouncer's transaction-mode pooler. If you must use the pooler URL, append `&pgbouncer=true` and add `directUrl = env("DIRECT_URL")` to `prisma/schema.prisma` for migrations.

### `frontend/.env`
```
VITE_API_BASE_URL=http://localhost:3000/api
```

## API surface (high level)

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/markets                 # ?division&district&priceLevel&crowdLevel&lat&lng&radiusKm&sort&page
POST   /api/markets
GET    /api/markets/:id
PATCH  /api/markets/:id
DELETE /api/markets/:id

GET    /api/markets/:id/reviews
POST   /api/markets/:id/reviews
POST   /api/reviews/:id/react        # { type: HELPFUL | NOT_HELPFUL }

GET    /api/markets/:id/price-updates
POST   /api/markets/:id/price-updates

POST   /api/uploads                  # multipart, returns { url }
```

## Notes

- All Bengali strings live in the components; English fallbacks are paired with them via `<span lang="bn">`. The UI is primarily Bengali — labels like `গরুর হাট`, `দাম`, `কম দাম`, `বেশি দাম`, `রিভিউ`, `মন্তব্য`, `কাছাকাছি হাট` are used throughout.
- File uploads land in `uploads/` (mounted as a Docker volume in compose) and are served from `/uploads/*`.
- Redis is used for response caching on hot read endpoints (`GET /api/markets`) and for IP-based rate-limiting on write endpoints.
