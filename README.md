This is the [Next.js](https://nextjs.org) project for [apexgold.cz](https://apexgold.cz).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The site is localized (`app/[lang]/`) and the admin panel lives under `app/admin/` — see `proxy.ts` for how locales and the `/admin` route are resolved.

## Running the production server

1. **Node version** — the app uses the built-in `node:sqlite` module, which requires **Node 24+**.

2. **Environment variables** — copy `.env.example` to `.env.local` and fill in the admin credentials:

   ```bash
   cp .env.example .env.local
   node scripts/setup-admin.mjs
   ```

   This generates `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_TOTP_SECRET`, and `ADMIN_SESSION_SECRET` and writes them to `.env.local`. Also set `NEXT_PUBLIC_GA_ID` if analytics should be enabled. Leads are stored in a local SQLite file (defaults to `./data/apexgold.db`, overridable with `APEXGOLD_DB_PATH`) — make sure that path is writable and persisted across deploys.

3. **Build and start**:

   ```bash
   npm run build
   npm run start
   ```

   `next start` serves the app on `localhost:3000` by default.

4. **Reverse proxy** — in production, Caddy sits in front of the Node process and terminates TLS for both hosts (see `Caddyfile`):
   - `apexgold.cz` (and the `www` redirect) proxy to `localhost:3000`.
   - `admin.apexgold.cz` rewrites to `/admin` and proxies to the same app.

   Keep the Node process running (e.g. with `pm2` or a `systemd` service) and reload Caddy after any config change with `caddy reload`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
