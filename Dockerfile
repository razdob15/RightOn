
FROM node:22-slim

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

EXPOSE 3000

# Serve the built client
CMD [ "npx", "serve", "-s", "dist/client", "-l", "3000" ]