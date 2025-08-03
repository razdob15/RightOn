# Prometheus Metrics - Phase 1 Implementation

This document describes the Prometheus metrics implementation for the RightOn NestJS backend.

## Available Endpoints

### Metrics Endpoint

- **URL**: `GET /metrics`
- **Purpose**: Prometheus scraping endpoint
- **Content-Type**: `text/plain`
- **Description**: Exposes all collected metrics in Prometheus format

### Health Check Endpoints

- **URL**: `GET /health` - Overall health status
- **URL**: `GET /health/ready` - Readiness probe (for Kubernetes)
- **URL**: `GET /health/live` - Liveness probe (for Kubernetes)

## Metrics Collected

### Default Node.js Metrics (Automatic)

- `righton_process_cpu_user_seconds_total` - User CPU time
- `righton_process_cpu_system_seconds_total` - System CPU time
- `righton_process_resident_memory_bytes` - Resident memory usage
- `righton_process_heap_bytes` - Heap memory usage
- `righton_process_open_fds` - Open file descriptors
- `righton_nodejs_eventloop_lag_seconds` - Event loop lag
- `righton_nodejs_gc_duration_seconds` - Garbage collection duration

### Custom HTTP Metrics

- `righton_http_requests_total{method, route, status_code}` - Total HTTP requests
- `righton_http_request_duration_seconds{method, route, status_code}` - Request duration histogram

### Database Health Metrics

- Database connectivity status
- Database response time
- Connection pool status (via health checks)

## Configuration

### Environment Variables

- `APP_VERSION` - Application version (default: "1.0.0")
- Standard database connection variables for health checks

### Metric Labels

- `app: "righton-backend"` - Application identifier
- `version: process.env.APP_VERSION` - Application version
- HTTP metrics include method, route, and status_code labels

## Usage Examples

### Scraping Configuration (Prometheus)

```yaml
scrape_configs:
  - job_name: 'righton-backend'
    static_configs:
      - targets: ['localhost:3050']
    metrics_path: '/metrics'
    scrape_interval: 15s
```

### Health Check Usage

```bash
# Basic health check
curl http://localhost:3050/health

# Kubernetes readiness probe
curl http://localhost:3050/health/ready

# Kubernetes liveness probe
curl http://localhost:3050/health/live
```

### Metrics Endpoint

```bash
# View all metrics
curl http://localhost:3050/metrics
```

## Next Steps (Phase 2+)

1. **Database Metrics**: Add TypeORM connection pool metrics
2. **Business Metrics**: Add rights evaluation and user registration metrics
3. **Custom Dashboards**: Create Grafana dashboards
4. **Alerting**: Set up Prometheus alerting rules
5. **Distributed Tracing**: Add OpenTelemetry integration

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Prometheus    │────│  /metrics        │────│  NestJS App     │
│   Server        │    │  Endpoint        │    │  + Interceptors │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                        │
                                                ┌───────▼───────┐
                                                │  Health Checks │
                                                │  + Database    │
                                                └────────────────┘
```

## Files Created

- `src/metrics/metrics.module.ts` - Prometheus integration module
- `src/metrics/metrics.controller.ts` - Metrics endpoint controller
- `src/metrics/interceptors/metrics.interceptor.ts` - HTTP metrics collection
- `src/health/health.module.ts` - Health check module
- `src/health/health.controller.ts` - Health endpoints
- `src/health/indicators/database-health.indicator.ts` - Database health checks
