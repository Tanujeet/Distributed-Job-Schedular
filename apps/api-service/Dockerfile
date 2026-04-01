FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/ ./packages/
COPY apps/api-service/ ./apps/api-service/

RUN npm install

COPY tsconfig.json* ./

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production

EXPOSE 4000

CMD ["npx", "tsx", "apps/api-service/src/index.ts"]