import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfigInit } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const {PORT, COOKIE_SECRET} = process.env
  app.use(cookieParser(COOKIE_SECRET))
  app.useGlobalPipes(new ValidationPipe())
  swaggerConfigInit(app)
  await app.listen(PORT, () => console.log(`app is running on port : ${PORT}`));
}
bootstrap();
