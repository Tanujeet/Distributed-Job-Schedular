FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages ./packages
COPY apps/api-service ./apps/api-service


RUN npm install

RUN rm -rf apps/api-service/dist

RUN npx tsc -p packages/database \
 && npx tsc -p packages/redis \
 && npx tsc -p packages/utils \
 && npx tsc -p apps/api-service

# second stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app .

ENV NODE_ENV=production

RUN npm prune --omit=dev

EXPOSE 4000

CMD ["node", "apps/api-service/dist/index.js"]