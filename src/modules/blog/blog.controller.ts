import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { BlogService } from './blog.service';
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from "./dto/blog.dto";
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumees } from 'src/common/types/enums/swagger-consumes.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Pagination } from 'src/common/decorator/pagination.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SkipAuth } from 'src/common/decorator/skip-auth.decorator';
@Controller('blog')
@ApiTags('Blog')
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('/')
  @ApiConsumes(SwaggerConsumees.UrlEncoded, SwaggerConsumees.Json)
  create(@Body() blogDto : CreateBlogDto){
    return this.blogService.create(blogDto)
  }

  @Get('/get-my-blogs')
  getMyBlogs () {
    return this.blogService.getMyBlogs()
  }

  @Get('/')
  @Pagination()
  @SkipAuth()
  @FilterBlog()
  getAllBlog(@Query() paginationDto : PaginationDto, @Query() filterDto : FilterBlogDto){
    return this.blogService.blogList(paginationDto, filterDto)
  }

  @Delete('/:id')
  deleteOneBlog(@Param('id', ParseIntPipe) id : number ){
    return this.blogService.delete(id)
  }

  @Put('/:id')
  @ApiConsumes(SwaggerConsumees.UrlEncoded, SwaggerConsumees.Json)
  updateABlog(@Param('id', ParseIntPipe) id : number, @Body() blogDto : UpdateBlogDto){
    return this.blogService.update(id, blogDto)
  }

  @Get('/like/:id')
  likeToggle(@Param('id', ParseIntPipe) id : number){
    return this.blogService.likeToggle(id)
  }

  @Get('/bookmark/:id')
  bookmarkToggle(@Param('id', ParseIntPipe) id : number){
    return this.blogService.bookMarkToggle(id)
  }
}
