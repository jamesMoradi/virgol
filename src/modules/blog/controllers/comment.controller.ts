import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CommentService } from "../services/comment.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { CreateCommentDto } from "../dto/comment.dto";
import { Pagination } from "../../../common/decorator/pagination.decorator";
import { PaginationDto } from "../../../common/dtos/pagination.dto";

@Controller('blog-comment')
@ApiTags('Blog')
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class CommentController{
  constructor(private readonly commentService : CommentService) {}

  @Post('/')
  create(@Body() createCommentDto : CreateCommentDto){
    return this.commentService.createComment(createCommentDto)
  }

  @Get()
  @Pagination()
  find(@Query() paginationDto : PaginationDto){
    return this.commentService.find(paginationDto)
  }

  @Put('/accept/:id')
  acceptComment(@Param('id', ParseIntPipe) id : number){
    return this.commentService.accept(id)
  }

  @Put('/reject/:id')
  rejectComment(@Param('id', ParseIntPipe) id : number){
    return this.commentService.reject(id)
  }
}