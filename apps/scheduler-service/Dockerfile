FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/ ./packages/
COPY apps/scheduler-service/ ./apps/scheduler-service/

RUN npm install

COPY tsconfig.json* ./

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production

CMD ["npx", "tsx", "apps/scheduler-service/src/index.ts"]