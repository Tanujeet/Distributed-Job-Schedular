FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/ ./packages/
COPY apps/worker-service/ ./apps/worker-service/

RUN npm install

RUN npx tsc -p apps/worker-service/tsconfig.json

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production

CMD ["node", "apps/worker-service/dist/index.js"]