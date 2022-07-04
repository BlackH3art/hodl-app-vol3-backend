import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
  });

  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.use(cookieParser());

  await app.listen(process.env.PORT || 3500);
}
bootstrap();
