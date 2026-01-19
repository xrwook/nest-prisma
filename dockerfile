# =============================================================================
# Multi-stage Dockerfile for NestJS Production Build
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Builder
# -----------------------------------------------------------------------------
FROM node:22.12-alpine AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn run prisma:gen
RUN yarn run build:prod
RUN rm -rf node_modules && yarn install --production --frozen-lockfile

# -----------------------------------------------------------------------------
# Stage 2: Runner (Production)
# -----------------------------------------------------------------------------
FROM node:22.12-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# files 폴더 복사 (업로드된 파일들 포함)
# COPY files ./files
# COPY files2 ./files2

COPY .env.prod .env.prod

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "dist/src/main"]
