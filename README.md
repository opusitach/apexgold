This is the [Next.js](https://nextjs.org) project for [apexgold.cz](https://apexgold.cz).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The site is localized (`app/[lang]/`) and the admin panel lives under `app/admin/` — see `proxy.ts` for how locales and the `/admin` route are resolved.

## Deploying with Docker

Production runs as two containers (`docker-compose.yml`):

- **`app`** — the Next.js server (site, API routes, admin panel, SQLite), built from `Dockerfile` as a `output: "standalone"` bundle on `node:24-alpine`. Node 24 is the floor because `lib/db.ts` uses the built-in `node:sqlite` module. Not published to the host.
- **`webserver`** — Caddy on ports 80/443 (+443/udp for HTTP/3). It terminates TLS with automatic Let's Encrypt certificates and proxies to `app:3000` (`Caddyfile`).

### 1. Prerequisites

Docker Engine with the Compose plugin on the server, ports 80 and 443 open, and DNS `A`/`AAAA` records for `apexgold.cz`, `www.apexgold.cz` and `admin.apexgold.cz` pointing at it. Certificates cannot be issued before DNS resolves.

**Build on the server.** The image bakes in platform-specific `sharp` binaries — an image built on an Apple Silicon Mac gets the arm64 musl build and its image optimizer will fail on an x86 host. If you must build locally, use `docker buildx build --platform linux/amd64`.

### 2. Environment variables

The `app` container reads `.env.local` — the same git-ignored file the setup scripts write, so nothing has to be copied around:

```bash
cp .env.example .env.local
node scripts/setup-admin.mjs
```

`setup-admin.mjs` fills in `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_TOTP_SECRET` and `ADMIN_SESSION_SECRET` (it needs Node 24+; it can also be run on a laptop and the file copied to the server).

One exception: `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_GOOGLE_ADS_ID` are inlined into the client bundle by `next build`, so setting them in `.env.local` does nothing for the container. They are passed as build args in `docker-compose.yml` — to change them, export them in the shell (or put them in `./.env`, which Compose reads for interpolation) and rebuild.

### 3. Database

Leads are stored in a SQLite file mounted from the host at `./data` (`APEXGOLD_DB_PATH=/data/apexgold.db`). To carry an existing database over, stop the app first and copy all three files, then fix ownership — the container runs as uid 1000:

```bash
scp data/apexgold.db data/apexgold.db-wal data/apexgold.db-shm server:/srv/apexgold/data/
```

```bash
sudo chown -R 1000:1000 /srv/apexgold/data
```

A backup is a plain copy of that directory.

### 4. Build and run

```bash
docker compose up -d --build
```

`docker compose ps` should show `app` as `healthy` (the healthcheck hits `/api/health`) and `webserver` running. Watch certificate issuance with `docker compose logs -f webserver`.

### 5. Telegram webhook

Once, after the site is live on HTTPS:

```bash
node scripts/setup-telegram.mjs https://apexgold.cz
```

It writes `TELEGRAM_WEBHOOK_SECRET` into `.env.local`; run it from the deploy directory, then `docker compose up -d` again so the container picks the secret up.

### 6. Day-to-day

```bash
docker compose up -d --build
```

redeploys after a `git pull`. `docker compose logs -f app` tails the app, and `docker compose restart webserver` reloads Caddy after editing the `Caddyfile`. Issued certificates persist in the `caddy_data` volume, so rebuilds do not re-request them.

## Running without Docker

The app also runs as a plain Node process — `npm run build && npm run start` on **Node 24+**, with the same environment variables in `.env.local` and a reverse proxy in front (change `app:3000` back to `localhost:3000` in the `Caddyfile`).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
