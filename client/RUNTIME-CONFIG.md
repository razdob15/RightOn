# Runtime Environment Variable Injection for Client

This document explains how the RightOn client handles environment variables at runtime, allowing for dynamic configuration without rebuilding the Docker image.

## How It Works

The client Docker image is built once and can be deployed to different environments (dev, staging, production) with different configurations by simply changing environment variables at runtime.

### Architecture

1. **Build Time**: The React app is built with Vite, creating static assets
2. **Runtime Injection**: When the container starts, the `docker-entrypoint.sh` script:
   - Creates a `runtime-config.js` file with current environment variables
   - Injects a script tag into `index.html` to load this configuration
   - Replaces any build-time placeholders in JavaScript files
3. **Client Access**: The React app uses utility functions to access these runtime values

## Supported Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `VITE_BACKEND_URL` | Backend API URL | `http://localhost:3050` |
| `VITE_APP_TITLE` | Application title | `RightOn` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |

## Usage in Code

Instead of directly accessing `import.meta.env`, use the utility functions:

```typescript
import { getBackendUrl, getAppTitle, getAppVersion } from '@/utils/config';

// Get backend URL with runtime support
const backendUrl = getBackendUrl();

// Get app title
const title = getAppTitle();

// Get app version
const version = getAppVersion();
```

## Deployment Examples

### Docker Compose

```yaml
services:
  client:
    image: righton-client:latest
    environment:
      - VITE_BACKEND_URL=https://api.example.com
      - VITE_APP_TITLE=RightOn - Production
      - VITE_APP_VERSION=2.1.0
    ports:
      - "80:8080"
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: righton-client
spec:
  template:
    spec:
      containers:
      - name: client
        image: righton-client:latest
        env:
        - name: VITE_BACKEND_URL
          value: "https://api.righton.example.com"
        - name: VITE_APP_TITLE
          valueFrom:
            configMapKeyRef:
              name: righton-config
              key: app-title
```

### Docker Run

```bash
docker run -d \
  -p 8080:8080 \
  -e VITE_BACKEND_URL=https://api.example.com \
  -e VITE_APP_TITLE="RightOn - Staging" \
  -e VITE_APP_VERSION=2.0.0 \
  righton-client:latest
```

## Development

For local development, you can override environment variables in your shell:

```bash
export VITE_BACKEND_URL=http://localhost:3001
export VITE_APP_TITLE="RightOn - Development"
npm run dev:client
```

## Build Process

The Docker build process includes:

1. **Multi-stage build**: Builds the React app in a Node.js container
2. **Production stage**: Copies built files to an nginx container
3. **Runtime preparation**: Installs `gettext` for `envsubst` support
4. **Entrypoint setup**: Configures the runtime injection script

## Security Considerations

- Environment variables are exposed to the client-side code
- Only include non-sensitive configuration values
- Use proper CORS and security headers in nginx configuration
- The `runtime-config.js` file is served without caching to ensure updates

## Troubleshooting

### Environment Variables Not Applied

1. Check if the container has the environment variables set:
   ```bash
   docker exec -it <container-name> env | grep VITE_
   ```

2. Verify the runtime config file was created:
   ```bash
   docker exec -it <container-name> cat /usr/share/nginx/html/runtime-config.js
   ```

3. Check the browser console for the `window.__RUNTIME_CONFIG__` object

### Debugging

Enable debug logging by setting:
```bash
docker run -e DEBUG=true righton-client:latest
```

The entrypoint script will output detailed information about the injection process.

## Migration from Build-time Variables

If you have existing code using `import.meta.env` directly:

1. Replace direct access with utility functions from `@/utils/config`
2. Update your deployment configuration to use runtime environment variables
3. Test that the configuration is properly injected at runtime

## Performance Impact

- Minimal: The runtime injection adds ~1-2ms to container startup time
- The `runtime-config.js` file is ~1KB and loaded once
- No impact on application runtime performance
