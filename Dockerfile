# Self-hosted production build. Uses next.config.ts's `output: 'standalone'`
# so the runtime image ships only the files each page actually needs, not
# the full node_modules tree -- the standard Next.js self-hosting pattern
# (see https://nextjs.org/docs/app/api-reference/config/next-config-js/output).

# ── Stage 1: install deps (cached separately from source so a source-only
#    change doesn't reinstall everything) ──────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: build ───────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are inlined into the client JS bundle at BUILD time --
# they must be passed as build args, not just runtime environment, or the
# browser bundle ships empty strings. The two server-only secrets
# (SUPABASE_SERVICE_ROLE_KEY, CMS_SECRET) are deliberately NOT here -- they
# stay out of every image layer and are injected at container runtime only
# (see docker-compose.yml), since they're read exclusively by server-side
# API routes.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY \
    NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST

# public/ is a genuinely empty directory in this repo right now -- git
# does not track empty directories at all, so a fresh clone has no
# public/ directory to COPY --from in the runner stage below. mkdir -p
# makes that COPY always valid, whether or not public/ ever gains real
# files (and harmless if it already exists).
RUN npm run build && mkdir -p public

# ── Stage 3: runtime ─────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
