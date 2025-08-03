# Multi-stage build for React client
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

# Copy client files
COPY client ./client

# Build the shared library first
RUN NX_DAEMON=false npx nx build shared

# Build the client
RUN NX_DAEMON=false npx nx build client --verbose

# Production stage
FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy built files from builder stage
COPY --from=builder /usr/src/app/dist/client /usr/share/nginx/html

# Copy custom nginx configuration for React Router
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the entrypoint script
COPY client/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8080

# Use the entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
