# =================================================================
# Multi-stage Dockerfile cho Next.js 16.x + Analytics Backend
# =================================================================

# =================================
# Stage 1: Dependencies & Build 
# =================================
FROM node:20-bullseye-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    curl \
    ca-certificates \
    git \
    openssl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY tsconfig.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci --include=dev --no-audit --no-fund

# Copy source code
COPY src/ ./src/
COPY public/ ./public/
COPY analytics-backend/ ./analytics-backend/
COPY next.config.ts ./
COPY *.config.js ./
COPY *.config.mjs ./

# Generate Prisma client for backend
RUN cd analytics-backend && npx prisma generate

# Build analytics backend TypeScript -> JavaScript  
RUN npm run analytics:build

# Build Next.js frontend
RUN npm run build

# =================================
# Stage 2: Production Runtime
# =================================
FROM node:20-bullseye-slim AS production

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    curl \
    openssl \
  && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs --ingroup nodejs

WORKDIR /app

# Copy package.json and install production dependencies as root
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund && \
    npm cache clean --force

# Copy built applications from builder stage with correct ownership
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/analytics-backend/dist ./analytics-backend/dist
COPY --from=builder --chown=nextjs:nodejs /app/analytics-backend/prisma ./analytics-backend/prisma

# Copy any remaining node_modules from Prisma client
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV ANALYTICS_PORT=3002

# Switch to non-root user
USER nextjs

# Expose ports
EXPOSE 3001 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:3002/health || exit 1

# Default: Start analytics backend
CMD ["node", "analytics-backend/dist/index.js"]
