This is the [Next.js](https://nextjs.org) project for [apexgold.cz](https://apexgold.cz).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The site is localized (`app/[lang]/`) and the admin panel lives under `app/admin/` — see `proxy.ts` for how locales and the `/admin` route are resolved.

## Deploying with Docker

Production runs as a single container (`docker-compose.yml`):

- **`app`** — the Next.js server (site, API routes, admin panel, SQLite), built from `Dockerfile` as a `output: "standalone"` bundle on `node:24-alpine`. Node 24 is the floor because `lib/db.ts` uses the built-in `node:sqlite` module. Not published to the host.

TLS, the `www` redirect and the `admin.apexgold.cz` mapping live in the shared Caddy of the [infra-websites](https://github.com/opusitach/infra-websites) repo (`/home/ubuntu/infra-websites` on the server). It reaches the app over the external `edge` docker network as `apexgold-app:3000`, so that network has to exist before the first `docker compose up` (`make network` in infra-websites).

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

#### The lead journal

Every submission is also appended to `data/leads.jsonl` (one JSON object per line) *before* the insert into SQLite is attempted, so an application survives even when the database refuses writes or the Telegram delivery fails. Three event types are written: `received` (the full submission), `stored` (the id it got) and `failed` (why it did not make it). The app never rotates or prunes this file — container logs are rotated, this is the durable trail. It holds the same personal data as the database and lives in the same directory, so the backup above already covers it.

Applications that never reached the database — what to re-enter by hand after an outage:

```bash
jq -s '(map(select(.event=="stored").ref)) as $ok | map(select(.event=="received" and (.ref | IN($ok[]) | not)))' data/leads.jsonl
```

### 4. Build and run

```bash
docker compose up -d --build
```

`docker compose ps` should show `app` as `healthy` (the healthcheck hits `/api/health`). Certificate issuance is watched from infra-websites (`make logs`).

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

redeploys after a `git pull`. `docker compose logs -f app` tails the app. Web server changes (domains, redirects, headers) are made in infra-websites and applied there with `make reload`.

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

It must also own `data/`, the bind mount that holds the leads database, with **uid 1000** — the `node` user the container runs as. Docker creates a missing bind-mount source as `root`, and the app then cannot create the database at all: every form submission answers 500 while the container itself keeps serving pages. The deploy script creates the directory before Compose can and refuses to deploy when the owner is wrong; if it ever is, fix it once with `sudo chown -R 1000:1000 <deploy path>/data`. `/api/health` takes a write lock on the database, so this failure now turns the container unhealthy and fails the deploy instead of surfacing as lost applications.

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

## Search engines

Everything a crawler needs is generated from the page data, so there is nothing to maintain by hand:

- `app/robots.ts` → `/robots.txt`, allowing everything except `/admin` and `/api/`, and pointing at the sitemap. `admin.apexgold.cz` serves its own `Disallow: /` (plus `X-Robots-Tag: noindex`) from the Caddyfile in infra-websites.
- `app/sitemap.ts` → `/sitemap.xml`: 13 pages × 4 locales, each with its `hreflang` alternates and the photos that page renders (Google Images crawls those). Its `lastmod` comes from the `CONTENT_REVISED` constant — **bump it when the copy actually changes**, not on every deploy, or search engines learn to ignore the field.
- `lib/siteMeta.ts` → canonical URL, `hreflang`, Open Graph and Twitter cards for every page.
- `lib/schema.ts` → the JSON-LD graph (`LocalBusiness`, `WebSite`, `Service`, `Offer`, `FAQPage`, `BreadcrumbList`), all pointing at one business entity by `@id`.

### Verifying ownership in the search consoles

Google is verified through a DNS `TXT` record on `apexgold.cz`. Seznam and Bing want a `<meta>` tag: paste the `content=` value into `SITE_VERIFICATION` in `lib/siteMeta.ts` and deploy — the pages are prerendered, so the tag only appears after a rebuild. An empty value emits no tag at all.

Then submit `https://apexgold.cz/sitemap.xml` in each console:

| Console | Where |
| --- | --- |
| Google Search Console | Sitemaps → Add a new sitemap |
| Seznam Webmaster | `search.seznam.cz/wmt` → Sitemapy |
| Bing Webmaster Tools | importable in one click from Search Console |

### IndexNow

Bing, Seznam and Yandex accept a push notification instead of waiting for a crawl (Google does not participate). Ownership is proved by `public/<key>.txt`, which contains exactly the key that names it — it must be deployed before a submission is accepted.

```bash
npm run indexnow
```

That reads the key, fetches the live `sitemap.xml` and submits every URL. Run it after a deploy that adds or rewrites pages; it is pointless for an unchanged site and repeated submissions of the same URLs are a good way to get throttled. To rotate the key, delete the old file and create a new pair:

```bash
KEY=$(openssl rand -hex 16); printf %s "$KEY" > public/$KEY.txt
```

## Running without Docker

The app also runs as a plain Node process — `npm run build && npm run start` on **Node 24+**, with the same environment variables in `.env.local` and a reverse proxy in front (point `reverse_proxy` in the infra-websites Caddyfile at `localhost:3000` instead of `apexgold-app:3000`).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
