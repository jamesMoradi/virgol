import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { addUserToReqWOV } from 'src/common/midddleware/addUserToRequestWOV.middleware';

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
export class BlogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(addUserToReqWOV).forRoutes('blog/by-slug/:slug')
  }
}
