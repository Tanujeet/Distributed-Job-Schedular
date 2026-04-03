# ---------- BUILDER ----------
FROM node:20-alpine AS builder

WORKDIR /app

# root files
COPY package.json package-lock.json ./

# monorepo structure
COPY packages ./packages
COPY apps/worker-service ./apps/worker-service

# install with workspaces
RUN npm install --workspaces

# install typescript globally for build
RUN npm install -g typescript

# build all (packages + worker)
RUN npm run build --workspaces


# ---------- RUNNER ----------
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# root files (needed for resolution)
COPY package.json package-lock.json ./

# reuse correct node_modules
COPY --from=builder /app/node_modules ./node_modules

# runtime code
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/worker-service/dist ./apps/worker-service/dist

CMD ["node", "apps/worker-service/dist/index.js"]