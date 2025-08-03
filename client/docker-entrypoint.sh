#!/bin/sh

# Default values for environment variables
export VITE_BACKEND_URL=${VITE_BACKEND_URL:-"http://localhost:3050"}
export VITE_APP_TITLE=${VITE_APP_TITLE:-"RightOn"}
export VITE_APP_VERSION=${VITE_APP_VERSION:-"1.0.0"}

echo "Injecting environment variables..."
echo "VITE_BACKEND_URL: $VITE_BACKEND_URL"
echo "VITE_APP_TITLE: $VITE_APP_TITLE"
echo "VITE_APP_VERSION: $VITE_APP_VERSION"

# Create a runtime config JavaScript file that will be injected into the HTML
cat > /usr/share/nginx/html/runtime-config.js << EOF
window.__RUNTIME_CONFIG__ = {
  VITE_BACKEND_URL: "${VITE_BACKEND_URL}",
  VITE_APP_TITLE: "${VITE_APP_TITLE}",
  VITE_APP_VERSION: "${VITE_APP_VERSION}"
};
EOF

# Replace placeholders in index.html with actual script tag
if [ -f /usr/share/nginx/html/index.html ]; then
  # Add the runtime config script to the head of index.html
  sed -i 's|</head>|  <script src="/runtime-config.js"></script>\n  </head>|' /usr/share/nginx/html/index.html
  echo "Runtime configuration injected successfully"
else
  echo "Warning: index.html not found"
fi

# Replace any hardcoded environment variable placeholders in JS files
# This is a fallback for build-time placeholders
find /usr/share/nginx/html -name "*.js" -type f -exec sh -c '
  for file do
    if [ -f "$file" ]; then
      sed -i "s|__VITE_BACKEND_URL__|${VITE_BACKEND_URL}|g" "$file"
      sed -i "s|__VITE_APP_TITLE__|${VITE_APP_TITLE}|g" "$file"
      sed -i "s|__VITE_APP_VERSION__|${VITE_APP_VERSION}|g" "$file"
    fi
  done
' sh {} +

echo "Environment variable injection completed"

# Execute the original command
exec "$@"
