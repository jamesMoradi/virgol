import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entity/blog.entity';
import { CategoryService } from "../category/category.service";
import { CategoryEntity } from "../category/entities/category.entity";
import { BlogCategoryEntity } from "./entity/blog-category.entity";
import { BlogLikeEntity } from "./entity/like.entity";

@Module({
  imports : [AuthModule, TypeOrmModule.forFeature([
    BlogEntity,
    BlogCategoryEntity,
    CategoryEntity,
    BlogLikeEntity
  ])],
  controllers: [BlogController],
  providers: [BlogService, CategoryService],
})
export class BlogModule {}
