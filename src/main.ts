import { NestFactory } from '@nestjs/core';
import monitor from 'express-status-monitor';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(monitor());
  await app.listen(3003);
}
bootstrap();
