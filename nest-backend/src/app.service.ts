import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  getHello(): string {
    return 'Hello World! RightOn NestJS Backend is running!';
  }

  async getHealth(): Promise<{
    status: string;
    timestamp: string;
    database?: string;
  }> {
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    };

    try {
      // Check database connection
      if (this.dataSource.isInitialized) {
        await this.dataSource.query('SELECT 1');
        health.database = 'connected';
      }
    } catch (error) {
      health.status = 'ERROR';
      health.database = 'error';
    }

    return health;
  }
}
