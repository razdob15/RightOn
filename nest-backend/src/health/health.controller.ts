import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { DatabaseHealthIndicator } from './indicators/database-health.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private databaseHealth: DatabaseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.databaseHealth.pingCheck('database')]);
  }

  @Get('ready')
  @HealthCheck()
  readiness() {
    return this.health.check([() => this.databaseHealth.pingCheck('database')]);
  }

  @Get('live')
  @HealthCheck()
  liveness() {
    return this.health.check([() => this.databaseHealth.isHealthy('database')]);
  }
}
