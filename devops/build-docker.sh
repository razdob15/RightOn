#!/bin/bash

cd ../

# Build script for RightOn Docker images


# Build client image
docker build -f client/Dockerfile -t docker.io/razdob15/righton-client:latest .

# Build backend image  
docker build -f nest-backend/Dockerfile -t docker.io/razdob15/righton-backend:latest .


