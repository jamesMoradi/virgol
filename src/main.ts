import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfigInit } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const {PORT, COOKIE_SECRET} = process.env

  app.useStaticAssets('public')
  app.use(cookieParser(COOKIE_SECRET))
  app.useGlobalPipes(new ValidationPipe())
  
  swaggerConfigInit(app)
  await app.listen(PORT, () => console.log(`app is running on port : ${PORT}`));
}
bootstrap();
