FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/ ./packages/
COPY apps/worker-service/ ./apps/worker-service/

RUN npm install

# 🔥 build worker
RUN npx tsc -p apps/worker-service

# =====================

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production

# ✅ run compiled JS
CMD ["node", "apps/worker-service/dist/index.js"]