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

The `app` container reads `.env.local` — the same git-ignored file the setup scripts write, so nothing has to be copied around. Generate the admin credentials **before** creating the file; `setup-admin.mjs` refuses to overwrite an existing `.env.local` and only prints the values instead:

```bash
node scripts/setup-admin.mjs
```

That writes `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_TOTP_SECRET` and `ADMIN_SESSION_SECRET`, and prints an `otpauth://` URL to add to an authenticator app. Append `TELEGRAM_BOT_TOKEN` to the same file by hand (see `.env.example` for the full list). The script needs Node 24+; on a server that only has Docker, run it in a throwaway container:

```bash
docker run --rm -v "$PWD:/app" -w /app --user "$(id -u):$(id -g)" node:24-alpine node scripts/setup-admin.mjs
```

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

It appends `TELEGRAM_WEBHOOK_SECRET` to `.env.local` and registers the webhook with Telegram, so it has to run from the deploy directory against the live HTTPS domain. Then `docker compose up -d` again for the container to pick the secret up. Without Node on the server, the same container trick works:

```bash
docker run --rm -v "$PWD:/app" -w /app --user "$(id -u):$(id -g)" node:24-alpine node scripts/setup-telegram.mjs https://apexgold.cz
```

### 6. Day-to-day

```bash
docker compose up -d --build
```

redeploys after a `git pull`. `docker compose logs -f app` tails the app, and `docker compose restart webserver` reloads Caddy after editing the `Caddyfile`. Issued certificates persist in the `caddy_data` volume, so rebuilds do not re-request them.

## Continuous deployment

`.github/workflows/deploy.yml` runs that same day-to-day command for you on every push to `main` (and on demand via **Actions → Deploy → Run workflow**). It has two jobs:

1. **Checks** — on a GitHub runner: `npm ci`, `npm run lint`, `next typegen && tsc --noEmit`, `npm run build`. Next 16 no longer lints during `next build`, so linting is a separate step. A failure here stops the run and the server is never touched.
2. **Deploy** — SSH into the VPS and pipe `scripts/deploy-remote.sh` into `bash -s`. The script resets the working tree to the exact commit that triggered the run, rebuilds with `docker compose up -d --build`, waits for the `app` healthcheck, then prunes Docker.

The image is still built **on the server** — see the `sharp` warning above. Deploys are serialised by a concurrency group, so two pushes in a row queue instead of colliding.

### Disk hygiene

Each rebuild leaves the previous image untagged and grows the BuildKit cache, which is unbounded by default — left alone, the VPS disk fills up after a few dozen deploys. After a successful deploy the script runs:

```bash
docker image prune --force && docker builder prune --force --filter until=168h
```

Untagged images go immediately; build cache is only dropped once it is a week old, so the next build still reuses the `npm ci` and `next build` layers. `--filter until=` is used rather than `--keep-storage`, which was renamed to `--max-used-space` in Docker 27 and would break on the other version. `docker system df` and `df -h` are printed at the end of every run, so the job log doubles as a disk-usage history.

### Server prerequisites

The SSH user must own the deploy directory, be able to run `docker` without `sudo` (member of the `docker` group), and be able to `git fetch origin` non-interactively — i.e. its own deploy key is already in `~/.ssh`.

### GitHub secrets and variables

Under **Settings → Secrets and variables → Actions**:

| Secret | Value |
| --- | --- |
| `VPS_HOST` | Server hostname or IP |
| `VPS_USER` | SSH user that owns the deploy directory |
| `VPS_SSH_KEY` | Private key, whole file including the `BEGIN`/`END` lines |
| `VPS_KNOWN_HOSTS` | Output of `ssh-keyscan` for the server |

Two optional **variables** (not secrets) override the defaults: `VPS_PORT` (default `22`) and `VPS_PATH` (default `/home/ubuntu/apexgold`, the deploy directory on the current EC2 host).

Generate a dedicated key pair for Actions rather than reusing a personal one:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/apexgold_deploy -C "github-actions" -N ""
```

```bash
ssh-copy-id -i ~/.ssh/apexgold_deploy.pub user@apexgold.cz
```

Then `cat ~/.ssh/apexgold_deploy` into `VPS_SSH_KEY`, and pin the host keys so the runner cannot be redirected to another machine:

```bash
ssh-keyscan -p 22 apexgold.cz
```

### When a deploy fails

There is no automatic rollback. If the build fails the old containers keep serving — Compose never gets to recreate them. If the build succeeds but the new container never turns healthy, the job fails red with the last 60 log lines, and the site is down until it is fixed; recover by SSHing in and running `git reset --hard <previous-sha> && docker compose up -d --build`.

## Running without Docker

The app also runs as a plain Node process — `npm run build && npm run start` on **Node 24+**, with the same environment variables in `.env.local` and a reverse proxy in front (change `app:3000` back to `localhost:3000` in the `Caddyfile`).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
