# Financer — Personal Finance Dashboard (Next.js 15, Plaid, Lemon Squeezy)

**Stack highlights:** Next.js (App Router, RSC), TypeScript, Clerk (auth), Hono (typed API), Drizzle ORM + Neon, TanStack Query/Table, Recharts, Tailwind v4 + shadcn/ui, Sentry.  
**Fintech:** Plaid **Sandbox** integration (link, exchange, accounts, transactions), subscriptions via **Lemon Squeezy** (Checkout + Customer Portal + webhook, DB status).

> ⚠️ **Educational/demo project.** Plaid runs in **Sandbox** only. Do **not** connect real bank accounts.

---

## TL;DR

- Link a bank via **Plaid (sandbox)** → import **accounts** & **transactions**  
- Explore data with **filters/search/sorting/pagination**, inline edits, CSV **export**  
- **CSV import** with **TF-IDF auto-categorization** + merchant rules  
- Premium flows are **paywalled** via **Lemon Squeezy** subscriptions  
- Production touches: **Clerk auth**, **typed Hono API**, **Drizzle migrations**, **Sentry**, typed payload validation (Zod)

---

## ✨ Key Features

### Fintech & Data
- **Plaid Sandbox**: Link flow, server-side public_token exchange, persisted **accounts** and **transactions** (with Plaid Personal Finance Category mapping).
- **CSV Import**: Client-side parsing (PapaParse) with **TF-IDF**-based auto-categorization and merchant rules; **CSV Export** for the active selection.
- **Overview Analytics**: Daily income/expense time series (gap-filled), category share (pie), and deltas vs previous period.

### Subscriptions & Access
- **Lemon Squeezy**:  
  - `POST /api/subscriptions/checkout` → URL to **Checkout** or **Customer Portal** (if already subscribed)  
  - `GET /api/subscriptions/current` → current status  
  - `POST /api/subscriptions/webhook` → HMAC-verified upsert in DB  
- **Paywall gating**: Plaid linking and CSV import require an active subscription.

### App UX
- **Transactions Table** (TanStack Table): sorting, selection, inline edits (sheet modals).  
- **URL-synced filters**: account & date range filters survive refresh and are shareable (deep-links).  
- **Accounts & Categories**: CRUD with modals; first-run import of the Plaid PFC taxonomy.

### Observability & Safety
- **Sentry** (server/edge) with prod-only enablement and `/monitoring` tunnel.  
- **Hono + Zod** validation on API routes; **Clerk**-backed auth guard.  
- **Drizzle ORM + Neon** with migrations committed.

---

## 🧭 Project Status

- ✅ Next.js 15 (App Router, RSC) + TypeScript + Tailwind v4/shadcn  
- ✅ Auth (Clerk) + middleware guard  
- ✅ Hono API (`/api`) + Zod validation  
- ✅ Drizzle ORM + Neon driver; migrations via `drizzle-kit`  
- ✅ **Plaid Sandbox**: link → exchange → accounts + transactions → category mapping  
- ✅ **Lemon Squeezy**: checkout, customer portal, webhook; DB holds subscription status  
- ✅ CSV import (TF-IDF categorization) and CSV export  
- ✅ Overview charts & summary  
- ✅ Sentry wiring (prod-only), TanStack Query provider  
- ⏳ CI (GitHub Actions)

---

## 🏗️ Architecture

**Frontend-first, App Router**

- **RSC** pages for first render and streaming; interactive “islands” as client components.  
- **Feature-Sliced layers**: `shared → entities → features → widgets → app pages`.

**API / Server**

- `src/app/api/[[...route]]/route.ts` — **Hono** router mounted at `/api`; subroutes:
  - `/plaid`, `/summary`, `/accounts`, `/categories`, `/transactions`, `/subscriptions`
- Request validation via `@hono/zod-validator`; auth via `@hono/clerk-auth`.
- **DB (Drizzle ORM / Postgres, Neon)** — core tables:
  - `accounts` (id, name, userId, plaid_id)  
  - `categories` (id, name, userId, plaid_id, unique(userId, plaid_id))  
  - `transactions` (id, amount **milliunits**, payee, notes, date, accountId, categoryId)  
  - `connected_banks` (id, userId, accessToken, cursor, itemId)  
  - `subscriptions` (id, userId **unique**, subscriptionId **unique**, status)

**Data & State**

- TanStack Query hooks under `src/entities/**/api` for server data.  
- Small local/Zustand stores where needed (e.g., CSV flow).  
- Utilities for money math (milliunits), Plaid taxonomy, formatting, and URL filters.

**UI**

- shadcn/ui components, Tailwind v4, lucide icons.

---

## 🔌 API Surface (selected)

`/api/plaid`  
- **POST** `/create-link-token` → `{ token }`  
- **POST** `/exchange-public-token` `{ public_token }` → persist bank + accounts + transactions  
- **GET** `/connected-bank` → current connection  
- **DELETE** `/connected-bank` → remove connection  
- **POST** `/webhook` (Plaid) → sync by cursor

`/api/subscriptions`  
- **GET** `/current` → subscription status  
- **POST** `/checkout` → `{ url }` (Checkout or Customer Portal)  
- **POST** `/webhook` (Lemon Squeezy) → HMAC verify + DB upsert

`/api/summary`  
- **GET** `/` with `?from=YYYY-MM-DD&to=YYYY-MM-DD&accountId=…` → time series + category share + deltas

