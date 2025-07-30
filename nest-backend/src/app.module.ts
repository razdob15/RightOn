import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RightsModule } from './rights/rights.module';
import { UsersModule } from './users/users.module';
import { DatabaseSeeder } from './database/database-seeder.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserEntity } from './users/entities/user.entity';
import { RightEntity } from './rights/entities/right.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'righton',
      entities: [UserEntity, RightEntity],
      synchronize: true, // Set to false in production
      logging: ['query', 'error', 'schema'],
      dropSchema: false,
    }),
    RightsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseSeeder],
})
export class AppModule {}
