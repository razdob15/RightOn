# Multi-stage build for NestJS backend
FROM node:22-slim AS builder

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Install all dependencies (including dev dependencies needed for Nx)
RUN npm ci

# Copy shared library files
COPY libs/shared ./libs/shared

# Copy backend files
COPY nest-backend ./nest-backend

# Copy rights data file (needed for seeding)
COPY rights.json ./

# Build the shared library first
RUN NX_DAEMON=false npx nx build shared

# Build the backend
RUN NX_DAEMON=false npx nx build nest-backend --verbose

# Production stage
FROM node:22-slim

WORKDIR /usr/src/app

# Copy package files for production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built files from builder stage
COPY --from=builder /usr/src/app/dist/nest-backend ./dist/nest-backend
COPY --from=builder /usr/src/app/dist/libs/shared ./dist/libs/shared
COPY --from=builder /usr/src/app/rights.json ./

# # Create a non-root user
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nestjs

# # Change ownership of the app directory
# RUN chown -R nestjs:nodejs /usr/src/app
# USER nestjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "dist/nest-backend/main.js"]
