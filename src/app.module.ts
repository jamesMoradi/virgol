import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TypeOrmConfig } from './config/typeorm.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true,
      envFilePath : join(process.cwd(), '.env')
    }),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    UserModule,
    AuthModule
  ]
})
export class AppModule {}
