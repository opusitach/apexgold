# ---------------------------------------------------------------------------
# apexgold.cz — production image.
#
# Node 24 is the floor, not a preference: lib/db.ts uses the built-in
# `node:sqlite` module, which only became stable in 24. Alpine keeps the image
# small and sharp ships musl builds, so image optimization still works.
# ---------------------------------------------------------------------------
ARG NODE_VERSION=24-alpine

# --- deps -------------------------------------------------------------------
# Its own stage so editing a component does not reinstall node_modules.
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- builder ----------------------------------------------------------------
FROM node:${NODE_VERSION} AS builder
WORKDIR /app

# NEXT_PUBLIC_* variables are inlined into the client bundle by `next build`,
# so they have to be present here — setting them at runtime does nothing.
ARG NEXT_PUBLIC_GA_ID=""
ARG NEXT_PUBLIC_GOOGLE_ADS_ID=""
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID \
    NEXT_PUBLIC_GOOGLE_ADS_ID=$NEXT_PUBLIC_GOOGLE_ADS_ID \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- runner -----------------------------------------------------------------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

# Alpine ships no zone database, so TZ below would silently stay UTC without it.
RUN apk add --no-cache tzdata

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    TZ=Europe/Prague \
    APEXGOLD_DB_PATH=/data/apexgold.db

# The standalone bundle already contains server.js, next.config and the traced
# node_modules; only the static assets have to be placed next to it by hand.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# sharp is loaded lazily by the image optimizer, so the output tracer does not
# always pick it up. Copy it explicitly: `require("sharp")` from
# node_modules/next/dist/server/ resolves up to /app/node_modules.
COPY --from=deps --chown=node:node /app/node_modules/sharp ./node_modules/sharp
COPY --from=deps --chown=node:node /app/node_modules/@img ./node_modules/@img

# Mount point for the SQLite database. Deliberately not declared as a VOLUME:
# compose bind-mounts ./data here, and an implicit volume would only mask a
# missing mount behind an anonymous one.
RUN mkdir -p /data && chown node:node /data

USER node
EXPOSE 3000

CMD ["node", "server.js"]
