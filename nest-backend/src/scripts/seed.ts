import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DatabaseSeeder } from '../database/database-seeder.service';

async function runSeeder() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const seeder = app.get(DatabaseSeeder);
    await seeder.seedRights();
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

runSeeder();
