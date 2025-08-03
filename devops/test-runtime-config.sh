#!/bin/bash

# Test script to verify runtime environment variable injection
# This script builds and runs the client container with test environment variables

set -e

echo "🚀 Testing Runtime Environment Variable Injection"
echo "================================================="

# Build the client image
echo "📦 Building client Docker image..."
docker build -f client/Dockerfile -t righton-client-test .

# Test with different environment variables
echo "🧪 Testing with custom environment variables..."

# Start container with test environment variables
CONTAINER_ID=$(docker run -d \
  -p 8081:8080 \
  -e VITE_BACKEND_URL=https://test-api.example.com \
  -e VITE_APP_TITLE="RightOn - Test Environment" \
  -e VITE_APP_VERSION=99.99.99 \
  righton-client-test)

echo "📋 Container ID: $CONTAINER_ID"

# Wait for container to start
echo "⏳ Waiting for container to start..."
sleep 5

# Check if container is running
if docker ps | grep -q $CONTAINER_ID; then
    echo "✅ Container is running"
else
    echo "❌ Container failed to start"
    docker logs $CONTAINER_ID
    exit 1
fi

# Test if runtime config was injected
echo "🔍 Checking runtime configuration injection..."

# Check environment variables in container
echo "Environment variables in container:"
docker exec $CONTAINER_ID env | grep VITE_ || echo "No VITE_ variables found"

# Check if runtime-config.js was created
echo "Checking runtime-config.js file:"
if docker exec $CONTAINER_ID test -f /usr/share/nginx/html/runtime-config.js; then
    echo "✅ runtime-config.js exists"
    echo "Content:"
    docker exec $CONTAINER_ID cat /usr/share/nginx/html/runtime-config.js
else
    echo "❌ runtime-config.js not found"
fi

# Check if the configuration is accessible via HTTP
echo "🌐 Testing HTTP access to runtime config..."
if curl -s -f http://localhost:8081/runtime-config.js > /tmp/runtime-config-test.js; then
    echo "✅ Runtime config accessible via HTTP"
    echo "Content:"
    cat /tmp/runtime-config-test.js
    rm -f /tmp/runtime-config-test.js
else
    echo "❌ Runtime config not accessible via HTTP"
fi

# Test main page accessibility
echo "🏠 Testing main page accessibility..."
if curl -s -f http://localhost:8081/ > /dev/null; then
    echo "✅ Main page accessible"
else
    echo "❌ Main page not accessible"
fi

# Cleanup
echo "🧹 Cleaning up..."
docker stop $CONTAINER_ID > /dev/null
docker rm $CONTAINER_ID > /dev/null

echo "✨ Test completed successfully!"
echo ""
echo "To manually test the client:"
echo "docker run -d -p 8080:8080 \\"
echo "  -e VITE_BACKEND_URL=https://your-api.example.com \\"
echo "  -e VITE_APP_TITLE='Your App Title' \\"
echo "  -e VITE_APP_VERSION=1.0.0 \\"
echo "  righton-client-test"
