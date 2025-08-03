import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsController } from './metrics.controller';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
        config: {
          prefix: 'righton_',
        },
      },
      defaultLabels: {
        app: 'righton-backend',
        version: process.env.APP_VERSION || '1.0.0',
      },
    }),
  ],
  controllers: [MetricsController],
})
export class MetricsModule {}
