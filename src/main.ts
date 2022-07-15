import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set("trust proxy", 1);

  app.enableCors({
    origin: ['https://hodl-app.xyz', 'https://www.hodl-app.xyz', 'http://hodl-app.xyz', 'http://www.hodl-app-xyz'],
    credentials: true
  });

  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.use(cookieParser());

  await app.listen(process.env.PORT || 3500);
}
bootstrap();
