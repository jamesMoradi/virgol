import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TypeOrmConfig } from './config/typeorm.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { BlogModule } from './modules/blog/blog.module';
import { ImagesModule } from './modules/images/images.module';
import { CustomHttpModule } from './modules/http/http.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal : true,envFilePath : join(process.cwd(), '.env')}),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    UserModule,
    CategoryModule,
    BlogModule,
    ImagesModule,
    CustomHttpModule
  ]
})
export class AppModule {}
