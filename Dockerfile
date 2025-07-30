
FROM node:22-slim

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies needed for Nx)
RUN npm ci

# Copy source code
COPY . ./

# Build the shared library first
RUN npx nx build shared

# Build the client
RUN npx nx build client

EXPOSE 3000

# Serve the built client (you might want to use a web server like nginx for production)
CMD [ "npx", "serve", "-s", "dist/client", "-l", "3000" ]