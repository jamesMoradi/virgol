import { Module } from '@nestjs/common';
import { BlogService } from './services/blog.service';
import { BlogController } from './controllers/blog.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entity/blog.entity';
import { CategoryService } from "../category/category.service";
import { CategoryEntity } from "../category/entities/category.entity";
import { BlogCategoryEntity } from "./entity/blog-category.entity";
import { BlogLikeEntity } from "./entity/like.entity";
import { BlogBookMarkEntity } from "./entity/book-mark.entity";
import { BlogCommentEntity } from "./entity/comment.entity";
import { CommentController } from "./controllers/comment.controller";
import { CommentService } from "./services/comment.service";

@Module({
  imports : [AuthModule, TypeOrmModule.forFeature([
    BlogEntity,
    BlogCategoryEntity,
    CategoryEntity,
    BlogLikeEntity,
    BlogBookMarkEntity,
    BlogCommentEntity
  ])],
  controllers: [BlogController, CommentController],
  providers: [BlogService, CategoryService, CommentService],
})
export class BlogModule {}
