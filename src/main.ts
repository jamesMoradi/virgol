import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfigInit } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const {PORT} = process.env
  swaggerConfigInit(app)
  await app.listen(PORT, () => console.log(`app is running on port : ${PORT}`));
}
bootstrap();
