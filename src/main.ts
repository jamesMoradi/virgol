import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfigInit } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const {PORT} = process.env
  app.useGlobalPipes(new ValidationPipe())
  swaggerConfigInit(app)
  await app.listen(PORT, () => console.log(`app is running on port : ${PORT}`));
}
bootstrap();
