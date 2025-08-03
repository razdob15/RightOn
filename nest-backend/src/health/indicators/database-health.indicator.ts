import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super();
  }

  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.dataSource.query('SELECT 1');
      const options = this.dataSource.options as any; // Type assertion for PostgreSQL options
      return this.getStatus(key, true, {
        status: 'connected',
        database: options.database || 'unknown',
        host: options.host || 'unknown',
      });
    } catch (error) {
      const result = this.getStatus(key, false, {
        message:
          error instanceof Error ? error.message : 'Database connection failed',
      });
      throw new HealthCheckError('Database check failed', result);
    }
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Check if database is responsive
      const startTime = Date.now();
      await this.dataSource.query('SELECT NOW()');
      const responseTime = Date.now() - startTime;

      const isHealthy = responseTime < 5000; // 5 seconds threshold

      if (!isHealthy) {
        throw new Error(`Database response time too high: ${responseTime}ms`);
      }

      return this.getStatus(key, true, {
        responseTime: `${responseTime}ms`,
        status: 'healthy',
      });
    } catch (error) {
      const result = this.getStatus(key, false, {
        message:
          error instanceof Error
            ? error.message
            : 'Database health check failed',
      });
      throw new HealthCheckError('Database health check failed', result);
    }
  }
}
