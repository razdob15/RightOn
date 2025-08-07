#!/bin/bash

cd ../

# Build script for RightOn Docker images

TAG=$1

if [ -z "$TAG" ]; then
  echo "Error: TAG argument is required."
  echo "Usage: $0 <TAG>"
  exit 1
fi

# Build client image
docker build -f client/Dockerfile -t me-west1-docker.pkg.dev/hrz-gem-ale-hac-hack-6/hackathon/frontend:$TAG .

# Build backend image  
docker build -f nest-backend/Dockerfile -t me-west1-docker.pkg.dev/hrz-gem-ale-hac-hack-6/hackathon/backend:$TAG .
