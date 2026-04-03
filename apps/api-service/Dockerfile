# ---------- builder ----------
FROM node:20-alpine AS builder

WORKDIR /app

# root files
COPY package.json package-lock.json ./

# monorepo structure
COPY packages ./packages
COPY apps/api-service ./apps/api-service

# install with workspaces
RUN npm install --workspaces

# install typescript globally for build
RUN npm install -g typescript

# build ALL packages + service
RUN npm run build --workspaces


# ---------- production ----------
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# root files (needed for node resolution)
COPY package.json package-lock.json ./

# only required runtime things
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api-service/dist ./apps/api-service/dist

EXPOSE 4000

CMD ["node", "apps/api-service/dist/apps/api-service/src/index.js"]