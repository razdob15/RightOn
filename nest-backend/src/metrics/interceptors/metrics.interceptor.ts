import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { Counter, Histogram, register } from 'prom-client';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private readonly httpRequestsTotal: Counter<string>;
  private readonly httpRequestDuration: Histogram<string>;

  constructor() {
    // HTTP request counter
    this.httpRequestsTotal = new Counter({
      name: 'righton_http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [register],
    });

    // HTTP request duration histogram
    this.httpRequestDuration = new Histogram({
      name: 'righton_http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10], // seconds
      registers: [register],
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const method = request.method;
    const route = this.getRoute(context, request);

    return next.handle().pipe(
      tap({
        next: () => {
          this.recordMetrics(method, route, response.statusCode, startTime);
        },
        error: () => {
          this.recordMetrics(
            method,
            route,
            response.statusCode || 500,
            startTime,
          );
        },
      }),
    );
  }

  private getRoute(context: ExecutionContext, request: Request): string {
    // Try to get the route pattern from the handler
    const handler = context.getHandler();
    const controller = context.getClass();

    if (handler && controller) {
      const controllerName = controller.name
        .replace('Controller', '')
        .toLowerCase();
      const handlerName = handler.name;
      return `/${controllerName}/${handlerName}`;
    }

    // Fallback to request path with parameters normalized
    const path = request.route?.path || request.url;
    return this.normalizeRoute(path);
  }

  private normalizeRoute(path: string): string {
    // Replace path parameters with placeholders to avoid high cardinality
    return path
      .replace(/\/\d+/g, '/:id')
      .replace(/\/[a-f0-9-]{36}/g, '/:uuid')
      .replace(/\/[a-zA-Z0-9_-]{10,}/g, '/:param');
  }

  private recordMetrics(
    method: string,
    route: string,
    statusCode: number,
    startTime: number,
  ): void {
    const duration = (Date.now() - startTime) / 1000; // Convert to seconds

    const labels = {
      method: method.toUpperCase(),
      route,
      status_code: statusCode.toString(),
    };

    this.httpRequestsTotal.inc(labels);
    this.httpRequestDuration.observe(labels, duration);
  }
}
