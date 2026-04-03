# ---------- BUILDER ----------
FROM node:20-alpine AS builder

WORKDIR /app

# root files
COPY package.json package-lock.json ./

# monorepo structure
COPY packages ./packages
COPY apps/scheduler-service ./apps/scheduler-service

# install with workspaces
RUN npm install --workspaces

# install typescript globally for build
RUN npm install -g typescript

# build everything
RUN npm run build --workspaces


# ---------- RUNNER ----------
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# root files (needed for resolution)
COPY package.json package-lock.json ./

# copy node_modules from builder (already workspace-linked)
COPY --from=builder /app/node_modules ./node_modules

# copy runtime code
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/scheduler-service/dist ./apps/scheduler-service/dist

CMD ["node", "apps/scheduler-service/dist/index.js"]