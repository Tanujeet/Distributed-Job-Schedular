# ---------- BUILDER ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build dependencies first
RUN npx tsc -p packages/redis
RUN npx tsc -p packages/database
RUN npx tsc -p packages/utils

# Build scheduler (IMPORTANT)
RUN npx tsc -p apps/scheduler-service


# ---------- RUNNER ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# copy only required build output
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/scheduler-service/dist ./apps/scheduler-service/dist

CMD ["node", "apps/scheduler-service/dist/index.js"]