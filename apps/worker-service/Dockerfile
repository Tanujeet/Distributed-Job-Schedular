# ---------- BUILDER ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy full monorepo
COPY . .

# Build packages first
RUN npx tsc -p packages/redis
RUN npx tsc -p packages/database

# Install local packages so Node can resolve them
RUN npm install ./packages/redis
RUN npm install ./packages/database

# Build scheduler service
RUN npx tsc -p apps/scheduler-service


# ---------- RUNNER ----------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only needed files
COPY --from=builder /app ./

ENV NODE_ENV=production

# Run compiled JS (NOT TS)
CMD ["node", "apps/scheduler-service/dist/index.js"]