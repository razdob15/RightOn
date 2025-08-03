#!/bin/bash

cd ../

# Build script for RightOn Docker images


# Build client image
docker build -f client/Dockerfile -t me-west1-docker.pkg.dev/hrz-gem-ale-hac-hack-6/hackathon/frontend:v1.0.3 .

# Build backend image  
docker build -f nest-backend/Dockerfile -t me-west1-docker.pkg.dev/hrz-gem-ale-hac-hack-6/hackathon/backend:v1.0.3 .
