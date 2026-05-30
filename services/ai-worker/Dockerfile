FROM node:22-alpine AS base

# Keep the runtime slim but include the common Node libraries this repo needs.
RUN apk add --no-cache ca-certificates libc6-compat openssl

WORKDIR /app
ENV CI=true

FROM base AS deps

# Native toolchain is only needed during dependency installation.
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

# Build from the repo root so the shared workspace is available.
COPY . .

RUN npm run build --workspace=shared
RUN npm run build --workspace=services/ai-worker
RUN npm prune --omit=dev && npm cache clean --force

FROM base AS runtime

ENV NODE_ENV=production
ENV PORT=3002

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/shared/package.json ./shared/package.json
COPY --from=build /app/shared/dist ./shared/dist
COPY --from=build /app/services/ai-worker/package.json ./services/ai-worker/package.json
COPY --from=build /app/services/ai-worker/dist ./services/ai-worker/dist
# Ship the OSHA reference PDF next to the compiled worker so the runtime can always find it.
COPY --from=build /app/services/ai-worker/src/rag/documents ./services/ai-worker/dist/rag/documents

EXPOSE 3002
CMD ["node", "services/ai-worker/dist/index.js"]
