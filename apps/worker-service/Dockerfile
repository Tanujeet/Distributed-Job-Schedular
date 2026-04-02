# ---------- BUILDER ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy full monorepo
COPY . .

# Build order matters (dependencies first)
RUN npx tsc -p packages/redis
RUN npx tsc -p packages/database
RUN npx tsc -p packages/utils

# Build worker
RUN npx tsc -p apps/worker-service


# ---------- RUNNER ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install only production deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy ONLY required build output + packages
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/worker-service/dist ./apps/worker-service/dist

# Run compiled JS
CMD ["node", "apps/worker-service/dist/index.js"]