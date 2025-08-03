import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { MetricsInterceptor } from './metrics/interceptors/metrics.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global metrics interceptor
  app.useGlobalInterceptors(new MetricsInterceptor());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Add your frontend URLs
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 3050;
  await app.listen(port);
  console.log(`NestJS backend is running on http://localhost:${port}`);
}
bootstrap();
