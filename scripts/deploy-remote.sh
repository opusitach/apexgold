#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Runs on the VPS, not on the runner: .github/workflows/deploy.yml pipes this
# file into `bash -s` over SSH. Piping it (instead of calling a copy that is
# already on the server) means the version being executed is the one from the
# commit being deployed — no chicken-and-egg where a deploy needs the previous
# deploy to have installed the right script.
#
# Expects DEPLOY_PATH and GIT_SHA in the environment; the workflow passes both
# on the ssh command line.
# ---------------------------------------------------------------------------
set -euo pipefail

: "${DEPLOY_PATH:?DEPLOY_PATH is required}"
: "${GIT_SHA:?GIT_SHA is required}"

# How long to wait for the app container's healthcheck. The compose healthcheck
# has a 60s start_period plus 3 retries at 30s, so a slow-but-healthy start can
# legitimately take ~150s; 300s leaves headroom without hanging the job.
HEALTH_TIMEOUT=300

cd "$DEPLOY_PATH"

# On any failure past this point, dump recent container logs — otherwise the
# workflow only shows "exit 1" and the reason stays on the server.
trap 'echo "--- deploy failed, last 60 log lines ---"; docker compose logs --tail=60 app || true' ERR

echo "--- updating working tree to $GIT_SHA ---"
git fetch --prune origin main
# reset --hard rather than pull: the deployed tree then matches the commit that
# triggered the workflow exactly, even if someone edited a file on the server.
# Safe for state, because .env.local and data/ are git-ignored and untracked
# files are never removed (no `git clean` here, deliberately).
git reset --hard "$GIT_SHA"
git --no-pager log -1 --format='%h %s (%an, %ar)'

# The leads database lives in ./data, bind-mounted into the container at /data.
# If that directory does not exist, Docker creates it as root — and the app
# runs as uid 1000 (`node`), so SQLite then fails with "unable to open database
# file" on every submitted form while the container still looks healthy.
# Creating it here means it belongs to the deploy user instead.
echo "--- checking the database directory ---"
mkdir -p data
data_uid="$(stat -c '%u' data)"
if [ "$data_uid" != "1000" ]; then
  echo "./data is owned by uid $data_uid, but the container writes to it as uid 1000." >&2
  echo "Fix it on the server once:  sudo chown -R 1000:1000 $DEPLOY_PATH/data" >&2
  exit 1
fi

echo "--- rebuilding and restarting containers ---"
# The image is built on the server on purpose: it bakes in platform-specific
# sharp binaries (see README). --remove-orphans drops containers left behind by
# services that were renamed or deleted in docker-compose.yml.
docker compose up -d --build --remove-orphans

echo "--- waiting for the app container to become healthy ---"
container_id="$(docker compose ps -q app)"
if [ -z "$container_id" ]; then
  echo "no app container is running" >&2
  exit 1
fi

elapsed=0
while true; do
  state="$(docker inspect -f '{{.State.Status}}' "$container_id")"
  health="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$container_id")"

  if [ "$health" = "healthy" ]; then
    echo "app is healthy after ${elapsed}s"
    break
  fi
  # A crash loop would otherwise burn the full timeout before reporting.
  if [ "$state" != "running" ]; then
    echo "app container is '$state' (health: $health)" >&2
    exit 1
  fi
  if [ "$health" = "none" ]; then
    echo "app container has no healthcheck — cannot verify the deploy" >&2
    exit 1
  fi
  if [ "$elapsed" -ge "$HEALTH_TIMEOUT" ]; then
    echo "app did not become healthy within ${HEALTH_TIMEOUT}s (last status: $health)" >&2
    exit 1
  fi

  sleep 5
  elapsed=$((elapsed + 5))
done

# --- disk cleanup ----------------------------------------------------------
# Every `up --build` leaves the previous image untagged (a few hundred MB) and
# adds to the BuildKit cache, which has no size limit by default. Without this
# the VPS disk fills up after a few dozen deploys.
#
# Untagged images go entirely; build cache is only dropped once it is a week
# old, so the next build still reuses the npm ci / next build layers and stays
# fast. `--filter until=` works on both the legacy builder and buildx, unlike
# --keep-storage (renamed to --max-used-space in Docker 27+).
echo "--- pruning unused images and stale build cache ---"
docker image prune --force
docker builder prune --force --filter until=168h

echo "--- disk usage after cleanup ---"
docker system df
df -h "$DEPLOY_PATH"

trap - ERR
echo "--- deploy finished ---"
