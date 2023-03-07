import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: [
      'http://localhost:3003',
      'https://preeminent-banoffee-5a0dad.netlify.app',
      'https://beshariq.kitober.uz',
      'https://kutubxona.itsone.uz',
    ],
    methods: ['POST', 'PUT', 'DELETE', 'GET', 'PATCH'],
  });
  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`Server running port ${port}`);
}
bootstrap();