`/api/accounts`, `/api/categories`, `/api/transactions` — CRUD, bulk ops, search & pagination.

---

## 🧰 Tech Stack

**Frontend:** Next.js 15 · React 19 · TypeScript · Tailwind v4 · shadcn/ui · TanStack Query/Table · Recharts  
**API:** Hono · Zod · `@hono/clerk-auth` · Route Handlers (Node runtime)  
**Auth:** Clerk  
**DB:** Drizzle ORM + `@neondatabase/serverless`  
**Fintech:** Plaid SDK (Sandbox) · **Lemon Squeezy** SDK (checkout/portal/webhooks)  
**Observability:** Sentry (server/edge)  
**Data tooling:** PapaParse, uuid, date-fns, lodash, zustand

---

## 🔐 Security & Privacy

- **Sandbox only** for Plaid. Never use real banking credentials.  
- Store tokens server-side; in production, **encrypt at rest** and scrub from logs.  
- HttpOnly cookies via Clerk; Lemon webhooks verified with HMAC.  
- Middleware protects the app (public routes are limited to sign-in/up and the subscription webhook).

---

## 🚀 Getting Started

```bash
# 1) Install deps
bun i

# 2) Copy envs
cp .env.example .env

# 3) DB migrations (Drizzle)
bun run db:update

# 4) Dev
bun run dev
# open http://localhost:3000
```

### Environment variables (`.env.example`)

- **Clerk:** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`  
- **DB:** `PRODUCTION_DB_URL`, `DEVELOPMENT_DB_URL` (Neon)  
- **Sentry:** `NEXT_PUBLIC_SENTRY_DSN` (prod/preview), `SENTRY_AUTH_TOKEN` (CI)  
- **Plaid (sandbox):** `PLAID_CLIENT_TOKEN`, `PLAID_SECRET_TOKEN`  
- **App URL:** `NEXT_PUBLIC_APP_URL`  
- **Lemon Squeezy:** `LEMONSQUEEZY_STORE_ID`, `LEMONSQUEEZY_PRODUCT_ID`, `LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_WEBHOOK_SECRET`

> **Sentry in development**: enabled only in production/preview when a DSN is present. Locally, keep `NEXT_PUBLIC_SENTRY_DSN` empty.

---

## 📊 Metrics & Charts

- `/summary` aggregates daily series, computes **income/expenses/remaining** and deltas vs the previous window.  
- `fillMissingDays` for continuous time series; category share pie for composition.  
- Filters are URL-synced for deep links.

---

## ✅ Code Quality & Best Practices — Review

**What’s strong**
- **Typed, modular design:** App Router with a clean split into entities/features/widgets; typed API via Hono + Zod; Drizzle schemas checked into repo.  
- **Clear domain boundaries:** finance entities (accounts, categories, transactions) and subscription state kept separate and explicit.  
- **Security posture:** Clerk for auth, HMAC verification on Lemon webhooks, Plaid confined to sandbox; tokens kept server-side.  
- **Developer ergonomics:** Tailwind v4 + shadcn/ui, TanStack Query/Table; URL-synced filters improve UX and shareability.  
- **Observability hooks:** Sentry wiring (server/edge), production-only enablement, monitoring endpoint.

**What to improve next (high-impact, short effort)**
1. **Encrypt tokens at rest** (Plaid access tokens) and add a scrubber middleware for logs.  
2. **Rate limiting & idempotency**: apply per-IP/user limits on `/api/plaid/*`; idempotent handling for webhooks (keyed by `event.id`).  
3. **Performance budget proof**: add a `/metrics` page (Web Vitals ingest) and include a Lighthouse (mobile) screenshot in README.  
4. **Accessibility basics**: keyboard focus, ARIA labels for table controls, color-contrast ≥ 4.5:1, live regions for async updates.  
5. **Error boundaries & friendly fallbacks**: empty/error/skeleton states are in place—add a global error boundary for unexpected crashes.  
6. **Backups & migrations policy**: document Neon backup cadence and a simple rollback procedure (Drizzle migrations).  
7. **Internationalization / currency**: centralize currency/locale formatting and (optionally) add an i18n stub for future expansion.

---

## 🗺️ Roadmap

- Budgets & alerts (per category), monthly/periodic reports (CSV/PDF)  
- i18n & multi-currency  
- Scheduled sync (cron)  
- At-rest encryption for tokens/secrets  
- CI (GitHub Actions) pipeline (lint → typecheck → build → deploy)

---

## 📂 Notable Source Layout

- `src/app/(dashboard)/*` — Overview, Transactions, Accounts, Categories, Settings  
- `src/app/api/[[...route]]/*` — Hono subroutes (plaid, subscriptions, summary, …)  
- `db/schemas/*` — Drizzle tables & relations  
- `src/entities/*` — typed API hooks, types, small stores (per domain)  
- `src/features/*` — user flows (plaid-connect, csv-import, subscribe-button, filters, …)  
- `src/widgets/*` — composite UI blocks (tables, sheets, header, summary)  
- `src/shared/*` — UI kit, utils, hooks, constants

---

## 📄 License

MIT

---

**Notes**  
This README reflects the current codebase: Next.js 15 + Clerk + Hono API + Drizzle/Neon; Plaid (Sandbox) and Lemon Squeezy are integrated at the API level with paywall gating; CSV import + TF-IDF categorization; Sentry wiring in prod/preview. If you change env keys or route names, update the sections above accordingly.