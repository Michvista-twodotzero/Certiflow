FROM node:22-alpine AS base

# Keep the base image small, but install the shared runtime libs Node apps in this repo need.
RUN apk add --no-cache ca-certificates libc6-compat openssl

WORKDIR /app
ENV CI=true

FROM base AS deps

# Native toolchain is only needed while installing/building dependencies.
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
COPY api-gateway/package.json ./api-gateway/package.json
COPY services/compliance-service/package.json ./services/compliance-service/package.json
COPY services/compliance-service/prisma ./services/compliance-service/prisma
COPY services/ai-worker/package.json ./services/ai-worker/package.json
COPY shared/package.json ./shared/package.json
COPY frontend/package.json ./frontend/package.json

RUN npm ci

FROM deps AS build

# Copy the full repo only after dependencies are installed so Docker can cache the heavy layers.
COPY . .

RUN npm run build --workspace=shared
RUN npm run build --workspace=api-gateway
RUN npm run build --workspace=services/compliance-service
RUN npm run build --workspace=services/ai-worker
RUN npm run build --workspace=frontend

# Strip dev-only packages before we move into the runtime image.
RUN npm prune --omit=dev && npm cache clean --force

FROM base AS runtime-base

ENV NODE_ENV=production

# Share the pruned node_modules and the compiled shared package with every runtime target.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/shared/package.json ./shared/package.json
COPY --from=build /app/shared/dist ./shared/dist

FROM runtime-base AS api-gateway

ENV PORT=3000

COPY --from=build /app/api-gateway/package.json ./api-gateway/package.json
COPY --from=build /app/api-gateway/dist ./api-gateway/dist

EXPOSE 3000
CMD ["node", "api-gateway/dist/index.js"]

FROM runtime-base AS compliance-service

ENV PORT=3001

COPY --from=build /app/services/compliance-service/package.json ./services/compliance-service/package.json
COPY --from=build /app/services/compliance-service/prisma ./services/compliance-service/prisma
COPY --from=build /app/services/compliance-service/dist ./services/compliance-service/dist

EXPOSE 3001
CMD ["sh", "-c", "npx prisma db push --schema services/compliance-service/prisma/schema.prisma && node services/compliance-service/dist/index.js"]

FROM runtime-base AS ai-worker

ENV PORT=3002

COPY --from=build /app/services/ai-worker/package.json ./services/ai-worker/package.json
COPY --from=build /app/services/ai-worker/dist ./services/ai-worker/dist

EXPOSE 3002
CMD ["node", "services/ai-worker/dist/index.js"]

FROM runtime-base AS frontend

ENV PORT=5173
ENV HOST=0.0.0.0

COPY --from=build /app/frontend/package.json ./frontend/package.json
COPY --from=build /app/frontend/build ./frontend/build

EXPOSE 5173
CMD ["node", "frontend/build"]
